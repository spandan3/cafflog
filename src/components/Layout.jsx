import { useAuth } from "../context/AuthContext"
import Authentication from "./Authentication"
import Modal from "./Modal"
import { useState } from "react"

export default function Layout(props) {
    const { children } = props
    const [showModal, setShowModal] = useState(false) 
    const { globalUser, logout } = useAuth()

    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFLOG</h1>
                <p>For Coffee Enthusiasts</p>
            </div>
            {globalUser ? 
            (<button onClick={logout}>
                <p>Logout</p>
            </button>) : 
            (<button onClick={() => { setShowModal(true) }}>
                <p>Sign up free</p>
                <i className="fa-solid fa-mug-hot"></i>
            </button>)}
        </header>
    )

    const footer = (
        <footer>
            <p><span className="text-gradient">CaffLog</span> was made using the <a href="https://www.fantacss.smoljames.com">FantaCSS</a> design library.</p>
        </footer>
    )



    return (
        <>
            {showModal &&
             (<Modal handleCloseModal={() => setShowModal(false) }>
                <Authentication handleCloseModal={() => setShowModal(false)} /> 
            </Modal>)}
            {header}
            <main>
                {children}
            </main>
            {footer}
        </>
    )
}