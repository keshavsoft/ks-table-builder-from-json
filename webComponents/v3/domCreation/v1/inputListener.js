export const attachInputListener = ({ inElement }) => {
    const localElement = inElement;
    if (!localElement) return;

    localElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const focusableElements = Array.from(
                document.querySelectorAll("input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled])")
            );
            const currentIndex = focusableElements.indexOf(localElement);
            if (currentIndex >= 0 && currentIndex + 1 < focusableElements.length) {
                focusableElements[currentIndex + 1].focus();
            }
        }
    });
};

export default attachInputListener;
