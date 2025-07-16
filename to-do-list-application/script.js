const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((taskObj, index) => createTask(taskObj.text, taskObj.done, index));
}

function createTask(taskText, isDone = false, index = tasks.length) {
  const li = document.createElement("li");
  li.className = "task-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isDone;

  const label = document.createElement("span");
  label.className = "task-label";
  label.textContent = taskText;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "action-btn";
  editBtn.innerHTML = "✏️";
  editBtn.title = "Edit Task";

  const saveBtn = document.createElement("button");
  saveBtn.className = "action-btn";
  saveBtn.innerHTML = "💾";
  saveBtn.title = "Save Task";
  saveBtn.style.display = "none";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "action-btn";
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.title = "Delete Task";

  checkbox.addEventListener("change", () => {
    li.classList.toggle("task-done", checkbox.checked);
    tasks[index].done = checkbox.checked;
    saveTasks();
  });

  editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = label.textContent;
    input.className = "task-edit-input";

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit(input.value);
      }
    });

    const saveEdit = (newText) => {
      if (newText.trim() !== "") {
        label.textContent = newText.trim();
        tasks[index].text = newText.trim();
        saveTasks();
        li.replaceChild(label, input);
        saveBtn.style.display = "none";
        editBtn.style.display = "inline-block";
      }
    };

    saveBtn.addEventListener("click", () => saveEdit(input.value));

    li.replaceChild(input, label);
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    input.focus();
  });

  deleteBtn.addEventListener("click", () => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });

  actions.appendChild(editBtn);
  actions.appendChild(saveBtn);
  actions.appendChild(deleteBtn);

  if (isDone) li.classList.add("task-done");

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(actions);

  taskList.appendChild(li);
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const newTask = { text: taskText, done: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

// Initial render
renderTasks();
