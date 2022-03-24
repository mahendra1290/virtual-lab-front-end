import { useAuthContext } from "../../providers/AuthProvider"
import { ProfileForm } from "../Signup/ProfileForm"

export const Teacher = () => {
  const { user } = useAuthContext()

  return (
    <div>
      <ProfileForm />
      <p>{user?.email}</p>
      <p>{user?.role}</p>
      <div>BDA Lab</div>
      <div>Physics</div>
      <div>Chemistry</div>
    </div>
  )
}
