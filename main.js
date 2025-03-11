// Main.js - Entry point for Form Builder application

/**
 * Main FormBuilder class - orchestrates the entire application
 */
class FormBuilder {
    constructor() {
        // Store references to DOM elements
        this.sectionList = document.querySelector(".sectionList");
        this.playground = document.querySelector(".col-md-6");
        this.editContainer = document.querySelector(".edit-container");
        this.playgroundContainer = null;

        // Counter for generating unique element IDs
        this.elementCounter = 0;

        // Initialize UI manager to handle mobile responsiveness
        this.uiManager = new UIManager();
    }

    /**
     * Initialize the form builder application
     */
    init() {
        // Add mobile navigation functionality
        this.uiManager.setupMobileNavigation();

        // Create and populate the element menu
        this.setupElementMenu();

        // Create the playground area
        this.createPlaygroundContainer();
    }

    /**
     * Set up the element menu with categories and draggable elements
     */
    setupElementMenu() {
        // Group form elements by category
        const formElementsManager = new FormElementsManager();
        const categories = formElementsManager.getCategories();
        const elementsByCategory = formElementsManager.getElementsByCategory();

        // Add category headers and populate the section list
        categories.forEach((category, index) => {
            // Add category header
            const categoryHeader = document.createElement("div");
            categoryHeader.className = "navtitle text-silent mt-3";
            categoryHeader.textContent = category.name;
            this.sectionList.appendChild(categoryHeader);

            // Add elements for this category
            const elements = elementsByCategory[category.id] || [];

            elements.forEach((element) => {
                const menuItem = document.createElement("div");
                menuItem.className = "card mb-2 draggable-menu-item";
                menuItem.setAttribute("draggable", "true");
                menuItem.setAttribute("data-element-type", element.id);

                menuItem.innerHTML = `
                    <div class="card-body py-2">
                        <i class="fas ${element.icon} me-2"></i>
                        ${element.name}
                    </div>
                `;

                this.sectionList.appendChild(menuItem);

                // Make the element draggable
                menuItem.addEventListener(
                    "dragstart",
                    this.handleDragStart.bind(this)
                );
            });
        });
    }

    /**
     * Create the playground container for dropping elements
     */
    createPlaygroundContainer() {
        this.playgroundContainer = document.createElement("div");
        this.playgroundContainer.className = "playground-container p-3";
        this.playgroundContainer.style.minHeight = "calc(100vh - 80px)";
        this.playgroundContainer.innerHTML =
            '<div class="drop-message text-center text-muted my-5">Drag elements here to build your form</div>';
        this.playground.appendChild(this.playgroundContainer);

        // Add event listeners for drag and drop functionality
        this.playgroundContainer.addEventListener(
            "dragover",
            this.handleDragOver.bind(this)
        );
        this.playgroundContainer.addEventListener(
            "drop",
            this.handleDrop.bind(this)
        );

        this.playgroundContainer.addEventListener("dragenter", function () {
            this.classList.add("dragover");
        });

        this.playgroundContainer.addEventListener("dragleave", function () {
            this.classList.remove("dragover");
        });

        // Add event listeners for element reordering
        this.setupElementReordering();
    }

    /**
     * Handle dragging an element from the menu
     */
    handleDragStart(e) {
        e.dataTransfer.setData(
            "text/plain",
            e.target.getAttribute("data-element-type")
        );
        e.dataTransfer.effectAllowed = "copy";
    }

    /**
     * Handle dragging over the playground area
     */
    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary to allow dropping
        }
        e.dataTransfer.dropEffect = "copy";
        return false;
    }

    /**
     * Handle dropping an element into the playground
     */
    handleDrop(e) {
        e.preventDefault();
        this.playgroundContainer.classList.remove("dragover");

        // Get the dragged element type
        const elementType = e.dataTransfer.getData("text/plain");

        // Create a new form element in the playground
        const elementCreator = new ElementCreator(this.elementCounter++);
        elementCreator.createFormElement(elementType, this.playgroundContainer);

        // Hide the drop message once elements are added
        const dropMessage =
            this.playgroundContainer.querySelector(".drop-message");
        if (dropMessage) {
            dropMessage.style.display = "none";
        }

        // Show save form button
        this.showSaveButton();

        return false;
    }

    /**
     * Show the save form button if it doesn't exist
     */
    showSaveButton() {
        const saveFormBtn = document.querySelector(".save-form-btn");
        if (saveFormBtn.style.display === "none") {
            saveFormBtn.style.display = "block";

            // Remove any existing event listeners by cloning and replacing the button
            const saveButton = saveFormBtn.querySelector("button");
            const newButton = saveButton.cloneNode(true);
            saveButton.parentNode.replaceChild(newButton, saveButton);

            // Add event listener for save form button
            newButton.addEventListener("click", () => {
                const codeGenerator = new CodeGenerator();
                codeGenerator.showFormCode();
            });
        }
    }

    /**
     * Set up event listeners for reordering elements in the playground
     */
    setupElementReordering() {
        this.playgroundContainer.addEventListener("dragover", (e) => {
            e.preventDefault();

            const draggable = document.querySelector(".dragging");
            if (!draggable) return;

            const afterElement = this.getDragAfterElement(
                this.playgroundContainer,
                e.clientY
            );
            if (afterElement == null) {
                this.playgroundContainer.appendChild(draggable);
            } else {
                this.playgroundContainer.insertBefore(draggable, afterElement);
            }
        });
    }

    /**
     * Helper function to determine where to drop the element during reordering
     */
    getDragAfterElement(container, y) {
        const draggableElements = [
            ...container.querySelectorAll(".form-element:not(.dragging)"),
        ];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }
}
