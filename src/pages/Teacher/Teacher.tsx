import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { async } from "@firebase/util"
import { collection, doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"
import { ProfileForm } from "../Signup/ProfileForm"

export const Teacher = () => {
  const { user } = useAuthContext()
  const [addLabModalOpen, setAddModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const createLab = async () => {
    setLoading(true)
    await setDoc(doc(collection(db, "labs")), {
      userUid: user?.uid,
      name: name,
      createdAt: new Date(),
    })
    setLoading(false)
    setAddModalOpen(false)
  }

  return (
    <div>
      <Button onClick={() => setAddModalOpen(true)}>Create Lab</Button>
      <p>{user?.email}</p>
      <p>{user?.role}</p>
      <Modal isOpen={addLabModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Lab</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createLab()
              }}
            >
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <HStack
                paddingTop="1rem"
                justify="end"
                marginBottom="1.5"
                spacing="1rem"
              >
                <Button
                  isLoading={loading}
                  loadingText="Creating"
                  isDisabled={name === ""}
                  type="submit"
                >
                  Create
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </HStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ProfileForm />
    </div>
  )
}
