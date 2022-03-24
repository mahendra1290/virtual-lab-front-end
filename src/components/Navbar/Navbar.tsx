import { Avatar, Button } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../providers/AuthProvider"

export const Navbar = () => {
  const { user, signOut, authLoading } = useAuthContext()

  return (
    <>
      <nav className="flex items-center justify-between bg-gray-100 p-4 px-8 shadow-sm">
        <Link to="/">
          <h1 className="text-xl font-bold first-letter:text-2xl first-letter:text-blue-600">
            Virtual Lab
          </h1>
        </Link>
        <ul className="flex gap-2">
          <li>About</li>
          <li>Contact Us</li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign up</Link>
          </li>
          {user && <Avatar size="sm" name={user.name} />}
          {user && (
            <li>
              <Button
                isLoading={authLoading}
                onClick={signOut}
                colorScheme="teal"
              >
                Log out
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </>
  )
}
