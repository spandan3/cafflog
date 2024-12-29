import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useState, useEffect, useContext, createContext } from "react"
import { auth, db } from "../../firebase"
import { doc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const { children } = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function logout() {
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }
    
    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, logout }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Current user: ', user)
            setGlobalUser(user)
            // if no user, empty the user state and return
            if (!user) { 
                console.log('No active user')
                return 
            }

            // if there is user, then check if user has data in db and if they do fetch said data and update global state

            try {
                setIsLoading(true)

                // first create a reference for the document (labelled json object), then snapshot to check if theres anything there
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}
                if (docSnap.exists()) {
                    firebaseData = docSnap.data()
                    console.log('Found user data')
                    console.log(firebaseData)
                }
                setGlobalData(firebaseData)

            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }


        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
