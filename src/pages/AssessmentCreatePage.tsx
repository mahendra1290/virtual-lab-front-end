import { collection, doc, getDocFromCache } from "firebase/firestore"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase"

const AssessmentCreatePage = () => {
  const { id: expId } = useParams()

  useEffect(() => {
    getDocFromCache(doc(collection(db, "experiments"), expId))
      .then((data) => {
        console.log(data.data())
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return <div>AssessmentCreatePage</div>
}

export default AssessmentCreatePage
