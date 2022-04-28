import React from "react"
import { Outlet, Route } from "react-router-dom"
const StudentLabSessionPage = React.lazy(
  () => import("../pages/StudentLabSessionPage")
)
const StudentPage = React.lazy(() => import("../pages/Student/StudentPage"))
const StudentLabPage = React.lazy(() => import("../pages/StudentLabPage"))
import { LabProvider } from "../providers/LabProvider"
import PrivateRoute from "./PrivateRoute"
import StudentExperimentPage from "../pages/Experiment/StudentExperimentPage"

const StudentRoutes = (
  <>
    <Route
      path="/s"
      element={
        <PrivateRoute roles={["student"]}>
          <Outlet />
        </PrivateRoute>
      }
    >
      <Route index element={<StudentPage />} />
      <Route
        path="/s/labs/:id"
        element={
          <LabProvider>
            <StudentLabPage />
          </LabProvider>
        }
      />
      <Route path="/s/lab-session/:id" element={<StudentLabSessionPage />} />
      <Route
        path="/s/labs/:labId/experiments/:expId"
        element={<StudentExperimentPage />}
      />

      {/* <Route
        path="/t/labs/:labId/experiments/:expId"
        element={<ExperimentPage />}
      />
      <Route path="/t/lab-session/:id" element={<LabSessionPage />} /> */}
    </Route>
  </>
)

export default StudentRoutes
