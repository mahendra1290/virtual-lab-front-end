import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { doc, setDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { FormField } from "../../components/forms/FormField"
import Header from "../../components/header/header"
import { labsCol } from "../../firebase"
import useLoading from "../../hooks/useLoading"
import { useAuthContext } from "../../providers/AuthProvider"
import { nanoid } from "nanoid"
import { FormEvent, useMemo, useState } from "react"
import { Lab } from "../../shared/types/Lab"
import LabMenuPanel from "../../components/labs/LabMenuPanel"
import TextEditor from "../../components/TextEditor/TextEditor"
import {
  EditorState as DraftEditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js"
import { RawDraftContentState, EditorState } from "react-draft-wysiwyg"
import { useNavigate } from "react-router-dom"

interface SectionData {
  [key: string]: EditorState
}

export const CreateLab = () => {
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", visibility: "private" } })

  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { loading, withLoading } = useLoading(false)
  const [sectionAddModalOpen, setSectionAddModalOpen] = useState(false)
  const [newSectionName, setNewSectionName] = useState("")
  const [sections, setSections] = useState(["Introduction", "Objective"])
  const [activeSession, setActiveSession] = useState("Introduction")
  const [sectionData, setSectionData] = useState<SectionData>({})
  const [editorData, setEditorData] = useState<EditorState>(
    DraftEditorState.createEmpty()
  )

  const handleSectionChange = (sectionName: string) => {
    setActiveSession(sectionName)
    setEditorData(sectionData[sectionName] || DraftEditorState.createEmpty())
  }

  const handleEditorDataChange = useMemo(() => {
    return (editorState: EditorState) => {
      setSectionData((prevData) => ({
        ...prevData,
        [activeSession]: editorState,
      }))
      setEditorData(editorState)
    }
  }, [activeSession])

  const createLab = async (data: {
    name: string
    visibility: "public" | "private"
  }) => {
    const sections: { [key: string]: RawDraftContentState } = {}
    Object.entries(sectionData).forEach(([key, val]) => {
      sections[key] = convertToRaw(val.getCurrentContent())
    })

    try {
      if (user?.uid) {
        const id = nanoid()
        await setDoc(doc(labsCol, id), {
          id,
          userUid: user?.uid,
          name: data.name,
          visibility: data.visibility,
          createdAt: new Date(),
          sectionData: sections,
        })
        navigate(`/t/labs/${id}`)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const createLabWithLoading = withLoading(createLab)

  const handleAddSectionButtonClick = () => {
    setSectionAddModalOpen(true)
  }

  const handleSectionModalClose = () => {
    setSectionAddModalOpen(false)
    setNewSectionName("")
  }

  const handleSectionSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSectionAddModalOpen(false)
    setSections((prevSections) => [...prevSections, newSectionName])
    setNewSectionName("")
  }

  return (
    <>
      {/* <form onSubmit={handleSubmit(createLab)}> */}
      <Header
        title="Create Lab"
        pathList={[["/", "labs"], "create lab"]}
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
        {/* <h1 className="mx-auto text-center text-2xl">{lab?.name}</h1> */}
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

        <div className="flex gap-8">
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
            {/* <form
              onSubmit={handleSubmit(createLabWithLoading)}
              className="mx-auto mt-16 flex flex-col gap-4 border p-8 shadow-md"
            >
              <FormControl isRequired>
                <FormField {...register("name")} label="Name" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="visibility">Lab Visibility</FormLabel>
                <Select {...register("visibility")}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Select>
                <FormHelperText>
                  Public labs are accessible by everyone.
                </FormHelperText>
          </FormControl> */}
            <Button className="mt-4" colorScheme="teal" size="sm">
              Save
            </Button>
            <Button className="mt-4 ml-2" colorScheme="red" size="sm">
              Clear
            </Button>
          </div>
        </div>
      </div>
      <Modal isOpen={sectionAddModalOpen} onClose={handleSectionModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Section</ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingBottom="5">
            <form onSubmit={handleSectionSubmit}>
              <VStack spacing="5" align="stretch">
                <FormControl>
                  <FormLabel htmlFor="sectionName">Section Name</FormLabel>
                  <Input
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    autoFocus
                    id="sectionName"
                  />
                </FormControl>
                <Button type="submit" isDisabled={!newSectionName}>
                  Add
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* </form> */}
    </>
  )
}
