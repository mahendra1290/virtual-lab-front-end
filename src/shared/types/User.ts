import { UserProfile } from "firebase/auth"

export type User = {
  uid: string | null
  email: string | null
  name: string | null
  role?: string | null
  profileCompleted?: boolean
}
