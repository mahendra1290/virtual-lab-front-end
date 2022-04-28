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

export type LabMenus = "edit" | "delete"
interface LabOptionMenuProps {
  onMenuClick?: (menu: LabMenus) => void
}

export const LabOptionMenu = ({ onMenuClick }: LabOptionMenuProps) => {
  const handleMenuClick = (menu: LabMenus) => () => {
    if (onMenuClick) {
      onMenuClick(menu)
    }
  }

  return (
    <Menu>
      <MenuButton as={Button} colorScheme="grey" variant="outline">
        <FiSettings />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleMenuClick("edit")} icon={<AiFillEdit />}>
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleMenuClick("delete")}
          className="capitalize"
          icon={<AiFillDelete />}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
