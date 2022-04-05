import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react"
import Header from "../../components/header/header"

export const CreateLab = () => {
  return (
    <>
      <Header title="Create Lab" pathList={[["/", "labs"], "create lab"]} />
      <div className="mx-auto w-1/2 p-4">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input />
        </FormControl>
        <Button colorScheme="blue">Submit</Button>
      </div>
    </>
  )
}
