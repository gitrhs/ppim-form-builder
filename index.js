/**
 * Form Builder Application
 *
 * This file serves as the main entry point that imports and initializes all modules.
 * Include this file in your HTML after all module files.
 */

// Import order matters - dependencies should be loaded first
// In a production environment, these files would be bundled together

// When using this code, include the following files in your HTML in this order:
// 1. element-manager.js
// 2. ui-manager.js
// 3. file-uploader.js
// 4. form-utils.js
// 5. element-creator.js
// 6. edit-panel-manager.js
// 7. code-generator.js
// 8. main.js
// 9. index.js (this file)

document.addEventListener("DOMContentLoaded", function () {
    // Initialize the form builder application
    const formBuilder = new FormBuilder();
    formBuilder.init();

    console.log("Form Builder initialized successfully!");

    // Initialize any global utilities or listeners
    window.copyToClipboard = UIManager.copyToClipboard;
});
