import React, { useState, useEffect } from "react";
import List from "./List"
import Project from "./Project"
import TextForm from "./TextForm"
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy,
    where,
    getDoc
  } from "firebase/firestore";


function Folders({ db, directory, setDirectory, filePath, setFilePath, listView, setListView, setFileType }) {
    const [input, setInput] = useState('')
    const [projects, setProjects] = useState([])
    const [lists, setLists] = useState([])
    

    async function getProjects() {
        const currentFolder = directory.substring(directory.lastIndexOf("/") + 1);
        //get projects with current directory as parent
        const projectCollection = collection(db, "projects");
        const projectQuery = query(projectCollection, where("parentproject", "==", currentFolder), orderBy("projectname"))
        const data = await getDocs(projectQuery);
        setProjects(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    async function getLists() {
        const currentFolder = directory.substring(directory.lastIndexOf("/") + 1);
        //get lists with current directory as parent
        const listCollection = collection(db, "lists");
        const listQuery = query(listCollection, where("parentproject", "==", currentFolder), orderBy("listname"))
        const data = await getDocs(listQuery);
        setLists(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    //initial render
    useEffect(() => {
        let mounted = true;
        if (directory && mounted) {
            getProjects();
            getLists();
        }
        return () => mounted = false;
    }, [directory]);

    function handleProjectClick(id, name) {
        const newDirectory = directory + `/${id}`;
        setDirectory(newDirectory)
        const newFilePath = filePath + `/${name}`;
        setFilePath(newFilePath);

        setFileType('projects')
    }

    function handleListClick(id, name) {
        const newDirectory = directory + `/${id}`;
        setDirectory(newDirectory);
        const newFilePath = filePath + `/${name}`;
        setFilePath(newFilePath);

        setListView(!listView);
        setFileType('lists')
    }

    async function handleSubmit(type) {
        const currentFolder = directory.substring(directory.lastIndexOf("/") + 1);
        if (input === '') return;
        if (type === 'list') {
            const listsCollection = collection(db, "lists")
            await addDoc(listsCollection, {listname: input, parentproject: currentFolder});
            getLists();
        }
        else if (type === 'project') {
            const projectsCollection = collection(db, "projects")
            await addDoc(projectsCollection, {projectname: input, parentproject: currentFolder});
            getProjects();
        }
        setInput('');
    }

    async function handleDelete(id, type) {
        if (type === 'project') {
            //delete current folder
            const projectRef = doc(db, 'projects', id)
            await deleteDoc(projectRef)

            //get internal projects' id's
            const projectCollection = collection(db, "projects");
            const projectQuery = query(projectCollection, where("parentproject", "==", id))
            const projectData = await getDocs(projectQuery);
            projectData.docs.forEach((project) => {
                handleDelete(project.id, 'project')
            })

            //get internal lists' id's
            const listCollection = collection(db, "lists");
            const listQuery = query(listCollection, where("parentproject", "==", id))
            const listData = await getDocs(listQuery);
            listData.docs.forEach((list) => {
                handleDelete(list.id, 'list');                
            })
        }

        else if (type === 'list') {
            //delete current list
            const listRef = doc(db, 'lists', id);
            await deleteDoc(listRef)

            //get and delete internal todos
            const todoCollection = collection(db, 'todos');
            const todoQuery = query(todoCollection, where("parentlist", "==", id))
            const todoData = await getDocs(todoQuery)
            todoData.docs.forEach(async (todo) => {
                const todoRef = doc(db, 'todos', todo.id)
                await deleteDoc(todoRef)
            })
        }

        getProjects();
        getLists();
    }

    async function handleUpdate(id, type, input) {
        const typePlural = type + 's'
        const name = {}
        name[type + 'name'] = input
        const docRef = doc(db, typePlural, id)
        await updateDoc(docRef, name)
        getProjects();
        getLists();
    }
    return (
        <div className="folders-container">

            <div className="projects-container">
            <TextForm 
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                type={'project'}
            />
                <div className="projectsList">
                    {projects.map((project) => {
                        return (
                            <Project
                                key={project.id}
                                project={project}
                                onClick={() => handleProjectClick(project.id, project.projectname)}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                                type={'project'}
                            />
                        )
                    })}
                </div>
            </div>

            <div className="lists-container">
            <TextForm 
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                type={'list'}
            />
                <div className="listsList">
                    {lists.map((list) => {
                        return (
                            <List 
                                key={list.id}
                                list={list}
                                onClick={() => handleListClick(list.id, list.listname)}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                                type={'list'}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Folders