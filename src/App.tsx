import { Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar/Navbar"
import { CreateLab } from "./pages/CreateLab/CreateLab"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { ProfileForm } from "./pages/Signup/ProfileForm"
import { Teacher } from "./pages/Teacher/Teacher"
import { LabPage } from "./pages/Lab/LabPage"
import { useAuthContext } from "./providers/AuthProvider"
import ExperimentPage from "./pages/Experiment/ExperimentPage"

function App() {
  const { authLoading } = useAuthContext()

  return (
    <div className="App">
      <Navbar />
      {authLoading && <h1>Loading...</h1>}
      {authLoading && <Spinner />}
      <Routes>
        <Route path="/" element={<Teacher />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/initial-profile" element={<ProfileForm />} />
        <Route path="/labs/:id" element={<LabPage />} />
        <Route path="/labs/create" element={<CreateLab />} />
        <Route
          path="/labs/:labId/experiments/:expId"
          element={<ExperimentPage />}
        />
      </Routes>
    </div>
  )
}

export default App
