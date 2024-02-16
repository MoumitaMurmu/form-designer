// Get references to HTML elements
const labelInputField = document.querySelector('#labelValue');
const form = document.querySelector('#form');
const inputType = document.querySelector('#inputType');
let draggedElement = null;

// Function to add a new form element
function addElement() {
    const type = inputType.value;
    const label = labelInputField.value;

    // Check if the label is empty
    if (!label.trim()) {
        alert("Label cannot be empty");
        return;
    }

    // Create label and container elements
    const labelInput = document.createElement("label");
    const div = document.createElement("div");

    // Generate a unique ID for the new element
    const elementId = Date.now().toString();

    // Handle 'select' type
    if (type === 'select') {
        // Create select input element
        const selectInput = document.createElement("select");
        selectInput.classList.add('form-control');

        // Create a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "-- Select an option --";
        selectInput.add(defaultOption);

        // Prompt user for number of options and create them
        const numberOfOptions = prompt("Enter the number of options:");
        for (let i = 1; i <= numberOfOptions; i++) {
            const optionValue = prompt(`Enter the value for option ${i}:`);
            const optionText = prompt(`Enter the display text for option ${i}:`);

            const newOption = document.createElement("option");
            newOption.value = optionValue;
            newOption.text = optionText;
            selectInput.add(newOption);
        }

        // Set label text and add elements to the container
        labelInput.innerHTML = label;
        labelInput.classList.add("form-label");
        div.classList.add("mb-3", "form-element");
        div.setAttribute("draggable", "true");
        div.appendChild(createDragHandle());
        div.appendChild(labelInput);
        div.appendChild(selectInput);
        div.appendChild(createDeleteButton(elementId));
    } 
    // Handle 'textarea' type
    else if (type === 'textarea') {
        // Create textarea element
        let textarea = document.createElement('textarea');
        textarea.classList.add('form-control');

        // Set label text and placeholder
        labelInput.innerHTML = label;
        labelInput.classList.add("form-label");
        textarea.placeholder = `Enter Your ${label}...`; // placeholder

        // Set up container and add elements
        div.classList.add("mb-3", "form-element");
        div.setAttribute("draggable", "true");
        div.appendChild(createDragHandle());
        div.appendChild(labelInput);
        div.appendChild(textarea);
        div.appendChild(createDeleteButton(elementId));
    } 
    // Handle other input types
    else {
        // Create input element
        let input = document.createElement('input');
        input.type = type;
        input.classList.add('form-control');

        // Set label text and placeholder
        labelInput.innerHTML = label;
        labelInput.classList.add("form-label");
        input.placeholder = `Enter Your ${label}...`; // placeholder

        // Set up container and add elements
        div.classList.add("mb-3", "form-element");
        div.setAttribute("draggable", "true");
        div.appendChild(createDragHandle());

        // If not 'submit' type, add label input
        if (type !== 'submit') {
            div.appendChild(labelInput);
        }

        div.appendChild(input);
        div.appendChild(createDeleteButton(elementId));

        // If 'submit' type, customize styling and value
        if (type === 'submit') {
            input.classList.add("btn", "btn-success");
            input.value = label;
        }
    }

    // Set unique ID for the new element and append it to the form
    div.id = elementId;
    form.appendChild(div);

    // Clear input fields after adding an element
    labelInputField.value = "";
    inputType.value = "";
}

// Function to create a drag handle for reordering
function createDragHandle() {
    const dragHandle = document.createElement("span");
    dragHandle.classList.add("drag-handle");
    dragHandle.innerHTML = '<i class="fas fa-arrows-alt"></i>';

    return dragHandle;
}

// Function to create a delete button for removing elements
function createDeleteButton(elementId) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");

    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-trash-alt");
    deleteButton.appendChild(icon);

    deleteButton.addEventListener("click", function () {
        deleteElement(elementId);
    });

    return deleteButton;
}

// Function to delete a form element
function deleteElement(elementId) {
    const elementToRemove = document.getElementById(elementId);
    if (elementToRemove) {
        elementToRemove.remove();
    }
}

// Event listeners for drag-and-drop functionality
document.addEventListener("dragstart", function (e) {
    draggedElement = e.target;
});

document.addEventListener("dragover", function (e) {
    e.preventDefault();
});

document.addEventListener("drop", function (e) {
    e.preventDefault();
    const dropTarget = e.target.closest('.form-element');
    if (dropTarget && draggedElement) {
        // Reorder the elements using drag-and-drop
        form.insertBefore(draggedElement, dropTarget.nextSibling);
        draggedElement = null;
    }
});

// Function to save the form data and log it to the console
function saveForm() {
    // Extract form data and create a JSON structure
    const formElements = Array.from(form.children).map((element) => {
        const id = element.id;

        const labelElement = element.querySelector('.form-label');

        const label = labelElement ? labelElement.innerText : '';

        const inputElement = element.querySelector('input, select, textarea');

        const type = inputElement ? inputElement.type : null;

        let placeholder = '';

        // Handle select-one type to extract options
        if (type === 'select-one') {
            var options = Array.from(inputElement.options)
              .filter(option => option.value !== "")
              .map(option => option.value);
        } 
        // Handle non-submit types to include placeholder
        else if (type !== 'submit') {
            placeholder = `Enter Your ${label}...`;
        }

        // Create an object for each form element
        const result = {
            id,
            type,
            label,
        };

        // Include placeholder for non-select, non-submit elements
        if (placeholder) {
            result.placeholder = placeholder;
        }

        // Include options only for select elements
        if (options) {
            result.options = options;
        }

        return result;
    });

    // Log the updated JSON to the console
    console.log(formElements);
}

