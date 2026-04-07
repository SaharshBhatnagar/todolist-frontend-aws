import { fetchTasks, createTask, updateTask, deleteTask, deleteAllTasks } from './api.js';

const inputField = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
const displayTodo = document.getElementById('todo-container');
const seeMoreBtn = document.getElementById('see-more');
const deleteAllBtn = document.getElementById('delete-all');
const conformDelete = document.getElementById('conform-delete');

function renderTaskToDOM(task) {
    const completedClass = task.is_completed ? 'completed-task' : '';

    displayTodo.innerHTML += `
    <div class="todo-list">
                <span class="todo-number"></span>
                <p class="todo-content ${completedClass}">${task.title}</p>

                <div class="edit-delete-btn">
                    <input type="checkbox" ${task.is_completed ? 'checked' : ''} data-id="${task.id}">
                    <button data-id="${task.id}" class="edit"><i class="fas fa-edit" style="color: rgb(116, 192, 252);"></i></button>
                    <button data-id="${task.id}" class="delete"><i class="fa-regular fa-trash-can" style="color: rgb(255, 0, 0);"></i></button>
                </div>
            </div>
            `;
};

function conformDeleteAll() {
    conformDelete.style.display = 'flex'; 
    conformDelete.innerHTML = `
    <div class="contain" >
        <p> Do you want to delete all the tasks? </p>
        <button id="conform"> CONFORM </button>
        <button id="cancel"> CANCEL </button>
    </div>
    `;
};

async function loadTasks() {
    const tasksArray = await fetchTasks();
    displayTodo.innerHTML = '';

    tasksArray.forEach(task => {
        renderTaskToDOM(task)
    });

    if (tasksArray.length <= 5) {
        seeMoreBtn.style.display = 'none';
    } else {
        seeMoreBtn.style.display = 'block';
    }

    if (tasksArray.length === 0) {
        deleteAllBtn.style.display = 'none';
    } else {
        deleteAllBtn.style.display = 'block';
    }
};

loadTasks();

todoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = inputField.value;
    
    await createTask(text);
    inputField.value = '';
    loadTasks();

});

displayTodo.addEventListener('click', async (event) => {
   const btn = event.target;
   const deleteBtn = btn.closest('.delete');
   const editBtn = btn.closest('.edit');

   if (deleteBtn) {
    const id = deleteBtn.getAttribute('data-id');

    await deleteTask(id);
    loadTasks();
   }

   if (btn.type === 'checkbox') {
    const id = btn.getAttribute('data-id');
    const isCompleted = btn.checked;
    const titleText = btn.closest('.todo-list').querySelector('.todo-content').innerHTML;

    await updateTask(id, titleText, "", isCompleted);

    loadTasks();
   }
   
    if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const todoWrapper = editBtn.closest('.todo-list');
        const textElement = todoWrapper.querySelector('.todo-content');
        const isCompleted = todoWrapper.querySelector('input[type="checkbox"]').checked;
        const icon = editBtn.querySelector('i'); // Target the FontAwesome icon

       
        if (textElement.isContentEditable) {
           
            textElement.contentEditable = "false";
            
            
            const newText = textElement.textContent.trim();
            
            
            if (newText !== "") {
                await updateTask(id, newText, "", isCompleted);
            }
            
            
            loadTasks();

        } else {
           
            textElement.contentEditable = "true";
            textElement.focus();

           
            textElement.style.backgroundColor = "aliceblue";
            textElement.style.border = "1px solid dodgerblue";
            textElement.style.borderRadius = "4px";
            textElement.style.padding = "2px 5px";
            textElement.style.outline = "none";

            
            icon.className = "fas fa-save"; 
            icon.style.color = "rgb(40, 167, 69)"; 
        }
    }
});

seeMoreBtn.addEventListener('click', () => {
    displayTodo.classList.toggle('show-all');

    if (displayTodo.classList.contains('show-all')) {
        seeMoreBtn.textContent = 'See Less';
    } else {
        seeMoreBtn.textContent = 'See More';
    }

});

deleteAllBtn.addEventListener('click', () => {
    conformDeleteAll();
});

conformDelete.addEventListener('click', async (event) => {
    const clickedElement = event.target;

    if (clickedElement.id === 'cancel') {
        conformDelete.style.display = 'none'; 
        conformDelete.innerHTML = '';
    }
    
    else if (clickedElement.id === 'conform') {
        await deleteAllTasks();
        conformDelete.style.display = 'none';
        conformDelete.innerHTML = '';
        loadTasks();
    }
    
    else if (clickedElement === conformDelete) {
        conformDelete.style.display = 'none';
        conformDelete.innerHTML = '';
    }
});