import { Skeleton } from "@workspace/ui/components/skeleton"

export function BlogsPageSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-green-200 bg-white shadow">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="mb-2 h-6 w-full" />
            <Skeleton className="mb-4 h-16 w-full" />
            <Skeleton className="mb-4 h-4 w-32" />
            <div className="flex justify-between">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
