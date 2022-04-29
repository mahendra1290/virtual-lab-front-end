import React from "react"
import { Route } from "react-router-dom"
import { StudentActivity } from "../pages/LabSession/StudentActivity"
import { LabProvider } from "../providers/LabProvider"
import PrivateRoute from "./PrivateRoute"

const CreateLab = React.lazy(() => import("../pages/CreateLab/CreateLab"))

const ExperimentPage = React.lazy(
  () => import("../pages/Experiment/ExperimentPage")
)

const LabPage = React.lazy(() => import("../pages/LabPage"))

const LabSessionPage = React.lazy(
  () => import("../pages/LabSession/LabSessionPage")
)
const Teacher = React.lazy(() => import("../pages/TeachersPage"))

const TeachersBasePage = React.lazy(() => import("../pages/TeacherBasePage"))

const CreateExperimentPage = React.lazy(
  () => import("../pages/CreateExperimentPage")
)

const AssessmentCreatePage = React.lazy(
  () => import("../pages/AssessmentCreatePage")
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
      <Route path="/t/labs/:id/edit" element={<CreateLab edit />} />
      <Route path="/t/experiments/create" element={<CreateExperimentPage />} />
      <Route
        path="/t/experiments/:id/edit"
        element={<CreateExperimentPage edit={true} />}
      />
      <Route
        path="/t/experiments/:id/assessment/create"
        element={<AssessmentCreatePage />}
      />
      <Route
        path="/t/labs/:labId/experiments/:expId"
        element={<ExperimentPage />}
      />
      <Route
        path="/t/lab-session/:id/student/:stdId"
        element={<StudentActivity />}
      />
      <Route path="/t/lab-session/:id" element={<LabSessionPage />} />
    </Route>
  </>
)

export default TeacherRoutes
