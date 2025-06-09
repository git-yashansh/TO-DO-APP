// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const sortBtn = document.getElementById('sortBtn');
const themeToggle = document.getElementById('themeToggle');
const emptyState = document.getElementById('emptyState');
const completedState = document.getElementById('completedState');
const currentTimeEl = document.getElementById('currentTime');
const timerDisplay = document.getElementById('timerDisplay');
const timerLabel = document.getElementById('timerLabel');
const startTimer = document.getElementById('startTimer');
const pauseTimer = document.getElementById('pauseTimer');
const resetTimer = document.getElementById('resetTimer');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const achievementBadge = document.getElementById('achievementBadge');
const motivationQuote = document.getElementById('motivationQuote');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const completeSound = document.getElementById('completeSound');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskTemplate = document.getElementById('taskTemplate');

// App State
let tasks = [];
let currentFilter = 'all';
let timerInterval = null;
let timerTime = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;
let isBreakTime = false;
let achievements = {
  firstTask: false,
  fiveTasksCompleted: false,
  allTasksCompleted: false
};

// Motivational Quotes
const quotes = [
  '"Shuruaat karne ka tareeka hai baatein chhod ke kaam shuru karna, dost." - Walt Disney',
  '"Yeh hamesha mushkil lagta hai jab tak yeh poora na ho jaye, yaar." - Nelson Mandela',
  '"Ghadi ko mat dekho, jaise wo chalti hai waise hi tum bhi chalte raho, dost." - Sam Levenson',
  '"Yaqeen karo ki tum kar sakte ho, bas aadha raasta tay kar liya hai." - Theodore Roosevelt',
  '"Kabhi bhi naye goals set karne ya naye sapne dekhne ke liye umar zyada nahi hoti, yaar." - C.S. Lewis',
  '"Quality koi kaam nahi, yeh aadat hai, dost." - Aristotle',
  '"Aage badhne ka raaz hai shuru karna, yaar." - Mark Twain',
  '"Tumhara waqt limited hai, ise kisi aur ki zindagi jeene mein barbaad mat karo, dost." - Steve Jobs',
  '"Bhavishya is baat par depend karta hai ki tum aaj kya karte ho, yaar." - Mahatma Gandhi',
  '"Badiya kaam karne ka sirf ek hi tareeka hai - jo tum karte ho usse pyaar karo, dost." - Steve Jobs'
];

// Initialize App
function init() {
  loadTasks();
  updateTaskCounts();
  updateTaskList();
  updateProgress();
  setupEventListeners();
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
  displayRandomQuote();
  checkEmptyState();
}

// Event Listeners
function setupEventListeners() {
  // Add task
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Clear tasks
  clearAllBtn.addEventListener('click', clearAllTasks);
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);

  // Sort tasks
  sortBtn.addEventListener('click', sortTasks);

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Filter tasks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      updateTaskList();
      checkEmptyState();
    });
  });

  // Timer controls
  startTimer.addEventListener('click', startPomodoro);
  pauseTimer.addEventListener('click', pausePomodoro);
  resetTimer.addEventListener('click', resetPomodoro);

  // New quote
  newQuoteBtn.addEventListener('click', displayRandomQuote);
}

// Task Functions
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    taskInput.classList.add('shake');
    setTimeout(() => taskInput.classList.remove('shake'), 500);
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    completed: false,
    emoji: getRandomEmoji(),
    date: new Date(),
    priority: 'medium' // low, medium, high
  };

  tasks.push(task);
  saveTasks();
  taskInput.value = '';
  updateTaskList();
  updateTaskCounts();
  updateProgress();
  checkEmptyState();
  
  // Check for first task achievement
  if (!achievements.firstTask) {
    achievements.firstTask = true;
    showAchievement('🎉 First Task Added!');
  }
}

function toggleTaskCompletion(id) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    
    if (tasks[taskIndex].completed) {
      try {
        completeSound.play();
      } catch (error) {
        console.log('Audio play failed:', error);
      }
      
      // Check for achievements
      const completedCount = tasks.filter(task => task.completed).length;
      if (completedCount >= 5 && !achievements.fiveTasksCompleted) {
        achievements.fiveTasksCompleted = true;
        showAchievement('🏆 5 Tasks Completed!');
      }
      
      if (completedCount === tasks.length && tasks.length > 0) {
        if (!achievements.allTasksCompleted) {
          achievements.allTasksCompleted = true;
          showAchievement('🌟 All Tasks Completed!');
        }
      }
    }
    
    saveTasks();
    updateTaskList();
    updateTaskCounts();
    updateProgress();
    checkEmptyState();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  updateTaskList();
  updateTaskCounts();
  updateProgress();
  checkEmptyState();
}

function changePriority(id) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    const priorities = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(tasks[taskIndex].priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    tasks[taskIndex].priority = priorities[nextIndex];
    saveTasks();
    updateTaskList();
  }
}

function editTask(id) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    const task = tasks[taskIndex];
    const newText = prompt('Edit task:', task.text);
    if (newText !== null && newText.trim() !== '') {
      task.text = newText.trim();
      saveTasks();
      updateTaskList();
    }
  }
}

function clearAllTasks() {
  if (tasks.length === 0) return;
  
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    updateTaskList();
    updateTaskCounts();
    updateProgress();
    checkEmptyState();
  }
}

function clearCompletedTasks() {
  const completedCount = tasks.filter(task => task.completed).length;
  if (completedCount === 0) return;
  
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  updateTaskList();
  updateTaskCounts();
  updateProgress();
  checkEmptyState();
}

function sortTasks() {
  // Cycle through sort options: default (by date) -> priority -> alphabetical
  const sortType = sortBtn.dataset.sortType || 'date';
  
  if (sortType === 'date') {
    tasks.sort((a, b) => {
      if (a.priority === 'high') return -1;
      if (b.priority === 'high') return 1;
      if (a.priority === 'medium' && b.priority === 'low') return -1;
      if (a.priority === 'low' && b.priority === 'medium') return 1;
      return 0;
    });
    sortBtn.dataset.sortType = 'priority';
    sortBtn.querySelector('.btn-emoji').textContent = '🔤';
  } else if (sortType === 'priority') {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    sortBtn.dataset.sortType = 'alpha';
    sortBtn.querySelector('.btn-emoji').textContent = '📅';
  } else {
    tasks.sort((a, b) => a.date - b.date);
    sortBtn.dataset.sortType = 'date';
    sortBtn.querySelector('.btn-emoji').textContent = '🔄';
  }
  
  updateTaskList();
}

// UI Update Functions
function updateTaskList() {
  taskList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });
  
  filteredTasks.forEach(task => {
    const taskItem = document.importNode(taskTemplate.content, true).querySelector('.task-item');
    
    // Set task text
    taskItem.querySelector('.task-text').textContent = task.text;
    
    // Set task emoji
    const taskEmoji = taskItem.querySelector('.task-emoji');
    taskEmoji.textContent = task.completed ? '✅' : task.emoji;
    
    // Set task date
    const taskDate = taskItem.querySelector('.task-date');
    taskDate.textContent = `📅 ${formatDate(task.date)}`;
    
    // Set task priority
    const taskPriority = taskItem.querySelector('.task-priority');
    const priorityEmojis = { low: '🟢', medium: '🟡', high: '🔴' };
    taskPriority.textContent = priorityEmojis[task.priority];
    taskPriority.title = `Priority: ${task.priority}`;
    
    // Add completed class if task is completed
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    
    // Add event listeners
    taskItem.querySelector('.task-toggle').addEventListener('click', () => {
      toggleTaskCompletion(task.id);
    });
    
    taskItem.querySelector('.priority-btn').addEventListener('click', () => {
      changePriority(task.id);
    });
    
    taskItem.querySelector('.edit-btn').addEventListener('click', () => {
      editTask(task.id);
    });
    
    taskItem.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTask(task.id);
    });
    
    taskList.appendChild(taskItem);
  });
}

function updateTaskCounts() {
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const activeTasksCount = totalTasks - completedTasksCount;
  
  activeCount.textContent = activeTasksCount;
  completedCount.textContent = completedTasksCount;
}

function updateProgress() {
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  
  if (totalTasks === 0) {
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
  } else {
    const percentage = Math.round((completedTasksCount / totalTasks) * 100);
    progressFill.style.width = `${percentage}%`;
    progressPercent.textContent = `${percentage}%`;
  }
}

function checkEmptyState() {
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });
  
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    completedState.style.display = 'none';
  } else if (filteredTasks.length === 0) {
    emptyState.style.display = 'none';
    completedState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    completedState.style.display = 'none';
  }
}

// Timer Functions
function updateTimerDisplay() {
  const minutes = Math.floor(timerTime / 60);
  const seconds = timerTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startPomodoro() {
  if (isTimerRunning) return;
  
  isTimerRunning = true;
  timerInterval = setInterval(() => {
    timerTime--;
    updateTimerDisplay();
    
    if (timerTime <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      isBreakTime = !isBreakTime;
      
      // Play sound
      try {
        completeSound.play();
      } catch (error) {
        console.log('Audio play failed:', error);
      }
      
      // Show notification
      if (isBreakTime) {
        showAchievement('☕ Break Time!');
        timerTime = 5 * 60; // 5 minute break
        timerLabel.textContent = 'Break Time';
      } else {
        showAchievement('🍅 Focus Time!');
        timerTime = 25 * 60; // 25 minute focus
        timerLabel.textContent = 'Focus Time';
      }
      
      updateTimerDisplay();
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

function resetPomodoro() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerTime = isBreakTime ? 5 * 60 : 25 * 60;
  updateTimerDisplay();
}

// Utility Functions
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
}

function updateCurrentTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString();
}

function formatDate(date) {
  const now = new Date();
  const taskDate = new Date(date);
  
  if (taskDate.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (taskDate.toDateString() === new Date(now - 86400000).toDateString()) {
    return 'Yesterday';
  } else {
    return taskDate.toLocaleDateString();
  }
}

function getRandomEmoji() {
  const emojis = ['📝', '🎯', '💡', '🚀', '⭐', '🔥', '💪', '🎨', '📚', '🎵', '🌟', '✨', '📌', '🔖'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  motivationQuote.textContent = quotes[randomIndex];
  motivationQuote.classList.add('tada');
  setTimeout(() => motivationQuote.classList.remove('tada'), 1000);
}

function showAchievement(message) {
  achievementBadge.querySelector('.achievement-text').textContent = message;
  achievementBadge.style.display = 'flex';
  
  setTimeout(() => {
    achievementBadge.classList.add('fade-out');
    setTimeout(() => {
      achievementBadge.style.display = 'none';
      achievementBadge.classList.remove('fade-out');
    }, 500);
  }, 3000);
}

// Local Storage Functions
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    // Convert date strings back to Date objects
    tasks.forEach(task => {
      task.date = new Date(task.date);
    });
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
