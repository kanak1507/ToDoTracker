//tablebody
const taskName = document.getElementById("taskName");
const priority = document.getElementById("priority");
const status = document.getElementById("status");
//controls
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
//button
const addButton = document.getElementById("addBtn");
const resetButton = document.getElementById("resetBtn");
const saveButton = document.getElementById("saveBtn");
//form
const form = document.getElementById("taskForm");
const formSection = document.getElementById("taskFormSection");
//active and complted tasks
const tableBody = document.getElementById("taskTableBody");
const completedTableBody = document.getElementById("completedTaskTableBody");
//dashboard
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
//toggle 
const activeToggle = document.getElementById("activeToggle");
const completedToggle = document.getElementById("completedToggle");
//minimize 
const activeWrapper = document.getElementById("activeWrapper");
const completedWrapper = document.getElementById("completedWrapper");
// Array to store all task objects
let tasks = [];
let editIndex = null;
//function to save current task
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//reload the tasks
function loadTasks(){
  const storedTasks = localStorage.getItem("tasks");
  if(storedTasks)
  {
    tasks = JSON.parse(storedTasks);
  }
}
// Function to update dashboard statistics
function updateDashboard() {
// Display the total number of tasks
  totalTasks.textContent = tasks.length;
  let completedCount = 0;
  for(const task of tasks){
    if(task.status === "completed")
    {
      completedCount++;
    }
  }
  completedTasks.textContent = completedCount;
  pendingTasks.textContent = tasks.length - completedCount;
}
//render tasks
function renderTasks(taskList = tasks) {
  tableBody.innerHTML = "";
  completedTableBody.innerHTML = "";
  taskList.forEach(function(task,index){
// Create a new table row
  const row = document.createElement("tr");
  // Task Name column
  const taskCell = document.createElement("td");
  taskCell.textContent = task.taskName;
  row.appendChild(taskCell);
  // Priority column
  const priorityCell = document.createElement("td");
  priorityCell.textContent = task.priority;
  priorityCell.classList.add(`priority-${task.priority}`);
  row.appendChild(priorityCell);
  // Status column
  const statusCell = document.createElement("td");
  statusCell.textContent = task.status;
  statusCell.classList.add(`status-${task.status}`);
  row.appendChild(statusCell);
  //Action
  const actionCell = document.createElement("td");
  //completed button
  const completeButton = document.createElement("button");
  completeButton.textContent = "Complete";
  completeButton.classList.add("complete-btn");
  completeButton.addEventListener("click",function(){
  tasks[index].status = "completed";
 
  saveTasks();
  updateDashboard();
  applyFilters();
  });
  //edit button
  
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-btn");
  editButton.addEventListener("click", function(event) {
    event.stopPropagation();

    console.log("Edit clicked");

    formSection.style.display = "block";
    editIndex = index;

    taskName.value = task.taskName;
    priority.value = task.priority;
    status.value = task.status;
});
  //delete Button 
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click",function(){
  tasks.splice(index,1);
  saveTasks();
  updateDashboard();
  applyFilters();   
})
  // Add the correct buttons based on task status
if (task.status === "completed") {
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    completedTableBody.appendChild(row);
} else {
    actionCell.appendChild(completeButton);
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    tableBody.appendChild(row);
}
});
}
activeToggle.addEventListener("click", function(){
  if(activeWrapper.style.display === "none"){
    activeWrapper.style.display = "block";
    activeToggle.textContent = "▼ Active Tasks";
  }else{
    activeWrapper.style.display = "none";
    activeToggle.textContent = "▶ Active Tasks";
  }
});
completedToggle.addEventListener("click", function(){
  if(completedWrapper.style.display === "none"){
    completedWrapper.style.display = "block";
    completedToggle.textContent = "▼ Completed Tasks";
  }else{
    completedWrapper.style.display = "none";
    completedToggle.textContent = "▶ Completed Tasks";
  }
});
function applyFilters(){
  let filteredTasks = tasks;
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;
  const searchText = searchInput.value.toLowerCase();
  if (selectedStatus !== "all") {
    filteredTasks = filteredTasks.filter(function(task) {
    return task.status === selectedStatus;
    });
}
if (selectedPriority !== "all") {
    filteredTasks = filteredTasks.filter(function(task){
     return task.priority === selectedPriority;
    });
}
if (searchText !== "") {
  filteredTasks = filteredTasks.filter(function(task) {
  return task.taskName.toLowerCase().includes(searchText);
  });
  }
  renderTasks(filteredTasks);
}
// Add click event to Save button
form.addEventListener("submit", function(event){
  // Prevent page refresh when form is submitted
  event.preventDefault();
  // Read values entered by the user
  const task = taskName.value;
  const level = priority.value;
  const currentStatus = status.value;
  // Create a task object using the entered values
  const newTask = {
    taskName: task.trim(),
    priority: level,
    status: currentStatus,
  };
  // Store the task in the array
  if (editIndex === null) {
    tasks.push(newTask);//not editing
    saveTasks();
} else {
    tasks[editIndex] = newTask;
    saveTasks();
    editIndex = null;//if editing, update it and replace it with new task
}

  // Update dashboard counters
  updateDashboard();
  //rendering tasks
  applyFilters();
  // Clear all form fields after saving
  form.reset();
  formSection.style.display = "none";
}
);
resetButton.addEventListener("click", function(){
  formSection.style.display = "none";
  editIndex = null;
});
loadTasks();
addButton.addEventListener("click",function(){
  formSection.style.display = "block";
});
searchInput.value = "";
statusFilter.value = "all";
priorityFilter.value = "all";
document.addEventListener("click", function(event) {
  if (formSection.style.display === "none") {
    return;
  }
  const clickedInsideForm = formSection.contains(event.target);
  const clickedAddButton = addButton.contains(event.target);
  if (!clickedInsideForm && !clickedAddButton) {
    formSection.style.display = "none";
    form.reset();
    editIndex = null;
  }
});
searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
priorityFilter.addEventListener("change", applyFilters);
applyFilters();
updateDashboard();
formSection.style.display = "none";