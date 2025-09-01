// Password utility functions

// Generate a secure random password
export const generateSecurePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate a memorable password using words
export const generateMemorablePassword = (): string => {
  const adjectives = [
    'Happy', 'Bright', 'Swift', 'Strong', 'Clever',
    'Noble', 'Brave', 'Lucky', 'Golden', 'Silver'
  ];
  const nouns = [
    'Tiger', 'Eagle', 'Dragon', 'Phoenix', 'Lion',
    'Mountain', 'Ocean', 'Thunder', 'Lightning', 'Star'
  ];
  const numbers = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  const symbols = ['!', '@', '#', '$', '%'][Math.floor(Math.random() * 5)];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective}${noun}${numbers}${symbols}`;
};

// Validate password strength
export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  suggestions: string[];
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];
  
  // Length check
  if (password.length >= 8) score++;
  else suggestions.push('Minimal 8 karakter');
  
  if (password.length >= 12) score++;
  else if (password.length >= 8) suggestions.push('Lebih baik 12+ karakter');
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 0.5;
  else suggestions.push('Tambahkan huruf kecil');
  
  if (/[A-Z]/.test(password)) score += 0.5;
  else suggestions.push('Tambahkan huruf besar');
  
  if (/[0-9]/.test(password)) score += 0.5;
  else suggestions.push('Tambahkan angka');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 0.5;
  else suggestions.push('Tambahkan simbol khusus');
  
  // Common patterns check
  if (!/(.)\1{2,}/.test(password)) score += 0.5; // No repeated characters
  else suggestions.push('Hindari karakter berulang');
  
  if (!/^(123|abc|qwerty|password)/i.test(password)) score += 0.5;
  else suggestions.push('Hindari pola umum');
  
  // Determine label and color
  let label = '';
  let color = '';
  
  if (score < 2) {
    label = 'Sangat Lemah';
    color = 'red';
  } else if (score < 3) {
    label = 'Lemah';
    color = 'orange';
  } else if (score < 4) {
    label = 'Sedang';
    color = 'yellow';
  } else if (score < 5) {
    label = 'Kuat';
    color = 'green';
  } else {
    label = 'Sangat Kuat';
    color = 'emerald';
  }
  
  return {
    score: Math.min(score, 5),
    label,
    color,
    suggestions
  };
};

// Copy to clipboard with fallback
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};