import { createRegisterFormTemplate } from "../../templates/template-creator";

class RegisterView {
  constructor() {
    this._registerForm = null;
    this._nameInput = null;
    this._emailInput = null;
    this._passwordInput = null;
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }
  getTemplate() {
    return `
      <div class="container">
        ${createRegisterFormTemplate()}
      </div>
    `;
  }

  initElements() {
    this._registerForm = document.getElementById("registerForm");
    this._nameInput = document.getElementById("name");
    this._emailInput = document.getElementById("email");
    this._passwordInput = document.getElementById("password");
  }

  setupRegisterForm(registerCallback) {
    this._registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = this._nameInput.value;
      const email = this._emailInput.value;
      const password = this._passwordInput.value;

      registerCallback({ name, email, password });
    });
  }

  showErrorMessage(message) {
    alert(message);
  }

  showSuccessMessage(message) {
    alert(message);
  }
}

export default RegisterView;
