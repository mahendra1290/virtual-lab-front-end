import { Spinner } from "@chakra-ui/react"
import { Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar/Navbar"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { ProfileForm } from "./pages/Signup/ProfileForm"
import { useAuthContext } from "./providers/AuthProvider"
import NotFoundPage from "./pages/404/NotFoundPage"
import JoinLabPage from "./pages/JoinLabPage/JoinLabPage"
import TeacherRoutes from "./routes/TeacherRoutes"
import PrivateRoute from "./routes/PrivateRoute"
import StudentRoutes from "./routes/StudentRoutes"
import Loading from "./components/Loading"
import Footer from "./components/Footer"

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
    <>
      <div className="App relative min-h-screen">
        <Navbar />
        <Suspense fallback={<Loading />}>
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

export default App
