import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Skeleton,
  InputSkeleton,
  ButtonSkeleton,
  TextSkeleton,
  LabelSkeleton
} from '@/components/ui/skeleton'

interface LoginFormSkeletonProps extends React.ComponentProps<'div'> {}

export function LoginFormSkeleton({
  className,
  ...props
}: LoginFormSkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <Skeleton className="h-7 w-32 mx-auto" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* GitHub Button Skeleton */}
            <div className="flex flex-col gap-4">
              <ButtonSkeleton className="w-full" />
            </div>

            {/* Divider */}
            <div className="relative text-center text-sm">
              <TextSkeleton className="w-24 mx-auto" />
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              {/* Email Field */}
              <div className="grid gap-3">
                <LabelSkeleton />
                <InputSkeleton />
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <LabelSkeleton />
                  <TextSkeleton className="ml-auto w-32" />
                </div>
                <InputSkeleton />
              </div>

              {/* Submit Button */}
              <ButtonSkeleton />
            </div>

            {/* Sign up link */}
            <div className="text-center text-sm">
              <TextSkeleton className="w-40 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms text */}
      <div className="text-center text-xs">
        <TextSkeleton className="w-56 mx-auto" />
      </div>
    </div>
  )
}
