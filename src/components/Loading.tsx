import { Spinner } from "@chakra-ui/react"
import React from "react"

const Loading = () => {
  return (
    <div className="flex h-[20rem] flex-col items-center justify-center">
      <Spinner size="xl" />
      <h1 className="text-2xl">Loading...</h1>
    </div>
  )
}

export default Loading
