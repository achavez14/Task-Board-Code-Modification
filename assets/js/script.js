// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const newId = nextId; // Store the current nextId value
    nextId++; // Increment nextId for the next task
    localStorage.setItem("nextId", nextId); // Update nextId in localStorage
    return newId; // Return the current nextId for the new task
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = `
    <div class="card task-card mb-3" data-task-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text">Deadline: ${task.deadline}</p>
      </div>
    </div>
  `;
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
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

// Todo: create a function to handle adding a new task
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
      localStorage.setItem("nextId", nextId);
  
      const taskCard = createTaskCard(newTask);
      $('#todo-cards').append(taskCard);
  
      $('#taskForm')[0].reset(); // Reset the form
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).closest('.task-card').data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $(event.target).closest('.task-card').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
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

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$('.delete-btn').click(handleDeleteTask);

    // Add event listeners
    $('#taskForm').submit(handleAddTask);
    $('.delete-btn').click(handleDeleteTask);
  
    // Make lanes droppable
    $('.lane').droppable({
      accept: '.task-card',
      drop: handleDrop
    });
  
    // Date picker for the due date field
    $('#dueDate').datepicker();
