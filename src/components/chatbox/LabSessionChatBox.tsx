import { Button, Divider, Input } from "@chakra-ui/react"
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { BiSend } from "react-icons/bi"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"

interface LabSessionChatBoxProps {
  sessionId: string
  studentId: string
}

interface Message {
  id: string
  from: string
  message: string
  seen: boolean
  timestamp: Timestamp
}

const scrollToBottom = (element: HTMLDivElement) => {
  element.scrollTop = element.scrollHeight
}

const LabSessionChatBox = ({
  sessionId,
  studentId,
}: LabSessionChatBoxProps) => {
  const { user } = useAuthContext()

  const chatCollectionRef = useRef(
    collection(db, `lab-chat-${sessionId}-${studentId}`)
  )

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [messages, setMessages] = useState<Message[]>([])

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { message: "" } })

  useEffect(() => {
    const q = query(chatCollectionRef.current, orderBy("timestamp"))
    const unsub: Unsubscribe = onSnapshot(q, (data) => {
      const msgs = data.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Message)
      )
      console.log(msgs, sessionId, studentId)

      setMessages(msgs)
    })
    return () => {
      console.log("run unsub")
      unsub()
    }
  }, [])

  useEffect(() => {
    console.log("mes", messages)

    if (scrollRef.current) {
      scrollToBottom(scrollRef.current)
    }
  }, [messages])

  const onMessageSend = ({ message }: { message: string }) => {
    if (!message.trimStart()) {
      return
    }
    const colRef = chatCollectionRef.current
    if (studentId && sessionId) {
      addDoc(colRef, {
        from: user?.uid,
        message: message.trimStart(),
        timestamp: Timestamp.now(),
        seen: false,
      })
    }
    reset()
  }

  return (
    <div>
      <div
        ref={scrollRef}
        className="scrollbar-thumb-rounded-full gap flex max-h-[15rem] min-w-[20rem] flex-col gap-1 overflow-y-scroll scroll-smooth pr-4 scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200"
      >
        {messages.map((msg, index) => (
          <div
            className={`${
              msg.from === user?.uid
                ? "self-end bg-teal-100"
                : "self-start bg-blue-100"
            } max-w-[80%] rounded-md px-2 py-1 text-sm ${
              messages.at(index - 1)?.from !== msg.from ? "mt-2" : ""
            }`}
            key={msg.id}
          >
            <p>{msg.message}</p>
            <p className="mt-1 text-xs text-gray-500">
              {moment(msg.timestamp.toMillis()).format("hh-mm A")}
            </p>
          </div>
        ))}
      </div>
      <Divider className="my-4" />
      <form onSubmit={handleSubmit(onMessageSend)} className="flex  gap-2">
        <Input
          size="sm"
          autoFocus
          placeholder="Enter message"
          rounded="full"
          {...register("message")}
        />
        <Button type="submit" rounded="full" className="flex-grow" size="sm">
          Send <BiSend className="ml-2" />{" "}
        </Button>
      </form>
    </div>
  )
}

export default LabSessionChatBox
