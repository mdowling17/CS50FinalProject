import React, { useRef, useState } from 'react'
import { signUp, useAuth } from '../firebase-config'
import { Link } from 'react-router-dom'

function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const [loading, setLoading] = useState(false)
    const currentUser = useAuth()
    
    async function handleSignUp() {
        setLoading(true)
        try {
            await signUp(emailRef.current.value, passwordRef.current.value);
        } catch {
            alert("Failed to sign up")
        }
        setLoading(false)
    }

    return (
        <div className="login-container">
            <div className="login">
                    <h1 className="text-center">Sign Up</h1>
                    <p>Email:</p>
                    <input type="text" ref={emailRef}></input>
                    <p>Password:</p>
                    <input type="password" ref={passwordRef}></input>
                    <p>Confirm Password:</p>
                    <input type="password" ref={confirmPasswordRef}></input>
                    <button disabled={loading || currentUser} onClick={handleSignUp}>Sign Up</button>
            </div>
            <p>Already signed up? <Link to="/login" className="Link">Log In</Link></p>
        </div>
    )
}

export default Signup