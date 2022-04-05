import { Button } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <h1 className="text-4xl">
      404: Not found{" "}
      <Link to="/">
        <Button>Home</Button>
      </Link>
    </h1>
  </div>
)

export default NotFoundPage
