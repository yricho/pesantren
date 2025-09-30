import { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

const toastState: ToastState = {
  toasts: []
}

let listeners: Array<(state: ToastState) => void> = []

function dispatch(action: { type: 'ADD_TOAST' | 'REMOVE_TOAST'; toast?: Toast; id?: string }) {
  switch (action.type) {
    case 'ADD_TOAST':
      if (action.toast) {
        toastState.toasts = [...toastState.toasts, action.toast]
      }
      break
    case 'REMOVE_TOAST':
      toastState.toasts = toastState.toasts.filter(t => t.id !== action.id)
      break
  }
  
  listeners.forEach(listener => {
    listener(toastState)
  })
}

export function toast({ title, description, type = 'info', variant, duration = 3000 }: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast: Toast = { id, title, description, type, variant, duration }
  
  dispatch({ type: 'ADD_TOAST', toast: newToast })
  
  if (duration > 0) {
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id })
    }, duration)
  }
}

export function useToast() {
  const [state, setState] = useState<ToastState>(toastState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter(l => l !== setState)
    }
  }, [])

  return {
    toast,
    toasts: state.toasts,
    dismiss: (id: string) => dispatch({ type: 'REMOVE_TOAST', id })
  }
}