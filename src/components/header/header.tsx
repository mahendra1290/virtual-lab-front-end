import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
} from "@chakra-ui/react"
import React from "react"
import { HiArrowLeft } from "react-icons/hi"
import { Link, useNavigate } from "react-router-dom"

type HeaderProps = {
  title?: string | React.ReactElement
  pathList?: (string | [string, string | undefined])[]
  onBackClick?: () => void
  showBackButton?: boolean
  rightContent?: React.ReactChild | React.ReactChildren | boolean
}

const Header = ({
  title,
  pathList = [],
  onBackClick,
  showBackButton = true,
  rightContent,
}: HeaderProps) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 shadow-sm dark:bg-gray-700 dark:text-slate-200 md:px-8">
      <div>
        <div className="flex items-center gap-2">
          <HiArrowLeft
            onClick={handleBackClick}
            role="button"
            className="m-0 text-2xl"
          />
          <h1 className="text-2xl capitalize text-gray-800 dark:text-slate-200">
            {title}
          </h1>
        </div>
        <Breadcrumb className="text-sm capitalize text-gray-700 dark:text-slate-100">
          <BreadcrumbItem key="home-crumb">
            <Link to="/">home</Link>
          </BreadcrumbItem>
          {pathList.map((item) => {
            if (typeof item === "string") {
              return (
                <BreadcrumbItem key={item}>
                  <BreadcrumbLink>{item}</BreadcrumbLink>
                </BreadcrumbItem>
              )
            } else {
              return (
                <BreadcrumbItem key={item[0]}>
                  {/* <BreadcrumbLink> */}
                  <Link to={item[0]}>{item[1]}</Link>
                  {/* </BreadcrumbLink> */}
                </BreadcrumbItem>
              )
            }
          })}
        </Breadcrumb>
      </div>
      {rightContent}
    </div>
  )
}

export default Header
