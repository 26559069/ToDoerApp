import { TodoItem } from "./TodoItem.js";

// #region: Global variables and constants
const todoList = document.querySelector("#todo-list");
const nameInput = document.querySelector("#todo-name");
const notesInput = document.querySelector("#todo-notes");
const saveButton = document.querySelector("#todo-save");
const deleteButton = document.querySelector("#todo-delete");
const wipeImage = document.querySelector("#wipe-image");

const STORAGE_KEY = "todoer-items";
// #endregion: Global variables and constants

// #region: Setup event listeners
document.addEventListener("DOMContentLoaded", onPageLoad);
todoList.addEventListener("change", onItemSelected);
saveButton.addEventListener("click", onSaveClicked);
deleteButton.addEventListener("click",  onDeleteClicked);
wipeImage.addEventListener("click", onWipeImageClicked);
nameInput.addEventListener("input", onNameChanged);
// #endregion: Setup event listeners

// #region: event handlers
/**
 * This function is called when the page is loaded.
 * It retrieves the list of todo items from local storage,
 * fills them in the list and resets the state of the form.
 */
async function onPageLoad() {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    for (const item of items) {
        const todoItem = new TodoItem(item.name, item.notes);
        todoList.append(todoItem.toOption());
    };
    onWipeImageClicked();
    onNameChanged();
}

/**
 * This function is called when a todo item is selected from the list.
 * It fills in the form with the selected item's name and notes and adjust the buttons accordingly.
 */
async function onItemSelected() {
    const todoItem = todoList.options[todoList.selectedIndex].todoItem;
    nameInput.value = todoItem.name;
    notesInput.value = todoItem.notes;
    onNameChanged();
}

/**
 * This function is called when the Save button is clicked.
 * It saves the current name and notes to the list, either by adding a new item or updating an existing one.
 * It also persists the changes to local storage and updates the form state accordingly.
 */
async function onSaveClicked() {
    const name = nameInput.value.trim();
    const notes = notesInput.value.trim();
    const todoItem = new TodoItem(name, notes);
    const matchingIndex = findItemByName(name);
    if (matchingIndex < 0) {
        todoList.append(todoItem.toOption());
        todoList.selectedIndex = todoList.options.length - 1;
    } else {
        todoList.options[matchingIndex].todoItem = todoItem;
        todoList.options[matchingIndex].textContent = todoItem.name;
        todoList.selectedIndex = matchingIndex;
    }
    onNameChanged();
    persistItems();
}

/**
 * This function is called when the Delete button is clicked.
 * It removes the selected item from the list, clears the form, updates the state of the buttons
 * and persists the changes to local storage.
 */
async function onDeleteClicked() {
    todoList.remove(todoList.selectedIndex);
    onWipeImageClicked();
    onNameChanged();
    persistItems();
}

/**
 * This function is called when the Wipe Image is clicked.
 * It clears the form, resets the selection in the list and updates the state of the buttons.
 */
async function onWipeImageClicked() {
    todoList.selectedIndex = -1;
    nameInput.value = "";
    notesInput.value = "";
    wipeImage.style.display = "none";
    onNameChanged();
}

/**
 * This function is called when the name input field is changed.
 * It enables or disables the Save and Delete buttons based on the input and selection state.
 */
async function onNameChanged() {
    const name = nameInput.value.trim();
    const index = findItemByName(name);
    if (name.length === 0) {
        saveButton.disabled = true;
        deleteButton.disabled = true;
        wipeImage.style.display = "none";
    } else  {
        saveButton.disabled = false;
        deleteButton.disabled = (index === -1);
        wipeImage.style.display = "block";
    }
    todoList.selectedIndex = index;
    if (index >= 0) {
        notesInput.value = todoList.options[index].todoItem.notes;
    }
}
// #endregion: event handlers

// #region: utility functions
/**
 * Finds the index of a todo item in the list by its name.
 * @param {string} name - The name of the todo item to find.
 * @returns {number} The index of the item in the list, or -1 if not found.
 */
function findItemByName(name) {
    return Array.from(todoList.options).findIndex(option => option.todoItem.name === name);
}

/**
 * Persists the current list of todo items to local storage.
 */
function persistItems() {
    const items = Array.from(todoList.options).map(option => option.todoItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
// #endregion: utility functions