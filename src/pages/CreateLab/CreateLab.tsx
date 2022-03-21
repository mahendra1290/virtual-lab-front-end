import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react"

export const CreateLab = () => {
  return (
    <div className="mx-auto w-1/2 p-4">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input />
      </FormControl>
      <Button colorScheme="blue">Submit</Button>
    </div>
  )
}
