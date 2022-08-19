import React, { useRef, useState } from 'react'
import { logIn, useAuth } from '../firebase-config'
import { Link } from 'react-router-dom'

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const currentUser = useAuth()
    
    async function handleLogIn() {
        setLoading(true)
        try {
            await logIn(emailRef.current.value, passwordRef.current.value);
        } catch {
            alert("Failed to log in")
        }
        setLoading(false)
    }

    return (
        <div className="login-container">
            <div className="login">
                    <h1 className="text-center">Log In</h1>
                    <p>Email:</p>
                    <input type="text" ref={emailRef}></input>
                    <p>Password:</p>
                    <input type="password" ref={passwordRef}></input>
                    <button disabled={loading || currentUser} onClick={handleLogIn}>Log In</button>
            </div>
            <p>Need a new account? <Link to="/signup" className="Link">Sign Up</Link></p>
        </div>
    )
}

export default Login