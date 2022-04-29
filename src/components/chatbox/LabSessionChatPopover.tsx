import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import React from "react"

const LabSessionChatPopover = ({
  children,
}: {
  children: React.ReactChild | React.ReactChildren
}) => {
  return (
    <Popover placement="top-end">
      <PopoverTrigger>
        <Button>Chat</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Chats</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default LabSessionChatPopover
