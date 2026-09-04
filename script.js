// Produtos - Lanches
const lanches = [
    {
        id: 1,
        name: 'Hambúrguer Clássico',
        description: 'Pão, carne, alface, tomate e maionese',
        price: 18.90,
        image: 'images/lanche-1.jpg'
    },
    {
        id: 2,
        name: 'X-Frango',
        description: 'Pão, frango, queijo, alface e tomate',
        price: 22.90,
        image: 'images/x-frango.jpg'
    },
    {
        id: 3,
        name: 'X-Salada',
        description: 'Pão, carne, queijo, alface, tomate, cebola',
        price: 24.90,
        image: 'images/x-salada.jpg'
    },
    {
        id: 4,
        name: 'Misto Quente',
        description: 'Pão, presunto, queijo e manteiga',
        price: 12.90,
        image: 'images/Misto%20Quente.png'
    },
    {
        id: 5,
        name: 'Cachorro Quente',
        description: 'Pão, linguiça, batata palha, milho',
        price: 14.90,
        image: 'images/Cachorro%20Quente.jpg'
    },
    {
        id: 6,
        name: 'Beiragen na Chapa',
        description: 'Carne, queijo derretido, cebola e pimentão',
        price: 26.90,
        image: 'images/Beiragen%20na%20Chapa.avif'
    },
    {
        id: 7,
        name: 'Pastel de Carne',
        description: 'Pastel crocante recheado com carne moída',
        price: 8.90,
        image: 'images/Pastel%20de%20Carne.jpg'
    },
    {
        id: 8,
        name: 'Coxinha de Frango',
        description: 'Coxinha macia com frango desfiado',
        price: 7.90,
        image: 'images/coxinha.webp'
    }
];

// Produtos - Bebidas
const bebidas = [
    {
        id: 101,
        name: 'Coca-Cola 2L',
        description: 'Diversos sabores disponíveis',
        price: 14,
        image: 'images/coca-cola-2-litros.jpg'
    },
    {
        id: 102,
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Fanta, Sprite',
        price: 5.90,
        image: 'images/bebida-2.jpg'
    },
    {
        id: 103,
        name: 'Suco Natural',
        description: 'Laranja, Maçã ou Morango',
        price: 5,
        image: 'images/bebida-3.jpg'
    },
    {
        id: 104,
        name: 'Chopp (1L)',
        description: 'Chopp Gelado - Brahma',
        price: 12,
        image: 'images/cerveja.jpg'
    },
    {
        id: 105,
        name: 'Água Mineral',
        description: 'Água 500ml ou 1.5L',
        price: 3.,
        image: 'images/agua%20mineral.webp'
    },
    {
        id: 106,
        name: 'Milkshake',
        description: 'Chocolate, Morango ou Baunilha',
        price: 15,
        image: 'images/Milkshake.webp'
    },
    {
        id: 107,
        name: 'Chá Gelado',
        description: 'Pêssego, Maçã ou Limão',
        price: 8,
        image: 'images/Ch%C3%A1%20Gelado.webp'
    },
    {
        id: 108,
        name: 'Café Coado',
        description: 'Café coado quentinho 300ml',
        price: 5,
        image: 'images/Cafe.jpg'
    }
];

// Carrinho de compras
let cart = [];
let selectedProduct = null;
let paymentMethod = 'Pix';
let orderNote = '';
let deliveryAddress = '';
let deliveryCoords = null; // { lat, lng }

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    // sincronizar com produtos definidos no admin (localStorage)
    try {
        const raw = localStorage.getItem('adminProducts');
        if (raw) {
            const adminProducts = JSON.parse(raw);
            const lans = adminProducts.filter(p => p.category === 'lanches').map(p => ({
                id: p.id,
                name: p.name,
                description: p.description || '',
                price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
                image: p.image || 'images/placeholder.png'
            }));
            const bebs = adminProducts.filter(p => p.category === 'bebidas').map(p => ({
                id: p.id,
                name: p.name,
                description: p.description || '',
                price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
                image: p.image || 'images/placeholder.png'
            }));
            if (lans.length) {
                lanches.splice(0, lanches.length, ...lans);
            }
            if (bebs.length) {
                bebidas.splice(0, bebidas.length, ...bebs);
            }
        }
    } catch (e) {
        console.warn('Não foi possível carregar produtos do admin:', e);
    }

    renderProducts('lanches', lanches);
    renderProducts('bebidas', bebidas);
    setupEventListeners();
    loadCartFromStorage();
    loadPaymentFromStorage();
    renderPaymentSelection();
    loadOrderNoteFromStorage();
    renderOrderNote();
    loadDeliveryFromStorage();
    renderDeliveryAddress();
    renderStoreSchedule();
    initRating();
});

// Ler adminData do localStorage (usado para obter o schedule configurado)
function getAdminData() {
    try {
        const raw = localStorage.getItem('adminData');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) { return null; }
}

// Renderizar horário da loja no cabeçalho (compacto) com toggle para ver lista completa
function renderStoreSchedule() {
    const el = document.getElementById('storeSchedule');
    if (!el) return;
    const admin = getAdminData();
    const schedule = admin && admin.settings && admin.settings.schedule ? admin.settings.schedule : null;
    if (!schedule) {
        el.textContent = 'Horário não configurado';
        return;
    }
    const dayMap = ['sun','mon','tue','wed','thu','fri','sat'];
    const labelMap = { mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom' };
    const todayKey = dayMap[new Date().getDay()];
    const today = schedule[todayKey];
    let compact = '';
    if (today && today.enabled) {
        compact = `Hoje: ${today.open} — ${today.close}`;
    } else {
        compact = 'Fechado hoje';
    }

    // full schedule HTML
    let full = '<div class="full-schedule-list">';
    Object.keys(labelMap).forEach(k => {
        const item = schedule[k];
        if (item && item.enabled) {
            full += `<div class="fs-row"><strong>${labelMap[k]}:</strong> ${item.open} — ${item.close}</div>`;
        } else {
            full += `<div class="fs-row"><strong>${labelMap[k]}:</strong> Fechado</div>`;
        }
    });
    full += '</div>';

    el.innerHTML = `<div class="today">${compact}</div><button id="toggleFullSchedule" class="link-btn">Ver horários</button><div class="full-schedule" style="display:none">${full}</div>`;

    const toggle = el.querySelector('#toggleFullSchedule');
    const fullDiv = el.querySelector('.full-schedule');
    if (toggle && fullDiv) {
        toggle.addEventListener('click', () => {
            if (fullDiv.style.display === 'none') {
                fullDiv.style.display = 'block';
                toggle.textContent = 'Ocultar horários';
            } else {
                fullDiv.style.display = 'none';
                toggle.textContent = 'Ver horários';
            }
        });
    }
}

// Delivery address persistence and geolocation
function saveDeliveryToStorage() {
    try { localStorage.setItem('centralLanchesDeliveryAddress', deliveryAddress || ''); localStorage.setItem('centralLanchesDeliveryCoords', deliveryCoords ? JSON.stringify(deliveryCoords) : ''); } catch (e) {}
}

function loadDeliveryFromStorage() {
    try {
        const a = localStorage.getItem('centralLanchesDeliveryAddress');
        const c = localStorage.getItem('centralLanchesDeliveryCoords');
        if (a) deliveryAddress = a;
        if (c) {
            try { deliveryCoords = JSON.parse(c); } catch (e) { deliveryCoords = null; }
        }
    } catch (e) {}
}

function renderDeliveryAddress() {
    const input = document.getElementById('deliveryAddressInput');
    const display = document.getElementById('deliveryAddressDisplay');
    const sendBtn = document.getElementById('sendLocationBtn');
    if (input) {
        input.value = deliveryAddress || '';
        input.addEventListener('input', () => {
            deliveryAddress = input.value;
            // clear coords when user types a manual address
            if (deliveryCoords) { deliveryCoords = null; }
            saveDeliveryToStorage();
            if (display) display.textContent = deliveryAddress || '';
        });
    }
    if (display) {
        if (deliveryCoords) {
            display.innerHTML = `Local enviado: <a href="https://www.openstreetmap.org/?mlat=${deliveryCoords.lat}&mlon=${deliveryCoords.lng}#map=18/${deliveryCoords.lat}/${deliveryCoords.lng}" target="_blank">Abrir mapa</a>`;
        } else {
            display.textContent = deliveryAddress || '';
        }
    }
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Geolocalização não suportada neste navegador.');
                return;
            }
            sendBtn.disabled = true;
            sendBtn.textContent = 'Enviando...';
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                deliveryCoords = { lat, lng };
                // prefer mostrar coords e link; keep deliveryAddress empty if not provided
                deliveryAddress = `Latitude: ${lat}, Longitude: ${lng}`;
                saveDeliveryToStorage();
                if (display) display.innerHTML = `Local enviado: <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}" target="_blank">Abrir mapa</a>`;
                if (input) input.value = '';
                sendBtn.disabled = false;
                sendBtn.textContent = 'Enviar localização atual';
            }, (err) => {
                alert('Não foi possível obter a localização: ' + err.message);
                sendBtn.disabled = false;
                sendBtn.textContent = 'Enviar localização atual';
            }, { enableHighAccuracy: true, timeout: 10000 });
        });
    }
}

// Renderizar produtos
function renderProducts(category, products) {
    const grid = document.getElementById(`${category}Grid`);
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="imageFallback(this)">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="openProductModal(${product.id})">
                    Selecionar
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Encontrar produto por ID
function findProduct(id) {
    const allProducts = [...lanches, ...bebidas];
    return allProducts.find(p => p.id === id);
}

// Abrir modal de seleção de produto
function openProductModal(productId) {
    selectedProduct = findProduct(productId);
    if (!selectedProduct) return;

    const modal = document.getElementById('productModal');
    document.getElementById('productModalImage').innerHTML = `<img src="${selectedProduct.image}" alt="${selectedProduct.name}" loading="lazy" onerror="imageFallback(this)" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--border-radius);">`;
    document.getElementById('productModalName').textContent = selectedProduct.name;
    document.getElementById('productModalDescription').textContent = selectedProduct.description;
    document.getElementById('productModalPrice').textContent = `R$ ${selectedProduct.price.toFixed(2)}`;
    document.getElementById('quantityInput').value = 1;
    document.getElementById('observationsInput').value = '';
    
    modal.classList.add('active');
}

// Fechar modal de seleção
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    selectedProduct = null;
}

// Controlar quantidade
function updateQuantity(value) {
    const input = document.getElementById('quantityInput');
    const newValue = parseInt(input.value) + value;
    if (newValue >= 1 && newValue <= 99) {
        input.value = newValue;
    }
}

// Adicionar ao carrinho com quantidade e observações
function addToCart() {
    if (!selectedProduct) return;

    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    const observations = document.getElementById('observationsInput').value.trim();
    
    // Criar identificador único para item com observações diferentes
    const itemKey = `${selectedProduct.id}_${observations}`;
    const existingItem = cart.find(item => item.itemKey === itemKey);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...selectedProduct,
            itemKey: itemKey,
            quantity: quantity,
            observations: observations
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    showAddedNotification(selectedProduct.name, quantity);
    closeProductModal();
}

// Atualizar UI do carrinho
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy" onerror="imageFallback(this)">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">Quantidade: ${item.quantity}</div>
                    ${item.observations ? `<div class="cart-item-obs"><em>Obs: ${item.observations}</em></div>` : ''}
                </div>
                <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item-btn" onclick="removeFromCart('${item.itemKey}')">
                    Remover
                </button>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // aplicar taxa por forma de pagamento
    const CREDIT_CARD_FEE = 0.0394; // 3.94% parcelado
    const AVISTA_FEE = 0.00; // 0% para Pix/Dinheiro (sem taxa)
    let feeRate = 0;
    if (paymentMethod === 'Cartão') feeRate = CREDIT_CARD_FEE;
    else if (paymentMethod === 'Pix' || paymentMethod === 'Dinheiro') feeRate = AVISTA_FEE;
    const feeAmount = total * feeRate;
    const totalWithFee = total + feeAmount;
    if (feeRate > 0) {
        cartTotal.textContent = `R$ ${totalWithFee.toFixed(2)} (incl. taxa R$ ${feeAmount.toFixed(2)})`;
    } else {
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
    const selectedDisplay = document.getElementById('selectedPaymentDisplay');
    if (selectedDisplay) selectedDisplay.textContent = paymentMethod || '—';
}

// Payment methods: persist selection and render controls
function savePaymentToStorage() {
    try { localStorage.setItem('centralLanchesPayment', paymentMethod); } catch (e) {}
}

function loadPaymentFromStorage() {
    try {
        const p = localStorage.getItem('centralLanchesPayment');
        if (p) paymentMethod = p;
    } catch (e) {}
}

function renderPaymentSelection() {
    const section = document.getElementById('paymentSection');
    if (!section) return;
    const inputs = Array.from(section.querySelectorAll('input[name="payment"]'));
    inputs.forEach(inp => {
        inp.checked = (inp.value === paymentMethod);
        inp.addEventListener('change', () => {
            if (inp.checked) {
                paymentMethod = inp.value;
                savePaymentToStorage();
                const sel = document.getElementById('selectedPaymentDisplay');
                if (sel) sel.textContent = paymentMethod;
                // atualizar UI do carrinho quando muda a forma de pagamento (recalcular taxa)
                try { updateCartUI(); } catch (e) {}
            }
        });
    });
}

// Remover item do carrinho por itemKey
function removeFromCart(itemKey) {
    try {
        const idx = cart.findIndex(i => i.itemKey === itemKey);
        if (idx === -1) return;
        cart.splice(idx, 1);
        saveCartToStorage();
        updateCartUI();
    } catch (e) {
        console.error('Erro ao remover item do carrinho:', e);
    }
}

function saveOrderNoteToStorage() {
    try { localStorage.setItem('centralLanchesOrderNote', orderNote); } catch (e) {}
}

function loadOrderNoteFromStorage() {
    try {
        const n = localStorage.getItem('centralLanchesOrderNote');
        if (n) orderNote = n;
    } catch (e) {}
}

function renderOrderNote() {
    const ta = document.getElementById('orderNoteInput');
    if (!ta) return;
    ta.value = orderNote || '';
    ta.addEventListener('input', () => {
        orderNote = ta.value;
        saveOrderNoteToStorage();
    });
}

// Configurar event listeners
function setupEventListeners() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModal = document.getElementById('cartModal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Product Modal listeners
    const closeProductModalBtn = document.getElementById('closeProductModalBtn');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const confirmAddBtn = document.getElementById('confirmAddBtn');
    const decreaseQtyBtn = document.getElementById('decreaseQtyBtn');
    const increaseQtyBtn = document.getElementById('increaseQtyBtn');
    const productModal = document.getElementById('productModal');
    
    // Cart Modal listeners
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    // Product Modal listeners
    closeProductModalBtn.addEventListener('click', closeProductModal);
    cancelProductBtn.addEventListener('click', closeProductModal);
    confirmAddBtn.addEventListener('click', addToCart);
    decreaseQtyBtn.addEventListener('click', () => updateQuantity(-1));
    increaseQtyBtn.addEventListener('click', () => updateQuantity(1));
    
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
    
    // Input de quantidade
    document.getElementById('quantityInput').addEventListener('change', (e) => {
        let value = parseInt(e.target.value);
        if (value < 1) e.target.value = 1;
        if (value > 99) e.target.value = 99;
    });
    
    checkoutBtn.addEventListener('click', finalizePurchase);
}

// Finalizar compra
function finalizePurchase() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const baseTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // aplicar mesmas taxas mostradas na UI
    const CREDIT_CARD_FEE = 0.0394; // 3.94% parcelado
    const AVISTA_FEE = 0.00; // 0% para Pix/Dinheiro (sem taxa)
    let feeRate = 0;
    if (paymentMethod === 'Cartão') feeRate = CREDIT_CARD_FEE;
    else if (paymentMethod === 'Pix' || paymentMethod === 'Dinheiro') feeRate = AVISTA_FEE;
    const feeAmount = baseTotal * feeRate;
    const total = baseTotal + feeAmount;
    const items = cart.map(item => {
        let itemText = `${item.name} (x${item.quantity})`;
        if (item.observations) {
            itemText += ` - Obs: ${item.observations}`;
        }
        return itemText;
    }).join('\n');
    
    const feeText = feeRate > 0 ? `\nTaxa: R$ ${feeAmount.toFixed(2)} (${(feeRate*100).toFixed(2)}%)` : '';
    const message = `Olá! Gostaria de fazer o seguinte pedido:\n\n${items}\n\nTotal: R$ ${total.toFixed(2)}${feeText}`;
    // incluir forma de pagamento no pedido
    const paymentText = paymentMethod ? `\nForma de pagamento: ${paymentMethod}` : '';
    const orderNoteText = orderNote ? `\nObservações: ${orderNote}` : '';
    let deliveryText = '';
    if (deliveryCoords) {
        deliveryText = `\nLocalização: https://www.openstreetmap.org/?mlat=${deliveryCoords.lat}&mlon=${deliveryCoords.lng}#map=18/${deliveryCoords.lat}/${deliveryCoords.lng}`;
    } else if (deliveryAddress) {
        deliveryText = `\nEndereço: ${deliveryAddress}`;
    }
    const finalMessage = encodeURIComponent(message + paymentText + orderNoteText + deliveryText);
    const whatsappNumber = '5585999999999'; // Altere para seu número
    // Abrir WhatsApp com forma de pagamento
    window.open(`https://wa.me/${whatsappNumber}?text=${finalMessage}`, '_blank');
    
    // Limpar carrinho após enviar
    setTimeout(() => {
        cart = [];
        saveCartToStorage();
        updateCartUI();
        document.getElementById('cartModal').classList.remove('active');
        // limpar observação do pedido
        orderNote = '';
        saveOrderNoteToStorage();
        const ta = document.getElementById('orderNoteInput');
        if (ta) ta.value = '';
        // limpar endereço e coords
        deliveryAddress = '';
        deliveryCoords = null;
        saveDeliveryToStorage();
        const da = document.getElementById('deliveryAddressInput');
        const disp = document.getElementById('deliveryAddressDisplay');
        if (da) da.value = '';
        if (disp) disp.textContent = '';
    }, 500);
}

// Notificação de produto adicionado
function showAddedNotification(productName, quantity = 1) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 300;
        animation: slideInRight 0.3s ease;
        font-weight: bold;
    `;
    notification.textContent = `✓ ${quantity}x ${productName} adicionado ao carrinho!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Armazenar carrinho no localStorage
function saveCartToStorage() {
    localStorage.setItem('centralLanchesCart', JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCartFromStorage() {
    const saved = localStorage.getItem('centralLanchesCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Adicionar animação CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Avaliação 1-5 estrelas: lógica, persistência e UI
function initRating() {
    const starsContainer = document.getElementById('ratingStars');
    const infoEl = document.getElementById('ratingInfo');
    if (!starsContainer || !infoEl) return;
    const stars = Array.from(starsContainer.querySelectorAll('.star'));
    const removeBtn = document.getElementById('removeRatingBtn');

    // Ratings are stored as an object keyed by a per-browser user id:
    // { userId: rating }
    function getRatingsObj() {
        try {
            // migrate old array format if present
            const old = localStorage.getItem('centralLanchesRatings');
            if (old) {
                try {
                    const arr = JSON.parse(old);
                    if (Array.isArray(arr)) {
                        const obj = {};
                        arr.forEach((v, i) => obj['migrate_' + i] = v);
                        localStorage.setItem('centralLanchesRatingsObj', JSON.stringify(obj));
                        localStorage.removeItem('centralLanchesRatings');
                        return obj;
                    }
                } catch (e) {}
            }
            return JSON.parse(localStorage.getItem('centralLanchesRatingsObj') || '{}');
        } catch (e) { return {}; }
    }

    function saveRatingsObj(obj) {
        localStorage.setItem('centralLanchesRatingsObj', JSON.stringify(obj));
    }

    function getUserId() {
        let id = localStorage.getItem('centralLanchesUserId');
        if (!id) {
            id = 'u_' + Math.random().toString(36).slice(2, 10);
            localStorage.setItem('centralLanchesUserId', id);
        }
        return id;
    }

    const userId = getUserId();

    function getRatingsArray() {
        const obj = getRatingsObj();
        return Object.values(obj).map(v => parseInt(v, 10));
    }

    function getUserRating() {
        const obj = getRatingsObj();
        return obj[userId] ? parseInt(obj[userId], 10) : null;
    }

    function saveUserRating(val) {
        const obj = getRatingsObj();
        obj[userId] = val;
        saveRatingsObj(obj);
    }

    function renderInfo() {
        const arr = getRatingsArray();
        const user = getUserRating();
        if (removeBtn) removeBtn.disabled = !user;
        if (arr.length === 0) {
            if (user) {
                infoEl.textContent = `Você avaliou: ${user} estrela(s)`;
                fillStars(user);
            } else {
                infoEl.textContent = 'Nenhuma avaliação ainda';
                fillStars(0);
            }
            return;
        }
        const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
        if (user) {
            infoEl.textContent = `Você avaliou: ${user} • Média: ${avg.toFixed(1)} (${arr.length})`;
        } else {
            infoEl.textContent = `Avaliação média: ${avg.toFixed(1)} (${arr.length} avaliações)`;
        }
        fillStars(Math.round(avg));
    }

    function fillStars(n) {
        stars.forEach(s => {
            const v = parseInt(s.dataset.value, 10);
            if (v <= n) s.classList.add('filled'); else s.classList.remove('filled');
        });
    }

    // Handlers: allow the user to change their rating (updates stored value)
    stars.forEach(s => {
        const val = parseInt(s.dataset.value, 10);
        s.addEventListener('click', () => {
            const prev = getUserRating();
            saveUserRating(val);
            if (prev) {
                infoEl.textContent = 'Sua avaliação foi atualizada!';
            } else {
                infoEl.textContent = 'Obrigado pela sua avaliação!';
            }
            fillStars(val);
            setTimeout(renderInfo, 700);
        });
        s.addEventListener('mouseover', () => fillStars(val));
        s.addEventListener('mouseout', renderInfo);
    });

    // Remover avaliação do usuário atual
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            const obj = getRatingsObj();
            if (obj[userId]) {
                delete obj[userId];
                saveRatingsObj(obj);
                infoEl.textContent = 'Sua avaliação foi removida.';
                fillStars(0);
                // atualizar UI após breve pausa para feedback
                setTimeout(renderInfo, 700);
            } else {
                infoEl.textContent = 'Você não tem avaliação para remover.';
            }
        });
    }

    // inicializar
    renderInfo();
}

// Função de fallback para imagens quebradas
function imageFallback(img) {
    try {
        // evitar loop se a imagem já estiver com fallback
        if (img.dataset.fallbackApplied) return;
        const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23777777' font-family='Arial, Helvetica, sans-serif' font-size='20'>Imagem indisponível</text></svg>`;
        img.src = svg;
        img.dataset.fallbackApplied = '1';
        img.classList.add('img-fallback');
        img.onerror = null;
    } catch (e) {
        img.onerror = null;
    }
}
