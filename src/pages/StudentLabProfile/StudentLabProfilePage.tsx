import { Box, Divider, VStack } from "@chakra-ui/react"
import axios from "axios"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import moment from "moment"
import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../components/header/header"
import Loading from "../../components/Loading"
import StudentWork from "../../components/student-work/StudentWorkViewer"
import { db } from "../../firebase"
import { useLab } from "../../hooks/useLab"
import { User } from "../../shared/types/User"

const StudentLabProfilePage = () => {
  const { labId, studentId } = useParams()

  const { loading, error, lab, experiments } = useLab(labId || "")

  const [student, setStudent] = useState<User>()

  useEffect(() => {
    axios
      .get(`/users/${studentId}`)
      .then((response) => setStudent(response.data))
      .catch((err) => {
        console.log(err.response)
      })
  }, [])

  const joinedData = useMemo(() => {
    if (lab && student) {
      const stud = lab.students?.find((stud) => stud.uid === studentId)
      if (!stud?.joinedAt) {
        return "not joined"
      }
      const millis = stud?.joinedAt.toMillis
        ? stud.joinedAt.toMillis()
        : (stud?.joinedAt.seconds || 0) * 1000

      return `${moment(millis).fromNow().toString()} - ${moment(millis).format(
        "DD-MM-YYYY hh:mm:A"
      )}`
    }
  }, [lab, student])

  if (loading || !student) {
    return <Loading />
  }

  return (
    <>
      <Header
        title={student?.name || ""}
        pathList={[
          ["/t/labs", "labs"],
          [`/t/labs/${lab?.id}`, lab?.name],
        ]}
      />
      <div className="mx-auto mt-4 w-full rounded-md border py-4 px-8 lg:w-2/3">
        <VStack align="flex-start">
          <h1 className="text-lg">Student Details:</h1>
          <Divider />
          <p className="text-gray-600">Name: {student.name}</p>
          <p className="text-gray-600">Email: {student.email}</p>
          <p className="text-gray-600">Joined: {joinedData}</p>
        </VStack>

        <h1 className="mt-4 text-lg">Sessions: </h1>
        <StudentWork
          studentUid={studentId || ""}
          experiments={experiments || []}
        />

        <Divider />
      </div>
    </>
  )
}

export default StudentLabProfilePage
