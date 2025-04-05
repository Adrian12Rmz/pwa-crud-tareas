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
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    alert('Tarea añadida correctamente');
  }

  // Editar tarea
  function editTask(id) {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === id);
    
    if (task) {
      taskInput.value = task.text;
      taskInput.focus();
      editMode = true;
      currentTaskId = id;
      submitBtn.textContent = '✏️ Actualizar';
      highlightTask(id);
    }
  }

  // Actualizar tarea
  function updateTask(id, newText) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].text = newText;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      saveTasks(tasks);
      renderTasks();
      alert('Tarea actualizada correctamente');
    }
  }

  // Eliminar tarea
  function deleteTask(id) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      const tasks = getTasks().filter(task => task.id !== id);
      saveTasks(tasks);
      renderTasks();
      if (editMode && id === currentTaskId) exitEditMode();
      alert('Tarea eliminada correctamente');
    }
  }

  // Marcar tarea como completada
  function toggleComplete(id) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks(tasks);
      renderTasks();
    }
  }

  // Resaltar tarea en edición
  function highlightTask(id) {
    document.querySelectorAll('#task-list
