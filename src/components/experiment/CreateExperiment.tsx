import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react"
import { collection, doc, setDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { db } from "../../firebase"
import { FormField } from "../forms/FormField"

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

export const CreateExperment = ({ labId, onSuccess, onCancel }: Props) => {
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

  const createExperiment = async (data: ExperimentFormInput) => {
    await setDoc(doc(collection(db, "labs", labId, "experiments")), {
      ...data,
      labId: labId,
    })
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <div>
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
    </div>
  )
}
