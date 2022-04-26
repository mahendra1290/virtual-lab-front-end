import React, { useState } from "react"
import { FiDelete } from "react-icons/fi"
import { BiRename } from "react-icons/bi"
import { Input } from "@chakra-ui/react"

type LabSectionMenuProps = {
  value: string
  mode: string
}

const LabSectionMenu = ({ value, mode = "er" }: LabSectionMenuProps) => {
  const [text, setText] = useState(value)
  return (
    <div className="group flex w-full items-center justify-between">
      {mode == "edit" && (
        <>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
          <div className="hidden gap-2 group-hover:flex">
            <BiRename className="text-green-600" />
            <FiDelete className="text-red-600" />
          </div>
        </>
      )}
      <span>{value}</span>
      <div className="hidden gap-2 group-hover:flex">
        <BiRename className="text-green-600" />
        <FiDelete className="text-red-600" />
      </div>
    </div>
  )
}

export default LabSectionMenu
