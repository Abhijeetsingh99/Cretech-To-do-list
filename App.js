import React from 'react';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Todo App</h1>
      </header>
      <TaskList />
    </div>
  );
}

export default App;

