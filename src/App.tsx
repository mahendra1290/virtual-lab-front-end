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
import { LabSessionPage } from "./pages/LabSession/LabSessionPage"
import { JoinedLabSessionPage } from "./pages/JoinedLabSession/JoinedLabSessionPage"
import { StudentPage } from "./pages/Student/StudentPage"

function App() {
  const { authLoading, user } = useAuthContext()

  return (
    <div className="App relative min-h-screen">
      {authLoading && (
        <>
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center rounded-md border-2 p-8 shadow-sm">
              <Spinner colorScheme="blue" size="xl" />
              <h1 className="text-2xl">Loading...</h1>
            </div>
          </div>
          <div className="absolute inset-0 z-40 bg-white/30 backdrop-blur-sm" />
        </>
      )}
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user?.role === "teacher" ? <Teacher /> : <StudentPage />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/initial-profile" element={<ProfileForm />} />
        <Route path="/labs/:id" element={<LabPage />} />
        <Route path="/labs/create" element={<CreateLab />} />
        <Route
          path="/labs/:labId/experiments/:expId"
          element={<ExperimentPage />}
        />
        <Route path="/t/lab-session/:id" element={<LabSessionPage />} />
        <Route path="/s/lab-session/:id" element={<JoinedLabSessionPage />} />
      </Routes>
    </div>
  )
}

export default App
