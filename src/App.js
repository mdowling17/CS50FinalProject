import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./MattsTodos.css"
import Signup from "./components/Signup"
import TodoApp from "./components/TodoApp"
import Login from "./components/Login"
import Randomizer from "./components/Randomizer"
import ErrorPage from "./components/ErrorPage"
import { logOut } from "./firebase-config"
import { db } from "./firebase-config";


function App() {
  const [currentUser, setCurrentUser] = useState()
  const [userLoading, setUserLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [filepath, setFilepath] = useState()
  const [directory, setDirectory] = useState()

  async function handleLogOut() {
    setLoading(true)
    try {
      await logOut();
    }
    catch {
      alert('Could not log out')
    }
    setLoading(false)
    return(<Navigate to="/" />)
  }
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      setCurrentUser(user)
      setUserLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <div>
    {!userLoading &&
      <Router>
        <nav>
          <div>
            <Link to="/login" className="Link">Home</Link>

            {currentUser
            ? <div className="email"><span style={{textDecoration: "underline"}}>Current User:</span><br></br>{currentUser.email}</div>
            : <Link to="/signup" className="Link">Sign Up</Link>}

            {currentUser
            && <Link to="/randomizer" className="Link">Randomizer</Link>}

            {currentUser 
            ? <div disabled={loading} onClick={handleLogOut} to="/login" className="Link">Log Out</div> 
            : <Link to="/login" className="Link">Log In</Link>}

          </div>
        </nav>
        <Routes>
          <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <Signup />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/randomizer" element={currentUser ? <Randomizer db={db} filepath={filepath} setFilepath={setFilepath} directory={directory} setDirectory={setDirectory} /> : <Navigate to="/login" />} />
          <Route path="/" element={currentUser ? <TodoApp db={db} email={currentUser?.email} linkedDirectory={directory} setLinkedDirectory={setDirectory} linkedFilepath={filepath} setLinkedFilepath={setFilepath} /> : <Navigate to="/login" />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>}
    </div>
  )
}

export default App