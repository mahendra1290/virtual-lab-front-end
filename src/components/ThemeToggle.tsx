import { useColorMode } from "@chakra-ui/react"
import React from "react"
import { FaSun, FaMoon } from "react-icons/fa"
import { ThemeContext } from "../providers/ThemeContext"

const Toggle = () => {
  const { theme, setTheme } = React.useContext(ThemeContext)
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <div className="rounded-full p-2 transition duration-500 ease-in-out">
      {theme === "dark" ? (
        <FaSun
          onClick={() => {
            setTheme(colorMode === "dark" ? "light" : "dark")
            toggleColorMode()
          }}
          className="cursor-pointer text-xl text-gray-500 dark:text-gray-400"
        />
      ) : (
        <FaMoon
          onClick={() => {
            setTheme(colorMode === "dark" ? "light" : "dark")
            toggleColorMode()
          }}
          className="cursor-pointer text-xl text-gray-500 dark:text-gray-400"
        />
      )}
    </div>
  )
}

export default Toggle
