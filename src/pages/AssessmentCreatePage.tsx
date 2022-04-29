import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react"
import { collection, doc, getDocFromCache } from "firebase/firestore"
import { nanoid } from "nanoid"
import React, { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { FormField } from "../components/forms/FormField"
import Header from "../components/header/header"
import { db } from "../firebase"
import { Experiment } from "../shared/types/Lab"

const AssessmentCreatePage = () => {
  const { id: expId } = useParams()

  const [experiment, setExperiment] = useState<Experiment>()

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      totalScore: 0,
      testCases: [
        {
          id: nanoid(5),
          input: "",
          output: "",
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

  return (
    <>
      <form onSubmit={handleSubmit((values) => console.log(values))}>
        <Header
          title={`${experiment?.title} Assessment`}
          pathList={[["/", "labs"]]}
          rightContent={<Button type="submit">Save Assessment</Button>}
        />
        <div className="px-8 py-4">
          <FormControl isInvalid={!!errors.totalScore}>
            <FormField
              label="Total Score"
              error={errors.totalScore}
              {...register("totalScore", {
                required: "This is required",
              })}
            />
          </FormControl>
          <Divider className="my-4" />
          <h3 className="text-ld">Test Cases</h3>
          {fields.map((item, index) => {
            return (
              <div className="mt-4 border p-2">
                <div className="flex gap-4" key={item.id}>
                  <FormControl
                    isInvalid={!!errors.testCases?.at(index)?.input}
                    className="flex-grow"
                  >
                    <FormLabel>Input</FormLabel>
                    <Textarea
                      minHeight="20rem"
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
                      minHeight="20rem"
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
