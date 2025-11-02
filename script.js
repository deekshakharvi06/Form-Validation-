// script.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");

  // --- Helper functions ---
  function showError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    let errorDiv = document.getElementById(input.id + "-error");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.id = input.id + "-error";
      input.insertAdjacentElement("afterend", errorDiv);
    }
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    const errorDiv = document.getElementById(input.id + "-error");
    if (errorDiv) {
      errorDiv.innerText = "";
      errorDiv.style.display = "none";
    }
  }

  // --- Regex patterns ---
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[6-9]\d{9}$/;


  // --- Validation functions ---
  // Name: only letters, max length 50
  function validateName() {
    const name = document.getElementById("fullName");
    const val = name.value.trim();
    const nameRegex = /^[A-Za-z\s]{1,50}$/;

    if (!val) {
      showError(name, "Full name is required.");
      return false;
    } else if (!nameRegex.test(val)) {
      showError(
        name,
        "Name must contain only letters and spaces."
      );
      return false;
    }else if (val.length < 2) {
      showError(name, "Name must be at least 2 characters.");
      return false;
    }
    clearError(name);
    return true;
  }

// Email 
  function validateEmail() {
    const email = document.getElementById("email");
    const val = email.value.trim();

    if (!val) {
      showError(email, "Email is required.");
      return false;
    } else if (!emailPattern.test(val)) {
      showError(email, "Please enter a valid email address.");
      return false;
    }
    clearError(email);
    return true;
  }

  // Phone Number
  function validatePhone() {
    const phone = document.getElementById("phone");
    const val = phone.value.trim();

    if (!val) {
      showError(phone, "Phone number is required.");
      return false;
    } else if (!phonePattern.test(val)) {
      showError(phone, "Phone must be 10 digits and start with 7, 8, or 9.");
      return false;
    }
    clearError(phone);
    return true;
  }

  // Password Conditions
  const pw = document.getElementById("password");
  const cpw = document.getElementById("confirmPassword");
  const pwConditions = document.createElement("div");

  pwConditions.className = "password-conditions";
  pwConditions.id = "password-conditions";
  pw.insertAdjacentElement("afterend", pwConditions);
  pwConditions.innerHTML = `
    <ul>
      <li id="pw-min" class="invalid">Minimum 8 characters</li>
      <li id="pw-first" class="invalid">First letter uppercase</li>
      <li id="pw-lower" class="invalid">Contains lowercase letter</li>
      <li id="pw-num" class="invalid">Contains number</li>
      <li id="pw-spec" class="invalid">Contains special character</li>
    </ul>
  `;
  pwConditions.style.display = "none";

  function updateCondition(id, isValid) {
    const li = document.getElementById(id);
    if (li) {
      li.classList.toggle("valid", isValid);
      li.classList.toggle("invalid", !isValid);
    }
  }

  //password function
  function validatePassword() {
    const val = pw.value;

    // Show condition box when typing
    if (val.length > 0) pwConditions.style.display = "block";

    const minChar = val.length >= 8;
    const firstCap = /^[A-Z]/.test(val);
    const hasSmall = /[a-z]/.test(val);
    const hasNum = /\d/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    updateCondition("pw-min", minChar);
    updateCondition("pw-first", firstCap);
    updateCondition("pw-lower", hasSmall);
    updateCondition("pw-num", hasNum);
    updateCondition("pw-spec", hasSpecial);

    if (minChar && firstCap && hasSmall && hasNum && hasSpecial) {
      clearError(pw);
      return true;
    } else {
      showError(
        pw,
        "Password must meet all listed conditions."
      );
      return false;
    }
  }

  // Hide password conditions when confirm password focused
  cpw.addEventListener("focus", () => {
    pwConditions.style.display = "none";
  });

  //confirm password
  function validateConfirmPassword() {
    const val = cpw.value;

    if (!val) {
      showError(cpw, "Please confirm your password.");
      return false;
    } else if (val !== pw.value) {
      showError(cpw, "Passwords do not match.");
      return false;
    }
    clearError(cpw);
    return true;
  }

  // --- Validate all on form submit ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isValid =
      validateName() &&
      validateEmail() &&
      validatePhone() &&
      validatePassword() &&
      validateConfirmPassword();

    if (isValid) {
      alert("Form validation passed.");
      form.reset();

      // Clear all borders and password conditions
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
      });
      pwConditions.style.display = "none";
    }
  });

  // --- Real-time validation on input ---
  document.getElementById("fullName").addEventListener("input", validateName);
  document.getElementById("email").addEventListener("input", validateEmail);
  document.getElementById("phone").addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    validatePhone();
  });
  pw.addEventListener("input", validatePassword);
  cpw.addEventListener("input", validateConfirmPassword);
});
