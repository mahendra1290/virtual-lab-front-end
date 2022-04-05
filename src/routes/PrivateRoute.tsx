import React from "react"
import { Navigate } from "react-router-dom"
import { useAuthContext } from "../providers/AuthProvider"

type Props = {
  children: React.ReactChild | React.ReactChildren
  roles: string[]
}

const PrivateRoute = ({ children, roles = [] }: Props) => {
  const { user, authLoading } = useAuthContext()

  console.log("user", user, "private route")

  if (roles.includes(user?.role || "")) {
    return children as JSX.Element
  }

  if (!user && !authLoading) {
    return <Navigate to="/login" />
  }

  if (authLoading) {
    return <h1>Loading...</h1>
  }

  return <h1>Access Denied</h1>
}

export { PrivateRoute }
