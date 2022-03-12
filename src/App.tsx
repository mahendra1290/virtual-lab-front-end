import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import { Editor } from "./components/Editor"
import { Navbar } from "./components/Navbar/Navbar"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
