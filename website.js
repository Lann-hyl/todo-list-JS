const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUl = document.getElementById('todo-list')

let todoList = loadTodos(); 
updateTodoList();


document.addEventListener('click', e => {
    const isDropdownButton = e.target.matches(".dropdown-button");
    const isDropdownMenu = e.target.closest(".dropdown");
    if (!isDropdownButton && !isDropdownMenu) {
        document.querySelectorAll(".dropdown.active").forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
})

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
})

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
function updateTodoList() {
    todoListUl.innerHTML = "";
    todoList.forEach((todo, todoIndex) => {
        todoItem = createTodoItem(todo, todoIndex);
        todoListUl.append(todoItem);
    });
}
function createTodoItem(todo, todoIndex) {
    const todoID = "todo-" + todoIndex;
    const todoLI = document.createElement('li');
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoID}">
        <label class="custom-checkbox" for="${todoID}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
        </label>
        <label for="${todoID}" class="todo-text">
            ${todo.text}
        </label>

        <div class="dropdown">
            <button class="dropdown-button"> <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg> </button>
            <div class="dropdown-menu">
                <button class="delete-button"> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    Delete 
                </button>
            </div>
        </div>
    `
    
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        todoList[todoIndex].completed = checkbox.checked;
        saveTodos();
    });
    checkbox.checked = todo.completed;

    const dropdownButton = todoLI.querySelector(".dropdown-button");
    dropdownButton.addEventListener("click", () => {
        let currentDropdown = dropdownButton.closest(".dropdown");
        currentDropdown.classList.toggle('active');

        document.querySelectorAll(".dropdown.active").forEach(dropdown => {
            if (dropdown !== currentDropdown) dropdown.classList.remove('active');
        });
    });

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });

    return todoLI;
}

function deleteTodoItem(todoIndex) {
    todoList = todoList.filter((_, i) => i !== todoIndex);
    updateTodoList();
    saveTodos();
}

function saveTodos() {
    const todosJson = JSON.stringify(todoList);
    localStorage.setItem("todos", todosJson);
}

function loadTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}