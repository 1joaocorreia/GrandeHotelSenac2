export default function DateSelector() {
    function getTodayDateISO() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const todayISO = getTodayDateISO();

    const dateSelectorDiv = document.createElement("div");
    dateSelectorDiv.className = "dateSelector-wrapper";
    dateSelectorDiv.style.display = 'flex';
    dateSelectorDiv.style.zIndex = '100';
    dateSelectorDiv.style.gap = '12px';
    dateSelectorDiv.style.alignItems = 'flex-start';

    const inner = document.createElement("div");
    inner.className = "dateSelector";

    const checkInContainer = document.createElement('div');
    checkInContainer.style.display = 'flex';
    checkInContainer.style.flexDirection = 'column';
    checkInContainer.classList.add("date-container");
    
    const dateSelectorIn = document.createElement('input');
    dateSelectorIn.type = 'date';
    dateSelectorIn.id = 'check-in';
    dateSelectorIn.className = 'card p-4 shadow-lg';
    dateSelectorIn.min = todayISO;
    checkInContainer.appendChild(dateSelectorIn);

    const errorCheckIn = document.createElement('div');
    errorCheckIn.classList.add("date-error");
    checkInContainer.appendChild(errorCheckIn);
    
    inner.appendChild(checkInContainer);

    const checkOutContainer = document.createElement('div');
    checkOutContainer.style.display = 'flex';
    checkOutContainer.style.flexDirection = 'column';
    checkOutContainer.classList.add("date-container");
    
    const dateSelectorOut = document.createElement('input');
    dateSelectorOut.type = 'date';
    dateSelectorOut.id = 'check-out';
    dateSelectorOut.className = 'card p-4 shadow-lg';
    dateSelectorOut.min = todayISO;
    checkOutContainer.appendChild(dateSelectorOut);

    dateSelectorIn.addEventListener('change', function() {
        if (this.value) {
            const checkInDate = new Date(this.value);
            checkInDate.setDate(checkInDate.getDate() + 1);
            const minCheckOut = `${checkInDate.getFullYear()}-${String(checkInDate.getMonth() + 1).padStart(2, '0')}-${String(checkInDate.getDate()).padStart(2, '0')}`;
            dateSelectorOut.min = minCheckOut;
            
            if (dateSelectorOut.value && new Date(dateSelectorOut.value) <= new Date(this.value)) {
                dateSelectorOut.value = '';
            }
        }
    });

    const errorCheckOut = document.createElement('div');
    errorCheckOut.classList.add("date-error");
    checkOutContainer.appendChild(errorCheckOut);
    
    inner.appendChild(checkOutContainer);

    const guestsContainer = document.createElement('div');
    guestsContainer.style.display = 'flex';
    guestsContainer.style.flexDirection = 'column';
    guestsContainer.classList.add("guests-container");
    
    const guestsAmount = document.createElement('select');
    guestsAmount.innerHTML = `
        <option value="">Quantidade de hóspedes</option>
        <option value="1">1 pessoa</option>
        <option value="2">2 pessoas</option>
        <option value="3">3 pessoas</option>
        <option value="4">4 pessoas</option>
        <option value="5">5 ou mais pessoas</option>`;
    guestsAmount.className = 'card p-4 shadow-lg';
    guestsAmount.id = 'guest-amount';
    guestsAmount.style.height = '76.5px';
    guestsContainer.appendChild(guestsAmount);
    
    const errorGuests = document.createElement('div');
    errorGuests.classList.add("date-error");
    errorGuests.style.paddingTop = '14px';
    guestsContainer.appendChild(errorGuests);

    
    inner.appendChild(guestsContainer);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add("btn-container");
    
    const btnDateReserv = document.createElement('button');
    btnDateReserv.type = 'submit';
    btnDateReserv.textContent = "Pesquisar";
    btnDateReserv.className = 'btn btn-primary';
    btnDateReserv.style.fontWeight = '16px';
    btnDateReserv.style.height = '76.5px';
    btnDateReserv.style.width = '100%';
    btnContainer.appendChild(btnDateReserv);

    inner.appendChild(btnContainer);

    dateSelectorDiv.appendChild(inner);

    return {
        container: dateSelectorDiv,
        elements: {
            btnPesquisar: btnDateReserv,
            dateSelectorIn: dateSelectorIn,
            dateSelectorOut: dateSelectorOut,
            guestsAmount: guestsAmount,
            errorCheckIn: errorCheckIn,
            errorCheckOut: errorCheckOut,
            errorGuests: errorGuests
        }
    };
}