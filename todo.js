document.addEventListener('DOMContentLoaded', function() {
    // Загрузка задач из localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Элементы DOM
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskPriority = document.getElementById('task-priority');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const deleteSelectedBtn = document.getElementById('delete-selected');
    const sortDateBtn = document.getElementById('sort-date');
    const sortPriorityBtn = document.getElementById('sort-priority');
    const filterRadios = document.querySelectorAll('input[name="filter"]');
    
    // Отображение задач
    function renderTasks() {
        todoList.innerHTML = '';
        
        // Фильтрация
        const filterValue = document.querySelector('input[name="filter"]:checked').value;
        let filteredTasks = filterValue === 'all' ? tasks : tasks.filter(task => task.priority === filterValue);
        
        // Отрисовка
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
            li.dataset.index = index;
            
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <span class="task-date">${task.date}</span>
                    <span class="task-priority">${getPriorityLabel(task.priority)}</span>
                </div>
                <div class="task-actions">
                    <button class="move-up">↑</button>
                    <button class="move-down">↓</button>
                    <button class="delete-btn">×</button>
                </div>
            `;
            
            todoList.appendChild(li);
        });
    }
    
    // Добавление задачи
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    function addTask() {
        const text = taskInput.value.trim();
        const date = taskDate.value || new Date().toISOString().split('T')[0];
        const priority = taskPriority.value;
        
        if (text) {
            tasks.push({
                text,
                date,
                priority,
                completed: false
            });
            
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    }
    
    // Обработчики событий
    todoList.addEventListener('click', function(e) {
        const li = e.target.closest('li');
        if (!li) return;
        const index = parseInt(li.dataset.index);
        
        // Удаление
        if (e.target.classList.contains('delete-btn')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
        // Отметка выполнения
        else if (e.target.classList.contains('task-checkbox')) {
            tasks[index].completed = e.target.checked;
            saveTasks();
            renderTasks();
        }
        // Перемещение вверх
        else if (e.target.classList.contains('move-up') && index > 0) {
            [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
            saveTasks();
            renderTasks();
        }
        // Перемещение вниз
        else if (e.target.classList.contains('move-down') && index < tasks.length - 1) {
            [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
            saveTasks();
            renderTasks();
        }
    });
    
    // Удаление выделенных
    deleteSelectedBtn.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.task-checkbox:checked');
        const indexes = Array.from(checkboxes).map(cb => 
            parseInt(cb.closest('li').dataset.index));
        
        // Удаляем в обратном порядке
        indexes.sort((a, b) => b - a).forEach(i => tasks.splice(i, 1));
        saveTasks();
        renderTasks();
    });
    
    // Сортировка
    sortDateBtn.addEventListener('click', function() {
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        saveTasks();
        renderTasks();
    });
    
    sortPriorityBtn.addEventListener('click', function() {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        saveTasks();
        renderTasks();
    });
    
    // Фильтрация
    filterRadios.forEach(radio => {
        radio.addEventListener('change', renderTasks);
    });
    
    // Вспомогательные функции
    function getPriorityLabel(priority) {
        const labels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
        return labels[priority];
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Первоначальная отрисовка
    renderTasks();
});