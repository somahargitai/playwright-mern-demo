const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// In-memory todos array
let todos = [
  {
    id: uuidv4(),
    text: 'Learn Playwright',
    completed: false
  },
  {
    id: uuidv4(),
    text: 'Build MERN application',
    completed: false
  }
];

// Routes

// root hello world
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/welcome.html');
});

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET a single todo by ID
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === req.params.id);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  res.json(todo);
});

// POST - Create a new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  
  const newTodo = {
    id: uuidv4(),
    text,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT - Update a todo
app.put('/api/todos/:id', (req, res) => {
  const { text, completed } = req.body;
  const todoIndex = todos.findIndex(todo => todo.id === req.params.id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  // Update only provided fields
  if (text !== undefined) {
    todos[todoIndex].text = text;
  }
  
  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }
  
  res.json(todos[todoIndex]);
});

// DELETE - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(todo => todo.id === req.params.id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  const deletedTodo = todos[todoIndex];
  todos = todos.filter(todo => todo.id !== req.params.id);
  
  res.json(deletedTodo);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

