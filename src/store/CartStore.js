const key = "hotel_cart";

function createEmptyCart() {
    return { status: "draft", items: [] };
}

export function setCart(hotel_cart) {
    let normalized;

    if (!hotel_cart || typeof hotel_cart !== "object" || Array.isArray(hotel_cart)) {
        normalized = createEmptyCart();
    } else {
        normalized = {
            status: hotel_cart.status ?? "draft",
            items: Array.isArray(hotel_cart.items) ? hotel_cart.items : []
        };
    }

    localStorage.setItem(key, JSON.stringify(normalized));
}

export function getCart() {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return createEmptyCart();
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return createEmptyCart();
        }

        if (!Array.isArray(parsed.items)) {
            parsed.items = [];
        }

        return parsed;

    } catch {
        return createEmptyCart();
    }
}

export function addItemToHotelCart(item) {
    const hotel_cart = getCart();
    hotel_cart.items.push(item);
    setCart(hotel_cart);
    return hotel_cart;
}

export function removeItemFromHotelCart(i) {
    const hotel_cart = getCart();
    if (!Array.isArray(hotel_cart.items)) {
        hotel_cart.items = [];
    }
    hotel_cart.items.splice(i, 1);
    setCart(hotel_cart);
    return hotel_cart;
}

export function clearHotelCart() {
    setCart(createEmptyCart());
}

export function getTotalItems() {
    const { items } = getCart();
    const total = items.reduce(
        (acc, it) => acc + Number(it.subtotal || 0),
        0
    );

    return {
        total,
        qtde_items: items.length
    };
}
