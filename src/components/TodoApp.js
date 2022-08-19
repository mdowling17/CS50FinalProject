import React, { useEffect, useState, useRef } from "react";
import "../MattsTodos.css"
import Folders from "./Folders"
import TodoList from "./TodoList";
import {
  getDocs,
  collection,
  query,
  where
} from "firebase/firestore";

function TodoApp({ db, email, linkedDirectory, setLinkedDirectory, linkedFilepath, setLinkedFilepath }) {
  const isMountedRef = useRef(true);
  const [directory, setDirectory] = useState(linkedDirectory);
  const [filePath, setFilePath] = useState(linkedFilepath)
  const [fileType, setFileType] = useState(linkedDirectory ? 'lists' : 'projects')
  const [listView, setListView] = useState(linkedDirectory ? true : false);
  const [homeId, setHomeId] = useState(linkedDirectory?.substring(0, linkedDirectory.indexOf("/")));
  

  async function getHome() {
    const collectionRef = collection(db, "projects")
    const currentHome = query(collectionRef, where("user", "==", email))
    const data = await getDocs(currentHome)
    data.docs.length === 1 ? data.docs.forEach((doc) => {
      setDirectory(doc.id);
      setFilePath('home')
      setHomeId(doc.id)
    })
    : alert('Invalid user login info');
  }

  useEffect(() => {
    if (isMountedRef.current) {
      setLinkedDirectory()
      setLinkedFilepath()
      if (!directory) getHome();
    }
    return () => isMountedRef.current = false;
  }, [])

  function handleReturnButtonClick() {
    if (fileType === 'lists') {
      setListView(!listView);
      setFileType('projects');
    }
    const newDirectory = directory.substring(0, directory.lastIndexOf("/"));
    setDirectory(newDirectory);
    const newFilePath = filePath.substring(0, filePath.lastIndexOf("/"));
    setFilePath(newFilePath);
  }

  //if a list is opened, render the list
  return (
    <div className="app">
      <div className="top-line">
        <div className="filepath">{filePath}</div>
        <div 
            className="return-button"
            onClick={handleReturnButtonClick}
            style={{display: directory !== homeId ? "inline-block" : "none"}}
        >
            &nbsp;Return
        </div>
      </div>
      
      {listView 
      ? <TodoList
          db={db}
          directory={directory}
        />
      : 
        <Folders 
          db={db}
          directory={directory}
          setDirectory={setDirectory}
          filePath={filePath}
          setFilePath={setFilePath}
          listView={listView}
          setListView={setListView}
          setFileType={setFileType}
        />}
    </div>
  )
}

export default TodoApp