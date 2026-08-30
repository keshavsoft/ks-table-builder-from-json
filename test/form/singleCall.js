import { renderForm } from "../../webComponents/v2/core/controls/form/v1/index.js";

const formContainer = document.getElementById("formContainer");
const resultToast = document.getElementById("resultToast");
const resultOutput = document.getElementById("resultOutput");

if (formContainer) {
    const fieldsConfig = [
        { name: "username", label: "Username", type: "text", placeholder: "Enter username" },
        { name: "email", label: "Email Address", type: "email", placeholder: "name@example.com" },
        { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" }
    ];

    const initialData = {
        username: "Keshav",
        email: "keshav@example.com",
        phone: "+91 9876543210"
    };

    const handleSubmit = ({ inFormData, inEvent }) => {
        const localFormData = inFormData;
        if (resultToast && resultOutput) {
            resultOutput.textContent = JSON.stringify(localFormData, null, 2);
            resultToast.classList.remove("hidden");
        }
    };

    const formElement = renderForm({
        inFields: fieldsConfig,
        inData: initialData,
        inOnSubmit: handleSubmit
    });

    if (formElement) {
        formContainer.appendChild(formElement);
    }
}
