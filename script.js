class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.theme = this.loadTheme();
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.themeToggle = document.getElementById('themeToggle');
        
        this.initTheme();
        this.initEventListeners();
        this.displayTasks();
        this.updateTaskCount();
    }

    initTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.themeToggle.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }

    initEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        this.clearAllBtn.addEventListener('click', () => this.deleteAllTasks());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        this.themeToggle.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        this.saveTheme();
        
        // Add a subtle animation to the theme toggle
        this.themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 200);
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            this.shakeInput();
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.displayTasks();
        this.updateTaskCount();
        this.taskInput.value = '';
        this.taskInput.focus();
        
        // Add success animation to add button
        this.addBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.addBtn.style.transform = '';
        }, 150);
    }

    shakeInput() {
        this.taskInput.style.animation = 'shake 0.5s ease-in-out';
        this.taskInput.style.borderColor = 'var(--danger)';
        setTimeout(() => {
            this.taskInput.style.animation = '';
            this.taskInput.style.borderColor = '';
        }, 500);
    }

    displayTasks() {
        this.taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            this.taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one above! ✨</div>';
            return;
        }

        this.tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.style.animationDelay = `${index * 0.1}s`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="todoApp.toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">Delete</button>
            `;
            this.taskList.appendChild(taskItem);
        });
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.displayTasks();
            this.updateTaskCount();
        }
    }

    deleteTask(taskId) {
        const taskElement = event.target.closest('.task-item');
        taskElement.classList.add('removing');
        
        setTimeout(() => {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.displayTasks();
            this.updateTaskCount();
        }, 400);
    }

    deleteAllTasks() {
        if (this.tasks.length === 0) return;
        
        if (confirm('Are you sure you want to delete all tasks?')) {
            // Add staggered removal animation
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('removing');
                }, index * 100);
            });
            
            setTimeout(() => {
                this.tasks = [];
                this.saveTasks();
                this.displayTasks();
                this.updateTaskCount();
            }, taskItems.length * 100 + 400);
        }
    }

    updateTaskCount() {
        const remainingTasks = this.tasks.filter(task => !task.completed).length;
        const totalTasks = this.tasks.length;
        
        if (totalTasks === 0) {
            this.taskCount.textContent = 'No tasks';
        } else if (remainingTasks === 0) {
            this.taskCount.textContent = 'All tasks completed! 🎉';
        } else {
            this.taskCount.textContent = `${remainingTasks} of ${totalTasks} tasks remaining`;
        }
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveTheme() {
        localStorage.setItem('todoTheme', this.theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('todoTheme');
        if (savedTheme) return savedTheme;
        
        // Check user's system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

// Initialize the app when the page loads
const todoApp = new TodoApp();
