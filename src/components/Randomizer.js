import React, { useState } from 'react'
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";
import { Link } from 'react-router-dom'


export default function Randomizer({ db, filepath, setFilepath, directory, setDirectory }) {
    const [randomTodo, setRandomTodo] = useState()

    async function getRandomTask() {
        //get random todo
        const todoCollection = collection(db, 'todos')
        const todoQuery = query(todoCollection, where("level", "==", 0), where("completed", "==", false))
        const todoData = await getDocs(todoQuery)
        const randomValue = Math.floor(Math.random() * (todoData.docs.length))
        setRandomTodo(todoData.docs[randomValue])

        //get current listname
        const parentListID = todoData.docs[randomValue].data().parentlist;
        const docRef = doc(db, "lists", parentListID);
        const data = await getDoc(docRef);
        const listname = data.data().listname;
        //get remaining filepath
        const nextID = data.data().parentproject;
        getFilepath(nextID, listname, parentListID)
    }

    async function getFilepath(id, prevFilepath, prevID) {
        //get current folder name
        const docRef = doc(db, "projects", id);
        const data = await getDoc(docRef);
        const projectname = data.data().projectname;
        const newFilepath = projectname + '/' + prevFilepath;
        const newDirectory = id + '/' + prevID;

        //get next parent
        const nextID = data.data().parentproject;
        if (nextID) getFilepath(nextID, newFilepath, newDirectory)
        else {
            setFilepath(newFilepath)
            setDirectory(newDirectory)
        }
    }

    async function handleCheckmark(id, completed) {
        const docRef = doc(db, "todos", id);
        await updateDoc(docRef, {completed: !completed})
        alert(`Task completed!`)
        getRandomTask()
    }

    return (
        <div className="Randomizer">
            <button onClick={getRandomTask} className="Randomizer-Button">Get Random Task</button>
            <div className="Randomizer-Todo-Container">
                <div className="randomizer-filepath-container" style={{display: randomTodo ? "flex" : "none"}}>
                    <Link to="/" className="Link randomizer-Link">JUMP TO:</Link>
                    <div className="filepath">{filepath}</div>
                </div>
                {randomTodo && 
                <div className="todo-text randomizer-todo-text">
                    <div className="checkboxContainer randomizer-checkboxContainer">
                        <input 
                            type="checkbox"
                            checked={randomTodo?.data().completed}
                            onChange={() => handleCheckmark(randomTodo?.id, randomTodo?.data().completed)}
                            className="checkbox"
                        />
                    </div>
                    <div>{randomTodo?.data().task}</div>
                </div>}
                <div className="Link"></div>
            </div>
        </div>
    )
}
