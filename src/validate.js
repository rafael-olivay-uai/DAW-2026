const form = document.getElementById("subscription-form");
const nameInput = document.getElementById("name");
const formTitle = document.getElementById("form-title");

const fieldLabels = {    
    name: "Nombre completo",
    email: "Email",
    password: "Contraseña",
    "confirm-password": "Repetir contraseña",
    age: "Edad",
    phone: "Teléfono",
    address: "Dirección",
    city: "Ciudad",
    "postal-code": "Código postal",
    dni: "DNI",
};

function validateName(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Este campo es obligatorio.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(trimmed)) return "Solo se permiten letras y espacios.";
    if (!/\s/.test(trimmed)) return "Debe contener al menos un espacio entre nombre y apellido.";
    if (trimmed.replace(/\s/g, "").length <= 6) return "Debe tener más de 6 letras.";
    return "";
}

function validateEmail(value) {
    if (!value) return "Este campo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingresá un email válido.";
    return "";
}

function validatePassword(value) {
    if (!value) return "Este campo es obligatorio.";
    if (value.length < 8) return "Debe tener al menos 8 caracteres.";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Debe contener letras y números.";
    return "";
}

function validateConfirmPassword(value) {
    if (!value) return "Este campo es obligatorio.";
    if (value !== form.password.value) return "Las contraseñas no coinciden.";
    return "";
}

function validateAge(value) {
    if (!value) return "Este campo es obligatorio.";
    if (!/^\d+$/.test(value)) return "Debe ser un número entero.";
    if (parseInt(value, 10) < 18) return "Debés ser mayor o igual a 18 años.";
    return "";
}

function validatePhone(value) {
    if (!value) return "Este campo es obligatorio.";
    if (!/^\d{7,}$/.test(value)) return "Debe tener al menos 7 dígitos, sin espacios, guiones ni paréntesis.";
    return "";
}

function validateAddress(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Este campo es obligatorio.";
    if (trimmed.length < 5) return "Debe tener al menos 5 caracteres.";
    if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(trimmed) || !/\d/.test(trimmed) || !/\s/.test(trimmed)) {
        return "Debe contener letras, números y un espacio.";
    }
    return "";
}

function validateCity(value) {
    if (!value.trim()) return "Este campo es obligatorio.";
    if (value.trim().length < 3) return "Debe tener al menos 3 caracteres.";
    return "";
}

function validatePostalCode(value) {
    if (!value.trim()) return "Este campo es obligatorio.";
    if (value.trim().length < 3) return "Debe tener al menos 3 caracteres.";
    return "";
}

function validateDni(value) {
    if (!value) return "Este campo es obligatorio.";
    if (!/^\d{7,8}$/.test(value)) return "Debe ser un número de 7 u 8 dígitos.";
    return "";
}

const fieldValidators = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    "confirm-password": validateConfirmPassword,
    age: validateAge,
    phone: validatePhone,
    address: validateAddress,
    city: validateCity,
    "postal-code": validatePostalCode,
    dni: validateDni,
};

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`error-${fieldId}`);
    input.classList.toggle("input-error", Boolean(message));
    errorSpan.textContent = message;
}

function clearError(fieldId) {
    showError(fieldId, "");
}

function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const message = fieldValidators[fieldId](input.value);
    showError(fieldId, message);
    return message;
}

Object.keys(fieldValidators).forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    input.addEventListener("blur", () => validateField(fieldId));
    input.addEventListener("focus", () => clearError(fieldId));
});

function updateFormTitle() {
    const value = nameInput.value.trim();
    formTitle.textContent = value ? `HOLA ${value.toUpperCase()}` : "HOLA";
}

nameInput.addEventListener("focus", updateFormTitle);
nameInput.addEventListener("keydown", () => setTimeout(updateFormTitle, 0));

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = {};
    Object.keys(fieldValidators).forEach((fieldId) => {
        const message = validateField(fieldId);
        if (message) errors[fieldId] = message;
    });

    if (Object.keys(errors).length === 0) {
        const lines = Object.keys(fieldValidators)
            .map((fieldId) => `${fieldLabels[fieldId]}: ${document.getElementById(fieldId).value}`);
        alert("¡Suscripción exitosa!\n\n" + lines.join("\n"));
        form.reset();
        updateFormTitle();
    } else {
        const lines = Object.keys(errors)
            .map((fieldId) => `${fieldLabels[fieldId]}: ${errors[fieldId]}`);
        alert("Revisá los siguientes errores:\n\n" + lines.join("\n"));
    }
});
