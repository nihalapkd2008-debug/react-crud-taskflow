
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://localhost:3000/tasks";

  // READ - Fetch all tasks
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  // CREATE - Add a new task
  async function addTask() {
    if (!title.trim()) {
      alert("Please enter a task");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        title: title.trim(),
        completed: false,
      });

      setTasks((previousTasks) => [
        ...previousTasks,
        response.data,
      ]);

      setTitle("");
    } catch (error) {
      console.error("Add task error:", error);
    }
  }

  // UPDATE - Mark task as completed
  async function markCompleted(task) {
    try {
      const response = await axios.patch(
        `${API_URL}/${task.id}`,
        { completed: true }
      );

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === task.id ? response.data : item
        )
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  // DELETE - Remove a task
  async function deleteTask(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);

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

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <span>
              {task.title} -{" "}
              {task.completed ? "Completed" : "Pending"}
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
        ))
      )}
    </div>
  );
}

export default App;
