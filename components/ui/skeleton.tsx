import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  )
}

// Specific skeleton variants for common use cases
export function InputSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton 
      className={cn('h-10 w-full', className)} 
      {...props} 
    />
  )
}

export function ButtonSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton 
      className={cn('h-10 w-full', className)} 
      {...props} 
    />
  )
}

export function TextSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton 
      className={cn('h-4 w-3/4', className)} 
      {...props} 
    />
  )
}

export function LabelSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton 
      className={cn('h-4 w-16', className)} 
      {...props} 
    />
  )
}

// Loading spinner component for inline loading states
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-gray-600',
        'dark:border-gray-600 dark:border-t-gray-300',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}