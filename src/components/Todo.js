import React, { useState, useRef, useEffect } from "react"

function Todo({ todo, number, handleDelete, handleCheckmark, handleUpdate, handleNewLine, handleTab, handleShiftTab }) {
  const [selectedTask, setSelectedTask] = useState(todo.task);

  const textAreaRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      //Resize text area height on new lines
      textAreaRef.current.style.height = "inherit";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`

      //Set cursor to end of text area
      const input = selectedTask;
      const length = input.length;
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(length, length)
    }
    return () => mounted = false;
    
  }, [selectedTask])

  function onClick() {
    textAreaRef.current.focus()
  }
  //Update todo entry on blur
  function handleBlur() {
    if (selectedTask === '') {
      handleDelete(todo.id, todo.index)
    } 
    else handleUpdate(todo.id, selectedTask)
  }

  function handleKeyDown(e) {
    if (e.code === 'Enter') {
      e.preventDefault() //don't create newline
      //if above entry is filled, create a new line
      if (selectedTask !== '') {
        handleUpdate(todo.id, selectedTask)
        handleNewLine(todo.level, todo.index) 
      }
      //else shift tab until the level = 0, then delete
      else {
        if (todo.level === 0) handleDelete(todo.id, todo.index)
        else handleShiftTab(todo.level, todo.id)
      }
    }

    else if (e.code === 'Backspace' && selectedTask === '') {
      handleDelete(todo.id, todo.index)
    }
    
    else if (e.code === 'Tab') {
      //Don't tab out of the text area
      e.preventDefault()
      //If shift + tab, reverse indent until level = 0
      if (e.shiftKey) {
        if (todo.level > 0) handleShiftTab(todo.level, todo.id)
        else return;
      }
      //If just tab, indent 1 level
      else handleTab(todo.level, todo.id)
    }
  }

  const indent = todo.level * 20 + "px"
  return (
    <div className="todo" style={{marginLeft: indent}}>
        <div className="checkboxContainer">
          <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCheckmark(todo.id, todo.completed)}
              className="checkbox"
          />
        </div>
        <div className="todo-text-container" onClick={onClick}>
          <div className={todo.completed ? "todo-text strike" : "todo-text"}>
              <div className="text number">{number}.&nbsp;</div>
              <textarea 
                ref={textAreaRef} 
                onChange={(e) => setSelectedTask(e.target.value)} 
                onBlur={handleBlur} 
                value={selectedTask} 
                onKeyDown={(e) => handleKeyDown(e)}
                className={todo.completed ? "strike" : ""}
              />
          </div>
          <div onClick={() => handleDelete(todo.id, todo.index)} className="todo-delete">
          </div>
        </div>
    </div>
  )
}

export default Todo