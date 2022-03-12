import React from "react"
import { Link } from "react-router-dom"

export const Navbar = () => {
  return (
    <nav className="p-4 px-8 shadow-sm bg-gray-100 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-xl font-bold">Virtual Lab</h1>
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
      </ul>
    </nav>
  )
}
