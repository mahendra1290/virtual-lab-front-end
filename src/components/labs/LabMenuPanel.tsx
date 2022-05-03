import React, { Children } from "react"
import { FiDelete } from "react-icons/fi"
import { BiRename } from "react-icons/bi"
import { Box, Input } from "@chakra-ui/react"
import LabSectionMenu from "./LabSectionMenu"

type LabMenuPanelProps = {
  className?: string
  menus?: string[]
  onChange?: (key: string) => void
  activeMenu?: string
  onDelete?: (key: string) => void
  children?: React.ReactChild | React.ReactChildren
}

const activeMenuStyle =
  "bg-slate-100 text-teal-700 dark:text-slate-50 dark:bg-gray-800 font-bold"

const unactiveMenuStyle =
  "bg-slate-50 text-black dark:text-slate-200 dark:bg-gray-700"

const LabMenuPanel = ({
  menus = [],
  className,
  activeMenu,
  onChange,
  onDelete,
  children,
}: LabMenuPanelProps) => {
  const handleClick = (menu: string) => () => {
    if (onChange) {
      onChange(menu)
    }
  }

  return (
    <div className={`${className} flex flex-col gap-2 rounded-md`}>
      {menus.map((menu) => (
        <Box
          key={menu}
          role="button"
          onClick={handleClick(menu)}
          className={
            (activeMenu === menu ? activeMenuStyle : unactiveMenuStyle) +
            " group rounded-md p-4 hover:cursor-pointer hover:bg-slate-100"
          }
        >
          {menu}
          {/* <Input value={menu} />
          <div className="flex gap-4">
            <FiDelete className="hidden text-red-600 group-hover:block" />
          </div> */}
          {/* <LabSectionMenu value={menu} mode="" /> */}
        </Box>
      ))}
      {children}
    </div>
  )
}

export default LabMenuPanel
