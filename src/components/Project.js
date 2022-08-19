import React, { useRef, useState } from "react"
import Filename from "./Filename"

function Project({ project, onClick, handleDelete, handleUpdate, type }) {
    const [showDelete, setShowDelete] = useState(true)

    function handleMouseOver() {
        setShowDelete(false);
    }

    function handleMouseOut() {
        setShowDelete(true)
    }

    return (
        <div className="project">
            <div className="project-image-container">
                <div className="project-image" onClick={onClick} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}></div>
                <div onClick={() => handleDelete(project.id, 'project')} className="file-delete" style={{display: showDelete ? "block" : "none"}}></div>
            </div>
            <Filename 
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                type={type}
                file={project}
            />

        </div>
    )
}

export default Project