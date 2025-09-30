import { FullConfig } from '@playwright/test'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...')

  // Clean up auth files
  try {
    const authDir = path.join(__dirname, 'auth')
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true })
      console.log('✅ Cleaned up auth files')
    }
  } catch (error) {
    console.warn('⚠️ Could not clean up auth files:', error instanceof Error ? error.message : String(error))
  }

  // Clean up test database
  try {
    const testDbPath = path.join(process.cwd(), 'test-e2e.db')
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
      console.log('✅ Cleaned up test database')
    }
  } catch (error) {
    console.warn('⚠️ Could not clean up test database:', error instanceof Error ? error.message : String(error))
  }

  // Clean up any other test artifacts
  try {
    const testResultsDir = path.join(process.cwd(), 'test-results')
    const playwrightReportDir = path.join(process.cwd(), 'playwright-report')
    
    // Keep test results but clean up any temp files
    console.log('✅ Test artifacts preserved for review')
  } catch (error) {
    console.warn('⚠️ Could not clean up test artifacts:', error instanceof Error ? error.message : String(error))
  }

  console.log('✅ Global teardown completed')
}

export default globalTeardown