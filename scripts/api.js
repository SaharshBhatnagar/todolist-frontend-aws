const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost 
    ? 'http://localhost:5000/api/tasks' 
    : 'http://65.2.148.150:5050/api/tasks';

// GET
async function fetchTasks() {
    try {
        const response = await fetch(API_BASE_URL);

        if (response.ok) {
            const data =await  response.json();
            return data;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }catch (error) {
        console.log("Fetch error: ", error.message);
    }
};

// POST
async function createTask(title) {
    try {
        const response = await fetch(API_BASE_URL, { method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: "" })
        });


    } catch (error) {
        console.log("Fetch error: ", error.message);
    }
};

// PUT
async function updateTask(id, title, description, is_completed) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, is_completed })
        });
    } 
    catch (error) {
        console.log("Fetch error: ", error.message);
    }

};

// Delete
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE'});

        if (response.ok) {
            return;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }
    catch (error) {
        console.log("Fetch error: ", error.message);
    }
};

// Delete All
async function deleteAllTasks() {
    try {
        const response = await fetch(API_BASE_URL, { method: 'DELETE'});

        if (response.ok) {
            return;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }
    catch (error) {
        console.log("Fetch error: ", error.message);
    }
};

export {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks
};