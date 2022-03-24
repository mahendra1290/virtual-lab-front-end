import { Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { useAuthContext } from "../../providers/AuthProvider"
import { Button } from "@chakra-ui/react"
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
        className="mx-auto mt-24 flex w-full flex-col gap-4 rounded-md border-2 p-8 sm:w-2/3 lg:w-1/4"
      >
        <h1 className="text-bold mb-1 text-xl">Sign in to Virtual Lab</h1>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full rounded-sm"
            type="text"
            name="email"
            id="email"
          />
          <p className="mt-2 text-xs text-red-600">{errors.email?.message}</p>
        </label>
        <label className="block">
          <span className="text-gray-700">Password</span>
          <input
            {...register("password", { required: "Password is required" })}
            className="mt-1 block w-full rounded-sm"
            type="password"
            name="password"
            id="password"
          />
          <p className="mt-2 text-xs text-red-600">
            {errors.password?.message}
          </p>
        </label>

        <Button
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
