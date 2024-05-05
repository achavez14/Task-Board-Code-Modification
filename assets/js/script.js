// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    const newId = nextId;
    nextId++;
    localStorage.setItem("nextId", nextId);
    return newId;
}

// Function to create a task card
function createTaskCard(task) {
    const taskCard = `
        <div class="card task-card mb-3" data-task-id="${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text">Deadline: ${task.deadline}</p>
                <button class="btn btn-danger delete-btn">Delete</button>
            </div>
        </div>
    `;
    return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        switch (task.status) {
            case "Not Yet Started":
                $('#todo-cards').append(taskCard);
                break;
            case "In Progress":
                $('#in-progress-cards').append(taskCard);
                break;
            case "Completed":
                $('#done-cards').append(taskCard);
                break;
            default:
                break;
        }
    });

    $('.task-card').draggable({
        revert: "invalid",
        stack: ".task-card",
        cursor: "move"
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const deadline = $('#dueDate').val();

    if (title && description && deadline) {
        const newTask = {
            id: generateTaskId(),
            title: title,
            description: description,
            deadline: deadline,
            status: "Not Yet Started"
        };

        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));

        const taskCard = createTaskCard(newTask);
        $('#todo-cards').append(taskCard);

        $('#taskForm')[0].reset();
    }
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).closest('.task-card').data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $(event.target).closest('.task-card').remove();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('task-id');
    const newStatus = $(event.target).attr('id');

    taskList.forEach(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    // Add event listeners
    $('#taskForm').submit(handleAddTask);
    $('.container').on('click', '.delete-btn', handleDeleteTask);

    // Make lanes droppable
    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });

    // Date picker for the due date field
    $('#dueDate').datepicker();
});
