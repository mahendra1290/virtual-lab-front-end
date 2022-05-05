import { Divider, VStack } from "@chakra-ui/react"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import draftToHtml from "draftjs-to-html"
import React, { useEffect, useMemo, useState } from "react"
import { RawDraftContentState } from "react-draft-wysiwyg"
import { Experiment } from "../shared/types/Lab"
import LabMenuPanel from "./labs/LabMenuPanel"
import { Link, useNavigate, useParams } from "react-router-dom"
import FileViewer from "./file-viewer/FileViewer"
import { sortBy } from "lodash"

export interface SectionViewerItem {
  id: string
  name: string
  order?: number
  editorState: RawDraftContentState
}

export interface SectionViewerComponentItem {
  id: string
  name: string
  component?: React.Component | ReactJSXElement
}

interface SectionViewerProps {
  sections: SectionViewerItem[]
  otherComponents?: SectionViewerComponentItem[]
  filesPath?: string
}

const SectionViewer = ({
  sections,
  otherComponents,
  filesPath,
}: SectionViewerProps) => {
  const [activeSection, setActiveSection] = useState("")

  const menus = useMemo(() => {
    let tempSections = sortBy(sections, "order")
    const secMenus = tempSections.map((section) => section.name)
    if (otherComponents && otherComponents.length > 0) {
      otherComponents.forEach((comp) => {
        secMenus.push(comp.name)
      })
    }
    return secMenus
  }, [sections])

  const sectionData = useMemo(() => {
    const obj: { [key: string]: string } = {}
    sections.forEach((section) => {
      obj[section.name] = draftToHtml(section.editorState)
    })

    return obj
  }, [sections])

  useEffect(() => {
    const firstSection = sections.at(0)

    if (firstSection && !activeSection) {
      setActiveSection(firstSection?.name)
    }
  }, [sections])

  const RightSection = useMemo(() => {
    if (sectionData[activeSection]) {
      return (
        <div
          style={{ height: "calc(100% - 36px)" }}
          className="flex flex-col justify-between overflow-auto"
        >
          <div
            className="reset-tailwindcss"
            dangerouslySetInnerHTML={{ __html: sectionData[activeSection] }}
          />
          {filesPath && (
            <FileViewer collectionPath={filesPath} section={activeSection} />
          )}
        </div>
      )
    } else {
      const comp = otherComponents?.find((item) => item.name === activeSection)
      return comp?.component
    }
  }, [activeSection, otherComponents])

  return (
    <div className="flex gap-4">
      <LabMenuPanel
        activeMenu={activeSection}
        onChange={setActiveSection}
        className="w-1/4 rounded-md border p-4"
        menus={menus}
      />
      <div className="w-3/4 rounded-md border p-4">
        <h1 className="mb-2 text-xl">{activeSection}</h1>
        <Divider />

        {RightSection}
      </div>
    </div>
  )
}

export default SectionViewer
