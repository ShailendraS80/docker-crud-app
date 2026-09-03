const API_URL = "/api/todos";

const form = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const todoList = document.getElementById("todoList");

async function loadTodos() {
    const response = await fetch(API_URL);
    const todos = await response.json();

    todoList.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>
                ${todo.title}
                ${todo.completed ? "✅" : ""}
            </span>

            <span>
                <button onclick="toggleTodo(${todo.id}, ${todo.completed})">
                    ${todo.completed ? "Undo" : "Done"}
                </button>

                <button onclick="editTodo(${todo.id}, '${todo.title.replace(/'/g, "\\'")}')">
                    Edit
                </button>

                <button onclick="deleteTodo(${todo.id})">
                    Delete
                </button>
            </span>
        `;

        todoList.appendChild(li);
    });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();

    if (!title) return;

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    titleInput.value = "";

    loadTodos();
});

async function toggleTodo(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: !completed
        })
    });

    loadTodos();
}

async function editTodo(id, oldTitle) {
    const newTitle = prompt("Enter new title:", oldTitle);

    if (!newTitle) return;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle
        })
    });

    loadTodos();
}

async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadTodos();
}

loadTodos();
