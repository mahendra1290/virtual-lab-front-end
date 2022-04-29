import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react"
import {
  collection,
  doc,
  getDocFromCache,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { ref, UploadResult, uploadString } from "firebase/storage"
import { nanoid } from "nanoid"
import React, { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { FormField } from "../components/forms/FormField"
import Header from "../components/header/header"
import { db, storage } from "../firebase"
import useLoading from "../hooks/useLoading"
import { Experiment } from "../shared/types/Lab"

interface AssessmentForm {
  totalScore: number
  testCases: {
    id: string
    input: string
    output: string
    score: number
  }[]
}

interface TestCase {
  name: string
  content: string
  score: number
}

const AssessmentCreatePage = () => {
  const { id: expId } = useParams()

  const [experiment, setExperiment] = useState<Experiment>()

  const { loading, startLoading, stopLoading } = useLoading()

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AssessmentForm>({
    defaultValues: {
      testCases: [
        {
          id: nanoid(5),
          input: "",
          output: "",
          score: 10,
        },
      ],
    },
  })

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "testCases",
  })

  useEffect(() => {
    const exp = localStorage.getItem(`assessment-${expId}`)
    if (exp) {
      setExperiment(JSON.parse(exp) as Experiment)
    }
  }, [])

  useEffect(() => {
    getDocFromCache(doc(collection(db, "experiments"), expId))
      .then((data) => {
        console.log(data.data())
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const saveAssessment = async ({ testCases }: AssessmentForm) => {
    startLoading()
    try {
      console.log(testCases, " test case ")
      const storageRef = ref(storage, `test-cases-${expId}`)
      const basePath = storageRef.fullPath
      const uploadPromises: Promise<UploadResult>[] = []
      const inputsNamePath: TestCase[] = []
      const outputNamePath: TestCase[] = []
      testCases.forEach((value, index) => {
        inputsNamePath.push({
          name: `input-${index}.txt`,
          content: value.input,
          score: value.score,
        })
        outputNamePath.push({
          name: `output-${index}.txt`,
          content: value.output,
          score: value.score,
        })
      })

      console.log(inputsNamePath, outputNamePath, " hello bello ")
      const expRef = doc(collection(db, "test-cases"), expId)
      await setDoc(expRef, {
        inputs: inputsNamePath,
        outputs: outputNamePath,
      })
    } catch (err) {
      console.log("Someting went wrong")
    }
    stopLoading()
  }

  return (
    <>
      <form onSubmit={handleSubmit(saveAssessment)}>
        <Header
          title={`${experiment?.title} Assessment`}
          pathList={[["/", "labs"]]}
          rightContent={
            <Button isLoading={loading} loadingText="Saving..." type="submit">
              Save Assessment
            </Button>
          }
        />
        <div className="px-8 py-4">
          <h3 className="text-ld">Test Cases</h3>
          {fields.map((item, index) => {
            return (
              <div className="mt-2 mb-4 border p-2">
                <div className="flex gap-4" key={item.id}>
                  <FormControl
                    isInvalid={!!errors.testCases?.at(index)?.input}
                    className="flex-grow"
                  >
                    <FormLabel>Input</FormLabel>
                    <Textarea
                      minHeight="14rem"
                      {...register(`testCases.${index}.input`, {
                        required: "Input is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.testCases?.at(index)?.input?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl className="flex-grow">
                    <FormLabel>Expected Output</FormLabel>
                    <Textarea
                      minHeight="14rem"
                      {...register(`testCases.${index}.output`, {
                        required: "Output is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.testCases?.at(index)?.output?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    onClick={() => remove(index)}
                    colorScheme="red"
                    size="sm"
                    paddingInline={"6"}
                  >
                    Delete
                  </Button>
                </div>
                <Divider className="my-4" />{" "}
                <FormControl isInvalid={!!errors.totalScore}>
                  <FormField
                    type="number"
                    label="Total Score"
                    error={errors.totalScore}
                    {...register(`testCases.${index}.score`, {
                      required: "This is required",
                    })}
                  />
                </FormControl>
              </div>
            )
          })}
          <Button
            onClick={() => append({ id: nanoid(), input: "", output: "" })}
            colorScheme={"cyan"}
            className="mt-4"
          >
            Add new test case
          </Button>
        </div>
      </form>
    </>
  )
}

export default AssessmentCreatePage
