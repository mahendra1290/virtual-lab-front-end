import { Button } from "@chakra-ui/react"
import { nanoid } from "nanoid"
import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/header/header"
import SectionViewer, { SectionViewerItem } from "../components/SectionViewer"
import { useAuthContext } from "../providers/AuthProvider"
import { useLabContext } from "../providers/LabProvider"

const StudentLabPage = () => {
  const { user } = useAuthContext()
  const { id } = useParams()
  const { lab } = useLabContext()

  const sections = useMemo(() => {
    const arr: SectionViewerItem[] = []
    Object.entries(lab?.sectionData || {}).forEach(([key, val]) => {
      arr.push({ id: nanoid(), name: key, editorState: val })
    })
    return arr
  }, [lab])

  if (!lab) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <Header
        title={lab.name}
        pathList={["labs", lab.name]}
        rightContent={lab.visibility === "private" && <Button>Leave</Button>}
      />
      <div className="mt-4 px-8">
        <SectionViewer sections={sections} />
      </div>
    </>
  )
}

export default StudentLabPage
