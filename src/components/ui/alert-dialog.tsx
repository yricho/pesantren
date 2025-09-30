"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface AlertDialogTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

interface AlertDialogContentProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogFooterProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogActionProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

interface AlertDialogCancelProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const AlertDialogContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

const AlertDialog: React.FC<AlertDialogProps> & {
  Trigger: React.FC<AlertDialogTriggerProps>
  Content: React.FC<AlertDialogContentProps>
  Header: React.FC<AlertDialogHeaderProps>
  Title: React.FC<AlertDialogTitleProps>
  Description: React.FC<AlertDialogDescriptionProps>
  Footer: React.FC<AlertDialogFooterProps>
  Action: React.FC<AlertDialogActionProps>
  Cancel: React.FC<AlertDialogCancelProps>
} = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({ 
  children, 
  className,
  asChild = false 
}) => {
  const { setIsOpen } = React.useContext(AlertDialogContext)
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setIsOpen(true),
      className: cn(className, (children as React.ReactElement).props?.className)
    })
  }

  return (
    <button
      type="button"
      className={cn("", className)}
      onClick={() => setIsOpen(true)}
    >
      {children}
    </button>
  )
}

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children, className }) => {
  const { isOpen, setIsOpen } = React.useContext(AlertDialogContext)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}>
      {children}
    </div>
  )
}

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn("text-lg font-semibold", className)}>
      {children}
    </h2>
  )
}

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn("text-sm text-gray-500", className)}>
      {children}
    </p>
  )
}

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)}>
      {children}
    </div>
  )
}

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ children, className, onClick, disabled = false }) => {
  const { setIsOpen } = React.useContext(AlertDialogContext)

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    setIsOpen(false)
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ children, className, onClick }) => {
  const { setIsOpen } = React.useContext(AlertDialogContext)

  const handleClick = () => {
    onClick?.()
    setIsOpen(false)
  }

  return (
    <button
      type="button"
      className={cn(
        "mt-3 inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

AlertDialog.Trigger = AlertDialogTrigger
AlertDialog.Content = AlertDialogContent
AlertDialog.Header = AlertDialogHeader
AlertDialog.Title = AlertDialogTitle
AlertDialog.Description = AlertDialogDescription
AlertDialog.Footer = AlertDialogFooter
AlertDialog.Action = AlertDialogAction
AlertDialog.Cancel = AlertDialogCancel

export { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogAction, 
  AlertDialogCancel 
}