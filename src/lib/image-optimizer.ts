import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Image optimization service without Sharp (using Next.js built-in optimization)
export class ImageOptimizer {
  private cache: Map<string, { buffer: Buffer; contentType: string; timestamp: number }> = new Map();
  private readonly cacheTTL = 24 * 60 * 60 * 1000; // 24 hours
  
  constructor() {
    // Clean cache every hour
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60 * 60 * 1000);
  }

  private cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  private generateCacheKey(src: string, options: ImageOptions): string {
    return `${src}-${options.width}-${options.height}-${options.quality}-${options.format}`;
  }

  private async optimizeWithCanvas(buffer: Buffer, options: ImageOptions): Promise<{ buffer: Buffer; contentType: string }> {
    // Since we can't use Sharp, we'll implement basic optimization
    // This is a fallback - in production, you should use Sharp or similar
    return {
      buffer,
      contentType: this.getContentType(options.format || 'jpeg')
    };
  }

  private getContentType(format: string): string {
    switch (format.toLowerCase()) {
      case 'webp':
        return 'image/webp';
      case 'avif':
        return 'image/avif';
      case 'png':
        return 'image/png';
      case 'jpeg':
      case 'jpg':
      default:
        return 'image/jpeg';
    }
  }

  async optimizeImage(src: string, options: ImageOptions): Promise<{ buffer: Buffer; contentType: string }> {
    const cacheKey = this.generateCacheKey(src, options);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return { buffer: cached.buffer, contentType: cached.contentType };
    }

    try {
      // Read the source image
      const buffer = await fs.readFile(src);
      
      // Optimize the image (placeholder - use Sharp in production)
      const result = await this.optimizeWithCanvas(buffer, options);
      
      // Cache the result
      this.cache.set(cacheKey, {
        buffer: result.buffer,
        contentType: result.contentType,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw new Error('Image optimization failed');
    }
  }

  async generateResponsiveImages(src: string, breakpoints: number[] = [640, 768, 1024, 1280, 1920]) {
    const results = await Promise.all(
      breakpoints.map(async (width) => {
        const result = await this.optimizeImage(src, { width, quality: 85 });
        return {
          width,
          src: `data:${result.contentType};base64,${result.buffer.toString('base64')}`,
        };
      })
    );
    
    return results;
  }
}

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
}

// Singleton instance
export const imageOptimizer = new ImageOptimizer();

// Next.js Image Optimization Component
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  className?: string;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// React component for optimized images
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 85,
  priority = false,
  loading = 'lazy',
  className = '',
  sizes,
  placeholder = 'empty',
  blurDataURL
}) => {
  // Use standard img element for optimization
  return React.createElement('img', {
    src: src,
    alt: alt,
    width: width,
    height: height,
    loading: loading,
    className: className,
    style: {
      maxWidth: '100%',
      height: 'auto'
    }
  });
};

// Image format detection and WebP support
export const getOptimalImageFormat = (userAgent: string): 'webp' | 'avif' | 'jpeg' => {
  if (userAgent.includes('Chrome') && userAgent.includes('Version/')) {
    return 'avif'; // Modern Chrome supports AVIF
  }
  if (userAgent.includes('Chrome') || userAgent.includes('Firefox') || userAgent.includes('Edge')) {
    return 'webp';
  }
  return 'jpeg';
};

// Image preloading utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Intersection Observer for lazy loading
export const useLazyImageObserver = () => {
  const observerRef = React.useRef<IntersectionObserver>();
  
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.dataset.src;
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                observerRef.current?.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
  
  return observerRef.current;
};

// Progressive image loading component
export const ProgressiveImage: React.FC<{
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}> = ({ src, placeholder, alt, className, width, height }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState(placeholder || '');
  
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    img.src = src;
  }, [src]);
  
  return React.createElement('div', {
    className: `progressive-image ${isLoaded ? 'loaded' : 'loading'}`
  }, React.createElement('img', {
    src: currentSrc,
    alt: alt,
    className: className,
    width: width,
    height: height,
    style: {
      transition: 'opacity 0.3s ease',
      opacity: isLoaded ? 1 : 0.7,
      filter: isLoaded ? 'none' : 'blur(2px)'
    }
  }));
};

// Image compression utility (client-side)
export const compressImage = async (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Image upload with optimization
export const uploadOptimizedImage = async (
  file: File,
  endpoint: string = '/api/upload/image'
): Promise<{ url: string; optimized: boolean }> => {
  const compressedImage = await compressImage(file, 0.85, 1920, 1080);
  
  const formData = new FormData();
  formData.append('image', compressedImage, file.name);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  return response.json();
};