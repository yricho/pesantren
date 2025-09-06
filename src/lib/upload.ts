import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

/**
 * Upload image to local storage or cloud storage
 * In production, this should upload to cloud storage like S3, GCS, or Cloudinary
 */
export async function uploadImage(base64Data: string, filename: string): Promise<string> {
  try {
    // For development, save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true })
    
    // Generate unique filename
    const ext = path.extname(filename)
    const hash = crypto.randomBytes(8).toString('hex')
    const uniqueFilename = `${Date.now()}-${hash}${ext}`
    const filepath = path.join(uploadsDir, uniqueFilename)
    
    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64Data, 'base64')
    await fs.writeFile(filepath, buffer)
    
    // Return public URL
    const publicUrl = `/uploads/${uniqueFilename}`
    
    // In production, return the cloud storage URL
    // return `https://storage.googleapis.com/bucket-name/${uniqueFilename}`
    
    return publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Delete image from storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    if (imageUrl.startsWith('/uploads/')) {
      // Local file
      const filename = imageUrl.replace('/uploads/', '')
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
      await fs.unlink(filepath)
    }
    // In production, delete from cloud storage
  } catch (error) {
    console.error('Delete error:', error)
  }
}

/**
 * Get image URL for display
 */
export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return '/images/placeholder.png'
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If it's a local path, prepend the base URL in production
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`
  }
  
  return imageUrl
}