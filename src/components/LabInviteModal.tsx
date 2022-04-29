import {
  FormControl,
  FormHelperText,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { FormField } from "./forms/FormField"

interface Props {
  onSubmit: (emails: string[]) => void
}

const LabInviteModal = ({ onSubmit }: Props) => {
  const [emails, setEmails] = useState<string[]>([])
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    resetField,
  } = useForm({
    defaultValues: {
      email: "",
    },
  })
  const toast = useToast()

  const somethingWentWrongToast = useToast({
    title: "Please provide email",
    status: "warning",
    duration: 2000,
  })

  const handleEnter = (data: { email: string }) => {
    const exist = emails.find((mail) => mail == data.email)
    if (exist) {
      toast({
        title: "Email already exist",
        status: "warning",
        duration: 2000,
        position: "top",
      })
    } else {
      setEmails((e) => [...e, data.email])
      resetField("email")
    }
  }

  return (
    <ModalBody>
      Invite students to join lab
      <form onSubmit={handleSubmit(handleEnter)} className="mt-4">
        <FormControl isInvalid={!!errors.email}>
          <FormField
            label="Email"
            {...register("email", { required: "Email is required" })}
            error={errors.email}
            type="email"
            id="email"
            placeholder="Enter email of student"
          />
          <FormHelperText style={{ marginBottom: 8 }}>
            Press Enter to Add
          </FormHelperText>
          <HStack spacing={2}>
            {emails.map((mail) => (
              <Tag
                size="md"
                key={mail}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
              >
                <TagLabel>{mail}</TagLabel>
                <TagCloseButton
                  onClick={(e) => setEmails((e) => e.filter((m) => m != mail))}
                />
              </Tag>
            ))}
          </HStack>
        </FormControl>
      </form>
      <ModalFooter>
        <Button
          onClick={() => {
            const val = getValues("email")
            if (val) {
              emails.push(val)
              onSubmit(emails)
            } else if (emails.length == 0) {
              somethingWentWrongToast()
            } else {
              onSubmit(emails)
            }
          }}
        >
          Send
        </Button>
        <Button className="ml-4">Cancel</Button>
      </ModalFooter>
    </ModalBody>
  )
}

export default LabInviteModal
