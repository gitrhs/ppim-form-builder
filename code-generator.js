/**
 * CodeGenerator - Generates HTML and JavaScript code for the form
 */
class CodeGenerator {
    /**
     * Initialize the code generator
     */
    constructor() {
        this.formElementsManager = new FormElementsManager();
    }

    /**
     * Show form code in a modal
     */
    showFormCode() {
        // Generate the form code
        const formCode = this.generateFormCode();
        const formJson = this.generateFormJson();
        // Create a modal to display the code
        const modal = UIManager.createCodeModal(
            formJson,
            formCode.html,
            formCode.javascript
        );
        UIManager.showModal(modal);
    }

    /**
     * Generate form JSON data structure
     * @returns {Object} JSON representation of the form
     */
    generateFormJson() {
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

    /**
     * Generate form code (HTML and JavaScript)
     * @returns {Object} Object containing HTML and JavaScript code
     */
    generateFormCode() {
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

            // Handle different elements
            if (this.isDescriptiveElement(elementType)) {
                formHtml += this.generateDescriptiveElementHtml(
                    element,
                    elementType
                );
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
            formHtml += `        <label id="${labelId}" class="form-label animated-label" for="${inputId}">${label}${
                required ? " *" : ""
            }</label>\n`;

            switch (elementType) {
                case "text":
                    formHtml += this.generateTextInputHtml(
                        element,
                        inputId,
                        required
                    );
                    break;

                case "textarea":
                    formHtml += this.generateTextareaHtml(
                        element,
                        inputId,
                        required
                    );
                    break;

                case "number":
                    formHtml += this.generateNumberInputHtml(
                        element,
                        inputId,
                        required
                    );
                    break;

                case "date":
                    formHtml += this.generateDateInputHtml(inputId, required);
                    break;

                case "time":
                    formHtml += this.generateTimeInputHtml(inputId, required);
                    break;

                case "dropdown":
                    formHtml += this.generateDropdownHtml(
                        element,
                        inputId,
                        required
                    );
                    break;

                case "checkbox":
                    formHtml += this.generateCheckboxesHtml(
                        element,
                        inputId,
                        required
                    );
                    break;

                case "radio":
                    formHtml += this.generateRadioButtonsHtml(
                        element,
                        inputId,
                        required
                    );
                    break;

                case "file":
                    const fileUploaderConfig = this.generateFileUploaderHtml(
                        element,
                        fileIndex,
                        required
                    );
                    formHtml += fileUploaderConfig.html;
                    fileUploaders.push(fileUploaderConfig.config);
                    fileIndex++;
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
            formJs += this.generateFileUploadersJs(fileUploaders);
        }

        formJs += `});\n`;

        return {
            html: formHtml,
            javascript: formJs,
        };
    }

    /**
     * Check if an element is a descriptive element (title, desc, line, banner, section)
     * @param {string} elementType - Type of the element
     * @returns {boolean} True if it's a descriptive element
     */
    isDescriptiveElement(elementType) {
        return ["title", "desc", "line", "banner", "section"].includes(
            elementType
        );
    }

    /**
     * Generate HTML for descriptive elements
     * @param {HTMLElement} element - The form element
     * @param {string} elementType - Type of the element
     * @returns {string} Generated HTML
     */
    generateDescriptiveElementHtml(element, elementType) {
        let html = "";

        switch (elementType) {
            case "title":
                const title =
                    element.querySelector("h5")?.textContent || "Title";
                html = `    <div class="mb-4">\n`;
                html += `        <h5>${title}</h5>\n`;
                html += `    </div>\n\n`;
                break;

            case "desc":
                const description =
                    element.querySelector("p")?.textContent || "";
                html = `    <div class="mb-4">\n`;
                html += `        <p class="text-muted">${description}</p>\n`;
                html += `    </div>\n\n`;
                break;

            case "line":
                html = `    <div class="mb-4">\n`;
                html += `        <hr>\n`;
                html += `    </div>\n\n`;
                break;

            case "banner":
                const img = element.querySelector("img");
                const imgSrc = img?.getAttribute("src") || "/image/ppim1.png";
                const imgWidth = img?.style.width || "100%";
                const imgMaxHeight = img?.style.maxHeight || "200px";

                html = `    <div class="mb-4">\n`;
                html += `        <img src="${imgSrc}" alt="Banner" style="width: ${imgWidth}; max-height: ${imgMaxHeight}; object-fit: contain;">\n`;
                html += `    </div>\n\n`;
                break;

            case "section":
                const sectionTitle =
                    element.querySelector("h5")?.textContent || "Section Title";
                const sectionDesc =
                    element.querySelector("p")?.textContent || "";

                html = `    <div class="mb-4">\n`;
                html += `        <h5>${sectionTitle}</h5>\n`;
                html += `        <hr>\n`;
                if (sectionDesc) {
                    html += `        <p class="text-muted">${sectionDesc}</p>\n`;
                }
                html += `    </div>\n\n`;
                break;
        }

        return html;
    }

    /**
     * Generate HTML for text input
     * @param {HTMLElement} element - The form element
     * @param {string} inputId - ID for the input
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateTextInputHtml(element, inputId, required) {
        const placeholder = element.querySelector("input")?.placeholder || "";

        return `        <input type="text" class="form-control contact-form form-field ${
            required ? "required-field" : ""
        }" id="${inputId}" name="${inputId}" placeholder="${placeholder}" ${
            required ? "required" : ""
        }>\n`;
    }

    /**
     * Generate HTML for textarea
     * @param {HTMLElement} element - The form element
     * @param {string} inputId - ID for the textarea
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateTextareaHtml(element, inputId, required) {
        const textareaPlaceholder =
            element.querySelector("textarea")?.placeholder || "";
        const rows = element.querySelector("textarea")?.rows || 3;

        return `        <textarea class="form-control contact-form form-field ${
            required ? "required-field" : ""
        }" id="${inputId}" name="${inputId}" placeholder="${textareaPlaceholder}" rows="${rows}" ${
            required ? "required" : ""
        }></textarea>\n`;
    }

    /**
     * Generate HTML for number input
     * @param {HTMLElement} element - The form element
     * @param {string} inputId - ID for the input
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateNumberInputHtml(element, inputId, required) {
        const numberInput = element.querySelector("input");
        const numberPlaceholder = numberInput?.placeholder || "";
        const min = numberInput?.min || "";
        const max = numberInput?.max || "";

        return `        <input type="number" class="form-control contact-form form-field ${
            required ? "required-field" : ""
        }" id="${inputId}" name="${inputId}" placeholder="${numberPlaceholder}" ${
            min ? `min="${min}"` : ""
        } ${max ? `max="${max}"` : ""} ${required ? "required" : ""}>\n`;
    }

    /**
     * Generate HTML for date input
     * @param {string} inputId - ID for the input
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateDateInputHtml(inputId, required) {
        return `        <input type="date" class="form-control contact-form form-field ${
            required ? "required-field" : ""
        }" id="${inputId}" name="${inputId}" ${required ? "required" : ""}>\n`;
    }

    /**
     * Generate HTML for time input
     * @param {string} inputId - ID for the input
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateTimeInputHtml(inputId, required) {
        return `        <input type="time" class="form-control contact-form form-field ${
            required ? "required-field" : ""
        }" id="${inputId}" name="${inputId}" ${required ? "required" : ""}>\n`;
    }

    /**
     * Generate HTML for dropdown
     * @param {HTMLElement} element - The form element
     * @param {string} inputId - ID for the select
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateDropdownHtml(element, inputId, required) {
        let html = `        <select class="form-select contact-form form-field ${
            required ? "required-field" : ""
        }" id="${inputId}" name="${inputId}" ${required ? "required" : ""}>\n`;
        html += `            <option value="" selected disabled>Select an option</option>\n`;

        element.querySelectorAll("option").forEach((option) => {
            if (option.textContent !== "Select an option") {
                html += `            <option value="${option.textContent}">${option.textContent}</option>\n`;
            }
        });

        html += `        </select>\n`;
        return html;
    }

    /**
     * Generate HTML for checkboxes
     * @param {HTMLElement} element - The form element
     * @param {string} inputId - Base ID for the checkboxes
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateCheckboxesHtml(element, inputId, required) {
        let html = "";
        const checkboxes = element.querySelectorAll(".form-check");

        checkboxes.forEach((checkbox, i) => {
            const checkboxId = `${inputId}_${i}`;
            const checkboxLabel =
                checkbox.querySelector(".form-check-label")?.textContent ||
                `Option ${i + 1}`;

            html += `        <div class="form-check">\n`;
            html += `            <input class="form-check-input ${
                required ? "required-field" : ""
            }" type="checkbox" id="${checkboxId}" name="${inputId}[]" value="${checkboxLabel}" ${
                i === 0 && required ? "required" : ""
            }>\n`;
            html += `            <label class="form-check-label" for="${checkboxId}">${checkboxLabel}</label>\n`;
            html += `        </div>\n`;
        });

        return html;
    }

    /**
     * Generate HTML for radio buttons
     * @param {HTMLElement} element - The form element
     * @param {string} inputId - Base ID and name for the radio buttons
     * @param {boolean} required - Whether field is required
     * @returns {string} Generated HTML
     */
    generateRadioButtonsHtml(element, inputId, required) {
        let html = "";
        const radios = element.querySelectorAll(".form-check");

        radios.forEach((radio, i) => {
            const radioId = `${inputId}_${i}`;
            const radioLabel =
                radio.querySelector(".form-check-label")?.textContent ||
                `Option ${i + 1}`;

            html += `        <div class="form-check">\n`;
            html += `            <input class="form-check-input ${
                required ? "required-field" : ""
            }" type="radio" id="${radioId}" name="${inputId}" value="${radioLabel}" ${
                required ? "required" : ""
            }>\n`;
            html += `            <label class="form-check-label" for="${radioId}">${radioLabel}</label>\n`;
            html += `        </div>\n`;
        });

        return html;
    }

    /**
     * Generate HTML for file uploader
     * @param {HTMLElement} element - The form element
     * @param {number} fileIndex - Index for generating unique IDs
     * @param {boolean} required - Whether field is required
     * @returns {Object} Object containing HTML and config for the file uploader
     */
    generateFileUploaderHtml(element, fileIndex, required) {
        // Generate unique IDs for file uploader
        const fileId = `file_${fileIndex}`;
        const dropboxId = `${fileId}_dropbox`;
        const previewContainerId = `${fileId}_preview_container`;
        const imagePreviewId = `${fileId}_image_preview`;
        const uploadPromptId = `${fileId}_upload_prompt`;
        const cancelButtonId = `${fileId}_cancel_upload`;
        const labelId = `${fileId}Label`;

        // Get accepted file types and max size
        const fileInput = element.querySelector('input[type="file"]');
        const acceptedTypes = fileInput?.accept?.split(",") || [
            "image/jpeg",
            "image/png",
        ];
        const maxSize =
            element.querySelector(".upload-hint")?.textContent.match(/\d+/) ||
            5;

        let html = `        <div class="file-upload-container">\n`;
        html += `            <div id="${dropboxId}" class="dropbox">\n`;
        html += `                <div id="${uploadPromptId}">\n`;
        html += `                    <i class="fas fa-cloud-upload-alt upload-icon"></i>\n`;
        html += `                    <p>Drag and drop a file here or click to select</p>\n`;
        html += `                    <p class="upload-hint">Max size: ${maxSize}MB</p>\n`;
        html += `                </div>\n`;
        html += `                <div id="${previewContainerId}" style="display: none;">\n`;
        html += `                    <img id="${imagePreviewId}" class="preview-image" src="#" alt="Preview">\n`;
        html += `                    <button id="${cancelButtonId}" class="cancel-button" type="button">×</button>\n`;
        html += `                </div>\n`;
        html += `            </div>\n`;
        html += `            <input type="file" id="${fileId}" name="${fileId}" class="form-field ${
            required ? "required-field" : ""
        }" style="display: none;" ${required ? "required" : ""}>\n`;
        html += `        </div>\n`;

        // File uploader configuration
        const config = {
            id: fileId,
            dropboxId: dropboxId,
            previewContainerId: previewContainerId,
            imagePreviewId: imagePreviewId,
            uploadPromptId: uploadPromptId,
            cancelButtonId: cancelButtonId,
            labelId: labelId,
            maxSizeMB: maxSize,
            acceptedTypes: acceptedTypes,
        };

        return {
            html: html,
            config: config,
        };
    }

    /**
     * Generate JavaScript for file uploaders
     * @param {Array} fileUploaders - Array of file uploader configurations
     * @returns {string} Generated JavaScript
     */
    generateFileUploadersJs(fileUploaders) {
        let js = `    // Initialize file uploaders\n`;

        fileUploaders.forEach((uploader) => {
            js += `    new FileUploader({\n`;
            js += `        dropboxId: "${uploader.dropboxId}",\n`;
            js += `        inputId: "${uploader.id}",\n`;
            js += `        previewContainerId: "${uploader.previewContainerId}",\n`;
            js += `        imagePreviewId: "${uploader.imagePreviewId}",\n`;
            js += `        uploadPromptId: "${uploader.uploadPromptId}",\n`;
            js += `        cancelButtonId: "${uploader.cancelButtonId}",\n`;
            js += `        labelId: "${uploader.labelId}",\n`;
            js += `        maxSizeMB: ${uploader.maxSizeMB},\n`;
            js += `        acceptedTypes: ${JSON.stringify(
                uploader.acceptedTypes
            )},\n`;
            js += `        onFileSelect: () => formUtils.validateForm(),\n`;
            js += `        onFileRemove: () => formUtils.validateForm()\n`;
            js += `    });\n`;
        });

        return js;
    }
}
