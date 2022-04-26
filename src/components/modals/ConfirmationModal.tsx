import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Button,
} from "@chakra-ui/react"
import React from "react"

export type ConfirmationModalProps = {
  header: string | React.Component
  body: string | React.Component
  isOpen: boolean
  okBtnText?: string
  cancelBtnText?: string
  onOk: () => void
  onClose: () => void
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  header,
  body,
  onOk,
  okBtnText = "Delete",
  cancelBtnText = "Cancel",
}: ConfirmationModalProps) => {
  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button type="button" onClick={onClose} className="mr-4">
            {cancelBtnText}
          </Button>
          <Button type="button" colorScheme="red" onClick={onOk}>
            {okBtnText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfirmationModal
