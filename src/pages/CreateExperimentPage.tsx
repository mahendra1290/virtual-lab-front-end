import { FormControl, Input } from "@chakra-ui/react"
import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "../components/header/header"
import { Button, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react"
import { collection, doc, setDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { convertToRaw } from "draft-js"
import { db } from "../firebase"
import { FormField } from "../components/forms/FormField"
import SectionEditor, {
  SectionEditorValue,
} from "../components/sectionEditor/SectionEditor"
import useLoading from "../hooks/useLoading"

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

const CreateExperimentPage = () => {
  const [searchParams] = useSearchParams()

  const [expName, setExpName] = useState("")

  const [sectionData, setSectionData] = useState<SectionEditorValue[]>([])

  const { loading, startLoading, stopLoading } = useLoading()

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
      await setDoc(doc(collection(db, "labs", labId, "experiments")), {
        title: expName,
        labId: labId,
        sections: mappedSectionData,
      })
      stopLoading()
    }
  }

  const labId = searchParams.get("lab")

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
      <SectionEditor onChange={setSectionData} />
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
