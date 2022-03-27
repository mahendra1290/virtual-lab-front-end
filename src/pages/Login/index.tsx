import { Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { useAuthContext } from "../../providers/AuthProvider"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"

export const Login = () => {
  const { signInWithEmailPassword, authLoading, signInWithGoogle } =
    useAuthContext()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignIn = (data: { email: string; password: string }) => {
    signInWithEmailPassword(data.email, data.password)
  }

  return (
    <div className="h-full p-2">
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="mx-auto mt-24 flex w-full flex-col gap-4 rounded-lg border border-gray-100 p-8 shadow-lg sm:w-2/3 lg:w-1/4"
      >
        <h1 className="text-bold mb-1 text-xl">Sign in to Virtual Lab</h1>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full rounded-sm"
            type="text"
            name="email"
            id="email"
            placeholder="Enter you email"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            {...register("password", { required: "Password is required" })}
            className="mt-1 block w-full rounded-sm"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          borderRadius="full"
          isLoading={authLoading}
          loadingText="Signing In"
          type="submit"
          className="rounded-full bg-blue-200 px-4 py-2"
        >
          Sign in
        </Button>
        <Link to="forgot password" className="text-sm">
          Forgot password?
        </Link>
        <div className="flex items-center gap-2">
          <hr className="flex-1" />
          <span>Or</span>
          <hr className="flex-1" />
        </div>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>
        <div className="mx-auto">
          <span className="text-sm">Don't have an account?</span>
          <span className="ml-1 text-blue-500">
            <Link className="text-sm" to="/sign-up">
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}
