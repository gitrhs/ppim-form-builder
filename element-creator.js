/**
 * ElementCreator - Creates and manages form elements in the playground
 */
class ElementCreator {
    constructor(counter) {
        this.counter = counter;
        this.formElementsManager = new FormElementsManager();
    }

    /**
     * Create a form element in the playground
     * @param {string} type - Element type
     * @param {HTMLElement} container - Container element
     */
    createFormElement(type, container) {
        const elementData = this.formElementsManager.getElementById(type);
        if (!elementData) return;

        const uniqueId = `form-element-${this.counter}`;
        const formElement = document.createElement("div");
        formElement.className = "form-element card mb-3";
        formElement.setAttribute("draggable", "true");
        formElement.setAttribute("data-element-id", uniqueId);
        formElement.setAttribute("data-element-type", type);
        let controlsHtml = "";
        // Handle and controls bar
        if (elementData.name === "Line Separator") {
            controlsHtml = `
            <div class="card-header d-flex justify-content-between align-items-center py-2 bg-light">
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical me-2"></i>
                    <span>${elementData.name}</span>
                </div>
                <div class="element-controls">
                    <button class="btn btn-sm btn-delete" data-id="${uniqueId}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
        } else {
            controlsHtml = `
            <div class="card-header d-flex justify-content-between align-items-center py-2 bg-light">
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical me-2"></i>
                    <span>${elementData.name}</span>
                </div>
                <div class="element-controls">
                    <button class="btn btn-sm btn-edit" data-id="${uniqueId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" data-id="${uniqueId}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
        }
        // Element content
        const contentHtml = `
            <div class="card-body py-3">
                ${this.formElementsManager.getElementTemplate(type)}
            </div>
        `;

        formElement.innerHTML = controlsHtml + contentHtml;
        container.appendChild(formElement);

        // Set up element events
        this.setupFormElementEvents(formElement);

        // Initialize form field behavior based on type
        if (["text", "textarea", "number", "date", "time"].includes(type)) {
            this.initializeFormField(formElement);
        }

        // Initialize file uploader for file inputs
        if (type === "file") {
            this.initializeFileUploader(formElement);
        }
    }

    /**
     * Set up event listeners for the form element
     * @param {HTMLElement} element - Form element
     */
    setupFormElementEvents(element) {
        // Make element draggable for reordering
        element.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData(
                "text/plain",
                this.getAttribute("data-element-id")
            );
            e.dataTransfer.effectAllowed = "move";
            this.classList.add("dragging");
        });

        element.addEventListener("dragend", function () {
            this.classList.remove("dragging");
        });

        // Delete button
        const deleteBtn = element.querySelector(".btn-delete");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", function () {
                const elementId = this.getAttribute("data-id");
                const elementToDelete = document.querySelector(
                    `[data-element-id="${elementId}"]`
                );

                if (elementToDelete) {
                    elementToDelete.remove();

                    // Show the drop message if all elements are gone
                    const playground = document.querySelector(
                        ".playground-container"
                    );
                    if (!playground.querySelector(".form-element")) {
                        const dropMessage =
                            playground.querySelector(".drop-message");
                        if (dropMessage) {
                            dropMessage.style.display = "block";
                        }

                        // Remove save button
                        const saveFormBtn =
                            document.querySelector(".save-form-btn");
                        if (saveFormBtn) {
                            saveFormBtn.style.display = "none";
                        }
                    }

                    // Clear edit panel if deleted element was being edited
                    const editContainer =
                        document.querySelector(".edit-container");
                    const editPanel = editContainer.querySelector(
                        `.edit-panel[data-editing-id="${elementId}"]`
                    );

                    if (editPanel) {
                        editContainer.classList.add("idle");
                        editContainer.innerHTML =
                            '<h5 class="builderTitle">Edit Section</h5>';
                    }
                }
            });
        }

        // Edit button
        const editBtn = element.querySelector(".btn-edit");
        if (editBtn) {
            editBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const elementId = editBtn.getAttribute("data-id");
                const elementToEdit = document.querySelector(
                    `[data-element-id="${elementId}"]`
                );

                if (elementToEdit) {
                    const editPanelManager = new EditPanelManager();
                    editPanelManager.showEditPanel(elementToEdit);
                }
            });
        }

        // Drag handle for reordering
        const dragHandle = element.querySelector(".drag-handle");
        if (dragHandle) {
            dragHandle.addEventListener("mousedown", function () {
                element.setAttribute("draggable", "true");
            });

            element.addEventListener("mouseup", function () {
                setTimeout(() => {
                    element.setAttribute("draggable", "true");
                }, 100);
            });
        }
    }

    /**
     * Initialize form field with animated label behavior
     * @param {HTMLElement} element - Form element
     */
    initializeFormField(element) {
        const input = element.querySelector("input, textarea");
        const label = element.querySelector(".form-label");

        if (input && label) {
            // Add the necessary classes
            input.classList.add("form-field", "contact-form");
            label.classList.add("animated-label");

            // Set initial state
            if (input.value.trim()) {
                label.classList.add("visible");
            }

            // Add event listener
            input.addEventListener("input", function () {
                if (this.value.trim()) {
                    label.classList.add("visible");
                } else {
                    label.classList.remove("visible");
                }
            });

            // Auto-expand for textarea
            if (input.tagName === "TEXTAREA") {
                input.addEventListener("input", function () {
                    this.style.height = "auto";
                    this.style.height = this.scrollHeight + "px";
                });
            }
        }
    }

    /**
     * Initialize file uploader for file input elements
     * @param {HTMLElement} element - Form element
     */
    initializeFileUploader(element) {
        const fileInput = element.querySelector('input[type="file"]');
        const container = element.querySelector(".card-body > div");

        if (fileInput && container) {
            const uniqueId = fileInput.id;

            // Replace with dropbox template
            container.innerHTML = `
                <label class="form-label animated-label" for="${uniqueId}">File Upload</label>
                <div class="file-upload-container">
                    <div id="${uniqueId}-dropbox" class="dropbox">
                        <div id="${uniqueId}-upload-prompt">
                            <i class="fas fa-cloud-upload-alt upload-icon"></i>
                            <p>Drag and drop a file here or click to select</p>
                            <p class="upload-hint">Max size: 5MB</p>
                        </div>
                        <div id="${uniqueId}-preview-container" style="display: none;">
                            <img id="${uniqueId}-image-preview" class="preview-image" src="#" alt="Preview">
                            <button id="${uniqueId}-cancel-upload" class="cancel-button" type="button">×</button>
                        </div>
                    </div>
                </div>
            `;

            // Wait for next tick to ensure elements are in the DOM
            setTimeout(() => {
                new FileUploader({
                    dropboxId: `${uniqueId}-dropbox`,
                    inputId: uniqueId,
                    previewContainerId: `${uniqueId}-preview-container`,
                    imagePreviewId: `${uniqueId}-image-preview`,
                    uploadPromptId: `${uniqueId}-upload-prompt`,
                    cancelButtonId: `${uniqueId}-cancel-upload`,
                    labelId: null,
                });
            }, 0);
        }
    }
}
