import { Spinner } from "@chakra-ui/react"
import { Suspense, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar/Navbar"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { ProfileForm } from "./pages/Signup/ProfileForm"
import { useAuthContext } from "./providers/AuthProvider"
import ExperimentPage from "./pages/Experiment/ExperimentPage"
import { JoinedLabSessionPage } from "./pages/JoinedLabSession/JoinedLabSessionPage"
import { StudentPage } from "./pages/Student/StudentPage"
import TeachersBasePage from "./pages/TeacherBasePage"
import NotFoundPage from "./pages/404/NotFoundPage"
import axios from "axios"
import ConfirmationModal from "./components/modals/ConfirmationModal"
import JoinLabPage from "./pages/JoinLabPage/JoinLabPage"
import TeacherRoutes from "./routes/TeacherRoutes"
import PrivateRoute from "./routes/PrivateRoute"
import CodeEditorPage from "./pages/CodeEditorPage/CodeEditorPage"
import StudentLabSessionView from "./pages/StudentLabSessionView/StudentLabSessionView"
import StudentRoutes from "./routes/StudentRoutes"

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
      <Suspense fallback={<Spinner />}>
        <Routes>
          {TeacherRoutes}
          {StudentRoutes}
          <Route
            path="join-lab"
            element={
              <PrivateRoute roles={["student"]}>
                <JoinLabPage />
              </PrivateRoute>
            }
          />
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
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/sign-up"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/initial-profile"
            element={user ? <ProfileForm /> : <Navigate to="/login" />}
          />
          <Route path="/s/lab-session/:id" element={<JoinedLabSessionPage />} />
          <Route path="/editor" element={<CodeEditorPage />} />
          <Route path="/student-view/:id" element={<StudentLabSessionView />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      {/* <ConfirmationModal
        body={"You wont be able to undo this action"}
        isOpen={true}
        onClose={() => {}}
      /> */}
    </div>
  )
}

export default App
