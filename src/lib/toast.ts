// Simple toast implementation
let toastContainer: HTMLElement | null = null;

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

function createToastContainer() {
  if (toastContainer) return toastContainer;
  
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
  document.body.appendChild(toastContainer);
  
  return toastContainer;
}

function showToast(message: string, options: ToastOptions = {}) {
  const { type = 'info', duration = 3000 } = options;
  
  const container = createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `
    px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full
    ${type === 'success' ? 'bg-green-600' : ''}
    ${type === 'error' ? 'bg-red-600' : ''}
    ${type === 'warning' ? 'bg-yellow-600' : ''}
    ${type === 'info' ? 'bg-blue-600' : ''}
  `;
  
  toast.textContent = message;
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, duration);
}

export const toast = {
  success: (message: string, options?: ToastOptions) => 
    showToast(message, { ...options, type: 'success' }),
  error: (message: string, options?: ToastOptions) => 
    showToast(message, { ...options, type: 'error' }),
  info: (message: string, options?: ToastOptions) => 
    showToast(message, { ...options, type: 'info' }),
  warning: (message: string, options?: ToastOptions) => 
    showToast(message, { ...options, type: 'warning' }),
};