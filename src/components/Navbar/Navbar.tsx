import { Avatar, Button, useColorMode } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../providers/AuthProvider"
import Header from "../header/header"
import NotificationBox from "./NotificationBox"
import ProfileMenu from "./ProfileMenu"
import "../../logo.svg"
import Toggle from "../ThemeToggle"

export const Navbar = () => {
  const { user, signOut, authLoading } = useAuthContext()

  return (
    <>
      <nav className="flex items-center justify-between bg-gray-100 p-4 shadow-sm dark:bg-gray-800 md:py-4 lg:px-8">
        <Link to="/">
          <h1 className="font-mono text-xl font-bold first-letter:text-2xl first-letter:text-blue-600 dark:text-slate-200 dark:first-letter:text-blue-300">
            Virtual Lab
          </h1>
        </Link>
        <ul className="flex items-center gap-2">
          <NotificationBox />
          <div className="hidden gap-2 dark:text-slate-200 md:flex">
            <li>About</li>
            <li>Contact Us</li>
          </div>
          <Toggle />
          {/* <Button onClick={toggleColorMode}>
            Toggle {colorMode === "light" ? "Dark" : "Light"}
          </Button> */}
          {!user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/sign-up">Sign up</Link>
            </li>
          )}
          {/* {user && <Avatar size="sm" name={user.name || ""} src="" />} */}
          {user && <ProfileMenu />}

          {/* {user && (
            <li>
              <Button
                isLoading={authLoading}
                onClick={signOut}
                colorScheme="teal"
              >
                Log out
              </Button>
            </li>
          )} */}
        </ul>
      </nav>
      {/* <nav className="rounded border-gray-200 bg-white px-2 py-2.5 dark:bg-gray-800 sm:px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <a className="flex items-center">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Virtual lab
            </span>
          </a>
          <div className="flex items-center md:order-2">
            <ProfileMenu />
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
            id="mobile-menu-2"
          >
            <ul className="mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium">
              <li>
                <a
                  href="#"
                  className="block rounded bg-blue-700 py-2 pr-4 pl-3 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}
    </>
  )
}
