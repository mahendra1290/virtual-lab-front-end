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
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../../providers/AuthProvider"

export const ProfileForm = () => {
  const [role, setRole] = useState("student")
  const { user, updateUser } = useAuthContext()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: user?.email,
    },
  })

  useEffect(() => {
    if (user) {
      setValue("email", user.email)
    }
  }, [user])

  const onSubmit = async (data: any) => {
    if (user?.uid) {
      setLoading(true)
      await updateUser(user.uid, data.fullName, role)
      setLoading(false)
      navigate("/")
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-5 w-1/3 space-y-5 rounded-sm p-4 shadow-md"
    >
      <h1 className="text-xl">Complete your profile</h1>
      <FormControl isRequired isInvalid={!!errors.fullName}>
        <FormLabel htmlFor="fullName">Full Name</FormLabel>
        <Input
          {...register("fullName", { required: "Full name is required" })}
          type="text"
          id="fullName"
          placeholder="Enter you full name"
        />
        <FormErrorMessage>
          {errors.fullName && errors.fullName.message}
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
