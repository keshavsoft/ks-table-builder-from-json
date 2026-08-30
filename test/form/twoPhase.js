import { renderSkeleton, renderUserUI, hydrateFormData, bindSkeletonEvents } from "../../webComponents/v2/core/controls/form/v1/index.js";

const formContainer = document.getElementById("formContainer");
const resultToast = document.getElementById("resultToast");
const resultOutput = document.getElementById("resultOutput");

if (formContainer) {
    // PHASE 1: Render & Mount Form Skeleton Shell immediately
    const skeletonElement = renderSkeleton({});

    bindSkeletonEvents({
        inFormElement: skeletonElement,
        inOnSubmit: ({ inFormData, inEvent }) => {
            const localFormData = inFormData;
            if (resultToast && resultOutput) {
                resultOutput.textContent = JSON.stringify(localFormData, null, 2);
                resultToast.classList.remove("hidden");
            }
        }
    });

    formContainer.appendChild(skeletonElement);

    // PHASE 2: Async Population of User Controls into Mounted Page DOM
    setTimeout(() => {
        const dynamicFields = [
            { name: "username", label: "Username", type: "text", placeholder: "Enter username" },
            { name: "email", label: "Email Address", type: "email", placeholder: "name@example.com" },
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" }
        ];

        renderUserUI({
            inSkeletonElement: skeletonElement,
            inFields: dynamicFields
        });

        hydrateFormData({
            inFormElement: skeletonElement,
            inData: {
                username: "Keshav",
                email: "keshav@example.com",
                phone: "+91 9876543210"
            }
        });
    }, 600);
}
