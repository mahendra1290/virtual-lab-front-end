import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import { PasswordInput } from "../../components/forms/PasswordInput"
import { useForm } from "react-hook-form"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import { useState } from "react"
import { useAuthContext } from "../../providers/AuthProvider"
import { ProfileForm } from "./ProfileForm"
import { FormField } from "../../components/forms/FormField"

export const Signup = () => {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, signUpWithEmailPassword, authLoading } =
    useAuthContext()

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    await signUpWithEmailPassword(data.email, data.password)
    setLoading(false)
  }

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    return getValues("password") === confirmPassword
  }

  return (
    <div className="h-full p-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-12 flex w-full flex-col gap-4 rounded-lg border border-gray-100 p-8 shadow-lg sm:w-2/3 lg:w-1/4"
      >
        <h1 className="text-bold mb-1 text-xl">Sign up for Virtual Lab</h1>

        <FormControl isInvalid={errors.email}>
          <FormField
            label="Email"
            {...register("email", { required: "Email required" })}
            type="email"
            id="email"
            error={errors.email}
            placeholder="Enter email"
          />
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <FormField
            id="password"
            type="password"
            label="Password"
            {...register("password", {
              required: "Password required",
              minLength: { value: 6, message: "Min 6 characters required" },
            })}
            error={errors.password}
            placeholder="Enter your password"
          />
          <FormHelperText>Min 6 charater required</FormHelperText>
        </FormControl>

        <FormControl isInvalid={errors.confirmPassword}>
          <FormField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password required",
              minLength: { value: 6, message: "Min 6 characters required" },
              validate: validateConfirmPassword,
            })}
            error={errors.confirmPassword}
            placeholder="Enter password, again"
          />
          <FormErrorMessage>
            {errors.confirmPassword &&
              errors.confirmPassword.type === "validate" &&
              "Confirm password didn't match"}
          </FormErrorMessage>
        </FormControl>

        <Button
          isLoading={loading}
          loadingText="Signing Up"
          colorScheme="teal"
          variant="solid"
          type="submit"
          rounded="full"
          className="rounded-full bg-blue-200 px-4 py-2"
        >
          Sign up
        </Button>

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
          Sign up with Google
        </button>
        <div className="mx-auto">
          <span className="text-sm">Already have an account?</span>
          <span className="ml-1 text-blue-500">
            <Link className="text-sm" to="/login">
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}
