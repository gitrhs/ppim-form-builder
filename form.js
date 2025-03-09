/**
 * Form Utilities - A reusable library for form interactions
 * Features:
 * - Dynamic form validation
 * - File upload with preview
 * - Animated labels
 * - Form submission handling
 */

class FormUtils {
    constructor(config = {}) {
        // Default configuration
        this.config = {
            formSelector: "#contactForm",
            submitButtonSelector: "#submitContact",
            requiredFieldSelector: ".required-field",
            formFieldSelector: ".form-field",
            labelClass: "animated-label",
            errorContainerSelector: "#form-errors",
            errorListSelector: "#error-list",
            loadingModalSelector: "#loadingModal",
            ...config,
        };

        this.form = document.querySelector(this.config.formSelector);
        this.submitButton = document.querySelector(
            this.config.submitButtonSelector
        );

        if (!this.form || !this.submitButton) {
            console.error(
                "Form or submit button not found. Check your selectors."
            );
            return;
        }

        this.init();
    }

    /**
     * Initialize all form behaviors
     */
    init() {
        this.setupFormFields();
        this.setupValidation();
        this.setupSubmitHandler();
    }

    /**
     * Setup form field behaviors (labels, auto-expand for textareas)
     */
    setupFormFields() {
        const formFields = document.querySelectorAll(
            this.config.formFieldSelector
        );

        formFields.forEach((field) => {
            // Skip file inputs as they're handled separately
            if (field.type === "file") return;

            let labelId;
            if (field.id.endsWith("Input")) {
                labelId = `${field.id.replace("Input", "")}Label`;
            } else {
                labelId = `${field.id}Label`;
            }

            const label = document.getElementById(labelId);

            if (!label) return;

            // Set initial label state
            this.toggleLabel(field, label);

            // Setup event listeners based on field type
            if (field.tagName === "TEXTAREA") {
                field.addEventListener("input", () => {
                    this.toggleLabel(field, label);
                    this.autoExpandTextarea(field);
                    this.validateForm();
                });
            } else if (field.tagName === "SELECT") {
                field.addEventListener("change", () => {
                    this.toggleLabel(field, label);
                    this.validateForm();
                });
            } else {
                field.addEventListener("input", () => {
                    this.toggleLabel(field, label);
                    this.validateForm();
                });
            }
        });
    }

    /**
     * Toggle label visibility based on field value
     */
    toggleLabel(input, label) {
        if (input.value.trim()) {
            label.classList.add("visible");
        } else {
            label.classList.remove("visible");
        }
    }

    /**
     * Auto-expand textarea height based on content
     */
    autoExpandTextarea(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

    /**
     * Setup form validation
     */
    setupValidation() {
        // Initial validation
        this.validateForm();

        // Add event listeners to required fields
        const requiredFields = document.querySelectorAll(
            this.config.requiredFieldSelector
        );
        requiredFields.forEach((field) => {
            const eventType = field.tagName === "SELECT" ? "change" : "input";
            field.addEventListener(eventType, () => this.validateForm());
        });
    }

    /**
     * Validate the form and update submit button state
     */
    validateForm() {
        const requiredFields = document.querySelectorAll(
            this.config.requiredFieldSelector
        );
        let isValid = true;

        requiredFields.forEach((field) => {
            if (field.tagName === "SELECT") {
                if (field.value === "") {
                    isValid = false;
                }
            } else if (field.type === "file") {
                // For file inputs, check if there is a file selected
                if (field.files.length === 0) {
                    isValid = false;
                }
            } else {
                if (!field.value.trim()) {
                    isValid = false;
                }
            }
        });

        this.submitButton.disabled = !isValid;
        return isValid;
    }

    /**
     * Setup form submission handler
     */
    setupSubmitHandler() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!this.validateForm()) return;

            const errorContainer = document.querySelector(
                this.config.errorContainerSelector
            );
            if (errorContainer) {
                errorContainer.style.display = "none";
            }

            // Show loading modal if it exists
            const loadingModal = document.querySelector(
                this.config.loadingModalSelector
            );
            if (loadingModal) {
                const bsModal = new bootstrap.Modal(loadingModal);
                bsModal.show();
            }

            // Update button state
            const originalBtnText = this.submitButton.innerHTML;
            this.submitButton.innerHTML =
                '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
            this.submitButton.disabled = true;

            // Submit form data
            const formData = new FormData(this.form);

            fetch(this.form.action, {
                method: this.form.method,
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    // Hide loading modal
                    if (loadingModal) {
                        bootstrap.Modal.getInstance(loadingModal).hide();
                    }

                    // Reset button state
                    this.submitButton.innerHTML = originalBtnText;
                    this.submitButton.disabled = false;

                    if (data.success) {
                        this.showSuccessMessage();
                    } else {
                        this.showErrors(
                            data.errors || ["An unknown error occurred"]
                        );
                    }
                })
                .catch((error) => {
                    console.error("Form submission error:", error);

                    // Hide loading modal
                    if (loadingModal) {
                        bootstrap.Modal.getInstance(loadingModal).hide();
                    }

                    // Reset button state
                    this.submitButton.innerHTML = originalBtnText;
                    this.submitButton.disabled = false;

                    // Show error message
                    alert(
                        "There was an error connecting to the server. Please try again later."
                    );
                });
        });
    }

    /**
     * Show success message and reset form
     */
    showSuccessMessage() {
        const successModal = document.createElement("div");
        successModal.className = "modal fade";
        successModal.id = "successModal";
        successModal.setAttribute("tabindex", "-1");
        successModal.setAttribute("aria-hidden", "true");

        successModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title">Success</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <i class="fas fa-check-circle text-success mb-3" style="font-size: 3rem;"></i>
              <h5>Form submitted successfully!</h5>
              <p class="text-muted mb-0">Thank you for submitting your information.</p>
            </div>
          </div>
        </div>
      `;

        document.body.appendChild(successModal);

        const bsModal = new bootstrap.Modal(successModal);
        bsModal.show();

        successModal.addEventListener("hidden.bs.modal", () => {
            successModal.remove();
            this.resetForm();
        });
    }

    /**
     * Show error messages
     */
    showErrors(errors) {
        const errorContainer = document.querySelector(
            this.config.errorContainerSelector
        );
        const errorList = document.querySelector(this.config.errorListSelector);

        if (!errorContainer || !errorList) return;

        errorList.innerHTML = "";
        errors.forEach((error) => {
            const li = document.createElement("li");
            li.textContent = error;
            errorList.appendChild(li);
        });

        errorContainer.style.display = "block";

        // Scroll to error container
        errorContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    /**
     * Reset the form to its initial state
     */
    resetForm() {
        this.form.reset();

        // Reset all labels
        document
            .querySelectorAll(`.${this.config.labelClass}`)
            .forEach((label) => {
                label.classList.remove("visible");
            });

        // Reset validation
        this.validateForm();
    }
}

/**
 * FileUploader - A class to handle file uploads with preview
 */
class FileUploader {
    constructor(config) {
        this.config = {
            // Required config
            dropboxId: "",
            inputId: "",
            previewContainerId: "",
            imagePreviewId: "",
            uploadPromptId: "",
            cancelButtonId: "",
            labelId: "",

            // Optional config
            maxSizeMB: 5,
            acceptedTypes: ["image/jpeg", "image/png", "image/jpg"],
            onFileSelect: null,
            onFileRemove: null,
            ...config,
        };

        this.initElements();
        if (this.validateElements()) {
            this.setupEventListeners();
        }
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        this.dropbox = document.getElementById(this.config.dropboxId);
        this.fileInput = document.getElementById(this.config.inputId);
        this.previewContainer = document.getElementById(
            this.config.previewContainerId
        );
        this.imagePreview = document.getElementById(this.config.imagePreviewId);
        this.uploadPrompt = document.getElementById(this.config.uploadPromptId);
        this.cancelButton = document.getElementById(this.config.cancelButtonId);
        this.photoLabel = document.getElementById(this.config.labelId);
    }

    /**
     * Validate that all required elements exist
     */
    validateElements() {
        const elements = [
            this.dropbox,
            this.fileInput,
            this.previewContainer,
            this.imagePreview,
            this.uploadPrompt,
            this.cancelButton,
        ];

        const missingElements = elements.filter((el) => !el);

        if (missingElements.length > 0) {
            console.error(
                "FileUploader: Missing required elements for",
                this.config.inputId
            );
            return false;
        }

        return true;
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Click to select file
        this.dropbox.addEventListener("click", () => this.fileInput.click());

        // File input change
        this.fileInput.addEventListener("change", () => {
            if (this.fileInput.files.length > 0) {
                this.handleFileSelect(this.fileInput.files[0]);
            }
        });

        // Drag and drop events
        ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
            this.dropbox.addEventListener(
                eventName,
                this.preventDefaults,
                false
            );
        });

        // Add dragover class
        ["dragenter", "dragover"].forEach((eventName) => {
            this.dropbox.addEventListener(
                eventName,
                () => this.dropbox.classList.add("dragover"),
                false
            );
        });

        // Remove dragover class
        ["dragleave", "drop"].forEach((eventName) => {
            this.dropbox.addEventListener(
                eventName,
                () => this.dropbox.classList.remove("dragover"),
                false
            );
        });

        // Handle drop
        this.dropbox.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        // Cancel button
        this.cancelButton.addEventListener("click", (e) => {
            e.stopPropagation();
            this.removeFile();
        });
    }

    /**
     * Prevent default browser behavior for events
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Handle file selection and validation
     */
    handleFileSelect(file) {
        // Validate file type
        if (!this.config.acceptedTypes.includes(file.type)) {
            alert(
                `Please select a valid file type: ${this.config.acceptedTypes
                    .map((t) => t.replace("image/", ""))
                    .join(", ")}`
            );
            return;
        }

        // Validate file size
        if (file.size > this.config.maxSizeMB * 1024 * 1024) {
            alert(`File size should be less than ${this.config.maxSizeMB}MB`);
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            this.imagePreview.src = e.target.result;
            this.previewContainer.style.display = "flex";
            this.uploadPrompt.style.display = "none";

            if (this.photoLabel) {
                this.photoLabel.classList.add("visible");
            }

            // Callback if provided
            if (typeof this.config.onFileSelect === "function") {
                this.config.onFileSelect(file);
            }
        };

        reader.readAsDataURL(file);
    }

    /**
     * Reset file input and preview
     */
    removeFile() {
        this.fileInput.value = "";
        this.previewContainer.style.display = "none";
        this.uploadPrompt.style.display = "block";

        if (this.photoLabel) {
            this.photoLabel.classList.remove("visible");
        }

        // Callback if provided
        if (typeof this.config.onFileRemove === "function") {
            this.config.onFileRemove();
        }
    }
}

/**
 * Initialize everything when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
    // Add form-field class to all form elements for easier selection
    document.querySelectorAll(".contact-form").forEach((el) => {
        el.classList.add("form-field");
    });

    // Initialize the form utilities
    const formUtils = new FormUtils({
        formSelector: "#contactForm",
        submitButtonSelector: "#submitContact",
        requiredFieldSelector: ".required-field",
        formFieldSelector: ".form-field",
        errorContainerSelector: "#form-errors",
        errorListSelector: "#error-list",
        loadingModalSelector: "#loadingModal",
    });

    // Initialize file uploaders with validation callback
    const validateForm = () => formUtils.validateForm();

    const fileUploaders = [
        {
            dropboxId: "formalDropbox",
            inputId: "formalPhotoInput",
            previewContainerId: "formal-preview-container",
            imagePreviewId: "formal-image-preview",
            uploadPromptId: "formal-upload-prompt",
            cancelButtonId: "formal-cancel-upload",
            labelId: "formalPhotoLabel",
            onFileSelect: validateForm,
            onFileRemove: validateForm,
        },
        {
            dropboxId: "nonFormalDropbox",
            inputId: "nonFormalPhotoInput",
            previewContainerId: "non-formal-preview-container",
            imagePreviewId: "non-formal-image-preview",
            uploadPromptId: "non-formal-upload-prompt",
            cancelButtonId: "non-formal-cancel-upload",
            labelId: "nonFormalPhotoLabel",
            onFileSelect: validateForm,
            onFileRemove: validateForm,
        },
    ];

    fileUploaders.forEach((config) => new FileUploader(config));
});

/**
 * Example usage for creating a dynamic form with different configuration:
 *
 * // For a different form:
 * const otherFormUtils = new FormUtils({
 *   formSelector: '#anotherForm',
 *   submitButtonSelector: '#anotherSubmitButton',
 *   requiredFieldSelector: '.required-input',
 *   formFieldSelector: '.input-field',
 *   labelClass: 'floating-label'
 * });
 *
 * // For additional file uploaders:
 * new FileUploader({
 *   dropboxId: 'newDropbox',
 *   inputId: 'newFileInput',
 *   previewContainerId: 'new-preview-container',
 *   imagePreviewId: 'new-image-preview',
 *   uploadPromptId: 'new-upload-prompt',
 *   cancelButtonId: 'new-cancel-upload',
 *   labelId: 'newFileLabel',
 *   maxSizeMB: 10,
 *   acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf']
 * });
 */
