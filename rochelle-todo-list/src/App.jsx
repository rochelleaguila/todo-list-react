import { useState, useEffect } from 'react';
import './App.css';

function TodoItem({ label, is_done, delete_todo, toggle_todo }) {
  return (
    <div className="todo-item">
      <input type="checkbox" checked={is_done} onChange={toggle_todo} />
      <span className="todo-text">{label}</span>
      <button type="button" className="btn btn-danger" onClick={delete_todo}>
        Delete
      </button>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');

  // useEffect(() => {
  //   const local_todos = localStorage.getItem('todos');
  //   if (local_todos) {
  //     setTodos(JSON.parse(local_todos));
  //   }
  // }, []);

  // useEffect(() => {
  //   if (todos.length) {
  //     localStorage.setItem('todos', JSON.stringify(todos));
  //   }
  // }, [todos]);

  useEffect(() => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/rochelle')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          setTodos([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleTaskDelete = (idx) => {
    const updatedTodos = todos.filter((_, i) => i !== idx);
    setTodos(updatedTodos);
    updateTasksOnServer(updatedTodos);
  };

  const updateTasksOnServer = (updatedTasks) => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/rochelle', {
      method: 'PUT',
      body: JSON.stringify(updatedTasks), 
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos(updatedTasks)
      })
      .catch((error) => {
        console.error('Error updating tasks:', error);
      });
  };

  const clearAllTasksOnServer = () => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/rochelle', {
      method: 'PUT',
      body: JSON.stringify([{label: "Empty Task", done: false}]), // Send an empty array to clear all tasks
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setTodos([]); // Clears the local state on successful deletion
        } else {
          console.error('Failed to clear tasks on the server');
        }
      })
      .catch((error) => {
        console.error('Error clearing tasks:', error);
      });
  };

  return (
    <>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (todoInput.length > 0) {
            const newTask = {
              label: todoInput,
              done: false,
            };
            const updatedTasks = [newTask, ...todos];
            setTodos(updatedTasks);
            setTodoInput('');
            updateTasksOnServer(updatedTasks);
          }
        }}
        className="container d-flex flex-column align-items-center justify-content-start"
      >
        <h1>Todo List</h1>
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="What needs to get done?"
          aria-label="todo list input field"
          value={todoInput}
          onChange={(ev) => setTodoInput(ev.target.value)}
        ></input>
        {Array.isArray(todos) && todos.length > 0 ? (
          todos.map((item, idx) => (
            <TodoItem
              key={idx}
              label={item.label}
              is_done={item.is_done}
              toggle_todo={() =>
                setTodos(
                  todos.map((todo, i) =>
                    i === idx ? { ...todo, is_done: !todo.is_done } : todo
                  )
                )
              }
              delete_todo={() => handleTaskDelete(idx)}
            />
          ))
        ) : (
          <p>No tasks? Add a task.</p>
        )}
        <small>
          {todos.filter((item) => !item.is_done).length} todos left to do!
        </small>
        <button type="button" onClick={clearAllTasksOnServer}>
          Clear All Tasks
        </button>
      </form>
    </>
  );
}

export default App;






