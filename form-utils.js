/**
 * FormUtils - Handles form validation and submission
 */
class FormUtils {
    /**
     * Initialize form utilities
     * @param {Object} config - Configuration object
     */
    constructor(config) {
        this.config = {
            formSelector: "form",
            submitButtonSelector: '[type="submit"]',
            requiredFieldSelector: ".required-field",
            formFieldSelector: ".form-field",
            ...config,
        };

        // Get DOM elements
        this.form = document.querySelector(this.config.formSelector);
        this.submitButton = this.form?.querySelector(
            this.config.submitButtonSelector
        );

        // Initialize if form exists
        if (this.form) {
            this.init();
        }
    }

    /**
     * Initialize form validation
     */
    init() {
        // Add form submission handler
        this.form.addEventListener("submit", this.handleSubmit.bind(this));

        // Add input event listeners to all form fields
        const formFields = this.form.querySelectorAll(
            this.config.formFieldSelector
        );
        formFields.forEach((field) => {
            field.addEventListener("input", () => this.validateForm());

            // For select elements
            if (field.tagName === "SELECT") {
                field.addEventListener("change", () => this.validateForm());
            }
        });

        // Initial validation
        this.validateForm();
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    handleSubmit(e) {
        // Prevent the default form submission
        e.preventDefault();

        // Validate the form
        if (!this.validateForm()) {
            return;
        }

        // Get form data
        const formData = new FormData(this.form);

        // Here you would typically send the form data to a server
        // For now, just show a success message
        this.showSuccessMessage();
    }

    /**
     * Validate the form
     * @returns {boolean} True if valid, false otherwise
     */
    validateForm() {
        let isValid = true;

        // Get all required fields
        const requiredFields = this.form.querySelectorAll(
            this.config.requiredFieldSelector
        );

        // Check each required field
        requiredFields.forEach((field) => {
            let fieldValid = true;

            // Check different field types
            if (field.type === "checkbox" || field.type === "radio") {
                fieldValid = field.checked;
            } else if (field.type === "file") {
                fieldValid = field.files.length > 0;
            } else if (field.tagName === "SELECT") {
                fieldValid = field.value !== "" && field.value !== null;
            } else {
                fieldValid = field.value.trim() !== "";
            }

            // Add or remove invalid class
            if (fieldValid) {
                field.classList.remove("is-invalid");
                field.classList.add("is-valid");
            } else {
                field.classList.add("is-invalid");
                field.classList.remove("is-valid");
                isValid = false;
            }
        });

        // Enable or disable submit button
        if (this.submitButton) {
            this.submitButton.disabled = !isValid;
        }

        return isValid;
    }

    /**
     * Show a success message after form submission
     */
    showSuccessMessage() {
        // Hide the form
        this.form.style.display = "none";

        // Create success message
        const successMessage = document.createElement("div");
        successMessage.className = "alert alert-success mt-4";
        successMessage.innerHTML = `
            <h4 class="alert-heading">Form Submitted Successfully!</h4>
            <p>Thank you for submitting the form. We will process your information shortly.</p>
            <hr>
            <button class="btn btn-outline-success" id="resetForm">Submit Another Response</button>
        `;

        // Insert after the form
        this.form.parentNode.insertBefore(
            successMessage,
            this.form.nextSibling
        );

        // Add reset button functionality
        const resetButton = document.getElementById("resetForm");
        if (resetButton) {
            resetButton.addEventListener("click", () => {
                // Remove success message
                successMessage.remove();

                // Reset and show form
                this.form.reset();
                this.form.style.display = "block";

                // Reset validation
                const formFields = this.form.querySelectorAll(
                    this.config.formFieldSelector
                );
                formFields.forEach((field) => {
                    field.classList.remove("is-valid", "is-invalid");
                });

                // Disable submit button
                if (this.submitButton) {
                    this.submitButton.disabled = true;
                }
            });
        }
    }
}
