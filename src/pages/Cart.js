import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import { getCart } from "../store/CartStore.js";
import Grid from "../components/GridCart.js";

function renderCartContent() {
  const divRoot = document.getElementById('root');
  divRoot.innerHTML = '';
  const cart = getCart();
  const cartItems = cart.items || [];
  
  const grid = Grid(cartItems, renderCartContent);
  grid.className = "tablestyle";
  
  divRoot.appendChild(grid);
}

export default function renderCartPage() {
  const nav = document.getElementById('navbar');
  nav.innerHTML = '';

  const navbar = Navbar();
  nav.appendChild(navbar);

  renderCartContent();

  const footer = document.getElementById('footer');
  footer.innerHTML = '';
  const footers = Footer();
  footer.appendChild(footers);
}