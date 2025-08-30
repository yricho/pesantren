import axios from 'axios';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters?: Array<{
        type: string;
        text?: string;
        image?: { link: string };
        document?: { link: string; filename: string };
      }>;
    }>;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename: string;
    caption?: string;
  };
}

export interface WhatsAppWebhookData {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: { body: string };
          type: string;
          context?: {
            from: string;
            id: string;
          };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
          errors?: Array<{
            code: number;
            title: string;
            message?: string;
          }>;
        }>;
      };
      field: string;
    }>;
  }>;
}

export interface MessageTemplate {
  name: string;
  language: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
    example?: {
      header_text?: string[];
      body_text?: string[][];
    };
    buttons?: Array<{
      type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
}

class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private version: string;
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.version = process.env.WHATSAPP_API_VERSION || 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.version}`;

    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('WhatsApp service not properly configured. Check environment variables.');
    }
  }

  async sendMessage(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        return { success: false, error: 'WhatsApp service not configured' };
      }

      // Clean phone number (remove non-digits except +)
      const cleanPhone = this.cleanPhoneNumber(message.to);
      if (!cleanPhone) {
        return { success: false, error: 'Invalid phone number format' };
      }

      const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        ...message,
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        messageId: response.data.messages?.[0]?.id,
      };
    } catch (error: any) {
      console.error('WhatsApp send message error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async sendTextMessage(to: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendMessage({
      to,
      type: 'text',
      text: { body: text },
    });
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = 'id',
    parameters: any[] = []
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message: WhatsAppMessage = {
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
      },
    };

    // Add parameters if provided
    if (parameters.length > 0) {
      message.template!.components = [
        {
          type: 'body',
          parameters: parameters.map(param => ({
            type: 'text',
            text: String(param),
          })),
        },
      ];
    }

    return this.sendMessage(message);
  }

  async sendImageMessage(
    to: string,
    imageUrl: string,
    caption?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendMessage({
      to,
      type: 'image',
      image: {
        link: imageUrl,
        caption,
      },
    });
  }

  async sendDocumentMessage(
    to: string,
    documentUrl: string,
    filename: string,
    caption?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendMessage({
      to,
      type: 'document',
      document: {
        link: documentUrl,
        filename,
        caption,
      },
    });
  }

  // Message template management
  async createMessageTemplate(template: MessageTemplate): Promise<{ success: boolean; templateId?: string; error?: string }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`,
        template,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        templateId: response.data.id,
      };
    } catch (error: any) {
      console.error('Create template error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async getMessageTemplates(): Promise<{ success: boolean; templates?: any[]; error?: string }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            fields: 'name,status,components,language',
          },
        }
      );

      return {
        success: true,
        templates: response.data.data,
      };
    } catch (error: any) {
      console.error('Get templates error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // Webhook verification
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'your_verify_token';
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WhatsApp webhook verified successfully');
      return challenge;
    }
    
    console.error('Failed to verify WhatsApp webhook');
    return null;
  }

  // Process incoming webhook data
  async processWebhookData(data: WhatsAppWebhookData): Promise<void> {
    try {
      for (const entry of data.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const { messages, contacts, statuses } = change.value;

            // Process incoming messages
            if (messages) {
              for (const message of messages) {
                await this.handleIncomingMessage(message, contacts?.[0]);
              }
            }

            // Process message status updates
            if (statuses) {
              for (const status of statuses) {
                await this.handleMessageStatus(status);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing WhatsApp webhook data:', error);
    }
  }

  private async handleIncomingMessage(message: any, contact?: any): Promise<void> {
    try {
      console.log('Received WhatsApp message:', {
        from: message.from,
        messageId: message.id,
        type: message.type,
        text: message.text?.body,
        timestamp: message.timestamp,
      });

      // Here you can implement auto-response logic
      // For example, send a confirmation message
      if (message.type === 'text') {
        await this.handleTextMessage(message, contact);
      }

      // Store message in database if needed
      // await this.storeIncomingMessage(message, contact);
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  private async handleTextMessage(message: any, contact?: any): Promise<void> {
    const text = message.text.body.toLowerCase();
    const from = message.from;

    // Simple keyword responses
    let response = '';

    if (text.includes('info') || text.includes('informasi')) {
      response = `Assalamu'alaikum! Selamat datang di Pondok Pesantren Imam Syafi'i.\n\nUntuk informasi lebih lanjut:\n📞 Telepon: +62 812-3456-7890\n📧 Email: admin@ponpesimamsyafii.id\n🌐 Website: www.ponpesimamsyafii.id\n\nBarakallahu fiikum!`;
    } else if (text.includes('ppdb') || text.includes('pendaftaran')) {
      response = `PPDB (Penerimaan Peserta Didik Baru) Pondok Pesantren Imam Syafi'i:\n\n📝 Pendaftaran online: www.ponpesimamsyafii.id/ppdb\n💰 Biaya pendaftaran: Rp 150.000\n📋 Syarat: KTP, KK, Ijazah, Foto\n📅 Jadwal: Januari - Juli 2024\n\nInfo lebih lanjut hubungi admin kami.`;
    } else if (text.includes('spp') || text.includes('pembayaran')) {
      response = `Informasi Pembayaran SPP:\n\n💳 Pembayaran dapat dilakukan via:\n- Transfer Bank\n- QRIS\n- Tunai di kantor\n\n📅 Jatuh tempo: tanggal 10 setiap bulan\n📞 Info tagihan: hubungi admin\n\nBarakallahu fiikum!`;
    } else if (text.includes('terima kasih') || text.includes('syukron')) {
      response = `Wa iyyaka, barakallahu fiika! 🤲\n\nSemoga Allah memberikan kemudahan untuk Anda. Jika ada yang bisa kami bantu lagi, jangan ragu untuk menghubungi kami.`;
    } else {
      // Default response
      response = `Assalamu'alaikum warahmatullahi wabarakatuh!\n\nTerima kasih telah menghubungi Pondok Pesantren Imam Syafi'i.\n\nBalas dengan:\n• "INFO" - Informasi umum\n• "PPDB" - Penerimaan siswa baru\n• "SPP" - Info pembayaran\n\nAtau hubungi admin kami di +62 812-3456-7890`;
    }

    if (response) {
      await this.sendTextMessage(from, response);
    }
  }

  private async handleMessageStatus(status: any): Promise<void> {
    try {
      console.log('Message status update:', {
        messageId: status.id,
        status: status.status,
        timestamp: status.timestamp,
        recipientId: status.recipient_id,
      });

      // Update message status in database
      // await this.updateMessageStatus(status.id, status.status);

      if (status.errors) {
        console.error('Message delivery errors:', status.errors);
      }
    } catch (error) {
      console.error('Error handling message status:', error);
    }
  }

  private cleanPhoneNumber(phone: string): string | null {
    // Remove all non-digit characters except +
    let clean = phone.replace(/[^\d+]/g, '');
    
    // Handle Indonesian numbers
    if (clean.startsWith('0')) {
      clean = '62' + clean.substring(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    } else if (clean.startsWith('+62')) {
      clean = clean.substring(1);
    }
    
    // Validate Indonesian number format
    if (clean.match(/^62[8]\d{8,11}$/)) {
      return clean;
    }
    
    // Allow international numbers
    if (clean.match(/^\d{10,15}$/)) {
      return clean;
    }
    
    return null;
  }

  // Notification integration
  async sendNotificationViaWhatsApp(
    phoneNumber: string,
    type: string,
    title: string,
    message: string,
    templateName?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Try to use template first if available
      if (templateName) {
        const result = await this.sendTemplateMessage(phoneNumber, templateName, 'id', [title, message]);
        if (result.success) {
          return result;
        }
      }

      // Fallback to text message
      const fullMessage = `*${title}*\n\n${message}\n\n_Pondok Pesantren Imam Syafi'i_`;
      return await this.sendTextMessage(phoneNumber, fullMessage);
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        return { success: false, error: 'WhatsApp credentials not configured' };
      }

      // Test by getting business account info
      const response = await axios.get(
        `${this.baseUrl}/${this.phoneNumberId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }
}

// Singleton instance
let whatsappService: WhatsAppService | null = null;

export const getWhatsAppService = (): WhatsAppService => {
  if (!whatsappService) {
    whatsappService = new WhatsAppService();
  }
  return whatsappService;
};

export default WhatsAppService;