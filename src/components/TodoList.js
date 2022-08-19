import React, { useEffect } from "react";
import TextForm from "./TextForm";
import Todo from "./Todo";
import TodoTitle from "./TodoTitle";
import { useState } from "react"
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  where
} from "firebase/firestore";

const username='Matt'

function TodoList({ db, directory }) {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);

  const todosCollectionRef = collection(db, "todos");
  const currentDirectory = directory.substring(directory.lastIndexOf("/") + 1);

  //Get Todo List from Firebase DB
  const getTodos = async () => {
    const todosCollectionRefSorted = query(todosCollectionRef, where("parentlist", "==", currentDirectory), orderBy("index"));
    const data = await getDocs(todosCollectionRefSorted);
    setTodos(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  }

  //Initial Render of Todo List
  useEffect(() => {
    let mounted = true
    if (mounted) getTodos();
    return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Add new todo
  async function handleSubmit() {
    if (input === '') return;
    
    //Get the number of todo entries
    const tempCollection = collection(db, "todos")
    const tempQuery = query(tempCollection, where("parentlist", "==", currentDirectory))
    const data = await getDocs(tempQuery);
    const todoCount = data ? data.docs.length : 0;

    //Add a new doc at the end of the list
    await addDoc(todosCollectionRef, {date: Date.now(), task: input, completed: false, level: 0, index: todoCount, parentlist: currentDirectory});
    getTodos();
    setInput('');
  }


  //Enter Functionality
  async function handleNewLine(level, index) {
    //Shift entries after current index below new entry
    const tempCollection = collection(db, "todos");
    const queryTemp = query(tempCollection, where("parentlist", "==", currentDirectory), where("index", ">", index))
    const data = await getDocs(queryTemp)

    data.docs.forEach((docu) => {
      const docRef = doc(db, "todos", docu.id);
      const docIndex = docu.data().index;
      updateDoc(docRef, {index: docIndex + 1})
    })

    //Add new entry at index + 1
    await addDoc(todosCollectionRef, {date: Date.now(), task: "", completed: false, level: level, index: (index + 1), parentlist: currentDirectory})
    getTodos();
  }
  

  //Tab Functionality
  async function handleTab(level, id) {
    const docRefFirst = doc(db, "todos", id);
    updateDoc(docRefFirst, {level: level + 1});
    getTodos();
  }


  //Shift+Tab Functionality
  async function handleShiftTab(level, id) {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, {level: level - 1})
    getTodos();
  }


  //Complete todo
  async function handleCheckmark(id, completed) {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, {completed: !completed})
    getTodos();
  }


  //Delete todo
  async function handleDelete(id, index) {
    //Delete selected todo
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);

    //Shift entries after deleted todo up 1
    const tempCollection = collection(db, "todos");
    const queryTemp = query(tempCollection, where("parentlist", "==", currentDirectory), where("index", ">", index))
    const data = await getDocs(queryTemp)
    data.docs.forEach((docu) => {
      const docRef = doc(db, "todos", docu.id);
      const docIndex = docu.data().index;
      updateDoc(docRef, {index: docIndex - 1})
    })
    getTodos();
  }


  //Update todo
  async function handleUpdate(id, updatedText) {
    const docRef = doc(db, "todos", id);
    await updateDoc(docRef, {task: updatedText})
    getTodos();
  }

  function getPosition(index, level) {
    const todosCpy = todos;
    var positions = {};
    var positionCounter = {};
    todosCpy.forEach((todo) => {
      if (positionCounter[todo.level]) {
        positionCounter[todo.level]++;
      }

      else positionCounter[todo.level] = 1;

      for (var key in positionCounter) {
        if (todo.level < key) delete positionCounter[key];
      }

      positions[todo.index] = positionCounter[todo.level]
    })
    return getCounterType(level, positions[index]);
  }

  function getCounterType(level, number) {
    //Is Number
    if (level % 3 === 0) {
      return number;
    }

    //Is alphabetical
    else if (level % 3 === 1) {
      var letters = 0;
      var numsLeft = number;
      for (let i = 1; numsLeft > 0; i++) {
        numsLeft = numsLeft - 26**i;
        letters++;
      }

      var alphabetical = '';
      var modifier = 0;
      for (let i = 0; i < letters; i++) {
        modifier = modifier+(26**i);
        alphabetical += String.fromCharCode(Math.floor(((number - modifier)/(26 ** i)) % 26) + 97)
      }
      return alphabetical;
    }

    //Is roman numeral
    else if (level % 3 === 2) {
      const newNumber = (number - 1) % 3999 + 1;
      //i = 1, v = 5, x = 10, l = 50, c = 100, d = 500, m = 1000
      const romans = {1: "i", 5: "v", 10: "x", 50: "l", 100: "c", 500: "d", 1000: "m"};
      const digits = newNumber.toString().length;
      var romanNumeral = '';
      for (let i = digits - 1; i >= 0; i--) {
        const currDigit = Math.floor(newNumber/(10**i) % 10);
        const position = 10**i;
        if (currDigit === 9) romanNumeral += romans[position] + romans[position*10];
        else if (currDigit === 4) romanNumeral += romans[position] + romans[5*position];
        else romanNumeral += romans[position].repeat(currDigit);
      }
      return romanNumeral
    }
  }


  return (
    <div className="todolist">
        

        <TodoTitle username={username}/>

        {todos.map((todo) => {
            return (
                <Todo
                    key={todo.id}
                    todo={todo}
                    number={getPosition(todo.index, todo.level)}
                    handleDelete={handleDelete}
                    handleCheckmark={handleCheckmark}
                    handleUpdate={handleUpdate}
                    handleNewLine={handleNewLine}
                    handleTab={handleTab}
                    handleShiftTab={handleShiftTab}
                />
            )
        })}

        <TextForm 
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            type={'task'}
        />
    </div>
  )
}

export default TodoList