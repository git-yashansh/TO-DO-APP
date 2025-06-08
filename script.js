class TodoApp {
    constructor() {
        // get all elements from DOM
        this.inpt = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.taskInfo = document.getElementById('taskCount');
        this.clearBtn = document.getElementById('clearAllBtn');
        this.themeBtn = document.getElementById('themeToggle');

        // load data
        this.tasks = this.loadTaskss();
        this.currTheme = this.getTheme();

        // setup app
        this.setTheme();
        this.addEvents();
        this.showTasks();
        this.updateTaskInfo();
    }

    setTheme() {
        document.documentElement.setAttribute('data-theme', this.currTheme);
        this.themeBtn.textContent = this.currTheme === 'dark' ? '☀️' : '🌙';
    }

    addEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());

        this.inpt.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        this.clearBtn.addEventListener('click', () => this.removeAll());

        this.themeBtn.addEventListener('click', () => this.changeTheme());
    }

    changeTheme() {
        this.currTheme = this.currTheme === 'light' ? 'dark' : 'light';
        this.setTheme();
        this.saveTheme();

        this.themeBtn.style.transform = 'scale(0.8) rotate(180deg)';
        setTimeout(() => {
            this.themeBtn.style.transform = '';
        }, 200);
    }

    addTask() {
        const text = this.inpt.value.trim();

        if (!text) {
            this.shakeInpt();
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.showTasks();
        this.updateTaskInfo();

        this.inpt.value = '';
        this.inpt.focus();

        this.addBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.addBtn.style.transform = '';
        }, 150);
    }

    shakeInpt() {
        this.inpt.style.animation = 'shake 0.5s';
        this.inpt.style.borderColor = 'red';
        setTimeout(() => {
            this.inpt.style.animation = '';
            this.inpt.style.borderColor = '';
        }, 500);
    }

    showTasks() {
        this.taskList.innerHTML = '';

        if (this.tasks.length == 0) {
            this.taskList.innerHTML = `<div class="empty-state">No tasks yet. Add one pls 😅</div>`;
            return;
        }

        this.tasks.forEach((t, i) => {
            const li = document.createElement('li');
            li.className = `task-item ${t.completed ? 'completed' : ''}`;
            li.style.animationDelay = `${i * 0.1}s`;

            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''}
                    onchange="todoApp.toggleDone(${t.id})">
                <span class="task-text">${t.text}</span>
                <button class="delete-btn" onclick="todoApp.deleteTask(${t.id})">Delete</button>
            `;

            this.taskList.appendChild(li);
        });
    }

    toggleDone(id) {
        const t = this.tasks.find(x => x.id === id);
        if (t) {
            t.completed = !t.completed;
            this.saveTasks();
            this.showTasks();
            this.updateTaskInfo();
        }
    }

    deleteTask(id) {
        const el = event.target.closest('.task-item');
        el.classList.add('removing');

        setTimeout(() => {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.showTasks();
            this.updateTaskInfo();
        }, 400);
    }

    removeAll() {
        if (!this.tasks.length) return;

        if (confirm('Sure to delete all tasks??')) {
            const items = document.querySelectorAll('.task-item');
            items.forEach((el, i) => {
                setTimeout(() => el.classList.add('removing'), i * 100);
            });

            setTimeout(() => {
                this.tasks = [];
                this.saveTasks();
                this.showTasks();
                this.updateTaskInfo();
            }, items.length * 100 + 400);
        }
    }

    updateTaskInfo() {
        const total = this.tasks.length;
        const left = this.tasks.filter(t => !t.completed).length;

        if (total === 0) {
            this.taskInfo.textContent = 'No task availble';
        } else if (left === 0) {
            this.taskInfo.textContent = 'All done bro! 🎉';
        } else {
            this.taskInfo.textContent = `${left} of ${total} still left`;
        }
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTaskss() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveTheme() {
        localStorage.setItem('todoTheme', this.currTheme);
    }

    getTheme() {
        const theme = localStorage.getItem('todoTheme');
        if (theme) return theme;

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

// start it 🚀
const todoApp = new TodoApp();
