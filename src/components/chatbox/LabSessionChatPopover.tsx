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
  IconButton,
} from "@chakra-ui/react"
import { IoMdChatbubbles } from "react-icons/io"
import React from "react"

const LabSessionChatPopover = ({
  children,
}: {
  children: React.ReactChild | React.ReactChildren
}) => {
  return (
    <Popover placement="top-end">
      <PopoverTrigger>
        <IconButton
          variant="link"
          colorScheme={"teal"}
          aria-label="Call Segun"
          size="lg"
          outline={"none"}
          icon={<IoMdChatbubbles />}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent width="480px">
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
