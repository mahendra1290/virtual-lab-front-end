import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { auth } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"

export const ProfileForm = () => {
  const [role, setRole] = useState("student")
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: user?.name,
      email: user?.email,
    },
  })

  useEffect(() => {
    if (user) {
      setValue("email", user.email)
      setValue("displayName", user.name)
    }
    if (user?.role) {
      navigate("/")
    }
  }, [user])

  const onSubmit = async (data: {
    email?: string | null
    displayName?: string | null
  }) => {
    if (user?.uid) {
      setLoading(true)
      try {
        await axios.post(`/users/${user.uid}`, {
          role: role,
          displayName: data.displayName,
        })
        await auth.currentUser?.getIdToken(true)
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-5 w-1/3 space-y-5 rounded-sm p-6 shadow-lg"
    >
      <h1 className="text-xl">Complete your profile</h1>
      <FormControl isRequired isInvalid={!!errors.displayName}>
        <FormLabel htmlFor="fullName">Full Name</FormLabel>
        <Input
          {...register("displayName", { required: "Display name is required" })}
          type="text"
          id="fullName"
          placeholder="Enter you full name"
        />
        <FormErrorMessage>
          {errors.displayName && errors.displayName.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isDisabled>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input {...register("email")} type="email" id="email" />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="role">Role</FormLabel>
        <RadioGroup
          onChange={setRole}
          value={role}
          id="role"
          colorScheme="teal"
        >
          <Stack direction="row" spacing="2">
            <Radio value="teacher">Teacher</Radio>
            <Radio value="student">Student</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <Button isLoading={loading} type="submit" colorScheme="teal">
        Submit
      </Button>
    </form>
  )
}
