import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
} from "@chakra-ui/react"
import { FaSignOutAlt, FaUserAlt } from "react-icons/fa"
import { FiSettings } from "react-icons/fi"
import { BiChevronDown } from "react-icons/bi"
import { AiFillDelete, AiFillEdit } from "react-icons/ai"

const LabOptionMenu = () => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<BiChevronDown />}
        colorScheme="grey"
        variant="outline"
      >
        <FiSettings />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<AiFillEdit />}>Edit</MenuItem>
        <MenuItem className="capitalize" icon={<AiFillDelete />}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default LabOptionMenu
