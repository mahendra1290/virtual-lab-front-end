import { Button, VStack } from "@chakra-ui/react"
import { nanoid } from "nanoid"
import React, { useMemo } from "react"
import Header from "../components/header/header"
import SectionViewer, { SectionViewerComponentItem, SectionViewerItem } from "../components/SectionViewer"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuthContext } from "../providers/AuthProvider"
import { useLabContext } from "../providers/LabProvider"
import { ExperimentCard } from "../components/experiment/ExperimentCard"

const StudentLabPage = () => {
  const { user } = useAuthContext()
  const { id } = useParams()
  const { lab, experiments } = useLabContext()

  const sections = useMemo(() => {
    const arr: SectionViewerItem[] = []
    Object.entries(lab?.sectionData || {}).forEach(([key, val]) => {
      arr.push({ id: nanoid(), name: key, editorState: val })
    })
    return arr
  }, [lab])

  const RightSection = () => {
    if (experiments && experiments.length > 0) {

      return (
        <VStack spacing={4} align={"strecth"} className="mt-4 w-1/2">
          {experiments?.map((item, idx) => (
            <Link key={item.id} to={`/s/labs/${lab?.id}/experiments/${item.id}`}>
              <ExperimentCard srNo={idx + 1} {...item} key={item.id} />
            </Link>
          ))}
        </VStack>
      )
    }

    return (<div />)
  }

  const otherProps: SectionViewerComponentItem[] = [
    {
      id: 'i',
      name: 'Experiments',
      component: RightSection()
    },
  ]

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
        <SectionViewer sections={sections} otherComponents={otherProps} />
      </div>
    </>
  )
}

export default StudentLabPage
