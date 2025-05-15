import { createLoginFormTemplate } from "../../templates/template-creator";

class LoginView {
  constructor() {
    this._loginForm = null;
    this._emailInput = null;
    this._passwordInput = null;
  }

  goToHomePage() {
    window.location.hash = "#/";
  }
  getTemplate() {
    return `
      <div class="container">
        ${createLoginFormTemplate()}
      </div>
    `;
  }

  initElements() {
    this._loginForm = document.getElementById("loginForm");
    this._emailInput = document.getElementById("email");
    this._passwordInput = document.getElementById("password");
  }

  setupLoginForm(loginCallback) {
    this._loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = this._emailInput.value;
      const password = this._passwordInput.value;

      loginCallback({ email, password });
    });
  }

  showErrorMessage(message) {
    alert(message);
  }

  showSuccessMessage(message) {
    alert(message);
  }
}

export default LoginView;
