import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

// Import pages
import { HomePage, TodosPage, AboutPage, NotFoundPage } from "./pages";

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch todos when the app starts
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch todos. Please try again later.");
      console.error("Error fetching todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (text) => {
    try {
      const response = await axios.post("/api/todos", {
        text,
        completed: false,
      });
      setTodos([...todos, response.data]);
    } catch (err) {
      setError("Failed to add todo. Please try again.");
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      };
      await axios.put(`/api/todos/${id}`, updatedTodo);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError("Failed to update todo. Please try again.");
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <img src="/icons/logo.svg" alt="Todo App Logo" className="app-logo" />
          <h1>Todo App</h1>
        </div>
        <nav className="app-navigation">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
                data-testid="nav-home"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/todos"
                className={({ isActive }) => (isActive ? "active" : "")}
                data-testid="nav-todos"
              >
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
                data-testid="nav-about"
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage todos={todos} />} />
          <Route
            path="/todos"
            element={
              <TodosPage
                todos={todos}
                isLoading={isLoading}
                error={error}
                addTodo={addTodo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer>
        <p>
          Playwright MERN Demo •{" "}
          <a href="https://github.com/somahargitai/playwright-mern-demo">
            GitHub
          </a>{" "}
          • Current path: {location.pathname}
        </p>
      </footer>
    </div>
  );
}

export default App;
