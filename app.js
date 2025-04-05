document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const submitBtn = document.getElementById('submit-btn');
  
  let editMode = false;
  let currentTaskId = null;

  // Cargar tareas al iniciar
  loadTasks();

  // Manejar envío del formulario
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    
    if (taskText) {
      if (editMode) {
        updateTask(currentTaskId, taskText);
        exitEditMode();
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
    taskInput.focus();
    
    editMode = true;
    currentTaskId = id;
    submitBtn.textContent = '✏️ Actualizar';
    
    // Resaltar tarea en edición
    const allTasks = document.querySelectorAll('#task-list li');
    allTasks.forEach(taskEl => {
      if (parseInt(taskEl.dataset.id) === id) {
        taskEl.classList.add('editing');
      } else {
        taskEl.classList.remove('editing');
      }
    });
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
    if (confirm('¿Eliminar esta tarea?')) {
      const tasks = getTasks().filter(task => task.id !== id);
      saveTasks(tasks);
      renderTasks();
      if (editMode && id === currentTaskId) exitEditMode();
    }
  }

  // Salir del modo edición
  function exitEditMode() {
    editMode = false;
    currentTaskId = null;
    submitBtn.textContent = '➕ Añadir';
    document.querySelectorAll('#task-list li').forEach(li => {
      li.classList.remove('editing');
    });
  }

  // Renderizar tareas
  function renderTasks() {
    taskList.innerHTML = '';
    getTasks().forEach(task => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      li.innerHTML = `
        <span>${task.text}</span>
        <div class="task-actions">
          <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
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
   
