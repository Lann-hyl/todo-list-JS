const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUl = document.getElementById('todo-list')

let draggedIndex = null;
let todoList = loadTodos(); 
updateTodoList();


// ========================================================
// Helper functions

// Modified from https://stackoverflow.com/a/17415677
function pad(num) {
    return (num < 10 ? '0' : '') + num;
}

function toIsoString(date) {
  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes());
}

function toDateIsoString(date) {
  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate());
}

function toTimeIsoString(date) {
  return pad(date.getHours()) +
      ':' + pad(date.getMinutes());
}
// ========================================================

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
            quantity: 1.0,
            displayQuantity: false,
            deadlineDate: new Date(),
            deadlineTime: new Date(),
            displayDeadline: false,
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
        if (!('displayQuantity' in todo)) {
            todo.displayQuantity = false;
            todo.quantity = 1.0;
        }
        if (!('displayDeadline' in todo)) {
            todo.displayDeadline = false;
        }
        if (!('deadlineDate' in todo)) {
            todo.deadlineDate = new Date();
            todo.deadlineTime = new Date();
        }
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
        
        <div class="quantity-buttons" style="display:none">
            <button class="plus-one-button"> 
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-280v-120H120v-80h120v-120h80v120h120v80H320v120h-80Zm390 80v-438l-92 66-46-70 164-118h64v560h-90Z"/></svg>
            </button>
            <button class="minus-one-button"> 
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-400H120v-80h280v80Zm230 200v-438l-92 66-46-70 164-118h64v560h-90Z"/></svg>
            </button>
        </div>

        <button for="${todoID}" class="todo-quantity" style="display:none">
            ${todo.quantity}
        </button>
        
        <label for="${todoID}" class="todo-text">
            ${todo.text}
        </label>


        <div for="${todoID}" class="deadline" style="display:none">
            <input id="${todoID}" class="deadline-date-input" type="date" value="${todo.deadlineDate.getTime() !== 0 ? toDateIsoString(todo.deadlineDate) : ""}"></input>
            <input id="${todoID}" class="deadline-time-input" type="time" value="${todo.deadlineTime.getTime() !== 0 ? toTimeIsoString(todo.deadlineTime) : ""}"></input>
        </div>

        <div for="${todoID}" class="dropdown">
            <button class="dropdown-button"> <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg> </button>

            <div class="dropdown-menu">
                <button class="deadlineToggle-button"> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M680-80v-120H560v-80h120v-120h80v120h120v80H760v120h-80Zm-480-80q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h40v-80h80v80h240v-80h80v80h40q33 0 56.5 23.5T760-720v244q-20-3-40-3t-40 3v-84H200v320h280q0 20 3 40t11 40H200Zm0-480h480v-80H200v80Zm0 0v-80 80Z"/></svg>
                    ${todo.displayDeadline ? "Hide deadline" : "Show Deadline"}
                </button>
                <button class="quantityToggle-button"> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm-20 200h80v-400H380v80h80v320Z"/></svg>
                    ${todo.displayQuantity ? "Hide quantity" : "Show quantity"}
                </button>
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

    // Quantity Display
    if (todo.displayQuantity) {
        todoLI.querySelector(".quantity-buttons").style.display = "grid";
        todoLI.querySelector(".todo-quantity").style.display = "flex";
    }

    const quantityToggle = todoLI.querySelector(".quantityToggle-button");
    quantityToggle.addEventListener("click", () => {
        toggleTodoQuantity(todoIndex);
    })

    // Quantity edit functions
    const quantityPlusOneButton = todoLI.querySelector(".plus-one-button");
    quantityPlusOneButton.addEventListener("click", () => {
        adjustByOneQuantityTodo(todoIndex, 1.0);
    })

    const quantityMinusOneButton = todoLI.querySelector(".minus-one-button");
    quantityMinusOneButton.addEventListener("click", () => {
        adjustByOneQuantityTodo(todoIndex, -1.0);
    })
    
    const quantityText = todoLI.querySelector(".todo-quantity");
    quantityText.addEventListener("click", () => {
        editQuantityTodo(todoIndex);
    })

    // Deadline display
    if (todo.displayDeadline) {
        todoLI.querySelector(".deadline").style.display = "flex";
    }

    const deadlineToggle = todoLI.querySelector(".deadlineToggle-button");
    deadlineToggle.addEventListener("click", () => {
        toggleTodoDeadline(todoIndex);
    })

    const deadlineDateInput = todoLI.querySelector(".deadline-date-input");
    deadlineDateInput.addEventListener("change", e => {
        if (e.target.value) 
            todo.deadlineDate = new Date(e.target.value);
        else
            todo.deadlineDate = new Date(0);
        saveTodos();
    })  
    const deadlineTimeInput = todoLI.querySelector(".deadline-time-input");
    deadlineTimeInput.addEventListener("change", e => {
        if (e.target.value) 
            // The date doesn't matter, we only need time
            todo.deadlineTime = new Date("1970-01-01T" + e.target.value);
        else
            todo.deadlineTime = new Date(0);
        saveTodos();
    }) 


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

// Show or hide todo quantity
function toggleTodoQuantity(todoIndex) {
    let todo = todoList[todoIndex];
    todo.displayQuantity = !todo.displayQuantity;
    updateTodoList();
    saveTodos();
}

// Show or hide todo deadline
function toggleTodoDeadline(todoIndex) {
    let todo = todoList[todoIndex];
    todo.displayDeadline = !todo.displayDeadline;
    updateTodoList();
    saveTodos();
}



// Increment or decrement todo quantity
function adjustByOneQuantityTodo(todoIndex, n) {
    let todo = todoList[todoIndex];
    todo.quantity = +(todo.quantity + n).toFixed(2);
    if (todo.quantity <= -1) {
        // Do not update the list if we decrement when quantity is already 0
        todo.quantity = 0;
        return;
    } else if (todo.quantity < 0) {
        // Snap quantity to 0
        todo.quantity = 0;
    }
    updateTodoList();
    saveTodos();
}

// Edit quantity directly via prompting the user
function editQuantityTodo(todoIndex) {
    let quantity = parseFloat(prompt("Enter new ToDo quantity", todoList[todoIndex].quantity.toString()));
    quantity = +parseFloat(quantity).toFixed(2);
    if (quantity === null || quantity === "" || isNaN(quantity) || quantity < 0) {
        return;
    } else {
        todoList[todoIndex].quantity = quantity;
        updateTodoList();
        saveTodos();
    }
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

// Delete item from todo list
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
    return JSON.parse(todos, (key, value) => {
        if (key === "deadlineDate" || key === "deadlineTime") {
            return new Date(value);
        }
        return value;
    });
}