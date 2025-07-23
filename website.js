const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUl = document.getElementById('todo-list')

let draggedIndex = null;
let todoList = loadTodos(); 
updateTodoList();

// Closes any open dropdown menu when clicking outside
document.addEventListener('click', e => {
    const isDropdownButton = e.target.matches(".dropdown-button");
    const isDropdownMenu = e.target.closest(".dropdown");

    // If the click is not on a dropdown button or inside a dropdown, close all open dropdowns
    if (!isDropdownButton && !isDropdownMenu) {
        document.querySelectorAll(".dropdown.active").forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

// Creates an item from the submitted text of the todo
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        }

        todoList.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

// Updates the UI todo list to match the list in script
function updateTodoList() {
    todoListUl.innerHTML = "";
    todoList.forEach((todo, todoIndex) => {
        todoItem = createTodoItem(todo, todoIndex);
        todoListUl.append(todoItem);
    });
}

// Create todo list item
function createTodoItem(todo, todoIndex) {
    const todoID = "todo-" + todoIndex;
    const todoLI = document.createElement('li');
    todoLI.className = "todo";
    todoLI.draggable = true;
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoID}">
        <label class="custom-checkbox" for="${todoID}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
        </label>

        <label for="${todoID}" class="todo-text">
            ${todo.text}
        </label>

        <div for="${todoID}" class="dropdown">
            <button class="dropdown-button"> <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg> </button>
            <div class="dropdown-menu">
                <button class="edit-button"> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    Edit  
                </button>
                <button class="delete-button"> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    Delete 
                </button>
            </div>
        </div>`;
    
    // Add event listeners
    // Checkbox
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        todoList[todoIndex].completed = checkbox.checked;
        saveTodos();
    });
    checkbox.checked = todo.completed;

    // Dropdown
    const dropdownButton = todoLI.querySelector(".dropdown-button");
    dropdownButton.addEventListener("click", () => {
        let currentDropdown = dropdownButton.closest(".dropdown");
        currentDropdown.classList.toggle('active');

        document.querySelectorAll(".dropdown.active").forEach(dropdown => {
            if (dropdown !== currentDropdown) dropdown.classList.remove('active');
        });
    });

    // Edit Button
    const editButton = todoLI.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
        editTodoItem(todoIndex);
    })

    // Delete button
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });

    // Drag and drop
    todoLI.addEventListener("dragstart", () => {
        // Set current todo item to dragged
        draggedIndex = todoIndex;
        // Add dragging class to item after a delay for styling
        setTimeout(() => todoLI.classList.add("dragging"), 0);
    })
    todoLI.addEventListener("dragend", e => {
        todoLI.classList.remove("dragging");
        saveTodos();
    })

    todoLI.addEventListener("dragover", e => {
        e.preventDefault();
        
        // If the target todo is different from the dragged todo, we insert the dragged todo here
        if (draggedIndex !== null && todoIndex !== draggedIndex) {
            const draggedTodo = todoList[draggedIndex];
            todoList.splice(draggedIndex, 1);
            todoList.splice(todoIndex, 0, draggedTodo);
            draggedIndex = todoIndex;
            updateTodoList();
        }
    })

    return todoLI;
}

// Edit text of todo item
function editTodoItem(todoIndex) {
    let text = prompt("Enter new ToDo text");
    if (text === null || text === "") {
        return;
    } else {
        todoList[todoIndex].text = text;
        updateTodoList();
        saveTodos();
    }
}

// Delete item of todo list
function deleteTodoItem(todoIndex) {
    todoList = todoList.filter((_, i) => i !== todoIndex);
    updateTodoList();
    saveTodos();
}

// Save list to localStorage
function saveTodos() {
    const todosJson = JSON.stringify(todoList);
    localStorage.setItem("todos", todosJson);
}

// Load list from localStorage
function loadTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}