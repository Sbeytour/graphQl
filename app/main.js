import { displayLoginPage } from "./src/login.js";
import { displayProfilePage } from "./src/profile.js";

document.addEventListener('DOMContentLoaded', () => {
    if (!!localStorage.getItem('token')) {
        displayProfilePage();
    } else {
        displayLoginPage();
    }
});