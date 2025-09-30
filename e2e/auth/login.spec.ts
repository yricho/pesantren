import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the login page
    await page.goto('/auth/signin')
  })

  test('should display login form correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Pondok Imam Syafi'i Blitar/)
    
    // Check form elements
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Check form labels
    await expect(page.locator('text=Username')).toBeVisible()
    await expect(page.locator('text=Password')).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should stay on login page and show validation errors
    await expect(page.url()).toContain('/auth/signin')
    
    // Check for validation error messages
    await expect(page.locator('text=Username is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[name="username"]', 'invaliduser')
    await page.fill('input[name="password"]', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Invalid username or password')).toBeVisible()
    
    // Should remain on login page
    await expect(page.url()).toContain('/auth/signin')
  })

  test('should login successfully with admin credentials', async ({ page }) => {
    // Fill in valid admin credentials
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Should show admin interface
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Test Administrator')).toBeVisible()
  })

  test('should login successfully with staff credentials', async ({ page }) => {
    // Fill in valid staff credentials
    await page.fill('input[name="username"]', 'staff')
    await page.fill('input[name="password"]', 'staff123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Should show staff interface
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Test Staff Member')).toBeVisible()
  })

  test('should handle form submission loading state', async ({ page }) => {
    // Fill in credentials
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin123')
    
    // Submit form and check loading state
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Button should show loading state
    await expect(submitButton).toBeDisabled()
    await expect(submitButton.locator('text=Signing in...')).toBeVisible()
    
    // Eventually should redirect
    await expect(page).toHaveURL('/dashboard')
  })

  test('should redirect authenticated users away from login page', async ({ page }) => {
    // First login
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Try to access login page again
    await page.goto('/auth/signin')
    
    // Should redirect back to dashboard
    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Logout', () => {
  test.use({ storageState: 'e2e/auth/admin.json' })

  test('should logout successfully', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should be authenticated
    await expect(page.locator('text=Test Administrator')).toBeVisible()
    
    // Click logout button
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Logout')
    
    // Should redirect to login page
    await expect(page).toHaveURL('/auth/signin')
    
    // Should not be able to access dashboard without re-authentication
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/auth/signin')
  })
})

test.describe('Session Management', () => {
  test('should handle expired sessions gracefully', async ({ page }) => {
    // Mock an expired session scenario
    await page.goto('/auth/signin')
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Simulate session expiry by clearing session storage
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // Try to access a protected page
    await page.goto('/transactions')
    
    // Should redirect to login
    await expect(page.url()).toContain('/auth/signin')
  })

  test('should maintain session across page refreshes', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Refresh the page
    await page.reload()
    
    // Should still be authenticated
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Test Administrator')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('login form should be accessible', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="username"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="password"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('button[type="submit"]')).toBeFocused()
    
    // Test form submission with keyboard
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin123')
    await page.keyboard.press('Enter')
    
    await expect(page).toHaveURL('/dashboard')
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Check for proper labeling
    await expect(page.locator('input[name="username"]')).toHaveAttribute('aria-label', /username/i)
    await expect(page.locator('input[name="password"]')).toHaveAttribute('aria-label', /password/i)
    
    // Check for form validation announcements
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })
})

test.describe('Security', () => {
  test('should prevent brute force attacks', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Attempt multiple failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="username"]', 'admin')
      await page.fill('input[name="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      await page.waitForTimeout(100) // Small delay between attempts
    }
    
    // After too many attempts, should show rate limiting message
    await expect(page.locator('text=Too many failed attempts')).toBeVisible()
    
    // Login button should be disabled temporarily
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('should not expose sensitive information in errors', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Try with non-existent username
    await page.fill('input[name="username"]', 'nonexistentuser')
    await page.fill('input[name="password"]', 'somepassword')
    await page.click('button[type="submit"]')
    
    // Should show generic error message, not specific "user not found"
    await expect(page.locator('text=Invalid username or password')).toBeVisible()
    
    // Should not indicate whether username exists or password is wrong
    await expect(page.locator('text=User not found')).not.toBeVisible()
    await expect(page.locator('text=Incorrect password')).not.toBeVisible()
  })
})

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE size

  test('should display login form correctly on mobile', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Form should be visible and properly sized
    const loginForm = page.locator('form')
    await expect(loginForm).toBeVisible()
    
    // Input fields should be touch-friendly
    const usernameInput = page.locator('input[name="username"]')
    const passwordInput = page.locator('input[name="password"]')
    
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    
    // Button should be large enough for touch
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    
    const buttonBox = await submitButton.boundingBox()
    expect(buttonBox?.height).toBeGreaterThan(44) // Minimum touch target size
  })

  test('should handle mobile keyboard interactions', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Tap username field - should bring up appropriate keyboard
    await page.locator('input[name="username"]').click()
    await expect(page.locator('input[name="username"]')).toBeFocused()
    
    // Fill and navigate to password
    await page.fill('input[name="username"]', 'admin')
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="password"]')).toBeFocused()
    
    await page.fill('input[name="password"]', 'admin123')
    await page.keyboard.press('Enter')
    
    await expect(page).toHaveURL('/dashboard')
  })
})