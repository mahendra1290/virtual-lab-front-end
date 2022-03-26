import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import "./userWorker"
import { ChakraProvider, withDefaultColorScheme } from "@chakra-ui/react"

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./providers/AuthProvider"

import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: "teal",
    components: ["Button"],
  }),
  {
    fonts: {
      heading: "Open Sans, sans-serif",
      body: "Open Sans, Raleway, sans-serif",
    },
  }
)

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
