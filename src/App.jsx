
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // READ: Fetch all tasks
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  // CREATE: Add a new task
  async function addTask() {
    if (!title.trim()) return;

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();

      setTasks((previousTasks) => [...previousTasks, newTask]);
      setTitle("");
    } catch (error) {
      console.error("Add task error:", error);
    }
  }

  // UPDATE: Mark a task as completed
  async function markCompleted(task) {
    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  // DELETE: Remove a task
  async function deleteTask(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  return (
    <div>
      <h1>TaskFlow</h1>
      <h2>My Tasks</h2>

      <input
        type="text"
        placeholder="Enter a new task"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <button onClick={addTask}>Add Task</button>

      {tasks.map((task) => (
        <div key={task.id}>
          <span>
            {task.title} - {task.completed ? "Completed" : "Pending"}
          </span>

          {!task.completed && (
            <button onClick={() => markCompleted(task)}>
              Mark Completed
            </button>
          )}

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
