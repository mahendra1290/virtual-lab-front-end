import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useState } from "react"
import { FiEyeOff, FiEye } from "react-icons/fi"

export const PasswordInput = ({ register }: { register: any }) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size="md">
      <Input
        {...register}
        pr="1"
        pl="4"
        type={show ? "text" : "password"}
        placeholder="Enter password"
      />
      <InputRightElement width="3rem">
        <Button h="1.75rem" size="sm" variant="link" onClick={handleClick}>
          {show ? <FiEye /> : <FiEyeOff />}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
