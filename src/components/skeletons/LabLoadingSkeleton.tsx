import { Skeleton } from "@chakra-ui/react"

const LabLoadingSkeleton = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="p-2">
      <Skeleton height="60px" />
      <div className="px-8">
        <div className="mt-4 flex h-40 gap-4">
          <div className="w-1/4 space-y-2">
            <Skeleton height="4rem" />
            <Skeleton height="4rem" />
            <Skeleton height="4rem" />
            <Skeleton height="4rem" />
            <Skeleton height="4rem" />
          </div>
          <Skeleton className="w-3/4" height="30rem" />
        </div>
      </div>
    </div>
  )
}

export default LabLoadingSkeleton
