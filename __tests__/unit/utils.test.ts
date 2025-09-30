import { cn, formatCurrency, formatDate, formatDateTime, getInitials } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge classes correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      expect(cn('base-class', true && 'conditional-class', false && 'hidden-class'))
        .toBe('base-class conditional-class')
    })

    it('should resolve conflicting Tailwind classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('', null, undefined)).toBe('')
    })

    it('should handle arrays and objects', () => {
      expect(cn(['class1', 'class2'], { 'class3': true, 'class4': false }))
        .toBe('class1 class2 class3')
    })
  })

  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(1000000)).toBe('Rp1.000.000')
      expect(formatCurrency(500000)).toBe('Rp500.000')
      expect(formatCurrency(1500)).toBe('Rp1.500')
    })

    it('should format negative amounts correctly', () => {
      expect(formatCurrency(-1000000)).toBe('-Rp1.000.000')
      expect(formatCurrency(-500)).toBe('-Rp500')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('Rp0')
    })

    it('should handle decimal amounts', () => {
      expect(formatCurrency(1000.50)).toBe('Rp1.001') // Indonesian formatting rounds
      expect(formatCurrency(999.99)).toBe('Rp1.000')
    })

    it('should handle very large amounts', () => {
      expect(formatCurrency(1000000000)).toBe('Rp1.000.000.000')
    })
  })

  describe('formatDate', () => {
    it('should format Date objects correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/15 Januari 2024|January 15, 2024/) // Allow for locale variations
    })

    it('should format date strings correctly', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toMatch(/15 Januari 2024|January 15, 2024/)
    })

    it('should handle different date formats', () => {
      const formatted = formatDate('2024-12-25T00:00:00Z')
      expect(formatted).toMatch(/25 Desember 2024|December 25, 2024/)
    })

    it('should handle invalid dates gracefully', () => {
      expect(() => formatDate('invalid-date')).not.toThrow()
      const result = formatDate('invalid-date')
      expect(result).toMatch(/Invalid Date|NaN/)
    })
  })

  describe('formatDateTime', () => {
    it('should format Date objects with time correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDateTime(date)
      expect(formatted).toMatch(/15 Januari 2024.*10\.30|January 15, 2024.*10:30/)
    })

    it('should format date strings with time correctly', () => {
      const formatted = formatDateTime('2024-01-15T14:45:00Z')
      expect(formatted).toMatch(/15 Januari 2024.*14\.45|January 15, 2024.*14:45/)
    })

    it('should handle midnight correctly', () => {
      const formatted = formatDateTime('2024-01-15T00:00:00Z')
      expect(formatted).toMatch(/15 Januari 2024.*00\.00|January 15, 2024.*00:00/)
    })

    it('should handle different timezones', () => {
      const date = new Date('2024-01-15T23:59:00+07:00')
      const formatted = formatDateTime(date)
      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })
  })

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('Ahmad Zaki')).toBe('AZ')
      expect(getInitials('Muhammad Abdullah Rahman')).toBe('MA')
    })

    it('should handle single name', () => {
      expect(getInitials('Ahmad')).toBe('A')
    })

    it('should handle names with more than 2 parts', () => {
      expect(getInitials('Muhammad Ahmad Zaki Rahman')).toBe('MA') // Only first 2 initials
    })

    it('should handle names with extra spaces', () => {
      expect(getInitials('  Ahmad   Zaki  ')).toBe('AZ')
    })

    it('should convert to uppercase', () => {
      expect(getInitials('ahmad zaki')).toBe('AZ')
      expect(getInitials('AHMAD zaki')).toBe('AZ')
    })

    it('should handle empty strings', () => {
      expect(getInitials('')).toBe('')
      expect(getInitials('   ')).toBe('')
    })

    it('should handle names with special characters', () => {
      expect(getInitials('Ahmad-Zaki')).toBe('A')
      expect(getInitials("Ahmad O'Connor")).toBe('AO')
    })

    it('should handle non-Latin characters', () => {
      expect(getInitials('أحمد زكي')).toBe('أز')
      expect(getInitials('Muhammad Åhmed')).toBe('MÅ')
    })
  })
})

// Additional integration-style tests for utility combinations
describe('Utils Integration', () => {
  it('should work together for formatting user display', () => {
    const user = {
      name: 'Muhammad Ahmad Zaki',
      balance: 1500000,
      lastLogin: '2024-01-15T10:30:00Z'
    }

    const initials = getInitials(user.name)
    const formattedBalance = formatCurrency(user.balance)
    const formattedDate = formatDateTime(user.lastLogin)

    expect(initials).toBe('MA')
    expect(formattedBalance).toBe('Rp1.500.000')
    expect(typeof formattedDate).toBe('string')
    expect(formattedDate.length).toBeGreaterThan(0)
  })

  it('should handle edge cases gracefully', () => {
    expect(getInitials('')).toBe('')
    expect(formatCurrency(0)).toBe('Rp0')
    expect(() => formatDate('invalid')).not.toThrow()
  })
})