import React from "react";

function TodoTitle({username}) {
    return(
        <div className="todo-title">
            <h1>{username}'s Todo List</h1>
        </div>
    )
}

export default TodoTitle