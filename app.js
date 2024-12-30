const translations = {
    en: {
        title: 'Enhanced Todo List',
        addBtn: 'Add Task',
        inputPlaceholder: 'Task title',
        descriptionPlaceholder: 'Task description (optional)',
        deleteBtn: 'Delete',
        editBtn: 'Edit',
        all: 'All',
        active: 'Active',
        completed: 'Completed',
        overdue: 'Overdue',
        total: 'Total',
        totalTasks: 'Total Tasks',
        completedTasks: 'Completed',
        pendingTasks: 'Pending',
        overdueTasks: 'Overdue',
        emptyState: 'No tasks yet. Add one to get started!',
        searchPlaceholder: 'Search tasks...',
        priority: {
            low: 'Low',
            medium: 'Medium',
            high: 'High'
        },
        sort: {
            date: 'Date',
            priority: 'Priority',
            alphabetical: 'A-Z'
        }
    },
    ar: {
        title: 'قائمة المهام المحسنة',
        addBtn: 'أضف مهمة',
        inputPlaceholder: 'عنوان المهمة',
        descriptionPlaceholder: 'وصف المهمة (اختياري)',
        deleteBtn: 'حذف',
        editBtn: 'تعديل',
        all: 'الكل',
        active: 'نشط',
        completed: 'مكتمل',
        overdue: 'متأخر',
        total: 'المجموع',
        totalTasks: 'مجموع المهام',
        completedTasks: 'مكتملة',
        pendingTasks: 'معلقة',
        overdueTasks: 'متأخرة',
        emptyState: 'لا توجد مهام بعد. أضف مهمة للبدء!',
        searchPlaceholder: 'البحث في المهام...',
        priority: {
            low: 'منخفض',
            medium: 'متوسط',
            high: 'مرتفع'
        },
        sort: {
            date: 'التاريخ',
            priority: 'الأولوية',
            alphabetical: 'أ-ي'
        }
    },
    es: {
        title: 'Lista de Tareas Mejorada',
        addBtn: 'Agregar Tarea',
        inputPlaceholder: 'Título de la tarea',
        descriptionPlaceholder: 'Descripción de la tarea (opcional)',
        deleteBtn: 'Eliminar',
        editBtn: 'Editar',
        all: 'Todas',
        active: 'Activas',
        completed: 'Completadas',
        overdue: 'Vencidas',
        total: 'Total',
        totalTasks: 'Tareas Totales',
        completedTasks: 'Completadas',
        pendingTasks: 'Pendientes',
        overdueTasks: 'Vencidas',
        emptyState: '¡No hay tareas aún. Agrega una para comenzar!',
        searchPlaceholder: 'Buscar tareas...',
        priority: {
            low: 'Baja',
            medium: 'Media',
            high: 'Alta'
        },
        sort: {
            date: 'Fecha',
            priority: 'Prioridad',
            alphabetical: 'A-Z'
        }
    }
};

const tips = [
    "Use high priority for urgent tasks due today",
    "Break large tasks into smaller, manageable ones",
    "Set realistic due dates to stay organized",
    "Regular updates help track progress effectively",
    "Use descriptions for important task details",
    "Review completed tasks for productivity insights",
    "Sort by priority during busy periods",
    "Check overdue tasks section regularly",
    "Use search to find specific tasks quickly",
    "Update task status as you make progress"
];

function showRandomTip() {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('loadingTip').textContent = tip;
}

// Update loading screen logic
document.addEventListener('DOMContentLoaded', () => {
    showRandomTip();
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3000);
});

let currentLang = 'en';
let currentFilter = 'all';
let currentSort = 'date';
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function updateLanguage(lang) {
    document.title = translations[lang].title;
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('todoInput').placeholder = translations[lang].inputPlaceholder;
    document.getElementById('todoDescription').placeholder = translations[lang].descriptionPlaceholder;
    document.getElementById('searchInput').placeholder = translations[lang].searchPlaceholder;
    document.getElementById('addBtn').textContent = translations[lang].addBtn;
    document.getElementById('totalLabel').textContent = translations[lang].totalTasks;
    document.getElementById('completedLabel').textContent = translations[lang].completedTasks;
    document.getElementById('pendingLabel').textContent = translations[lang].pendingTasks;
    document.getElementById('overdueLabel').textContent = translations[lang].overdueTasks;
    
    document.querySelectorAll('.filter-btn').forEach((btn, index) => {
        const filters = ['all', 'active', 'completed', 'overdue'];
        btn.textContent = translations[lang][filters[index]];
    });
    
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    renderTodos();
}

function updateStats() {
    const now = new Date();
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(todo => {
        const dueDate = new Date(todo.dueDate);
        return !todo.completed && dueDate < now;
    }).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('overdueTasks').textContent = overdue;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateStats();
}

function getFilteredTodos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let filtered = todos;

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(todo => 
            todo.text.toLowerCase().includes(searchTerm) ||
            todo.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply status filter
    switch(currentFilter) {
        case 'active':
            filtered = filtered.filter(todo => !todo.completed);
            break;
        case 'completed':
            filtered = filtered.filter(todo => todo.completed);
            break;
        case 'overdue':
            const now = new Date();
            filtered = filtered.filter(todo => 
                !todo.completed && new Date(todo.dueDate) < now
            );
            break;
    }

    // Apply sorting
    switch(currentSort) {
        case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'alphabetical':
            filtered.sort((a, b) => a.text.localeCompare(b.text));
            break;
        case 'date':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    return filtered;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang, options);
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                ${translations[currentLang].emptyState}
            </div>
        `;
        return;
    }

    todoList.innerHTML = '';
    
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const dueDate = new Date(todo.dueDate);
        const isOverdue = !todo.completed && dueDate < new Date();
        
        todoItem.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-text">${todo.text}</div>
                ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                <div class="todo-meta">
                    <span>Created: ${formatDate(todo.createdAt)}</span>
                    <span style="color: ${isOverdue ? 'var(--error)' : 'inherit'}">
                        Due: ${formatDate(todo.dueDate)}
                    </span>
                </div>
            </div>
            <span class="priority ${todo.priority}">
                ${translations[currentLang].priority[todo.priority]}
            </span>
            <div class="todo-actions">
                <button class="edit-btn">${translations[currentLang].editBtn}</button>
                <button class="delete-btn">${translations[currentLang].deleteBtn}</button>
            </div>
        `;
        
        const checkbox = todoItem.querySelector('input');
        checkbox.addEventListener('change', () => {
            const index = todos.findIndex(t => t.id === todo.id);
            todos[index].completed = checkbox.checked;
            todoItem.classList.toggle('completed');
            saveTodos();
        });
        
        const editBtn = todoItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const index = todos.findIndex(t => t.id === todo.id);
            document.getElementById('todoInput').value = todo.text;
            document.getElementById('todoDescription').value = todo.description;
            document.getElementById('priority').value = todo.priority;
            document.getElementById('dueDate').value = todo.dueDate;
            todos.splice(index, 1);
            renderTodos();
            saveTodos();
        });
        
        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const index = todos.findIndex(t => t.id === todo.id);
            todoItem.classList.add('deleting');
            setTimeout(() => {
                todos.splice(index, 1);
                renderTodos();
                saveTodos();
            }, 400);
        });
        
        todoList.appendChild(todoItem);
    });
}

// Event Listeners
document.getElementById('language').addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateLanguage(currentLang);
});

document.getElementById('sortBy').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTodos();
});

document.getElementById('searchInput').addEventListener('input', renderTodos);

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

document.getElementById('addBtn').addEventListener('click', () => {
    const input = document.getElementById('todoInput');
    const description = document.getElementById('todoDescription');
    const dueDate = document.getElementById('dueDate');
    const text = input.value.trim();
    const priority = document.getElementById('priority').value;
    
    if (text) {
        todos.push({
            id: Date.now(),
            text,
            description: description.value.trim(),
            completed: false,
            priority,
            dueDate: dueDate.value || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        });
        input.value = '';
        description.value = '';
        dueDate.value = '';
        renderTodos();
        saveTodos();
    }
});

document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('addBtn').click();
    }
});

// Initial render
updateLanguage(currentLang);
updateStats();

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2000);
});