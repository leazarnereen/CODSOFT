if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
            alert('Please enable notifications to receive reminders.');
        }
    });
}
const addIcon = document.getElementById('add-icon');
const todoList = document.getElementById('todo-list');
const calendarIcon = document.querySelector('.image[alt="Calendar"]');
const headerBell = document.getElementById('headerBell');
const taskFilter = document.getElementById('taskFilter');
let tasks = [];

window.onload = getfromStorage();

addIcon.addEventListener('click', () => {
    const taskName = prompt("Enter the name of Task:");
    if (taskName) {
        const option = prompt("Do you want to set a reminder (Yes/No)");
        let remainderTime = null;
        console.log(option.toLowerCase());
        if (option.toLowerCase() === "yes") {
            remainderTime = prompt("Set reminder date and time (YYYY-MM-DD HH:MM)");
        }
        const list = add(taskName, false, null, remainderTime);
        todoList.insertBefore(list, todoList.firstChild);
        saveToStorage();
        if (remainderTime) {
            scheduleReminder(taskName, remainderTime);
        }
    } else {
        alert('Please enter a task name.');
    }
});

function add  (taskName, isChecked, completedDate, remainderTime)  {
    const list = document.createElement('li');
    list.classList.add('task-item');

    const div1 = document.createElement('div');
    div1.className = "leftDiv";
    div1.classList.add('task-div1');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    checkbox.classList.add('task-checkbox');

    const taskContent = document.createElement('span');
    taskContent.textContent = taskName;
    taskContent.classList.add('task-content');

    const div2 = document.createElement('div');
    div2.className = "rightDiv";
    div2.classList.add('task-div2');

    const editIcon = document.createElement('img');
    editIcon.src = 'edit.ico';
    editIcon.alt = "editIcon";
    editIcon.classList.add('icon');

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'delete.ico';
    deleteIcon.alt = "deleteIcon";
    deleteIcon.classList.add('icon');

    let bellIcon;
    if (remainderTime) {
        bellIcon = document.createElement('img');
        bellIcon.src = 'bell.ico';
        bellIcon.alt = "reminder";
        bellIcon.classList.add('icon');
        bellIcon.addEventListener('click', () => {
        if (remainderTime) {
            alert(`Reminder for "${taskName}" is set at ${remainderTime}`);
        } else {
            alert(`No reminder set for "${taskName}".`);
        }
    });

}

    editIcon.addEventListener('click', () => {
        const newName = prompt("Edit Task Name:", taskName);
        if (newName) {
            taskContent.textContent = newName;
            saveToStorage();
        }
    });

    deleteIcon.addEventListener('click', () => {
        todoList.removeChild(list);
        saveToStorage();
    });

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            list.classList.add('completed-task');
            const completedDate = new Date();
            list.dataset.completedDate = completedDate;
            todoList.appendChild(list);
            saveToStorage();
        } else {
            list.classList.remove('completed-task');
            list.dataset.completedDate = ''; // Remove completion date
            todoList.insertBefore(list, todoList.firstChild);
            saveToStorage();
        }
    });
    if (remainderTime) {
        list.dataset.remainderTime = remainderTime;
    }
    list.appendChild(div1);
    div1.appendChild(checkbox);
    div1.appendChild(taskContent);
    list.appendChild(div2);
    div2.appendChild(editIcon);
    div2.appendChild(deleteIcon);
    if (remainderTime) {
        div2.appendChild(bellIcon);
    }

    list.dataset.remainderTime = remainderTime; 
    return list;
};

function scheduleReminder  (taskName, remainderTime)  {
    const reminderDate = new Date(remainderTime);
    const currentTime = new Date();
    const timeDifference = reminderDate - currentTime;

    if (timeDifference > 0) {
        setTimeout(() => {
            notify(taskName);
        }, timeDifference);
    }
};


const notify = (taskName) => {
    if (Notification.permission === 'granted') {
        new Notification("Reminder", {
            body: `Reminder: ${taskName}`,
            icon: 'bell.ico'
        });
    } else {
        alert(`Reminder: ${taskName}`);
    }
};

// Save to localStorage
const saveToStorage = () => {
    const tasks = [];
    todoList.querySelectorAll('.task-item').forEach(task => {
        const name = task.querySelector('.task-content').textContent;
        const isChecked = task.querySelector('.task-checkbox').checked;
        const date = task.dataset.completedDate || null;
        const remainderTime = task.dataset.remainderTime || null;
        const option = task.querySelector('.icon') ? "Yes" : "No";
        tasks.push({ name, isChecked, date, option, remainderTime });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


function getfromStorage () {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ name, isChecked, date, remainderTime }) => {
        const taskElement = add(name, isChecked, date, remainderTime);
        todoList.appendChild(taskElement);
        if (remainderTime) {
            scheduleReminder(name, remainderTime);
        }
    });
};

taskFilter.addEventListener('change', () => {
    const filterValue = taskFilter.value;
    todoList.querySelectorAll('.task-item').forEach(task => {
        const isChecked = task.querySelector('.task-checkbox').checked;
        if (filterValue === 'all') {
            task.style.display = 'flex';
        } else if (filterValue === 'completed' && isChecked) {
            task.style.display = 'flex';
        } else if (filterValue === 'pending' && !isChecked) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
});


headerBell.addEventListener('click', () => {
    const reminderTasks = [];
    todoList.querySelectorAll('.task-item').forEach(task => {
        const remainderTime = task.dataset.remainderTime;
        if (remainderTime) {
            reminderTasks.push(`${task.querySelector('.task-content').textContent}: ${remainderTime}`);
        }
    });

    if (reminderTasks.length > 0) {
        alert(`Reminders:\n${reminderTasks.join('\n')}`);
    } else {
        alert('No reminders set.');
    }
});


calendarIcon.addEventListener('click', () => {
    const completedTasks = document.querySelectorAll('.completed-task');
    completedTasks.forEach((task) => {
        const completedDate = new Date(task.dataset.completedDate);
        const today = new Date();
        const timeDifference = today - completedDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        alert(`Task "${task.querySelector('.task-content').textContent}" completed ${daysDifference} days ago.`);
    });
});
