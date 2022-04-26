import { Skeleton } from "@chakra-ui/react"
import React from "react"

const LabLoadingSkeleton = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="p-2">
      <Skeleton height="60px" />
      <div className="mt-4 flex h-40 gap-2">
        <Skeleton className="w-1/4" height="30rem" />
        <Skeleton className="w-3/4" height="30rem" />
      </div>
    </div>
  )
}

export default LabLoadingSkeleton
