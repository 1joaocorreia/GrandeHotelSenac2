import renderLoginPage from "./pages/Login.js";
import renderRegisterPage from "./pages/Register.js"; 
import renderHomePage from "./pages/Home.js";
import renderCartPage from "./pages/Cart.js";
import renderRoomPage from "./pages/Rooms.js";

const routes = {
    "/login": renderLoginPage,
    "/register": renderRegisterPage,
    "/home": renderHomePage,
    "/cart": renderCartPage,
    "/room": renderRoomPage
};

function getPath() {
    const pathParts = location.pathname.split('/').filter(Boolean);
    pathParts.shift();
    const path = '/' + pathParts.join('/');
    return path;
}

function renderRoutes() {
    const url = getPath();
    const render = routes[url] || routes["/home"];
    render();
} 

document.addEventListener('DOMContentLoaded', renderRoutes);

function preencherReserva(reservation) {
    const inputs = document.querySelectorAll('input[type="date"]');

    if (inputs.length >= 2) {
        inputs[0].value = reservation.checkin;
        inputs[1].value = reservation.checkout;
    }

    console.log("Dados aplicados na tela");

    localStorage.removeItem("repeatReservation");
}