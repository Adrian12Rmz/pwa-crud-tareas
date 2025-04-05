document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
    // Cargar tareas desde localStorage
    loadTasks();
  
    // Añadir tarea
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskText = taskInput.value.trim();
      if (taskText) {
        addTask(taskText);
        taskInput.value = '';
      }
    });
  
    function addTask(text) {
      const tasks = getTasks();
      tasks.push(text);
      saveTasks(tasks);
      renderTasks();
    }
  
    function deleteTask(index) {
      const tasks = getTasks();
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    }
  
    function renderTasks() {
      taskList.innerHTML = '';
      getTasks().forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${task}
          <button onclick="deleteTask(${index})">🗑️</button>
        `;
        taskList.appendChild(li);
      });
    }
  
    function getTasks() {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    }
  
    function saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    function loadTasks() {
      renderTasks();
    }
  
    // Hacerla accesible globalmente para los botones de delete
    window.deleteTask = deleteTask;
  });