import { Outlet, Route } from "react-router-dom"
import LabPage from "../pages/LabPage"
import { StudentPage } from "../pages/Student/StudentPage"
import StudentLabPage from "../pages/StudentLabPage"
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
