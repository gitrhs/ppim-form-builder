/**
 * FileUploader - Manages file upload functionality with drag and drop
 */
class FileUploader {
    /**
     * Initialize the file uploader
     * @param {Object} config - Configuration object
     */
    constructor(config) {
        this.config = {
            dropboxId: null,
            inputId: null,
            previewContainerId: null,
            imagePreviewId: null,
            uploadPromptId: null,
            cancelButtonId: null,
            labelId: null,
            maxSizeMB: 5,
            acceptedTypes: ["image/jpeg", "image/png"],
            onFileSelect: null,
            onFileRemove: null,
            ...config,
        };

        // Initialize DOM elements
        this.dropbox = document.getElementById(this.config.dropboxId);
        this.input = document.getElementById(this.config.inputId);
        this.previewContainer = document.getElementById(
            this.config.previewContainerId
        );
        this.imagePreview = document.getElementById(this.config.imagePreviewId);
        this.uploadPrompt = document.getElementById(this.config.uploadPromptId);
        this.cancelButton = document.getElementById(this.config.cancelButtonId);
        this.label = this.config.labelId
            ? document.getElementById(this.config.labelId)
            : null;

        // Exit if required elements don't exist
        if (!this.dropbox || !this.input) {
            console.error("Required elements not found for FileUploader");
            return;
        }

        // Set up event listeners
        this.setupEventListeners();
    }

    /**
     * Set up event listeners for file uploader
     */
    setupEventListeners() {
        // Click on dropbox
        this.dropbox.addEventListener("click", (e) => {
            if (
                e.target !== this.cancelButton &&
                !this.cancelButton?.contains(e.target)
            ) {
                this.input.click();
            }
        });

        // File selection
        this.input.addEventListener("change", () => {
            if (this.input.files.length > 0) {
                this.handleFiles(this.input.files);
            }
        });

        // Drag and drop events
        this.dropbox.addEventListener("dragenter", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropbox.classList.add("dragover");
        });

        this.dropbox.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropbox.classList.remove("dragover");
        });

        this.dropbox.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.dropbox.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropbox.classList.remove("dragover");

            if (e.dataTransfer.files.length > 0) {
                this.handleFiles(e.dataTransfer.files);
            }
        });

        // Cancel button
        if (this.cancelButton) {
            this.cancelButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeFile();
            });
        }
    }

    /**
     * Handle file selection
     * @param {FileList} files - Selected files
     */
    handleFiles(files) {
        const file = files[0]; // Only handle the first file

        // Validate file type
        if (
            this.config.acceptedTypes.length > 0 &&
            !this.config.acceptedTypes.includes(file.type)
        ) {
            alert(
                "File type not supported. Please upload: " +
                    this.config.acceptedTypes.join(", ")
            );
            return;
        }

        // Validate file size
        if (file.size > this.config.maxSizeMB * 1024 * 1024) {
            alert(`File size exceeds ${this.config.maxSizeMB}MB limit.`);
            return;
        }

        // Display file preview
        if (file.type.startsWith("image/") && this.imagePreview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview.src = e.target.result;
                this.showPreview();
            };
            reader.readAsDataURL(file);
        } else {
            // For non-image files, just show file name
            if (this.imagePreview) {
                this.imagePreview.src = "";
            }
            this.showPreview(file.name);
        }

        // Call the onFileSelect callback if provided
        if (typeof this.config.onFileSelect === "function") {
            this.config.onFileSelect(file);
        }
    }

    /**
     * Show the file preview
     * @param {string} [filename] - Optional filename for non-image files
     */
    showPreview(filename) {
        if (this.uploadPrompt) {
            this.uploadPrompt.style.display = "none";
        }

        if (this.previewContainer) {
            if (filename) {
                // For non-image files
                this.previewContainer.innerHTML = `
                    <div class="file-name">${filename}</div>
                    <button id="${this.config.cancelButtonId}" class="cancel-button" type="button">×</button>
                `;
                // Reattach event listener to the new cancel button
                const newCancelButton = document.getElementById(
                    this.config.cancelButtonId
                );
                if (newCancelButton) {
                    newCancelButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.removeFile();
                    });
                }
            }
            this.previewContainer.style.display = "block";
        }

        if (this.label) {
            this.label.classList.add("visible");
        }
    }

    /**
     * Remove the selected file
     */
    removeFile() {
        // Clear the input
        this.input.value = "";

        // Hide preview
        if (this.previewContainer) {
            this.previewContainer.style.display = "none";
        }

        // Show upload prompt
        if (this.uploadPrompt) {
            this.uploadPrompt.style.display = "block";
        }

        // Reset label
        if (this.label) {
            this.label.classList.remove("visible");
        }

        // Call the onFileRemove callback if provided
        if (typeof this.config.onFileRemove === "function") {
            this.config.onFileRemove();
        }
    }
}
