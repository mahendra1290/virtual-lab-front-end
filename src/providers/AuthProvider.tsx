import { useToast } from "@chakra-ui/react"
import { async } from "@firebase/util"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../firebase"

const provider = new GoogleAuthProvider()

type User = {
  uid: string | null
  email: string | null
  name: string | null
  role?: string | null
}

interface AuthProviderValue {
  user: User | null
  loggedIn: boolean
  role?: string
  authLoading: boolean
  updateUser: (uid: string, name: string, role: string) => Promise<boolean>
  signInWithEmailPassword: (email: string, password: string) => Promise<boolean>
  signInWithGoogle: () => void
  signUpWithEmailPassword: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = React.createContext<AuthProviderValue>({
  user: null,
  loggedIn: false,
  authLoading: true,
  updateUser: async (uid, name, role) => true,
  signInWithEmailPassword: async (email, password) => true,
  signUpWithEmailPassword: async (email, password) => true,
  signInWithGoogle: () => {},
  signOut: () => {},
})

type Props = {
  children: React.ReactChild | React.ReactChildren
}

const useAuthContext = () => {
  return useContext(AuthContext)
}

const usersRef = collection(db, "users")

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate()
  const toast = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)

  const createUserIfNotPresent = async (
    uid: string,
    email: string,
    profileCompleted: boolean = false
  ) => {
    try {
      const docSnap = await getDoc(doc(db, "users", uid))
      if (!docSnap.exists()) {
        await setDoc(doc(usersRef, uid), {
          uid: uid,
          email: email,
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
          doc(usersRef, uid),
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ ...user, name: user.displayName })
        getDoc(doc(db, "users", user.uid)).then((doc) => {
          if (doc.exists()) {
            setUser(doc.data() as User)
          }
        })
        setLoggedIn(true)
        setLoading(false)
        navigate("/")
      } else {
        setUser(null)
        setLoading(false)
        setLoggedIn(false)
      }
    })
  }, [])

  const signUpWithEmailPassword = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      if (user.email) {
        await createUserIfNotPresent(user.uid, user.email)
      }
      setLoading(false)
      return true
    } catch (err) {
      setLoading(false)
      return false
    }
  }

  const signUpUserWithGoogle = () => {}

  const signInWithEmailPassword = async (email: string, password: string) => {
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      setLoading(false)
      return true
    } catch (err: any) {
      console.log(err)
      let title = ""
      if (err.code === "auth/user-not-found") {
        title = "User not found"
      } else if (err.code === "auth/wrong-password") {
        title = "Username / password mismatch"
      }
      toast({
        title,
        position: "top-right",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      setLoading(false)
      return false
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      if (user.email) {
        await createUserIfNotPresent(user.uid, user.email)
      }
      setLoading(false)
      console.log(userCredential)
      navigate("/")
    } catch (err) {
      console.log(err)
      setLoading(false)
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

  const value = {
    user,
    loggedIn,
    role,
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
