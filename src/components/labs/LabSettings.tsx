import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Button,
  Input,
  FormLabel,
  FormHelperText,
  FormControl,
  Tag,
  VStack,
  HStack,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { async } from "@firebase/util"
import axios from "axios"
import { Timestamp } from "firebase/firestore"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { FaCopy } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useLabContext } from "../../providers/LabProvider"
import { Lab, LabJoiningLink } from "../../shared/types/Lab"

interface LabSettingsProps {
  lab?: Lab
}

const LabSettings = ({ lab }: LabSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const dateRef = useRef<HTMLInputElement>(null)
  const labId = lab?.id

  const { updateLab } = useLabContext()

  const toast = useToast()

  const createLink = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`labs/${labId}/lab-joining-links`, {
        labId,
        expiryDate: dateRef.current?.valueAsDate
          ? Timestamp.fromDate(dateRef.current?.valueAsDate)
          : null,
      })
      const joiningLink = response.data.joiningLink
      toast({
        title: "Joining link created",
        status: "success",
        duration: 2000,
      })
      setIsOpen(false)
    } catch (err) {
      setLoading(false)
    }
    setLoading(false)
  }

  const link = lab?.joiningLink

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${window.location.origin}/${link?.url}`)
        .then((value) => {
          toast({
            title: "Link copied to clipboard",
            variant: "subtle",
            status: "info",
            position: "top",
            duration: 2000,
          })
        })
    }
  }

  return (
    <div>
      <VStack align="start" spacing="4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl">Joining Link</h1>
          <FaCopy role="button" onClick={handleCopyLink} />
          {loading && <Spinner />}
        </div>
        {!link && !loading && <h1>No link created. Please create one</h1>}
        {!loading && link && (
          <HStack>
            <Link
              className="rounded-lg border px-4 py-2 text-lg text-blue-600"
              to={"/" + link.url}
            >
              {link.url}
            </Link>
            {link.expiryTimestamp && (
              <p className="rounded-lg border px-4 py-2 text-lg text-red-500">
                {/* {link.expiryTimestamp} */}
                {moment(
                  Timestamp.fromMillis(
                    link.expiryTimestamp.seconds * 1000
                  ).toDate()
                ).format("DD-MM-YYYY")}
              </p>
            )}
          </HStack>
        )}
        <Button onClick={() => setIsOpen(true)}>
          {link ? "Generate new link" : "Generate link"}
        </Button>
      </VStack>

      <Modal size="lg" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Valid for</FormLabel>
              <Input ref={dateRef} type="date" />
              <FormHelperText>
                A student can join lab before expiry date. (Leave empty if not
                needed)
              </FormHelperText>
            </FormControl>

            {/* <FormControl className="mt-4">
              <FormLabel>Email domain</FormLabel>
              <Input type="text" />
            </FormControl> */}
          </ModalBody>
          <ModalFooter>
            <Button type="button" colorScheme="red" className="mr-4">
              Cancel
            </Button>
            <Button
              isLoading={loading}
              loadingText="Creating..."
              onClick={createLink}
              type="button"
              colorScheme="green"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default LabSettings
