import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = ({ editingTask, setEditingTask, fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(new Date());

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setDueDate(editingTask.due_date ? new Date(editingTask.due_date) : new Date());
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      priority,
      due_date: dueDate.toISOString().split('T')[0]
    };

    if (editingTask) {
      await axios.put(`http://localhost:5000/tasks/${editingTask.id}`, {
        ...taskData,
        is_completed: editingTask.is_completed || false
      });
    } else {
      await axios.post('http://localhost:5000/tasks', taskData);
    }

    resetForm();
    fetchTasks();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(new Date());
    setEditingTask(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>
      <div>
        <label>Priority:</label>
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Due Date:</label>
        <DatePicker 
          selected={dueDate} 
          onChange={(date) => setDueDate(date)} 
        />
      </div>
      <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
      {editingTask && <button type="button" onClick={resetForm}>Cancel</button>}
    </form>
  );
};

export default TaskForm;