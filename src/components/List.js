import React, { useState } from "react"
import Filename from "./Filename"

function List({ list, onClick, handleDelete, handleUpdate, type }) {
    const [src, setSrc] = useState("/file-alt-regular-untabbed.png")
    const [showDelete, setShowDelete] = useState(true)

    //Change img src on mouse hover
    function handleMouseOver() {
        setSrc("/file-alt-regular.png")
        setShowDelete(false);
    }
    function handleMouseOut() {
        setSrc("/file-alt-regular-untabbed.png")
        setShowDelete(true);
    }

    return (
        <div className="list">
            <div className="list-image-container">
                <img className="list-image" src={src} alt="bs"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onClick={onClick}
                />
                <div onClick={() => handleDelete(list.id, 'list')} className="file-delete" style={{display: showDelete ? "block" : "none"}}></div>
            </div>

            <Filename 
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                type={type}
                file={list}
            />
        </div>
    )
}

export default List