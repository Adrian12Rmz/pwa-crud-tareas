// Configuración inicial
const DB_NAME = 'pwa-tasks-db-v2';
let editMode = false;
let currentTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const submitBtn = document.getElementById('submit-btn');

  // Cargar tareas al iniciar
  loadTasks();

  // Manejar envío del formulario
  taskForm.addEventListener('submit', handleSubmit);

  // Funciones CRUD
  function handleSubmit(e) {
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
      taskInput.focus();
    }
  }

  function addTask(text) {
    const tasks = getTasks();
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    showToast('Tarea añadida ✅');
  }

  function editTask(id) {
    const task = getTasks().find(t => t.id === id);
    if (task) {
      taskInput.value = task.text;
      editMode = true;
      currentTaskId = id;
      submitBtn.textContent = '✏️ Actualizar';
      highlightTask(id);
      taskInput.focus();
    }
  }

  function updateTask(id, newText) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = { 
        ...tasks[taskIndex], 
        text: newText,
        updatedAt: new Date().toISOString()
      };
      saveTasks(tasks);
      renderTasks();
      showToast('Tarea actualizada ✏️');
    }
  }

  function deleteTask(id) {
    if (confirm('¿Eliminar esta tarea permanentemente?')) {
      const tasks = getTasks().filter(t => t.id !== id);
      saveTasks(tasks);
      renderTasks();
      if (editMode && id === currentTaskId) exitEditMode();
      showToast('Tarea eliminada 🗑️');
    }
  }

  function toggleComplete(id) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks(tasks);
      renderTasks();
    }
  }

  // Helper functions
  function getTasks() {
    const tasks = localStorage.getItem(DB_NAME);
    return tasks ? JSON.parse(tasks) : [];
  }

  function saveTasks(tasks) {
    localStorage.setItem(DB_NAME, JSON.stringify(tasks));
    // Solicitar persistencia
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }
  }

  function renderTasks() {
    const tasks = getTasks();
    taskList.innerHTML = tasks.length === 0 
      ? '<p class="empty-message">No hay tareas. ¡Agrega una!</p>'
      : tasks.map(task => `
          <li data-id="${task.id}" class="${task.completed ? 'completed' : ''}">
            <div class="task-content">
              <input type="checkbox" ${task.completed ? 'checked' : ''} 
                     onchange="toggleComplete(${task.id})">
              <span>${task.text}</span>
            </div>
            <div class="task-actions">
              <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
              <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
            </div>
          </li>
        `).join('');
  }

  function highlightTask(id) {
    document.querySelectorAll('#task-list li').forEach(li => {
      li.classList.toggle('editing', parseInt(li.dataset.id) === id);
    });
  }

  function exitEditMode() {
    editMode = false;
    currentTaskId = null;
    submitBtn.textContent = '➕ Añadir';
    document.querySelectorAll('#task-list li').forEach(li => {
      li.classList.remove('editing');
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }, 100);
  }

  // Hacer funciones globales
  window.editTask = editTask;
  window.deleteTask = deleteTask;
  window.toggleComplete = toggleComplete;
});
