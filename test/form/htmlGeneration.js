import { renderSkeletonHtml, renderUserUI, hydrateFormData, bindSkeletonEvents } from "../../webComponents/v2/core/controls/form/v1/index.js";

const formContainer = document.getElementById("formContainer");
const resultToast = document.getElementById("resultToast");
const resultOutput = document.getElementById("resultOutput");

if (formContainer) {
    // Generate Raw HTML String Markup
    const rawHtmlString = renderSkeletonHtml({});

    // Inject raw HTML String into page DOM
    formContainer.innerHTML = rawHtmlString;

    // Hook Events & Controls into HTML-generated page DOM
    const formElement = formContainer.querySelector("form");
    bindSkeletonEvents({
        inFormElement: formElement,
        inOnSubmit: ({ inFormData, inEvent }) => {
            const localFormData = inFormData;
            if (resultToast && resultOutput) {
                resultOutput.textContent = JSON.stringify(localFormData, null, 2);
                resultToast.classList.remove("hidden");
            }
        }
    });

    renderUserUI({
        inTarget: formElement,
        inFields: [
            { name: "username", label: "Username", type: "text", placeholder: "Enter username" },
            { name: "email", label: "Email Address", type: "email", placeholder: "name@example.com" },
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" }
        ]
    });

    hydrateFormData({
        inFormElement: formElement,
        inData: {
            username: "Keshav",
            email: "keshav@example.com",
            phone: "+91 9876543210"
        }
    });
}
