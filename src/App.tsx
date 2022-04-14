import { Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
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
import TeachersBasePage from "./pages/Teacher/TeacherBasePage"
import NotFoundPage from "./pages/404/NotFoundPage"
import { PrivateRoute } from "./routes/PrivateRoute"
import axios from "axios"
import ConfirmationModal from "./components/modals/ConfirmationModal"

function App() {
  const { authLoading, user } = useAuthContext()

  if (authLoading)
    return (
      <>
        <div className="absolute inset-0 z-50 flex min-h-screen flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-md border-2 p-8 shadow-sm">
            <Spinner colorScheme="blue" size="xl" />
            <h1 className="text-2xl">Loading...</h1>
          </div>
        </div>
        <div className="absolute inset-0 z-40 bg-white/30 backdrop-blur-sm" />
      </>
    )

  return (
    <div className="App relative min-h-screen">
      <Navbar />
      <Routes>
        <Route
          path="/t"
          element={
            <PrivateRoute roles={["teacher"]}>
              <TeachersBasePage />
            </PrivateRoute>
          }
        >
          <Route index element={<Teacher />} />
          <Route path="/t/labs/:id" element={<LabPage />} />
          <Route path="/t/labs/create" element={<CreateLab />} />
          <Route
            path="/t/labs/:labId/experiments/:expId"
            element={<ExperimentPage />}
          />
          <Route path="/t/lab-session/:id" element={<LabSessionPage />} />
        </Route>
        <Route path="/s">
          <Route
            index
            element={
              <PrivateRoute roles={["student"]}>
                <StudentPage />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/"
          element={
            user?.role === "teacher" ? (
              <Navigate to="/t" />
            ) : (
              <Navigate to="/s" />
            )
          }
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/sign-up"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/initial-profile"
          element={user ? <ProfileForm /> : <Navigate to="/login" />}
        />
        <Route path="/s/lab-session/:id" element={<JoinedLabSessionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* <ConfirmationModal
        header={"Are you sure"}
        body={"You wont be able to undo this action"}
        isOpen={true}
        onClose={() => {}}
      /> */}
    </div>
  )
}

export default App
