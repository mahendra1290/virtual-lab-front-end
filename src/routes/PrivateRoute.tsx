import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthContext } from "../providers/AuthProvider"

type Props = {
  children: React.ReactChild | React.ReactChildren
  roles: string[]
}

const PrivateRoute = ({ children, roles = [] }: Props) => {
  const { user, authLoading } = useAuthContext()

  const location = useLocation()

  if (roles.includes(user?.role || "")) {
    return children as JSX.Element
  }

  if (!user && !authLoading) {
    if (location.pathname) {
      return <Navigate to={`/login?redirectTo=${location.pathname}`} />
    }
    return <Navigate to="/login" />
  }

  if (authLoading) {
    return <h1>Loading...</h1>
  }

  return <h1>Access Denied</h1>
}

export default PrivateRoute
