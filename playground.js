// Initialize form elements
document.addEventListener("DOMContentLoaded", function () {
    // Add mobile toggle functionality
    const addBurgerMenu = () => {
        const row = document.querySelector(".row");

        // Create burger icon for mobile
        const burgerIcon = document.createElement("div");
        burgerIcon.className = "burger-icon";
        burgerIcon.innerHTML = `
            <i class="fas fa-bars burger-icon-data"></i>
        `;
        row.prepend(burgerIcon);

        // Add event listener to toggle menu
        burgerIcon.addEventListener("click", function () {
            const sectionList = document.querySelector(".sectionList");
            sectionList.classList.toggle("show");
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (e) {
            const sectionList = document.querySelector(".sectionList");
            const burgerIcon = document.querySelector(".burger-icon");

            if (
                !sectionList.contains(e.target) &&
                !burgerIcon.contains(e.target)
            ) {
                sectionList.classList.remove("show");
            }
        });
    };

    // Call this function to add mobile menu toggle
    addBurgerMenu();

    // Form elements that can be dragged into the playground
    const formElements = [
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

    // Reference to containers
    const sectionList = document.querySelector(".sectionList");
    const playground = document.querySelector(".col-md-6");
    const editContainer = document.querySelector(".edit-container");

    // Counter for unique IDs
    let elementCounter = 0;

    // Add section categories to organize form elements
    const categories = [
        { id: "description", name: "Description" },
        { id: "basic", name: "Basic Fields" },
        { id: "advanced", name: "Advanced Fields" },
    ];

    // Group form elements by category
    const descriptionElements = formElements.filter(
        (el) => el.category === "description"
    );
    const basicElements = formElements.filter((el) => el.category === "basic");
    const advancedElements = formElements.filter(
        (el) => el.category === "advanced"
    );

    // Add category headers and populate the section list
    categories.forEach((category, index) => {
        // Add category header
        const categoryHeader = document.createElement("div");
        categoryHeader.className = "navtitle text-silent mt-3";
        categoryHeader.textContent = category.name;
        sectionList.appendChild(categoryHeader);

        // Add elements for this category
        let elements;
        if (index === 0) {
            elements = descriptionElements;
        } else if (index === 1) {
            elements = basicElements;
        } else {
            elements = advancedElements;
        }

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

            sectionList.appendChild(menuItem);

            // Make the element draggable
            menuItem.addEventListener("dragstart", handleDragStart);
        });
    });

    // Create playground container for dropping elements
    const playgroundContainer = document.createElement("div");
    playgroundContainer.className = "playground-container p-3";
    playgroundContainer.style.minHeight = "calc(100vh - 80px)";
    playgroundContainer.innerHTML =
        '<div class="drop-message text-center text-muted my-5">Drag elements here to build your form</div>';
    playground.appendChild(playgroundContainer);

    // Event listeners for the playground
    playgroundContainer.addEventListener("dragover", handleDragOver);
    playgroundContainer.addEventListener("drop", handleDrop);
    playgroundContainer.addEventListener("dragenter", function () {
        this.classList.add("dragover");
    });
    playgroundContainer.addEventListener("dragleave", function () {
        this.classList.remove("dragover");
    });

    // Drag and drop handling functions
    function handleDragStart(e) {
        e.dataTransfer.setData(
            "text/plain",
            e.target.getAttribute("data-element-type")
        );
        e.dataTransfer.effectAllowed = "copy";
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary to allow dropping
        }
        e.dataTransfer.dropEffect = "copy";
        return false;
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove("dragover");

        // Get the dragged element type
        const elementType = e.dataTransfer.getData("text/plain");

        // Create a new form element in the playground
        createFormElement(elementType, this);

        // Hide the drop message once elements are added
        const dropMessage = this.querySelector(".drop-message");
        if (dropMessage) {
            dropMessage.style.display = "none";
        }

        // Add save form button if it doesn't exist
        const saveFormBtn = document.querySelector(".save-form-btn");
        if (saveFormBtn.style.display === "none") {
            saveFormBtn.style.display = "block";

            // Remove any existing event listeners by cloning and replacing the button
            const saveButton = saveFormBtn.querySelector("button");
            const newButton = saveButton.cloneNode(true);
            saveButton.parentNode.replaceChild(newButton, saveButton);

            // Add event listener for save form button
            newButton.addEventListener("click", function () {
                // Generate and display form code
                showFormCode();
            });
        }

        return false;
    }

    // Generate JSON structure of the form
    function generateFormJson() {
        const formElements = document.querySelectorAll(".form-element");
        const formData = {
            title: "Custom Form",
            elements: [],
        };

        formElements.forEach((element, index) => {
            const elementType = element.getAttribute("data-element-type");
            const elementId = element.getAttribute("data-element-id");
            const label =
                element
                    .querySelector(".form-label")
                    ?.textContent.replace(" *", "") || "";

            // Create element data based on type
            const elementData = {
                id: elementId,
                type: elementType,
                label: label,
                order: index,
                required:
                    element
                        .querySelector(".form-label")
                        ?.textContent.includes("*") || false,
            };

            // Add specific properties based on element type
            switch (elementType) {
                case "title":
                    elementData.title =
                        element.querySelector("h5")?.textContent || "Title";
                    break;
                case "desc":
                    elementData.description =
                        element.querySelector("p")?.textContent || "";
                    break;
                case "line":
                    // No additional properties needed for line separator
                    break;
                case "banner":
                    const img = element.querySelector("img");
                    if (img) {
                        elementData.imageSrc =
                            img.getAttribute("src") || "/image/ppim1.png";
                        elementData.imageWidth = img.style.width || "100%";
                        elementData.imageMaxHeight =
                            img.style.maxHeight || "200px";
                    }
                    break;

                case "dropdown":
                case "checkbox":
                case "radio":
                    const options = [];
                    element
                        .querySelectorAll("option, .form-check-label")
                        .forEach((opt) => {
                            if (opt.textContent !== "Select an option") {
                                options.push(opt.textContent);
                            }
                        });
                    elementData.options = options;
                    break;

                case "number":
                    elementData.min = element.querySelector("input")?.min || "";
                    elementData.max = element.querySelector("input")?.max || "";
                    break;

                case "textarea":
                    elementData.rows =
                        element.querySelector("textarea")?.rows || 3;
                    break;

                case "section":
                    elementData.title =
                        element.querySelector("h5")?.textContent ||
                        "Section Title";
                    elementData.description =
                        element.querySelector("p")?.textContent || "";
                    break;
            }

            formData.elements.push(elementData);
        });

        return formData;
    }

    // Show form code in a modal
    function showFormCode() {
        // Generate the form code
        const formCode = generateFormCode();

        // Create a modal to display the code
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = "exportModal";
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-hidden", "true");

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Generated Form Code</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs" id="codeTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="html-tab" data-bs-toggle="tab" data-bs-target="#html-content" type="button" role="tab" aria-controls="html" aria-selected="true">HTML</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="js-tab" data-bs-toggle="tab" data-bs-target="#js-content" type="button" role="tab" aria-controls="js" aria-selected="false">JavaScript</button>
                            </li>
                        </ul>
                        <div class="tab-content mt-3" id="codeTabContent">
                            <div class="tab-pane fade show active" id="html-content" role="tabpanel" aria-labelledby="html-tab">
                                <pre class="bg-light p-3" style="max-height: 400px; overflow-y: auto;"><code>${formCode.html
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")}</code></pre>
                                <button class="btn btn-dark btn-sm copy-html-btn mt-2">
                                    <i class="fas fa-copy me-1"></i> Copy HTML
                                </button>
                            </div>
                            <div class="tab-pane fade" id="js-content" role="tabpanel" aria-labelledby="js-tab">
                                <pre class="bg-light p-3" style="max-height: 400px; overflow-y: auto;"><code>${formCode.javascript
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")}</code></pre>
                                <button class="btn btn-dark btn-sm copy-js-btn mt-2">
                                    <i class="fas fa-copy me-1"></i> Copy JavaScript
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p class="text-muted me-auto"><small>* Remember to include FormUtils.js in your project</small></p>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Bootstrap modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Add copy functionality
        document
            .querySelector(".copy-html-btn")
            .addEventListener("click", function () {
                copyToClipboard(formCode.html);
                this.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML =
                        '<i class="fas fa-copy me-1"></i> Copy HTML';
                }, 2000);
            });

        document
            .querySelector(".copy-js-btn")
            .addEventListener("click", function () {
                copyToClipboard(formCode.javascript);
                this.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML =
                        '<i class="fas fa-copy me-1"></i> Copy JavaScript';
                }, 2000);
            });

        // Remove modal when hidden
        modal.addEventListener("hidden.bs.modal", function () {
            document.body.removeChild(modal);
        });
    }

    // Generate form code function
    function generateFormCode() {
        const formElements = document.querySelectorAll(".form-element");
        let formHtml = `<form id="generatedForm" class="needs-validation" novalidate>\n`;
        let formJs = `document.addEventListener("DOMContentLoaded", function() {\n`;
        formJs += `    // Initialize form utilities\n`;
        formJs += `    const formUtils = new FormUtils({\n`;
        formJs += `        formSelector: "#generatedForm",\n`;
        formJs += `        submitButtonSelector: "#submitForm",\n`;
        formJs += `        requiredFieldSelector: ".required-field",\n`;
        formJs += `        formFieldSelector: ".form-field"\n`;
        formJs += `    });\n\n`;

        let fileUploaders = [];
        let fileIndex = 0;

        formElements.forEach((element, index) => {
            const elementType = element.getAttribute("data-element-type");
            const elementId = element.getAttribute("data-element-id");

            // Handle our new separate elements
            if (elementType === "title") {
                const title =
                    element.querySelector("h5")?.textContent || "Title";

                formHtml += `    <div class="mb-4">\n`;
                formHtml += `        <h5>${title}</h5>\n`;
                formHtml += `    </div>\n\n`;
                return;
            } else if (elementType === "desc") {
                const description =
                    element.querySelector("p")?.textContent || "";

                formHtml += `    <div class="mb-4">\n`;
                formHtml += `        <p class="text-muted">${description}</p>\n`;
                formHtml += `    </div>\n\n`;
                return;
            } else if (elementType === "line") {
                formHtml += `    <div class="mb-4">\n`;
                formHtml += `        <hr>\n`;
                formHtml += `    </div>\n\n`;
                return;
            } else if (elementType === "banner") {
                const img = element.querySelector("img");
                const imgSrc = img?.getAttribute("src") || "/image/ppim1.png";
                const imgWidth = img?.style.width || "100%";
                const imgMaxHeight = img?.style.maxHeight || "200px";

                formHtml += `    <div class="mb-4">\n`;
                formHtml += `        <img src="${imgSrc}" alt="Banner" style="width: ${imgWidth}; max-height: ${imgMaxHeight}; object-fit: contain;">\n`;
                formHtml += `    </div>\n\n`;
                return;
            } else if (elementType === "section") {
                const title =
                    element.querySelector("h5")?.textContent || "Section Title";
                const description =
                    element.querySelector("p")?.textContent || "";

                formHtml += `    <div class="mb-4">\n`;
                formHtml += `        <h5>${title}</h5>\n`;
                formHtml += `        <hr>\n`;
                if (description) {
                    formHtml += `        <p class="text-muted">${description}</p>\n`;
                }
                formHtml += `    </div>\n\n`;
                return;
            }

            const label =
                element
                    .querySelector(".form-label")
                    ?.textContent.replace(" *", "") || "Label";
            const required =
                element
                    .querySelector(".form-label")
                    ?.textContent.includes("*") || false;
            const inputId = `field_${index}`;
            const labelId = `${inputId}Label`;

            formHtml += `    <div class="mb-3">\n`;
            formHtml += `        <label id="${labelId}" class="form-label animated-label" for="${inputId}">${label}</label>\n`;

            switch (elementType) {
                case "text":
                    const placeholder =
                        element.querySelector("input")?.placeholder || "";
                    formHtml += `        <input type="text" class="form-control contact-form form-field ${
                        required ? "required-field" : ""
                    }" id="${inputId}" name="${inputId}" placeholder="${placeholder}" ${
                        required ? "required" : ""
                    }>\n`;
                    break;

                case "textarea":
                    const textareaPlaceholder =
                        element.querySelector("textarea")?.placeholder || "";
                    const rows = element.querySelector("textarea")?.rows || 3;
                    formHtml += `        <textarea class="form-control contact-form form-field ${
                        required ? "required-field" : ""
                    }" id="${inputId}" name="${inputId}" placeholder="${textareaPlaceholder}" rows="${rows}" ${
                        required ? "required" : ""
                    }></textarea>\n`;
                    break;

                case "number":
                    const numberInput = element.querySelector("input");
                    const numberPlaceholder = numberInput?.placeholder || "";
                    const min = numberInput?.min || "";
                    const max = numberInput?.max || "";

                    formHtml += `        <input type="number" class="form-control contact-form form-field ${
                        required ? "required-field" : ""
                    }" id="${inputId}" name="${inputId}" placeholder="${numberPlaceholder}" ${
                        min ? `min="${min}"` : ""
                    } ${max ? `max="${max}"` : ""} ${
                        required ? "required" : ""
                    }>\n`;
                    break;

                case "date":
                    formHtml += `        <input type="date" class="form-control contact-form form-field ${
                        required ? "required-field" : ""
                    }" id="${inputId}" name="${inputId}" ${
                        required ? "required" : ""
                    }>\n`;
                    break;

                case "time":
                    formHtml += `        <input type="time" class="form-control contact-form form-field ${
                        required ? "required-field" : ""
                    }" id="${inputId}" name="${inputId}" ${
                        required ? "required" : ""
                    }>\n`;
                    break;

                case "dropdown":
                    formHtml += `        <select class="form-select contact-form form-field ${
                        required ? "required-field" : ""
                    }" id="${inputId}" name="${inputId}" ${
                        required ? "required" : ""
                    }>\n`;
                    formHtml += `            <option value="" selected disabled>Select an option</option>\n`;

                    element.querySelectorAll("option").forEach((option) => {
                        if (option.textContent !== "Select an option") {
                            formHtml += `            <option value="${option.textContent}">${option.textContent}</option>\n`;
                        }
                    });

                    formHtml += `        </select>\n`;
                    break;

                case "checkbox":
                    const checkboxes = element.querySelectorAll(".form-check");
                    checkboxes.forEach((checkbox, i) => {
                        const checkboxId = `${inputId}_${i}`;
                        const checkboxLabel =
                            checkbox.querySelector(".form-check-label")
                                ?.textContent || `Option ${i + 1}`;

                        formHtml += `        <div class="form-check">\n`;
                        formHtml += `            <input class="form-check-input ${
                            required ? "required-field" : ""
                        }" type="checkbox" id="${checkboxId}" name="${inputId}[]" value="${checkboxLabel}" ${
                            i === 0 && required ? "required" : ""
                        }>\n`;
                        formHtml += `            <label class="form-check-label" for="${checkboxId}">${checkboxLabel}</label>\n`;
                        formHtml += `        </div>\n`;
                    });
                    break;

                case "radio":
                    const radios = element.querySelectorAll(".form-check");
                    radios.forEach((radio, i) => {
                        const radioId = `${inputId}_${i}`;
                        const radioLabel =
                            radio.querySelector(".form-check-label")
                                ?.textContent || `Option ${i + 1}`;

                        formHtml += `        <div class="form-check">\n`;
                        formHtml += `            <input class="form-check-input ${
                            required ? "required-field" : ""
                        }" type="radio" id="${radioId}" name="${inputId}" value="${radioLabel}" ${
                            required ? "required" : ""
                        }>\n`;
                        formHtml += `            <label class="form-check-label" for="${radioId}">${radioLabel}</label>\n`;
                        formHtml += `        </div>\n`;
                    });
                    break;

                case "file":
                    // Generate unique IDs for file uploader
                    const fileId = `file_${fileIndex}`;
                    const dropboxId = `${fileId}_dropbox`;
                    const previewContainerId = `${fileId}_preview_container`;
                    const imagePreviewId = `${fileId}_image_preview`;
                    const uploadPromptId = `${fileId}_upload_prompt`;
                    const cancelButtonId = `${fileId}_cancel_upload`;
                    const labelId = `${fileId}Label`;
                    fileIndex++;

                    // Get accepted file types and max size
                    const fileInput =
                        element.querySelector('input[type="file"]');
                    const acceptedTypes = fileInput?.accept?.split(",") || [
                        "image/jpeg",
                        "image/png",
                    ];
                    const maxSize =
                        element
                            .querySelector(".upload-hint")
                            ?.textContent.match(/\d+/) || 5;

                    formHtml += `        <div class="file-upload-container">\n`;
                    formHtml += `            <div id="${dropboxId}" class="dropbox">\n`;
                    formHtml += `                <div id="${uploadPromptId}">\n`;
                    formHtml += `                    <i class="fas fa-cloud-upload-alt upload-icon"></i>\n`;
                    formHtml += `                    <p>Drag and drop a file here or click to select</p>\n`;
                    formHtml += `                    <p class="upload-hint">Max size: ${maxSize}MB</p>\n`;
                    formHtml += `                </div>\n`;
                    formHtml += `                <div id="${previewContainerId}" style="display: none;">\n`;
                    formHtml += `                    <img id="${imagePreviewId}" class="preview-image" src="#" alt="Preview">\n`;
                    formHtml += `                    <button id="${cancelButtonId}" class="cancel-button" type="button">×</button>\n`;
                    formHtml += `                </div>\n`;
                    formHtml += `            </div>\n`;
                    formHtml += `            <input type="file" id="${fileId}" name="${fileId}" class="form-field ${
                        required ? "required-field" : ""
                    }" style="display: none;" ${required ? "required" : ""}>\n`;
                    formHtml += `        </div>\n`;

                    // Add file uploader configuration
                    fileUploaders.push({
                        id: fileId,
                        dropboxId: dropboxId,
                        previewContainerId: previewContainerId,
                        imagePreviewId: imagePreviewId,
                        uploadPromptId: uploadPromptId,
                        cancelButtonId: cancelButtonId,
                        labelId: labelId,
                        maxSizeMB: maxSize,
                        acceptedTypes: acceptedTypes,
                    });
                    break;
            }

            formHtml += `    </div>\n\n`;
        });

        // Add submit button
        formHtml += `    <div class="text-center mt-4">\n`;
        formHtml += `        <button type="submit" id="submitForm" class="btn btn-dark px-4 py-2" disabled>Submit</button>\n`;
        formHtml += `    </div>\n`;
        formHtml += `</form>`;

        // Add file uploaders initialization
        if (fileUploaders.length > 0) {
            formJs += `    // Initialize file uploaders\n`;
            fileUploaders.forEach((uploader) => {
                formJs += `    new FileUploader({\n`;
                formJs += `        dropboxId: "${uploader.dropboxId}",\n`;
                formJs += `        inputId: "${uploader.id}",\n`;
                formJs += `        previewContainerId: "${uploader.previewContainerId}",\n`;
                formJs += `        imagePreviewId: "${uploader.imagePreviewId}",\n`;
                formJs += `        uploadPromptId: "${uploader.uploadPromptId}",\n`;
                formJs += `        cancelButtonId: "${uploader.cancelButtonId}",\n`;
                formJs += `        labelId: "${uploader.labelId}",\n`;
                formJs += `        maxSizeMB: ${uploader.maxSizeMB},\n`;
                formJs += `        acceptedTypes: ${JSON.stringify(
                    uploader.acceptedTypes
                )},\n`;
                formJs += `        onFileSelect: () => formUtils.validateForm(),\n`;
                formJs += `        onFileRemove: () => formUtils.validateForm()\n`;
                formJs += `    });\n`;
            });
        }

        formJs += `});\n`;

        return {
            html: formHtml,
            javascript: formJs,
        };
    }

    // Create form element in the playground
    function createFormElement(type, container) {
        const elementData = formElements.find((el) => el.id === type);
        if (!elementData) return;

        const uniqueId = `form-element-${elementCounter++}`;
        const formElement = document.createElement("div");
        formElement.className = "form-element card mb-3";
        formElement.setAttribute("draggable", "true");
        formElement.setAttribute("data-element-id", uniqueId);
        formElement.setAttribute("data-element-type", type);

        // Handle and controls bar
        const controlsHtml = `
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

        // Element content
        const contentHtml = `
            <div class="card-body py-3">
                ${getElementTemplate(type)}
            </div>
        `;

        formElement.innerHTML = controlsHtml + contentHtml;
        container.appendChild(formElement);

        // Handle element specific actions
        setupFormElementEvents(formElement);

        // Initialize form fields with FormUtils behaviors
        if (
            type === "text" ||
            type === "textarea" ||
            type === "number" ||
            type === "date" ||
            type === "time"
        ) {
            initializeFormField(formElement);
        }

        // Initialize file uploader for file inputs
        if (type === "file") {
            initializeFileUploader(formElement);
        }
    }

    // Initialize form field with animated label behavior
    function initializeFormField(element) {
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

    // Initialize file uploader for file input elements
    function initializeFileUploader(element) {
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

    // Get template HTML for each element type
    function getElementTemplate(type) {
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

    // Setup events for form elements in the playground
    function setupFormElementEvents(element) {
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
                        saveFormBtn.style.display = "none";
                    }

                    // Clear edit panel if deleted element was being edited
                    clearEditPanel();
                }
            });
        }

        // Edit button
        const editBtn = element.querySelector(".btn-edit");
        if (editBtn) {
            editBtn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const elementId = this.getAttribute("data-id");
                const elementToEdit = document.querySelector(
                    `[data-element-id="${elementId}"]`
                );
                if (elementToEdit) {
                    showEditPanel(elementToEdit);
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

    // Enable dropping elements between form elements for reordering
    playgroundContainer.addEventListener("dragover", function (e) {
        e.preventDefault();

        const draggable = document.querySelector(".dragging");
        if (!draggable) return;

        const afterElement = getDragAfterElement(
            playgroundContainer,
            e.clientY
        );
        if (afterElement == null) {
            playgroundContainer.appendChild(draggable);
        } else {
            playgroundContainer.insertBefore(draggable, afterElement);
        }
    });

    // Helper function to determine where to drop the element during reordering
    function getDragAfterElement(container, y) {
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

    // Display the edit panel for a form element
    function showEditPanel(element) {
        editContainer.classList.remove("idle");
        const elementType = element.getAttribute("data-element-type");
        const elementId = element.getAttribute("data-element-id");

        let editPanelHtml = `
            <div class="edit-panel p-3" data-editing-id="${elementId}">
                <h6 class="mb-3">Edit ${
                    formElements.find((el) => el.id === elementType)?.name ||
                    "Element"
                }</h6>
        `;

        // Handle our new separate elements
        if (elementType === "title") {
            const title = element.querySelector("h5")?.textContent || "Title";

            editPanelHtml += `
                <div class="mb-3">
                    <label class="form-label">Title Text</label>
                    <input type="text" class="form-control contact-form" id="edit-title-text" value="${title}">
                </div>
            `;
        } else if (elementType === "desc") {
            const desc = element.querySelector("p")?.textContent || "";

            editPanelHtml += `
                <div class="mb-3">
                    <label class="form-label">Description Text</label>
                    <textarea class="form-control contact-form" id="edit-desc-text" rows="3">${desc}</textarea>
                </div>
            `;
        } else if (elementType === "line") {
            // No editable properties for line separator
            editPanelHtml += `
                <div class="mb-3">
                    <p class="text-muted">This element has no editable properties.</p>
                </div>
            `;
        } else if (elementType === "banner") {
            const img = element.querySelector("img");
            const imageSrc = img?.getAttribute("src") || "/image/ppim1.png";
            const width = img?.style.width || "100%";
            const maxHeight = img?.style.maxHeight || "200px";

            editPanelHtml += `
                <div class="mb-3">
                    <label class="form-label">Image Source</label>
                    <select class="form-control contact-form" id="edit-banner-image">
                        <option value="/image/ppim1.png" ${
                            imageSrc === "/image/ppim1.png" ? "selected" : ""
                        }>PPIM Logo</option>
                        <option value="/image/BANNERPPIM25-08.jpg" ${
                            imageSrc === "/image/BANNERPPIM25-08.jpg"
                                ? "selected"
                                : ""
                        }>PPIM Banner 1</option>
                        <option value="/image/ppimbanner1.jpg" ${
                            imageSrc === "/image/ppimbanner1.jpg"
                                ? "selected"
                                : ""
                        }>PPIM Banner 2</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Width</label>
                    <input type="text" class="form-control contact-form" id="edit-banner-width" value="${width}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Max Height</label>
                    <input type="text" class="form-control contact-form" id="edit-banner-max-height" value="${maxHeight}">
                </div>
            `;
        } else if (elementType === "section") {
            const sectionTitle =
                element.querySelector("h5")?.textContent || "Section Title";
            const sectionDesc =
                element.querySelector("p")?.textContent ||
                "Section description goes here.";

            editPanelHtml += `
                <div class="mb-3">
                    <label class="form-label">Section Title</label>
                    <input type="text" class="form-control contact-form" id="edit-section-title" value="${sectionTitle}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Section Description</label>
                    <textarea class="form-control contact-form" id="edit-section-desc" rows="3">${sectionDesc}</textarea>
                </div>
            `;
        } else {
            editPanelHtml += `
                <div class="mb-3">
                    <label class="form-label">Label</label>
                    <input type="text" class="form-control contact-form" id="edit-label" value="Label">
                </div>
        `;

            // Add element-specific settings
            if (elementType !== "section") {
                editPanelHtml += `
                <div class="mb-3">
                    <label class="form-label">Placeholder</label>
                    <input type="text" class="form-control contact-form" id="edit-placeholder" value="Placeholder">
                </div>
            `;
            }

            // Add more specific settings based on element type
            switch (elementType) {
                case "dropdown":
                case "checkbox":
                case "radio":
                    editPanelHtml += `
                    <div class="mb-3">
                        <label class="form-label">Options</label>
                        <div class="options-container">
                            <div class="input-group mb-2">
                                <input type="text" class="form-control contact-form" value="Option 1">
                                <button class="btn btn-outline-secondary btn-remove-option">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="input-group mb-2">
                                <input type="text" class="form-control contact-form" value="Option 2">
                                <button class="btn btn-outline-secondary btn-remove-option">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-add-option mt-2">
                            <i class="fas fa-plus"></i> Add Option
                        </button>
                    </div>
                `;
                    break;

                case "number":
                    editPanelHtml += `
                    <div class="row mb-3">
                        <div class="col">
                            <label class="form-label">Min Value</label>
                            <input type="number" class="form-control contact-form" id="edit-min">
                        </div>
                        <div class="col">
                            <label class="form-label">Max Value</label>
                            <input type="number" class="form-control contact-form" id="edit-max">
                        </div>
                    </div>
                `;
                    break;

                case "textarea":
                    editPanelHtml += `
                    <div class="mb-3">
                        <label class="form-label">Rows</label>
                        <input type="number" class="form-control contact-form" id="edit-rows" value="3">
                    </div>
                `;
                    break;

                case "file":
                    editPanelHtml += `
                    <div class="mb-3">
                        <label class="form-label">Max File Size (MB)</label>
                        <input type="number" class="form-control contact-form" id="edit-maxsize" value="5">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Accepted File Types</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="file-type-jpg" checked>
                            <label class="form-check-label" for="file-type-jpg">JPG/JPEG</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="file-type-png" checked>
                            <label class="form-check-label" for="file-type-png">PNG</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="file-type-pdf">
                            <label class="form-check-label" for="file-type-pdf">PDF</label>
                        </div>
                    </div>
                `;
                    break;

                case "description":
                    editPanelHtml = `
                    <div class="edit-panel p-3" data-editing-id="${elementId}">
                        <h6 class="mb-3">Edit Description</h6>
                        
                        <div class="mb-3">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-control contact-form" id="edit-description-title" value="Title">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control contact-form" id="edit-description-desc" rows="3">Description text goes here.</textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Banner Image</label>
                            <select class="form-select contact-form" id="edit-description-image">
                                <option value="/image/ppim1.png">PPIM Logo</option>
                                <option value="/image/BANNERPPIM25-08.jpg">PPIM Banner 1</option>
                                <option value="/image/ppimbanner1.jpg">PPIM Banner 2</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Image Width</label>
                            <input type="text" class="form-control contact-form" id="edit-description-width" value="100%">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Image Max Height</label>
                            <input type="text" class="form-control contact-form" id="edit-description-max-height" value="200px">
                        </div>
                    </div>
                `;
                    break;

                case "section":
                    editPanelHtml = `
                    <div class="edit-panel p-3" data-editing-id="${elementId}">
                        <h6 class="mb-3">Edit Section</h6>
                        
                        <div class="mb-3">
                            <label class="form-label">Section Title</label>
                            <input type="text" class="form-control contact-form" id="edit-section-title" value="Section Title">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control contact-form" id="edit-section-desc" rows="3">Section description goes here.</textarea>
                        </div>
                    </div>
                `;
                    break;
            }

            // Add validation options for all fields except sections
            if (elementType !== "section") {
                editPanelHtml += `
                <div class="mb-3">
                    <label class="form-label">Validation</label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="edit-required">
                        <label class="form-check-label" for="edit-required">Make this field required</label>
                    </div>
                </div>
            `;
            }

            // Add save and cancel buttons
            editPanelHtml += `
            <button class="btn btn-dark btn-save-element w-100 mt-3">Save Changes</button>
            
            <div class="text-center mt-3">
                <button class="btn btn-outline-secondary w-100 mt-3" id="cancel-edit">Cancel</button>
            </div>
        </div>
        `;

            // Set the edit panel HTML
            editContainer.innerHTML =
                '<h5 class="builderTitle">Edit Section</h5>' + editPanelHtml;

            // Update input values based on current element
            updateEditPanelValues(element);

            // Initialize form fields with FormUtils behaviors for the edit panel
            document
                .querySelectorAll(".edit-panel .contact-form")
                .forEach((field) => {
                    const label = field.previousElementSibling;
                    if (label && label.classList.contains("form-label")) {
                        label.classList.add("animated-label");

                        // Set initial state
                        if (field.value.trim()) {
                            label.classList.add("visible");
                        }

                        // Add event listener
                        field.addEventListener("input", function () {
                            if (this.value.trim()) {
                                label.classList.add("visible");
                            } else {
                                label.classList.remove("visible");
                            }
                        });

                        // Trigger input event to show/hide label
                        field.dispatchEvent(new Event("input"));

                        // Auto-expand for textarea
                        if (field.tagName === "TEXTAREA") {
                            field.addEventListener("input", function () {
                                this.style.height = "auto";
                                this.style.height = this.scrollHeight + "px";
                            });

                            // Trigger initial height adjustment
                            field.dispatchEvent(new Event("input"));
                        }
                    }
                });

            // Set up edit panel event listeners
            setupEditPanelEvents(elementType);
        }

        // Update edit panel input values based on the element being edited
        function updateEditPanelValues(element) {
            const elementType = element.getAttribute("data-element-type");

            // Get current values
            const label =
                element
                    .querySelector(".form-label")
                    ?.textContent.replace(" *", "") || "";
            const required =
                element
                    .querySelector(".form-label")
                    ?.textContent.includes("*") || false;

            // Update common fields
            const labelInput = document.getElementById("edit-label");
            const requiredInput = document.getElementById("edit-required");

            if (labelInput) labelInput.value = label;
            if (requiredInput) requiredInput.checked = required;

            // Update element-specific fields
            switch (elementType) {
                case "description":
                    const descTitle =
                        element.querySelector("h5")?.textContent || "";
                    const descText =
                        element.querySelector("p")?.textContent || "";
                    const descImage = element.querySelector("img");

                    const titleInput = document.getElementById(
                        "edit-description-title"
                    );
                    const descInput = document.getElementById(
                        "edit-description-desc"
                    );
                    const imageSelect = document.getElementById(
                        "edit-description-image"
                    );
                    const widthInput = document.getElementById(
                        "edit-description-width"
                    );
                    const maxHeightInput = document.getElementById(
                        "edit-description-max-height"
                    );

                    if (titleInput) titleInput.value = descTitle;
                    if (descInput) descInput.value = descText;

                    if (descImage && imageSelect) {
                        const imgSrc = descImage.getAttribute("src");
                        if (imgSrc) {
                            // Find and select the matching option
                            for (
                                let i = 0;
                                i < imageSelect.options.length;
                                i++
                            ) {
                                if (imageSelect.options[i].value === imgSrc) {
                                    imageSelect.selectedIndex = i;
                                    break;
                                }
                            }
                        }

                        // Get image style properties
                        if (widthInput && descImage.style.width) {
                            widthInput.value = descImage.style.width;
                        }

                        if (maxHeightInput && descImage.style.maxHeight) {
                            maxHeightInput.value = descImage.style.maxHeight;
                        }
                    }
                    break;

                case "text":
                case "number":
                case "date":
                case "time":
                    const input = element.querySelector("input");
                    const placeholderInput =
                        document.getElementById("edit-placeholder");

                    if (input && placeholderInput) {
                        placeholderInput.value = input.placeholder || "";

                        if (elementType === "number") {
                            const minInput =
                                document.getElementById("edit-min");
                            const maxInput =
                                document.getElementById("edit-max");

                            if (minInput) minInput.value = input.min || "";
                            if (maxInput) maxInput.value = input.max || "";
                        }
                    }
                    break;

                case "textarea":
                    const textarea = element.querySelector("textarea");
                    const textareaPlaceholder =
                        document.getElementById("edit-placeholder");
                    const rowsInput = document.getElementById("edit-rows");

                    if (textarea && textareaPlaceholder) {
                        textareaPlaceholder.value = textarea.placeholder || "";
                    }

                    if (textarea && rowsInput) {
                        rowsInput.value = textarea.rows || 3;
                    }
                    break;

                case "dropdown":
                case "checkbox":
                case "radio":
                    const optionsContainer =
                        document.querySelector(".options-container");
                    if (optionsContainer) {
                        optionsContainer.innerHTML = "";

                        // Get all options from the element
                        let options = [];
                        if (elementType === "dropdown") {
                            element
                                .querySelectorAll("option")
                                .forEach((option) => {
                                    if (
                                        option.textContent !==
                                        "Select an option"
                                    ) {
                                        options.push(option.textContent);
                                    }
                                });
                        } else {
                            element
                                .querySelectorAll(".form-check-label")
                                .forEach((label) => {
                                    options.push(label.textContent);
                                });
                        }

                        // Add option inputs to edit panel
                        options.forEach((option) => {
                            const optionDiv = document.createElement("div");
                            optionDiv.className = "input-group mb-2";
                            optionDiv.innerHTML = `
                            <input type="text" class="form-control contact-form" value="${option}">
                            <button class="btn btn-outline-secondary btn-remove-option">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                            optionsContainer.appendChild(optionDiv);

                            // Add event listener for remove button
                            const removeBtn =
                                optionDiv.querySelector(".btn-remove-option");
                            if (removeBtn) {
                                removeBtn.addEventListener(
                                    "click",
                                    function () {
                                        optionDiv.remove();
                                    }
                                );
                            }
                        });
                    }
                    break;

                case "section":
                    const sectionTitle =
                        element.querySelector("h5")?.textContent || "";
                    const sectionDesc =
                        element.querySelector("p")?.textContent || "";

                    const secTitleInput =
                        document.getElementById("edit-section-title");
                    const secDescInput =
                        document.getElementById("edit-section-desc");

                    if (secTitleInput) secTitleInput.value = sectionTitle;
                    if (secDescInput) secDescInput.value = sectionDesc;
                    break;
            }
        }

        // Clear the edit panel - moved to top level scope
        function clearEditPanel() {
            editContainer.classList.add("idle");
            editContainer.innerHTML =
                '<h5 class="builderTitle">Edit Section</h5>';
        }

        // Handle cancel button in edit panel
        document.addEventListener("click", function (e) {
            if (e.target && e.target.id === "cancel-edit") {
                clearEditPanel();
            }
        });

        // Setup edit panel event listeners
        function setupEditPanelEvents(elementType) {
            // Handle the save button
            const saveBtn = document.querySelector(".btn-save-element");
            if (saveBtn) {
                saveBtn.addEventListener("click", function () {
                    const editPanel = document.querySelector(".edit-panel");
                    const elementId = editPanel.getAttribute("data-editing-id");
                    const elementToEdit = document.querySelector(
                        `[data-element-id="${elementId}"]`
                    );

                    if (elementToEdit) {
                        // Get the element type from the element itself to ensure accuracy
                        const actualElementType =
                            elementToEdit.getAttribute("data-element-type");
                        // Update the element based on the edit panel values
                        updateElement(elementToEdit, actualElementType);

                        // Clear the edit panel
                        clearEditPanel();
                    }
                });
            }

            // Handle add option button for dropdowns, checkboxes, radio buttons
            const addOptionBtn = document.querySelector(".btn-add-option");
            if (addOptionBtn) {
                addOptionBtn.addEventListener("click", function () {
                    const optionsContainer =
                        document.querySelector(".options-container");
                    const newOption = document.createElement("div");
                    newOption.className = "input-group mb-2";
                    newOption.innerHTML = `
                    <input type="text" class="form-control contact-form" value="New Option">
                    <button class="btn btn-outline-secondary btn-remove-option">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                    optionsContainer.appendChild(newOption);

                    // Add event listener for the remove button
                    const removeBtn =
                        newOption.querySelector(".btn-remove-option");
                    if (removeBtn) {
                        removeBtn.addEventListener("click", function () {
                            newOption.remove();
                        });
                    }

                    // Initialize form field behavior
                    const input = newOption.querySelector("input");
                    if (input) {
                        input.focus();
                    }
                });
            }

            // Handle remove option buttons
            const removeOptionBtns =
                document.querySelectorAll(".btn-remove-option");
            removeOptionBtns.forEach((btn) => {
                btn.addEventListener("click", function () {
                    const optionContainer = this.closest(".input-group");
                    optionContainer.remove();
                });
            });
        }

        // Update form element based on edit panel values
        function updateElement(element, elementType) {
            // Handle our new separate elements
            if (elementType === "title") {
                const title =
                    document.getElementById("edit-title-text")?.value ||
                    "Title";

                // Update the title element
                const titleElement = element.querySelector("h5");
                if (titleElement) titleElement.textContent = title;
                return;
            }

            if (elementType === "desc") {
                const desc =
                    document.getElementById("edit-desc-text")?.value || "";

                // Update the description element
                const descElement = element.querySelector("p");
                if (descElement) descElement.textContent = desc;
                return;
            }

            if (elementType === "line") {
                // No editable properties for line separator
                return;
            }

            if (elementType === "banner") {
                const imageSrc =
                    document.getElementById("edit-banner-image")?.value ||
                    "/image/ppim1.png";
                const width =
                    document.getElementById("edit-banner-width")?.value ||
                    "100%";
                const maxHeight =
                    document.getElementById("edit-banner-max-height")?.value ||
                    "200px";

                // Update the banner element
                const imageElement = element.querySelector("img");
                if (imageElement) {
                    imageElement.setAttribute("src", imageSrc);
                    imageElement.style.width = width;
                    imageElement.style.maxHeight = maxHeight;
                    imageElement.style.objectFit = "contain";
                }
                return;
            }

            const label =
                document.getElementById("edit-label")?.value || "Label";
            const placeholder =
                document.getElementById("edit-placeholder")?.value ||
                "Placeholder";
            const required =
                document.getElementById("edit-required")?.checked || false;

            // Update label and add required indicator if needed
            const labelElement = element.querySelector(".form-label");
            if (labelElement) {
                labelElement.textContent = label + (required ? " *" : "");
            }

            // Update element based on type
            switch (elementType) {
                case "text":
                case "number":
                case "date":
                case "time":
                    const input = element.querySelector("input");
                    if (input) {
                        input.placeholder = placeholder;
                        input.required = required;

                        // Add or remove required-field class
                        if (required) {
                            input.classList.add("required-field");
                        } else {
                            input.classList.remove("required-field");
                        }

                        // Handle number input min/max
                        if (elementType === "number") {
                            const min =
                                document.getElementById("edit-min")?.value;
                            const max =
                                document.getElementById("edit-max")?.value;

                            if (min) input.min = min;
                            if (max) input.max = max;
                        }
                    }
                    break;

                case "textarea":
                    const textarea = element.querySelector("textarea");
                    if (textarea) {
                        textarea.placeholder = placeholder;
                        textarea.required = required;

                        // Add or remove required-field class
                        if (required) {
                            textarea.classList.add("required-field");
                        } else {
                            textarea.classList.remove("required-field");
                        }

                        const rows =
                            document.getElementById("edit-rows")?.value || 3;
                        textarea.rows = rows;
                    }
                    break;

                case "dropdown":
                    const select = element.querySelector("select");
                    if (select) {
                        select.required = required;

                        // Add or remove required-field class
                        if (required) {
                            select.classList.add("required-field");
                        } else {
                            select.classList.remove("required-field");
                        }

                        // Clear existing options
                        select.innerHTML =
                            "<option selected disabled>Select an option</option>";

                        // Add new options from edit panel
                        const options = document.querySelectorAll(
                            ".options-container input"
                        );
                        options.forEach((option) => {
                            const optionElement =
                                document.createElement("option");
                            optionElement.textContent = option.value;
                            select.appendChild(optionElement);
                        });
                    }
                    break;

                case "checkbox":
                case "radio":
                    const container = element.querySelector(".card-body > div");
                    if (container) {
                        // Keep the label, remove existing options
                        const labelHtml = `<label class="form-label d-block">${
                            label + (required ? " *" : "")
                        }</label>`;
                        let newHtml = labelHtml;

                        // Add new options from edit panel
                        const options = document.querySelectorAll(
                            ".options-container input"
                        );
                        options.forEach((option, index) => {
                            const id = `${elementType}-${Date.now()}-${index}`;
                            const name = `${elementType}-group-${Date.now()}`;
                            newHtml += `
                            <div class="form-check">
                                <input class="form-check-input ${
                                    required ? "required-field" : ""
                                }" 
                                       type="${elementType}" name="${name}" id="${id}" 
                                       ${required ? "required" : ""}>
                                <label class="form-check-label" for="${id}">${
                                option.value
                            }</label>
                            </div>
                        `;
                        });

                        container.innerHTML = newHtml;
                    }
                    break;

                case "file":
                    const fileInput =
                        element.querySelector('input[type="file"]');
                    const fileContainer =
                        element.querySelector(".card-body > div");

                    if (fileInput && fileContainer) {
                        fileInput.required = required;

                        // Add or remove required-field class
                        if (required) {
                            fileInput.classList.add("required-field");
                        } else {
                            fileInput.classList.remove("required-field");
                        }

                        // Update file upload label
                        const fileLabel =
                            fileContainer.querySelector(".form-label");
                        if (fileLabel) {
                            fileLabel.textContent =
                                label + (required ? " *" : "");
                        }

                        // Update max file size hint
                        const maxSize =
                            document.getElementById("edit-maxsize")?.value || 5;
                        const hintElement =
                            fileContainer.querySelector(".upload-hint");
                        if (hintElement) {
                            hintElement.textContent = `Max size: ${maxSize}MB`;
                        }

                        // Update accepted file types
                        const acceptedTypes = [];
                        if (document.getElementById("file-type-jpg")?.checked) {
                            acceptedTypes.push("image/jpeg");
                            acceptedTypes.push("image/jpg");
                        }
                        if (document.getElementById("file-type-png")?.checked) {
                            acceptedTypes.push("image/png");
                        }
                        if (document.getElementById("file-type-pdf")?.checked) {
                            acceptedTypes.push("application/pdf");
                        }

                        fileInput.accept = acceptedTypes.join(",");

                        // Re-initialize file uploader
                        setTimeout(() => {
                            const dropboxId = fileInput.id + "-dropbox";
                            const previewContainerId =
                                fileInput.id + "-preview-container";
                            const imagePreviewId =
                                fileInput.id + "-image-preview";
                            const uploadPromptId =
                                fileInput.id + "-upload-prompt";
                            const cancelButtonId =
                                fileInput.id + "-cancel-upload";

                            new FileUploader({
                                dropboxId: dropboxId,
                                inputId: fileInput.id,
                                previewContainerId: previewContainerId,
                                imagePreviewId: imagePreviewId,
                                uploadPromptId: uploadPromptId,
                                cancelButtonId: cancelButtonId,
                                maxSizeMB: maxSize,
                                acceptedTypes: acceptedTypes,
                                labelId: null,
                            });
                        }, 0);
                    }
                    break;

                case "section":
                    const sectionTitle =
                        document.getElementById("edit-section-title")?.value ||
                        "Section Title";
                    const sectionDesc =
                        document.getElementById("edit-section-desc")?.value ||
                        "Section description goes here.";

                    const sectionContainer =
                        element.querySelector(".card-body > div");
                    if (sectionContainer) {
                        sectionContainer.innerHTML = `
                        <h5>${sectionTitle}</h5>
                        <hr>
                        <p class="text-muted">${sectionDesc}</p>
                    `;
                    }
                    break;
            }
        }

        // Helper function to copy to clipboard
        function copyToClipboard(text) {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
    }
});
