import React from "react"
import { Route } from "react-router-dom"
import { LabProvider } from "../providers/LabProvider"
import PrivateRoute from "./PrivateRoute"
const CreateLab = React.lazy(() => import("../pages/CreateLab/CreateLab"))
const ExperimentPage = React.lazy(
  () => import("../pages/Experiment/ExperimentPage")
)
const LabPage = React.lazy(() => import("../pages/Lab/LabPage"))
const LabSessionPage = React.lazy(
  () => import("../pages/LabSession/LabSessionPage")
)
const Teacher = React.lazy(() => import("../pages/Teacher/Teacher"))
const TeachersBasePage = React.lazy(
  () => import("../pages/Teacher/TeacherBasePage")
)
const CreateExperimentPage = React.lazy(
  () => import("../pages/CreateExperimentPage/CreateExperimentPage")
)

const TeacherRoutes = (
  <>
    <Route
      path="/t"
      element={
        <PrivateRoute roles={["teacher"]}>
          <TeachersBasePage />
        </PrivateRoute>
      }
    >
      <Route index element={<Teacher />} />
      <Route
        path="/t/labs/:id"
        element={
          <LabProvider>
            <LabPage />
          </LabProvider>
        }
      />
      <Route path="/t/labs/create" element={<CreateLab />} />
      <Route path="/t/experiments/create" element={<CreateExperimentPage />} />
      <Route
        path="/t/labs/:labId/experiments/:expId"
        element={<ExperimentPage />}
      />
      <Route path="/t/lab-session/:id" element={<LabSessionPage />} />
    </Route>
  </>
)

export default TeacherRoutes
