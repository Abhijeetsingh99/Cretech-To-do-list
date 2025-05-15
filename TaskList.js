import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract fetchTasks so it can be used by both useEffect and TaskForm
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data || []); // Ensure it's always an array
      setError(null);
    } catch (err) {
      setError(err.message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>To-Do List</h1>
      <TaskForm 
        editingTask={editingTask} 
        setEditingTask={setEditingTask} 
        fetchTasks={fetchTasks} 
      />
      <ul>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{
              borderLeft: `5px solid ${
                task.priority === 'high'
                  ? 'red'
                  : task.priority === 'medium'
                  ? 'orange'
                  : 'green'
              }`,
              margin: '10px 0',
              padding: '10px',
              textDecoration: task.is_completed ? 'line-through' : 'none'
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due: {task.due_date}</p>
            <p>Priority: {task.priority}</p>
            <button onClick={() => setEditingTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;