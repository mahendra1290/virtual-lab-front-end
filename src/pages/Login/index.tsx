import { Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { app } from "../../firebase"

const provider = new GoogleAuthProvider()
const auth = getAuth(app)

export const Login = () => {
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential?.accessToken
        const user = result.user
        console.log(user, token)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.log(errorCode, errorMessage, email, credential)
      })
  }

  return (
    <div className="h-full p-2">
      <div className="mx-auto mt-24 flex w-full flex-col gap-4 rounded-md border-2 p-8 sm:w-2/3 lg:w-1/4">
        <h1 className="text-bold mb-1 text-xl">Sign in to Virtual Lab</h1>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            className="mt-1 block w-full rounded-sm"
            type="text"
            name="email"
            id="email"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Password</span>
          <input
            className="mt-1 block w-full rounded-sm"
            type="text"
            name="password"
            id="password"
          />
        </label>

        <button className="rounded-full bg-blue-200 px-4 py-2">Sign in</button>
        <Link to="forgot password" className="text-sm">
          Forgot password?
        </Link>
        <div className="flex items-center gap-2">
          <hr className="flex-1" />
          <span>Or</span>
          <hr className="flex-1" />
        </div>
        <button
          onClick={handleSignIn}
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
      </div>
    </div>
  )
}
