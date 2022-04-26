import { Spinner, useToast } from "@chakra-ui/react"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuthContext } from "../../providers/AuthProvider"

const JoinLabPage = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [labId, setLabId] = useState<string | null>(null)
  const toast = useToast({
    title: "Joined Lab successfully",
    duration: 2000,
    isClosable: true,
  })

  const navigate = useNavigate()

  const joinLab = async (code: string) => {
    try {
      setLoading(true)
      const res = await axios.post("labs/students", {
        uid: user?.uid,
        email: user?.email,
        name: user?.name,
        code,
      })
      setLabId(res.data.labId)
      toast()
      setTimeout(() => {
        navigate(`/s/labs/${res.data.labId}`)
      }, 500)
      console.log(res)
      setLoading(false)
    } catch (err: any) {
      console.log(err)

      setLoading(false)
    }
  }

  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      joinLab(code)
    }
  }, [])

  if (loading) {
    return (
      <div className="mx-auto mt-12 flex w-fit flex-col items-center justify-center gap-8 rounded-xl bg-teal-100 p-8 shadow-md">
        <Spinner size="xl" colorScheme="blue" />
        <h1 className="text-2xl">Joining lab...Please Wait</h1>
      </div>
    )
  }

  if (labId) {
    return (
      <div className="mx-auto mt-12 flex w-fit flex-col items-center justify-center gap-8 rounded-xl bg-teal-100 p-8 shadow-md">
        <h1 className="text-2xl">Redirecting to lab...</h1>
      </div>
    )
  }

  if (!labId || loading) {
    return (
      <div className="p-8 text-center text-2xl text-red-400">
        Lab link expired
      </div>
    )
  }
}

export default JoinLabPage
