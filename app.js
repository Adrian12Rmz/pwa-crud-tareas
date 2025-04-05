// Configuración inicial
const DB_NAME = 'tasks-db-v3';
let editMode = false;
let currentTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const submitBtn = document.getElementById('submit-btn');

  // Cargar tareas al iniciar
  loadTasks();

  // Manejar formulario
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

  // Funciones CRUD
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
    showToast('Tarea añadida');
  }

  function editTask(id) {
    const task = getTasks().find(t => t.id === id);
    if (task) {
      taskInput.value = task.text;
      editMode = true;
      currentTaskId = id;
      submitBtn.textContent = '🔄 Actualizar';
      highlightTask(id);
    }
  }

  function updateTask(id, newText) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].text = newText;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      saveTasks(tasks);
      renderTasks();
      showToast('Tarea actualizada');
    }
  }

  function deleteTask(id) {
    if (confirm('¿Eliminar esta tarea?')) {
      const tasks = getTasks().filter(t => t.id !== id);
      saveTasks(tasks);
      renderTasks();
      if (editMode && id === currentTaskId) exitEditMode();
      showToast('Tarea eliminada');
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

  // Helpers
  function getTasks() {
    return JSON.parse(localStorage.getItem(DB_NAME)) || [];
  }

  function saveTasks(tasks) {
    localStorage.setItem(DB_NAME, JSON.stringify(tasks));
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }
  }

  function renderTasks() {
    taskList.innerHTML = '';
    const tasks = getTasks();
    
    if (tasks.length === 0) {
      taskList.innerHTML = '<p class="empty">No hay tareas</p>';
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      li.className = task.completed ? 'completed' : '';
      
      li.innerHTML = `
        <div class="task-content">
          <input type="checkbox" ${task.completed ? 'checked' : ''} 
                 onchange="toggleComplete(${task.id})">
          <span>${task.text}</span>
        </div>
        <div class="task-actions">
          <button onclick="editTask(${task.id})">✏️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
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
    
    setTimeout(() => toast.remove(), 2000);
  }

  // Hacer funciones globales
  window.editTask = editTask;
  window.deleteTask = deleteTask;
  window.toggleComplete = toggleComplete;
});
