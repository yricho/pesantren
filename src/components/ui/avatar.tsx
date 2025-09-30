"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps {
  children: React.ReactNode
  className?: string
}

interface AvatarImageProps {
  src?: string
  alt?: string
  className?: string
}

interface AvatarFallbackProps {
  children: React.ReactNode
  className?: string
}

const Avatar: React.FC<AvatarProps> & {
  Image: React.FC<AvatarImageProps>
  Fallback: React.FC<AvatarFallbackProps>
} = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      {children}
    </div>
  )
}

const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageFailed, setImageFailed] = React.useState(false)

  if (!src || imageFailed) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageFailed(true)}
      style={{ display: imageLoaded ? 'block' : 'none' }}
    />
  )
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-medium",
        className
      )}
    >
      {children}
    </div>
  )
}

Avatar.Image = AvatarImage
Avatar.Fallback = AvatarFallback

export { Avatar, AvatarImage, AvatarFallback }