/**
 * Represents a single to-do item with a name and notes.
 * It provides a method to convert the item into an HTML option element 
 * for display in a select list.
 */
export class TodoItem {
    name;
    notes;

    constructor(name, notes) {
        this.name = name;
        this.notes = notes;
    }

    toOption() {
        const option = document.createElement("option");
        option.todoItem = this; // attaching this object as a custom property
        option.textContent = this.name;
        return option;
    }
}
