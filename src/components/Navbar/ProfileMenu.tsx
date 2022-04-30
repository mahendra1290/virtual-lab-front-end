import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import React from "react"
import { useAuthContext } from "../../providers/AuthProvider"
import { FaSignOutAlt, FaUserAlt } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

const ProfileMenu = () => {
  const { user, signOut } = useAuthContext()

  return (
    <Menu>
      <MenuButton>
        <Avatar size="sm" name={user?.name || ""} />
      </MenuButton>
      <MenuList>
        <MenuItem className="capitalize" icon={<FaUserAlt />}>
          {user?.name}
        </MenuItem>
        <MenuItem icon={<MdEmail />}>{user?.email}</MenuItem>
        <MenuItem icon={<FaSignOutAlt />} onClick={signOut}>
          Sign out
        </MenuItem>
        <MenuItem icon={<FaUserAlt />} className="capitalize">
          {user?.role}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ProfileMenu
