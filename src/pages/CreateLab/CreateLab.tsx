import { Button, FormControl, Input, Select } from "@chakra-ui/react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import Header from "../../components/header/header"
import { db, labsCol } from "../../firebase"
import useLoading from "../../hooks/useLoading"
import { useAuthContext } from "../../providers/AuthProvider"
import { nanoid } from "nanoid"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { Lab } from "../../shared/types/Lab"
import {
  EditorState as DraftEditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js"
import { RawDraftContentState, EditorState } from "react-draft-wysiwyg"
import { useNavigate, useParams } from "react-router-dom"
import SectionEditor, {
  SectionEditorValue,
} from "../../components/sectionEditor/SectionEditor"

const CreateLab = ({ edit = false }: { edit?: boolean }) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", visibility: "private" } })

  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { id } = useParams()
  const { loading, withLoading } = useLoading(false)
  const [sectionData, setSectionData] = useState<SectionEditorValue[]>([])
  const [initValue, setInitValue] = useState<SectionEditorValue[]>([])

  const createLab = async (data: {
    name: string
    visibility: "public" | "private"
  }) => {
    const sections: {
      name: string
      editorState: RawDraftContentState
      order: number
    }[] = []
    sectionData.forEach((section, index) => {
      sections.push({
        editorState: convertToRaw(section.editorState.getCurrentContent()),
        order: index,
        name: section.name,
      })
    })

    try {
      if (user?.uid) {
        const lId = edit ? id : nanoid()
        await setDoc(
          doc(labsCol, lId),
          {
            id: lId,
            userUid: user?.uid,
            name: data.name,
            visibility: data.visibility,
            createdAt: new Date(),
            sectionData: sections,
          },
          { merge: true }
        )
        navigate(-1)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const createLabWithLoading = withLoading(createLab)

  useEffect(() => {
    const fetchLab = async () => {
      if (edit && id) {
        const labRef = doc(collection(db, "labs"), id)
        const labDoc = await getDoc(labRef)
        if (labDoc.exists()) {
          const data = labDoc.data() as Lab
          const sectionData: SectionEditorValue[] = []
          data.sectionData?.forEach((val) => {
            sectionData.push({
              id: nanoid(5),
              name: val.name,
              editorState: DraftEditorState.createWithContent(
                convertFromRaw(val.editorState)
              ),
              order: val.order,
            })
          })
          sectionData.sort((a, b) => a.order - b.order)
          console.log(data, "data")

          setValue("name", data.name)
          setValue("visibility", data.visibility)
          setInitValue(sectionData)
        }
      }
    }
    fetchLab()
  }, [edit])

  return (
    <>
      {/* <form onSubmit={handleSubmit(createLab)}> */}
      <Header
        title={edit ? "Edit Lab" : "Create Lab"}
        pathList={[["/", "labs"], `${edit ? "edit lab" : "create lab"}`]}
        rightContent={
          <Button
            onClick={handleSubmit(createLabWithLoading)}
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText={"Saving"}
          >
            Save Lab
          </Button>
        }
      />
      <div className="px-8 py-4">
        <div className="mb-4 flex justify-between">
          <FormControl maxWidth="sm" isInvalid={!!errors.name} isRequired>
            {/* <FormLabel htmlFor="labName">Lab Name</FormLabel> */}
            <Input
              {...register("name", { required: "Lab name is requried" })}
              placeholder="Enter Lab Name"
              maxWidth="sm"
              id="labName"
            />
            {/* <FormErrorMessage>{errors.name?.message}</FormErrorMessage> */}
          </FormControl>
          <FormControl maxWidth="sm" isRequired>
            <Select maxWidth="sm" {...register("visibility")}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Select>
            {/* <FormHelperText>
              Public labs are accessible by everyone.
            </FormHelperText> */}
          </FormControl>
        </div>

        {/* <div className="flex gap-8">
          <LabMenuPanel
            activeMenu={activeSession}
            onChange={handleSectionChange}
            menus={sections}
            className="w-1/4 border p-6 shadow-sm"
          >
            <Button
              className="self-center"
              size="sm"
              onClick={handleAddSectionButtonClick}
            >
              Add New Section
            </Button>
          </LabMenuPanel>

          <div className="w-3/4 rounded-md border p-6 shadow-sm">
            <h1 className="mb-2 text-xl">{activeSession}</h1>
            <TextEditor value={editorData} onChange={handleEditorDataChange} />

            <Button className="mt-4" colorScheme="teal" size="sm">
              Save
            </Button>
            <Button className="mt-4 ml-2" colorScheme="red" size="sm">
              Clear
            </Button>
          </div>
        </div> */}
        <SectionEditor
          defaultMenus={edit ? undefined : ["Introduction", "Aim", "About"]}
          initialValue={initValue}
          onChange={setSectionData}
        />
      </div>
    </>
  )
}

export default CreateLab
