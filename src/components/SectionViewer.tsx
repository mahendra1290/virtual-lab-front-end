import { Divider } from "@chakra-ui/react"
import draftToHtml from "draftjs-to-html"
import React, { useEffect, useMemo, useState } from "react"
import { RawDraftContentState } from "react-draft-wysiwyg"
import LabMenuPanel from "./labs/LabMenuPanel"

interface SectionMenu {
  id: string
  name: string
  editorState: RawDraftContentState
}

interface SectionViewerProps {
  sections: SectionMenu[]
}

const SectionViewer = ({ sections }: SectionViewerProps) => {
  const [activeSection, setActiveSection] = useState("")

  const menus = useMemo(() => {
    return sections.map((section) => section.name)
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
        <div
          className="reset-tailwindcss"
          dangerouslySetInnerHTML={{
            __html: sectionData[activeSection],
          }}
        />
      </div>
    </div>
  )
}

export default SectionViewer
