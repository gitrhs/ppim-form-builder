/**
 * FormElementsManager - Manages the available form elements and their categories
 */
class FormElementsManager {
    constructor() {
        // Define categories for organizing form elements
        this.categories = [
            { id: "description", name: "Description" },
            { id: "basic", name: "Basic Fields" },
            { id: "advanced", name: "Advanced Fields" },
        ];

        // Define all available form elements
        this.formElements = [
            {
                id: "title",
                name: "Title Section",
                icon: "fa-heading",
                category: "description",
            },
            {
                id: "desc",
                name: "Description Text",
                icon: "fa-align-left",
                category: "description",
            },
            {
                id: "line",
                name: "Line Separator",
                icon: "fa-minus",
                category: "description",
            },
            {
                id: "banner",
                name: "Image Banner",
                icon: "fa-image",
                category: "description",
            },
            {
                id: "text",
                name: "Text Input",
                icon: "fa-keyboard",
                category: "basic",
            },
            {
                id: "textarea",
                name: "Text Area",
                icon: "fa-paragraph",
                category: "basic",
            },
            {
                id: "number",
                name: "Number Input",
                icon: "fa-hashtag",
                category: "basic",
            },
            {
                id: "dropdown",
                name: "Dropdown",
                icon: "fa-caret-down",
                category: "basic",
            },
            {
                id: "checkbox",
                name: "Checkbox",
                icon: "fa-check-square",
                category: "basic",
            },
            {
                id: "radio",
                name: "Radio Button",
                icon: "fa-circle-dot",
                category: "advanced",
            },
            {
                id: "date",
                name: "Date Picker",
                icon: "fa-calendar",
                category: "advanced",
            },
            {
                id: "time",
                name: "Time Picker",
                icon: "fa-clock",
                category: "advanced",
            },
            {
                id: "file",
                name: "File Upload",
                icon: "fa-file-upload",
                category: "advanced",
            },
            {
                id: "section",
                name: "Section Break",
                icon: "fa-grip-lines",
                category: "advanced",
            },
        ];
    }

    /**
     * Get the list of categories
     * @returns {Array} Categories
     */
    getCategories() {
        return this.categories;
    }

    /**
     * Get all form elements
     * @returns {Array} Form elements
     */
    getFormElements() {
        return this.formElements;
    }

    /**
     * Get a specific form element by ID
     * @param {string} id - Element ID
     * @returns {Object} Form element object
     */
    getElementById(id) {
        return this.formElements.find((el) => el.id === id);
    }

    /**
     * Group elements by their category
     * @returns {Object} Elements grouped by category
     */
    getElementsByCategory() {
        const grouped = {};

        this.categories.forEach((category) => {
            grouped[category.id] = this.formElements.filter(
                (el) => el.category === category.id
            );
        });

        return grouped;
    }

    /**
     * Get HTML template for a specific element type
     * @param {string} type - Element type
     * @returns {string} HTML template
     */
    getElementTemplate(type) {
        const label = "Label";
        const placeholder = "Placeholder";
        const uniqueId = `input-${Date.now()}`;

        switch (type) {
            case "title":
                return `
                    <div class="mb-0">
                        <h5>Title</h5>
                    </div>
                `;
            case "desc":
                return `
                    <div class="mb-0">
                        <p class="text-muted">Description text goes here.</p>
                    </div>
                `;
            case "line":
                return `
                    <div class="mb-0">
                        <hr>
                    </div>
                `;
            case "banner":
                return `
                    <div class="mb-0">
                        <img src="/image/ppim1.png" alt="Banner" style="width: 100%; max-height: 200px; object-fit: contain;">
                    </div>
                `;
            case "text":
                return `
                    <div class="mb-0">
                        <label class="form-label" for="${uniqueId}">${label}</label>
                        <input type="text" id="${uniqueId}" class="form-control contact-form" placeholder="${placeholder}">
                    </div>
                `;
            case "textarea":
                return `
                    <div class="mb-0">
                        <label class="form-label" for="${uniqueId}">${label}</label>
                        <textarea id="${uniqueId}" class="form-control contact-form" placeholder="${placeholder}" rows="3"></textarea>
                    </div>
                `;
            case "number":
                return `
                    <div class="mb-0">
                        <label class="form-label" for="${uniqueId}">${label}</label>
                        <input type="number" id="${uniqueId}" class="form-control contact-form" placeholder="${placeholder}">
                    </div>
                `;
            case "dropdown":
                return `
                    <div class="mb-0">
                        <label class="form-label" for="${uniqueId}">${label}</label>
                        <select id="${uniqueId}" class="form-select contact-form">
                            <option selected disabled>Select an option</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </select>
                    </div>
                `;
            case "checkbox":
                return `
                    <div class="mb-0">
                        <label class="form-label d-block">${label}</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="check1">
                            <label class="form-check-label" for="check1">Option 1</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="check2">
                            <label class="form-check-label" for="check2">Option 2</label>
                        </div>
                    </div>
                `;
            case "radio":
                return `
                    <div class="mb-0">
                        <label class="form-label d-block">${label}</label>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="radio-group" id="radio1">
                            <label class="form-check-label" for="radio1">Option 1</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="radio-group" id="radio2">
                            <label class="form-check-label" for="radio2">Option 2</label>
                        </div>
                    </div>
                `;
            case "date":
                return `
                    <div class="mb-0">
                        <label class="form-label" for="${uniqueId}">${label}</label>
                        <input type="date" id="${uniqueId}" class="form-control contact-form">
                    </div>
                `;
            case "time":
                return `
                    <div class="mb-0">
                        <label class="form-label" for="${uniqueId}">${label}</label>
                        <input type="time" id="${uniqueId}" class="form-control contact-form">
                    </div>
                `;
            case "file":
                return `
                    <div class="mb-0">
                        <label class="form-label" for="${uniqueId}">${label}</label>
                        <input type="file" id="${uniqueId}" class="form-control">
                    </div>
                `;
            case "section":
                return `
                    <div class="mb-0">
                        <h5>Section Title</h5>
                        <hr>
                        <p class="text-muted">Section description goes here.</p>
                    </div>
                `;
            default:
                return '<div class="p-3">Unknown element type</div>';
        }
    }
}
