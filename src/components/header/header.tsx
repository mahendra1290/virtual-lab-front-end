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
  title: string
  pathList?: (string | [string, string])[]
  onBackClick?: () => void
  showBackButton?: boolean
  rightContent?: React.ReactChild | React.ReactChildren
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
    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 shadow-sm md:px-8">
      <div>
        <div className="flex items-center gap-2">
          <HiArrowLeft
            onClick={handleBackClick}
            role="button"
            className="m-0 text-2xl"
          />
          <h1 className="text-3xl capitalize text-gray-800">{title}</h1>
        </div>
        <Breadcrumb className="text-sm capitalize text-gray-700">
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathList.map((item) => {
            console.log(typeof item, item, "type")

            if (typeof item === "string") {
              return (
                <BreadcrumbItem>
                  <BreadcrumbLink>{item}</BreadcrumbLink>
                </BreadcrumbItem>
              )
            } else {
              return (
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link to={item[0]}>{item[1]}</Link>
                  </BreadcrumbLink>
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
