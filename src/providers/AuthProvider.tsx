import { useToast } from "@chakra-ui/react"
import axios from "axios"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getIdToken,
  getIdTokenResult,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db, usersCol } from "../firebase"
import { User } from "../shared/types/User"

const provider = new GoogleAuthProvider()

interface AuthProviderValue {
  user: User | null
  loggedIn: boolean
  role?: string
  authLoading: boolean
  signInLoading: boolean
  signUpLoading: boolean
  updateUser: (uid: string, name: string, role: string) => Promise<boolean>
  signInWithEmailPassword: (email: string, password: string) => Promise<boolean>
  signInWithGoogle: (login: boolean) => void
  signUpWithEmailPassword: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = React.createContext<AuthProviderValue>({
  user: null,
  loggedIn: false,
  authLoading: true,
  signInLoading: false,
  signUpLoading: false,
  updateUser: async () => true,
  signInWithEmailPassword: async () => true,
  signUpWithEmailPassword: async () => true,
  signInWithGoogle: () => null,
  signOut: () => null,
})

type Props = {
  children: React.ReactChild | React.ReactChildren
}

const useAuthContext = () => useContext(AuthContext)

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate()
  const toast = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)
  const [signInLoading, setSignInLoading] = useState(false)
  const [signUpLoading, setSignUpLoading] = useState(false)

  const createUserIfNotPresent = async (
    uid: string,
    email: string,
    name: string,
    profileCompleted = false
  ) => {
    try {
      const docSnap = await getDoc(doc(db, "users", uid))
      if (!docSnap.exists()) {
        await setDoc(doc(usersCol, uid), {
          uid,
          email,
          name,
          profileCompleted,
        })
      }
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  const updateUser = async (uid: string, name: string, role: string) => {
    console.log(uid, name, role, "update")
    try {
      const docSnap = await getDoc(doc(db, "users", uid))
      if (docSnap.exists()) {
        await setDoc(
          doc(usersCol, uid),
          {
            role,
            name,
          },
          { merge: true }
        )
        return true
      }
      return false
    } catch (err) {
      console.log(err)
      return false
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        axios.defaults.headers.common["authorization"] =
          `Bearer ` + (await getIdToken(user))
        const idTokenResult = await getIdTokenResult(user)
        let role = idTokenResult.claims.role as string
        setUser({ ...user, name: user.displayName, role })
        getDoc(doc(db, "users", user.uid)).then((doc) => {
          if (doc.exists()) {
            setUser((prevUser) => ({
              ...prevUser,
              ...(doc.data() as User),
            }))
          }
        })
        setLoggedIn(true)
        setLoading(false)
      } else {
        delete axios.defaults.headers.common["authorization"]
        setUser(null)
        setLoading(false)
        setLoggedIn(false)
      }
    })
  }, [])

  const signUpWithEmailPassword = async (email: string, password: string) => {
    try {
      setSignUpLoading(true)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      if (user.email) {
        await createUserIfNotPresent(user.uid, user.email, "")
      }
      navigate("/initial-profile?password=true")
      setSignUpLoading(false)
      return true
    } catch (err) {
      setSignUpLoading(false)
      return false
    }
  }

  const signInWithEmailPassword = async (email: string, password: string) => {
    setSignInLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      setSignInLoading(false)
      navigate("/")
      return true
    } catch (err: any) {
      console.log(err)
      let title = err.code
      if (err.code === "auth/user-not-found") {
        title = "User not found"
      } else if (err.code === "auth/wrong-password") {
        title = "Username or password not correct"
      }
      toast({
        title,
        position: "top-right",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      setSignInLoading(false)
      return false
    }
  }

  const signInWithGoogle = async (login: boolean) => {
    setSignInLoading(true)
    try {
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      if (user.email) {
        await createUserIfNotPresent(
          user.uid,
          user.email,
          user.displayName || ""
        )
      }
      setSignInLoading(false)
      if (!login) {
        navigate("/initial-profile")
      } else {
        navigate("/")
      }
    } catch (err) {
      console.log(err)
      setSignInLoading(false)
    }
  }

  const logOut = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setLoading(false)
      navigate("/login")
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    user,
    loggedIn,
    role,
    signInLoading,
    signUpLoading,
    signInWithEmailPassword,
    signInWithGoogle,
    signOut: logOut,
    signUpWithEmailPassword,
    updateUser,
    authLoading: loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider, useAuthContext }
