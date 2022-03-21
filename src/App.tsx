import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar/Navbar"
import { CreateLab } from "./pages/CreateLab/CreateLab"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { Teacher } from "./pages/Teacher/Teacher"

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Teacher />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/labs/create" element={<CreateLab />} />
      </Routes>
    </div>
  )
}

export default App
