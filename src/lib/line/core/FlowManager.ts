import { SessionManager } from './SessionManager'
import { replyMessage } from '../client'

export interface FlowStep {
  id: string
  prompt: string
  inputType: 'text' | 'number' | 'date' | 'select' | 'image' | 'confirm'
  validation?: (input: any) => boolean | string | Promise<boolean | string>
  transform?: (input: any) => any | Promise<any>
  options?: string[] // For select type
  skipIf?: (data: any) => boolean
}

export interface FlowDefinition {
  id: string
  name: string
  description: string
  requiredPermission?: string
  steps: FlowStep[]
  onComplete: (data: any, userId: string) => Promise<void>
  onError?: (error: any, userId: string) => Promise<void>
}

export class FlowManager {
  private static flows = new Map<string, FlowDefinition>()

  /**
   * Register a flow definition
   */
  static registerFlow(flow: FlowDefinition) {
    this.flows.set(flow.id, flow)
  }

  /**
   * Start a flow for a user
   */
  static async startFlow(
    userId: string,
    flowId: string,
    replyToken: string
  ): Promise<boolean> {
    const flow = this.flows.get(flowId)
    if (!flow) {
      console.error(`Flow ${flowId} not found`)
      return false
    }

    // Check if user is already in a flow
    const isInFlow = await SessionManager.isInFlow(userId)
    if (isInFlow) {
      await replyMessage(replyToken, [{
        type: 'text',
        text: '⚠️ Anda sedang dalam proses lain. Ketik "batal" untuk membatalkan proses sebelumnya.'
      }])
      return false
    }

    // Calculate actual steps (some might be skipped)
    const totalSteps = flow.steps.length

    // Start the flow session
    await SessionManager.startFlow(userId, flow.name, flowId, totalSteps)

    // Send first step prompt
    await this.sendCurrentStep(userId, replyToken)
    
    return true
  }

  /**
   * Process user input for current flow
   */
  static async processInput(
    userId: string,
    input: any,
    replyToken: string
  ): Promise<boolean> {
    const session = await SessionManager.getSession(userId)
    
    if (!session.activeFlowId) {
      return false
    }

    const flow = this.flows.get(session.activeFlowId)
    if (!flow) {
      await SessionManager.abortFlow(userId)
      return false
    }

    const currentStepIndex = session.currentStep
    const currentStep = flow.steps[currentStepIndex]

    if (!currentStep) {
      // Flow complete
      await this.completeFlow(userId, replyToken)
      return true
    }

    // Validate input
    if (currentStep.validation) {
      const validationResult = await currentStep.validation(input)
      if (validationResult !== true) {
        const errorMsg = typeof validationResult === 'string' 
          ? validationResult 
          : '❌ Input tidak valid. Silakan coba lagi.'
        
        await replyMessage(replyToken, [{
          type: 'text',
          text: errorMsg
        }])
        return true
      }
    }

    // Transform input if needed
    const processedInput = currentStep.transform 
      ? await currentStep.transform(input) 
      : input

    // Store step data
    const stepData = { [currentStep.id]: processedInput }
    await SessionManager.nextStep(userId, stepData)

    // Check if we should skip next steps
    let nextStepIndex = currentStepIndex + 1
    while (nextStepIndex < flow.steps.length) {
      const nextStep = flow.steps[nextStepIndex]
      const flowData = await SessionManager.getFlowData(userId)
      
      if (nextStep.skipIf && nextStep.skipIf(flowData)) {
        await SessionManager.nextStep(userId, {})
        nextStepIndex++
      } else {
        break
      }
    }

    // Check if flow is complete
    if (nextStepIndex >= flow.steps.length) {
      await this.completeFlow(userId, replyToken)
    } else {
      // Send next step prompt
      await this.sendCurrentStep(userId, replyToken)
    }

    return true
  }

  /**
   * Send current step prompt to user
   */
  static async sendCurrentStep(userId: string, replyToken: string) {
    const session = await SessionManager.getSession(userId)
    const flow = this.flows.get(session.activeFlowId!)
    
    if (!flow) return

    const currentStep = flow.steps[session.currentStep]
    if (!currentStep) {
      await this.completeFlow(userId, replyToken)
      return
    }

    // Update waiting for
    await SessionManager.updateSession(userId, {
      waitingFor: currentStep.id
    })

    // Build progress indicator
    const progress = `[${session.currentStep + 1}/${session.totalSteps}]`

    // Send appropriate prompt based on input type
    switch (currentStep.inputType) {
      case 'select':
        await this.sendSelectPrompt(
          replyToken, 
          currentStep.prompt, 
          currentStep.options || [],
          progress
        )
        break
      
      case 'confirm':
        await this.sendConfirmPrompt(
          replyToken, 
          currentStep.prompt,
          progress
        )
        break
      
      case 'image':
        await replyMessage(replyToken, [{
          type: 'text',
          text: `${progress} ${currentStep.prompt}\n\n📷 Silakan kirim gambar`
        }])
        break
      
      default:
        await replyMessage(replyToken, [{
          type: 'text',
          text: `${progress} ${currentStep.prompt}`
        }])
    }
  }

  /**
   * Send select prompt with quick reply buttons
   */
  private static async sendSelectPrompt(
    replyToken: string,
    prompt: string,
    options: string[],
    progress: string
  ) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: `${progress} ${prompt}`,
      quickReply: {
        items: options.map(option => ({
          type: 'action',
          action: {
            type: 'message',
            label: option.substring(0, 20), // LINE limit
            text: option
          }
        }))
      }
    }])
  }

  /**
   * Send confirm prompt
   */
  private static async sendConfirmPrompt(
    replyToken: string,
    prompt: string,
    progress: string
  ) {
    await replyMessage(replyToken, [{
      type: 'flex',
      altText: 'Konfirmasi',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: progress,
              size: 'xs',
              color: '#999999'
            },
            {
              type: 'text',
              text: prompt,
              wrap: true,
              margin: 'md'
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              action: {
                type: 'message',
                label: 'Ya',
                text: 'ya'
              },
              style: 'primary'
            },
            {
              type: 'button',
              action: {
                type: 'message',
                label: 'Tidak',
                text: 'tidak'
              },
              style: 'secondary'
            }
          ],
          spacing: 'sm'
        }
      }
    }])
  }

  /**
   * Complete flow and execute completion handler
   */
  private static async completeFlow(userId: string, replyToken: string) {
    const session = await SessionManager.getSession(userId)
    const flow = this.flows.get(session.activeFlowId!)
    
    if (!flow) return

    const flowData = await SessionManager.getFlowData(userId)

    try {
      // Execute completion handler
      await flow.onComplete(flowData, userId)
      
      // Send success message
      await replyMessage(replyToken, [{
        type: 'text',
        text: `✅ ${flow.name} berhasil diselesaikan!`
      }])
    } catch (error) {
      console.error('Flow completion error:', error)
      
      // Execute error handler if available
      if (flow.onError) {
        await flow.onError(error, userId)
      }
      
      await replyMessage(replyToken, [{
        type: 'text',
        text: `❌ Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`
      }])
    } finally {
      // Clear flow session
      await SessionManager.completeFlow(userId)
    }
  }

  /**
   * Abort current flow
   */
  static async abortFlow(userId: string, replyToken: string): Promise<boolean> {
    const session = await SessionManager.getSession(userId)
    
    if (!session.activeFlowId) {
      return false
    }

    await SessionManager.abortFlow(userId)
    
    await replyMessage(replyToken, [{
      type: 'text',
      text: '❌ Proses dibatalkan'
    }])
    
    return true
  }

  /**
   * Get registered flow by ID
   */
  static getFlow(flowId: string): FlowDefinition | undefined {
    return this.flows.get(flowId)
  }

  /**
   * Get all registered flows
   */
  static getAllFlows(): FlowDefinition[] {
    return Array.from(this.flows.values())
  }
}