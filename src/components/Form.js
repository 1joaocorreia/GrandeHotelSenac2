export default function Form(){

    const divRoot = document.getElementById('root');
    divRoot.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'card p-4 shadow-lg containerDiv';
    container.style.width = '100%';
    container.style.maxWidth = '460px';
    divRoot.appendChild(container);

    const titulo = document.createElement('h1');
    titulo.textContent = 'Acesse sua conta';
    titulo.className = 'titulo';
    titulo.style.textAlign = 'center';
    titulo.style.marginBottom = '25px';
    container.appendChild(titulo); 

    const formulario = document.createElement('form');
    formulario.className = 'd-flex flex-column';

    const email = document.createElement('input');
    email.type = 'email';
    email.placeholder = "Digite seu e-mail";
    formulario.appendChild(email);

    const senha = document.createElement('input');
    senha.type = 'password';
    senha.placeholder = "Digite sua senha";
    formulario.appendChild(senha);

    const btnAuth = document.createElement('button');
    btnAuth.type = 'submit';
    btnAuth.textContent = "Entrar";
    btnAuth.className = 'btn btn-primary';
    btnAuth.style.fontWeight = '16px';
    formulario.appendChild(btnAuth);

    container.appendChild(formulario);
    return divRoot;
}   