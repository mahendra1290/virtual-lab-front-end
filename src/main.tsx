import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import App from "./App"
import "./userWorker"
import { ChakraProvider, withDefaultColorScheme } from "@chakra-ui/react"
import axios, { AxiosRequestConfig } from "axios"

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./providers/AuthProvider"

import { extendTheme } from "@chakra-ui/react"
import { auth } from "./firebase"

axios.defaults.baseURL = "http://localhost:5000/api"

axios.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await auth.currentUser?.getIdToken()
    if (!config.headers) {
      config.headers = {}
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.log(error)
  }
)

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
