import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import NotLogged from "../components/NotLogged.js";

export default function renderNotLoggedPage() {
    const navbar = document.getElementById('navbar')
    const root = document.getElementById('root');
    const footer = document.getElementById('footer');

    if (navbar) {
        const _navbar = Navbar();
        navbar.appendChild(_navbar);
    }
    if (footer) {
        const _footer = Footer();
        footer.appendChild(_footer);
    }
    if (! root) {return;}
    
    root.innerHTML = NotLogged();
}