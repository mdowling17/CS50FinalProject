import React, { useState, useRef, useEffect } from "react"

function Filename({ handleDelete, handleUpdate, type, file }) {
    const name = (type === 'list' ? 'listname' : 'projectname')
    const [input, setInput] = useState(file[name])
    const [editing, setEditing] = useState(false)
    const textAreaRef = useRef(null);

    useEffect(() => {
        //Resize text area height on new lines
        textAreaRef.current.style.height = "inherit";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`

        //Set cursor to end of text area
        const text = input;
        const length = text.length;
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(length, length)
    }, [input, editing])

      function handleClick() {
        setEditing(!editing)
    }
    
    //Update todo entry on blur
    function handleBlur() {
        if (input === '') {
        handleDelete(file.id, type)
        } 
        else handleUpdate(file.id, type, input)
        setEditing(!editing)
    }

    function handleKeyDown(e) {
        if (e.code === 'Enter') {
            e.preventDefault() //don't create newline
            //if above entry is filled, create a new line
            if (input !== '') {
                handleUpdate(file.id, type, input)
            }
            else handleDelete(file.id, type)
            textAreaRef.current.blur();
        }
    }

    return (
        <div>
            <div
                style={{display: editing ? "none" : "block"}}
                title={input}
                onClick={handleClick}
                className="title"
            >{input}
            </div>
            <textarea
                style={{display: editing ? "block" : "none"}}
                ref={textAreaRef}
                className="input" 
                title={input}
                onChange={(e) => setInput(e.target.value)}
                onBlur={handleBlur}
                value={input}
                onKeyDown={(e) => handleKeyDown(e)}
            />
        </div>
    )
}

export default Filename