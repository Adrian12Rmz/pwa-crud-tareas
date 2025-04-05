document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  let editMode = false;
  let currentTaskId = null;

  // Cargar tareas al iniciar
  loadTasks();

  // Evento para añadir/editar tarea
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    
    if (taskText) {
      if (editMode) {
        updateTask(currentTaskId, taskText);
        editMode = false;
        currentTaskId = null;
        taskForm.querySelector('button[type="submit"]').textContent = '➕ Añadir';
      } else {
        addTask(taskText);
      }
      taskInput.value = '';
    }
  });

  // Añadir tarea
  function addTask(text) {
    const tasks = getTasks();
    const newTask = {
      id: Date.now(),
      text: text
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
  }

  // Editar tarea
  function editTask(id) {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === id);
    taskInput.value = task.text;
    editMode = true;
    currentTaskId = id;
    taskForm.querySelector('button[type="submit"]').textContent = '✏️ Actualizar';
    taskInput.focus();
  }

  // Actualizar tarea
  function updateTask(id, newText) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].text = newText;
    saveTasks(tasks);
    renderTasks();
  }

  // Eliminar tarea
  function deleteTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
    renderTasks();
  }

  // Renderizar tareas
  function renderTasks() {
    taskList.innerHTML = '';
    getTasks().forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${task.text}</span>
        <div>
          <button onclick="editTask(${task.id})">✏️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  // Obtener tareas de localStorage
  function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  // Guardar tareas en localStorage
  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Cargar tareas
  function loadTasks() {
    renderTasks();
  }

  // Hacer funciones accesibles globalmente
  window.editTask = editTask;
  window.deleteTask = deleteTask;
});
