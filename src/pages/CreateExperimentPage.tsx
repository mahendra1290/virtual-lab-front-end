import { FormControl, Input } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Header from "../components/header/header"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { collection, doc, FieldValue, getDoc, setDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { convertToRaw, convertFromRaw, EditorState } from "draft-js"
import { db } from "../firebase"
import { FormField } from "../components/forms/FormField"
import SectionEditor, {
  SectionEditorValue,
} from "../components/sectionEditor/SectionEditor"
import useLoading from "../hooks/useLoading"
import { nanoid } from "nanoid"
import { Link, useNavigate } from "react-router-dom"
import { Experiment } from "../shared/types/Lab"
import Loading from "../components/Loading"
import FileUpload from "../components/file-uploader/FileUpload"

type ExperimentFormInput = {
  title: string
  description: string
  problemStatement: string
}

type Props = {
  labId: string
  onSuccess?: () => void
  onCancel?: () => void
}

const CreateExperimentPage = ({ edit = false }: { edit?: boolean }) => {
  const [searchParams] = useSearchParams()
  const { id } = useParams()

  const [expName, setExpName] = useState("")
  const [sectionData, setSectionData] = useState<SectionEditorValue[]>([])
  const [initValue, setInitValue] = useState<SectionEditorValue[]>([])

  const newExpId = useRef(nanoid(10))

  const { loading, startLoading, stopLoading } = useLoading()
  const {
    loading: fetchLoading,
    startLoading: startFetch,
    stopLoading: stopFetch,
  } = useLoading()

  const toast = useToast()
  const navigate = useNavigate()
  const labId = searchParams.get("lab")

  useEffect(() => {
    if (edit && id && labId && sectionData.length === 0) {
      startFetch()
      const expRef = doc(collection(db, "experiments"), id)
      getDoc(expRef)
        .then((doc) => {
          const exp = doc.data() as Experiment
          const sectionData = exp.sections?.map((val, ind) => ({
            ...val,
            editorState: EditorState.createWithContent(
              convertFromRaw(val.editorState)
            ),
            order: ind,
          }))
          console.log("doc", doc.data())

          if (sectionData) {
            setInitValue(sectionData)
          }
          setExpName(exp.title)
          stopFetch()
        })
        .catch((err) => {
          stopFetch()
        })
    }
  }, [edit])

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<ExperimentFormInput>({
    defaultValues: {
      title: "",
      description: "",
      problemStatement: "",
    },
  })

  const createExperiment = async () => {
    const mappedSectionData = sectionData.map((val) => {
      return {
        id: val.id,
        name: val.name,
        editorState: convertToRaw(val.editorState.getCurrentContent()),
      }
    })

    if (labId) {
      startLoading()
      const tId = edit ? id : newExpId.current
      try {
        await setDoc(
          doc(collection(db, "experiments"), tId),
          {
            tId,
            title: expName,
            labId: labId,
            sections: mappedSectionData,
          },
          { merge: true }
        )
        stopLoading()
        toast({
          position: "top",
          title: "New experiment created",
          status: "success",
          duration: 2000,
        })
        if (edit) {
          navigate(-1)
        } else {
          navigate(`/t/labs/${labId}/experiments/${tId}`)
        }
      } catch (err) {
        console.log(err)
        stopLoading()
      }
    }
  }

  const expId = edit ? id : newExpId.current

  const handleFileUpload = async (sectionId: string, fileUrls: string[]) => {
    const docRef = doc(collection(db, "experiment-files"), expId)
    await setDoc(docRef, {
      sectionId: sectionId,
      fileUrls: fileUrls,
    })
  }

  if (edit && fetchLoading) {
    return <Loading />
  }

  return (
    <>
      <Header
        title={
          <Input
            value={expName}
            onChange={(e) => setExpName(e.target.value)}
            placeholder="Enter Experiment Name"
            minWidth="28"
          />
        }
        pathList={[["/t", "labs"]]}
        rightContent={
          <div>
            <Button>Publish Experiment</Button>
            <Button
              className="ml-4"
              onClick={createExperiment}
              colorScheme={"blue"}
              isLoading={loading}
              loadingText={"Saving..."}
            >
              Save Experiment
            </Button>
          </div>
        }
      />
      <div className="px-8 py-4">
        <SectionEditor
          initialValue={initValue}
          onChange={setSectionData}
          onFileUpload={handleFileUpload}
          uploadUnderPath={`/experiments-files/${edit ? id : newExpId.current}`}
        />
      </div>
      {/* <div className="mx-auto w-2/3 p-4">
        <form className="space-y-4" onSubmit={handleSubmit(createExperiment)}>
          <FormControl isInvalid={!!errors.title}>
            <FormField
              label="Title"
              error={errors.title}
              {...register("title", { required: "Title is required" })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea {...register("description")} />
          </FormControl>
          <FormControl isInvalid={!!errors.problemStatement}>
            <FormLabel>Problem Statement</FormLabel>
            <Textarea
              {...register("problemStatement", {
                required: "Problem statement is required",
              })}
            />
            <FormErrorMessage>
              {errors.problemStatement && errors.problemStatement.message}
            </FormErrorMessage>
          </FormControl>
          <Button isLoading={isSubmitting} type="submit">
            Submit
          </Button>
          <Button type="reset" colorScheme="red" className="ml-4">
            Reset
          </Button>
        </form>
      </div> */}
    </>
  )
}

export default CreateExperimentPage
