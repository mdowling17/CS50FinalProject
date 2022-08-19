import React, { useRef, useEffect, useState } from "react"

function TextForm({ input, setInput, handleSubmit, type }) {
  const textAreaRef = useRef(null);
  const [button, setButton] = useState(true);

  useEffect(() => {
    //Resize text area height on new lines
    
      textAreaRef.current.style.height = "inherit";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  
      //Set cursor to end of textarea
      const targinput = input;
      const length = targinput.length;
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(length, length)
    
    
  }, [input, button])

  function handleKeyDown(e) {
    if (e.code === 'Enter') {
      e.preventDefault() //don't create newline
      textAreaRef.current.blur()
      handleSubmit(type);
    return;
    }
  }

  function handleClick() {
    setButton(!button);
  }

  function handleBlur() {
    setButton(!button);
    setInput('');
  }

  return (
    <div className="form">
      <button style={{display: button ? "block" : "none"}} onClick={handleClick}>+ Add {type}</button>
      <textarea 
        ref={textAreaRef}
        onChange={e => setInput(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => handleKeyDown(e)}
        style={{display: button ? "none" : "block"}}
        value={input}
        placeholder=""
        className="input">
      </textarea>
    </div>
  )
}

export default TextForm