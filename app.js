const listContainer = document.querySelector('[data-list]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListBtn = document.querySelector('[data-delete-list-button]');

const listDisplayContainer = document.querySelector(
  '[data-list-display-container]'
);
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.querySelector('#task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearComplete = document.querySelector(
  '[data-clear-complete-tasks-button]'
);

const LOCAL_STORAGE_TASK_LIST_KEY = 'task.key';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.SelectedListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listContainer.addEventListener('click', function (e) {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

clearComplete.addEventListener('click', (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

deleteListBtn.addEventListener('click', function (e) {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

tasksContainer.addEventListener('change', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

newListForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const listName = newListInput.value.trim();
  if (listName === null || listName === '') return;
  const listItem = createList(listName);
  newListInput.value = '';
  lists.push(listItem);
  saveAndRender();
});

newTaskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskName = newTaskInput.value.trim();
  if (taskName === null || taskName === '') return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createList(listName) {
  return {
    id: Date.now().toString(),
    name: listName,
    tasks: [],
  };
}

function createTask(taskName) {
  return {
    id: Date.now().toString(),
    name: taskName,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
  localStorage.setItem(LOCAL_STORAGE_TASK_LIST_KEY, JSON.stringify(lists));
}

function render() {
  clearElement(listContainer);
  renderList();
  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = '';
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    console.log(task);
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderList() {
  lists.forEach((list) => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listContainer.appendChild(listElement);
  });
}
function clearElement(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
render();
