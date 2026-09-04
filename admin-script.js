// Credenciais padrão (em produção, usar autenticação real)
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: '1234'
};

let adminData = {
    orders: [],
    settings: {
        whatsappNumber: '55',
        storeName: 'Central Lanches',
        storePhone: '',
        storeAddress: ''
    }
};

// Dados dos produtos
let products = [
    { id: 1, name: 'Hambúrguer Clássico', description: 'Pão, carne, alface, tomate e maionese', price: 18.90, category: 'lanches', image: 'images/lanche-1.jpg' },
    { id: 2, name: 'X-Frango', description: 'Pão, frango, queijo, alface e tomate', price: 22.90, category: 'lanches', image: 'images/x-frango.jpg' },
    { id: 3, name: 'X-Salada', description: 'Pão, carne, queijo, alface, tomate, cebola', price: 24.90, category: 'lanches', image: 'images/x-salada.jpg' },
    { id: 4, name: 'Misto Quente', description: 'Pão, presunto, queijo e manteiga', price: 12.90, category: 'lanches', image: 'images/Misto%20Quente.png' },
    { id: 5, name: 'Cachorro Quente', description: 'Pão, linguiça, batata palha, milho', price: 14.90, category: 'lanches', image: 'images/Cachorro%20Quente.jpg' },
    { id: 6, name: 'Beiragen na Chapa', description: 'Carne, queijo derretido, cebola e pimentão', price: 26.90, category: 'lanches', image: 'images/Beiragen%20na%20Chapa.avif' },
    { id: 7, name: 'Pastel de Carne', description: 'Pastel crocante recheado com carne moída', price: 8.90, category: 'lanches', image: 'images/Pastel%20de%20Carne.jpg' },
    { id: 8, name: 'Coxinha de Frango', description: 'Coxinha macia com frango desfiado', price: 7.90, category: 'lanches', image: 'images/coxinha.webp' },
    { id: 101, name: 'Refrigerante 2L', description: 'Diversos sabores disponíveis', price: 9.90, category: 'bebidas', image: 'images/coca-cola-2-litros.jpg' },
    { id: 102, name: 'Refrigerante Lata', description: 'Coca-Cola, Fanta, Sprite', price: 5.90, category: 'bebidas', image: 'images/bebida-2.jpg' },
    { id: 103, name: 'Suco Natural', description: 'Laranja, Maçã ou Morango', price: 8.90, category: 'bebidas', image: 'images/bebida-3.jpg' },
    { id: 104, name: 'Chopp (1L)', description: 'Chopp Gelado - Brahma', price: 19.90, category: 'bebidas', image: 'images/cerveja.jpg' },
    { id: 105, name: 'Água Mineral', description: 'Água 500ml ou 1.5L', price: 3.90, category: 'bebidas', image: 'images/agua%20mineral.webp' },
    { id: 106, name: 'Milkshake', description: 'Chocolate, Morango ou Baunilha', price: 12.90, category: 'bebidas', image: 'images/Milkshake.webp' },
    { id: 107, name: 'Chá Gelado', description: 'Pêssego, Maçã ou Limão', price: 6.90, category: 'bebidas', image: 'images/Ch%C3%A1%20Gelado.webp' },
    { id: 108, name: 'Café Coado', description: 'Café coado quentinho 300ml', price: 4.90, category: 'bebidas', image: 'images/Cafe.jpg' }
];

// Imagens disponíveis na pasta images/ (preenchido com os nomes encontrados no projeto)
const AVAILABLE_IMAGES = [
    "agua mineral.webp",
    "bebida-2.jpg",
    "bebida-3.jpg",
    "Beiragen na Chapa.avif",
    "Cachorro Quente.jpg",
    "Cafe.jpg",
    "cerveja.jpg",
    "Chá Gelado.webp",
    "coca-cola-2-litros.jpg",
    "coxinha.webp",
    "header.jpg",
    "lanche-1.jpg",
    "lanche-6.jpg",
    "lanche-7.jpg",
    "lanche-8.jpg",
    "Milkshake.webp",
    "Misto Quente.png",
    "Pastel de Carne.jpg",
    "refri em lata.png",
    "spices.jpg",
    "x-frango.jpg",
    "x-salada.jpg"
];

function populateImageSelect() {
    const sel = document.getElementById('productImageSelect');
    const imgInput = document.getElementById('productImage');
    const preview = document.getElementById('productImagePreview');
    if (!sel) return;
    // limpar
    sel.innerHTML = '<option value="">Selecionar imagem existente</option>';
    AVAILABLE_IMAGES.forEach(fn => {
        const opt = document.createElement('option');
        opt.value = fn;
        opt.textContent = fn;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
        const v = sel.value;
        if (!imgInput) return;
        if (!v) {
            imgInput.value = '';
            if (preview) { preview.src = ''; preview.style.display = 'none'; }
            return;
        }
        const path = 'images/' + v;
        imgInput.value = path;
        try { if (preview) { preview.src = encodeURI(path); preview.style.display = 'inline-block'; } } catch (e) {}
    });
}

// Carregar dados do localStorage
function loadAdminData() {
    const saved = localStorage.getItem('adminData');
    if (saved) {
        adminData = JSON.parse(saved);
    }
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

// Salvar dados no localStorage
function saveAdminData() {
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('adminProducts', JSON.stringify(products));
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();
    setupLoginForm();
    setupTabs();
    // popular seletor de imagens disponíveis
    try { populateImageSelect(); } catch (e) {}
    checkLogin();
});

// Verificar se está logado
function checkLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
}

// Configurar form de login
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
                localStorage.setItem('adminLoggedIn', 'true');
                showDashboard();
            } else {
                document.getElementById('loginError').textContent = 'Usuário ou senha incorretos!';
            }
        });
    }
}

// Mostrar login
function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
}

// Mostrar dashboard
function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'flex';
    renderProductsTable();
    updateDashboard();
    setupSettingsForm();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    showLogin();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
}

// Configurar navegação de abas
function setupTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Atualizar dashboard
function updateDashboard() {
    const totalOrders = document.getElementById('totalOrders');
    const totalRevenue = document.getElementById('totalRevenue');
    const totalCustomers = document.getElementById('totalCustomers');
    
    if (totalOrders) totalOrders.textContent = adminData.orders.length;
    if (totalCustomers) totalCustomers.textContent = adminData.orders.length;
    
    let revenue = 0;
    adminData.orders.forEach(order => {
        revenue += order.total;
    });
    if (totalRevenue) totalRevenue.textContent = `R$ ${revenue.toFixed(2)}`;
}

// Renderizar tabela de produtos
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy" onerror="imageFallback(this)"></td>
            <td>${product.category === 'lanches' ? 'Lanches' : 'Bebidas'}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Abrir modal de novo/editar produto
document.addEventListener('DOMContentLoaded', () => {
    const addProductBtn = document.getElementById('addProductBtn');
    const closeProductModal = document.getElementById('closeProductModal');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const productForm = document.getElementById('productForm');
    const productModal = document.getElementById('productModal');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            document.getElementById('productModalTitle').textContent = 'Novo Produto';
            productForm.reset();
            // configurar preview de imagem
            const preview = document.getElementById('productImagePreview');
            const imgInput = document.getElementById('productImage');
            const fileInput = document.getElementById('productImageFile');
            if (preview) { preview.style.display = 'none'; preview.src = ''; }
            const sel = document.getElementById('productImageSelect');
            if (sel) sel.value = '';
            if (imgInput) {
                imgInput.value = '';
                if (window._admin_img_input_handler) imgInput.removeEventListener('input', window._admin_img_input_handler);
                const handler = () => {
                    const v = imgInput.value.trim();
                    if (v) { preview.src = v; preview.style.display = 'inline-block'; } else { preview.src = ''; preview.style.display = 'none'; }
                };
                window._admin_img_input_handler = handler;
                imgInput.addEventListener('input', handler);
                // file input handler
                if (fileInput) {
                    fileInput.value = '';
                    if (window._admin_img_file_handler) fileInput.removeEventListener('change', window._admin_img_file_handler);
                    const fh = (ev) => {
                        const f = ev.target.files && ev.target.files[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                            try {
                                imgInput.value = reader.result;
                                if (preview) { preview.src = reader.result; preview.style.display = 'inline-block'; }
                            } catch (e) {}
                        };
                        reader.readAsDataURL(f);
                    };
                    window._admin_img_file_handler = fh;
                    fileInput.addEventListener('change', fh);
                }
            }
            productForm.onsubmit = addNewProduct;
            productModal.classList.add('active');
        });
    }
    
    if (closeProductModal) {
        closeProductModal.addEventListener('click', () => {
            productModal.classList.remove('active');
        });
    }
    
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', () => {
            productModal.classList.remove('active');
        });
    }
    
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
            }
        });
    }
});

// Adicionar novo produto
function addNewProduct(e) {
    e.preventDefault();
    
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: (document.getElementById('productImage').value || '').trim()
    };
    
    products.push(newProduct);
    saveAdminData();
    renderProductsTable();
    document.getElementById('productModal').classList.remove('active');
    alert('Produto adicionado com sucesso!');
}

// Editar produto
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const productModal = document.getElementById('productModal');
    document.getElementById('productModalTitle').textContent = 'Editar Produto';
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    const imgInput = document.getElementById('productImage');
    const preview = document.getElementById('productImagePreview');
    const fileInput = document.getElementById('productImageFile');
    if (imgInput) imgInput.value = product.image || '';
    if (preview) {
        if (product.image) { preview.src = product.image; preview.style.display = 'inline-block'; } else { preview.src = ''; preview.style.display = 'none'; }
    }
    if (imgInput) {
        if (window._admin_img_input_handler) imgInput.removeEventListener('input', window._admin_img_input_handler);
        const handler = () => {
            const v = imgInput.value.trim();
            if (preview) {
                if (v) { preview.src = v; preview.style.display = 'inline-block'; } else { preview.src = ''; preview.style.display = 'none'; }
            }
        };
        window._admin_img_input_handler = handler;
        imgInput.addEventListener('input', handler);
    }
    // ajustar seletor para o item atual (se estiver na pasta images/)
    const sel = document.getElementById('productImageSelect');
    if (sel) {
        try {
            const val = product.image || '';
            if (val && val.indexOf('images/') === 0) {
                const name = val.split('/').pop();
                sel.value = name;
            } else {
                sel.value = '';
            }
        } catch (e) { sel.value = ''; }
    }
    // configurar file input para edição
    if (fileInput) {
        fileInput.value = '';
        if (window._admin_img_file_handler) fileInput.removeEventListener('change', window._admin_img_file_handler);
        const fh = (ev) => {
            const f = ev.target.files && ev.target.files[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    if (imgInput) imgInput.value = reader.result;
                    if (preview) { preview.src = reader.result; preview.style.display = 'inline-block'; }
                } catch (e) {}
            };
            reader.readAsDataURL(f);
        };
        window._admin_img_file_handler = fh;
        fileInput.addEventListener('change', fh);
    }
    
    document.getElementById('productForm').onsubmit = (e) => {
        e.preventDefault();
        product.name = document.getElementById('productName').value;
        product.description = document.getElementById('productDescription').value;
        product.price = parseFloat(document.getElementById('productPrice').value);
        product.category = document.getElementById('productCategory').value;
        product.image = (document.getElementById('productImage').value || '').trim();
        
        saveAdminData();
        renderProductsTable();
        productModal.classList.remove('active');
        alert('Produto atualizado com sucesso!');
    };
    
    productModal.classList.add('active');
}

// Excluir produto
function deleteProduct(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== id);
        saveAdminData();
        renderProductsTable();
        alert('Produto excluído com sucesso!');
    }
}

// Configurar form de settings
function setupSettingsForm() {
    const whatsappInput = document.getElementById('whatsappNumber');
    const storeNameInput = document.getElementById('storeName');
    const storePhoneInput = document.getElementById('storePhone');
    const storeAddressInput = document.getElementById('storeAddress');
    const sendStoreLocationBtn = document.getElementById('sendStoreLocationBtn');
    const storeLocationDisplay = document.getElementById('storeLocationDisplay');
    const saveBtn = document.getElementById('saveSettingsBtn');
    
    if (whatsappInput) {
        whatsappInput.value = adminData.settings.whatsappNumber;
    }
    if (storeNameInput) {
        storeNameInput.value = adminData.settings.storeName;
    }
    if (storePhoneInput) {
        storePhoneInput.value = adminData.settings.storePhone;
    }
    if (storeAddressInput) {
        storeAddressInput.value = adminData.settings.storeAddress;
    }

    // render stored store coords (if houver)
    try {
        if (storeLocationDisplay) {
            const sc = adminData.settings.storeCoords;
            if (sc && sc.lat && sc.lng) {
                storeLocationDisplay.innerHTML = `Local da loja: <a href="https://www.openstreetmap.org/?mlat=${sc.lat}&mlon=${sc.lng}#map=18/${sc.lat}/${sc.lng}" target="_blank">Abrir mapa</a>`;
            } else {
                storeLocationDisplay.textContent = '';
            }
        }
    } catch (e) {}

    if (sendStoreLocationBtn) {
        sendStoreLocationBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Geolocalização não suportada neste navegador.');
                return;
            }
            sendStoreLocationBtn.disabled = true;
            const prevText = sendStoreLocationBtn.textContent;
            sendStoreLocationBtn.textContent = 'Enviando...';
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                adminData.settings.storeCoords = { lat: lat, lng: lng };
                saveAdminData();
                if (storeLocationDisplay) storeLocationDisplay.innerHTML = `Local da loja: <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}" target="_blank">Abrir mapa</a>`;
                sendStoreLocationBtn.disabled = false;
                sendStoreLocationBtn.textContent = prevText;
                alert('Localização da loja salva com sucesso.');
            }, (err) => {
                alert('Não foi possível obter a localização: ' + err.message);
                sendStoreLocationBtn.disabled = false;
                sendStoreLocationBtn.textContent = prevText;
            }, { enableHighAccuracy: true, timeout: 15000 });
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            adminData.settings.whatsappNumber = whatsappInput.value;
            adminData.settings.storeName = storeNameInput.value;
            adminData.settings.storePhone = storePhoneInput.value;
            adminData.settings.storeAddress = storeAddressInput.value;
            // coletar schedule a partir da UI
            const schedule = getScheduleFromUI();
            adminData.settings.schedule = schedule;
            
            saveAdminData();
            // atualizar cartão do dashboard imediatamente
            try { renderDashboardSchedule(); } catch (e) {}
            alert('Configurações salvas com sucesso!');
        });
    }
}

// Horário de funcionamento: render + coletar
const WEEK_DAYS = [
    { key: 'mon', label: 'Segunda' },
    { key: 'tue', label: 'Terça' },
    { key: 'wed', label: 'Quarta' },
    { key: 'thu', label: 'Quinta' },
    { key: 'fri', label: 'Sexta' },
    { key: 'sat', label: 'Sábado' },
    { key: 'sun', label: 'Domingo' }
];

function ensureDefaultSchedule() {
    if (!adminData.settings.schedule) {
        const s = {};
        WEEK_DAYS.forEach(d => {
            s[d.key] = { enabled: false, open: '10:00', close: '22:00' };
        });
        adminData.settings.schedule = s;
    }
}

function renderScheduleUI() {
    ensureDefaultSchedule();
    const container = document.getElementById('scheduleSection');
    if (!container) return;
    const schedule = adminData.settings.schedule || {};
    container.innerHTML = '';
    WEEK_DAYS.forEach(d => {
        const row = document.createElement('div');
        row.className = 'schedule-row';
        const item = schedule[d.key] || { enabled: false, open: '10:00', close: '22:00' };
        row.innerHTML = `
            <label class="day-label"><input type="checkbox" data-day="${d.key}" class="day-enabled" ${item.enabled ? 'checked' : ''}> ${d.label}</label>
            <input type="time" data-day-open="${d.key}" class="time-open" value="${item.open}">
            <span class="time-sep">—</span>
            <input type="time" data-day-close="${d.key}" class="time-close" value="${item.close}">
        `;
        container.appendChild(row);
    });

    // atualizar estado inicial (desabilitar inputs quando não marcado)
    container.querySelectorAll('.schedule-row').forEach(row => {
        const chk = row.querySelector('.day-enabled');
        const open = row.querySelector('.time-open');
        const close = row.querySelector('.time-close');
        const toggle = () => {
            const enabled = chk.checked;
            open.disabled = !enabled;
            close.disabled = !enabled;
        };
        chk.addEventListener('change', toggle);
        toggle();
    });
}

function getScheduleFromUI() {
    const container = document.getElementById('scheduleSection');
    const out = {};
    if (!container) return out;
    WEEK_DAYS.forEach(d => {
        const chk = container.querySelector(`input.day-enabled[data-day="${d.key}"]`);
        const open = container.querySelector(`input.time-open[data-day-open="${d.key}"]`);
        const close = container.querySelector(`input.time-close[data-day-close="${d.key}"]`);
        out[d.key] = {
            enabled: Boolean(chk && chk.checked),
            open: open ? open.value : '10:00',
            close: close ? close.value : '22:00'
        };
    });
    return out;
}

// chamar render quando mostrar dashboard/settings
const originalShowDashboard = showDashboard;
showDashboard = function() {
    originalShowDashboard();
    ensureDefaultSchedule();
    renderScheduleUI();
    // quando abrir aba settings, também renderizar quando clicada
    const settingsBtn = document.querySelector('.nav-btn[data-tab="settings"]');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => setTimeout(renderScheduleUI, 50));
    }
    // renderizar horário no dashboard
    renderDashboardSchedule();
    const editBtn = document.getElementById('editScheduleBtn');
    if (editBtn) editBtn.addEventListener('click', () => {
        // abrir aba de settings
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        const settingsTabBtn = document.querySelector('.nav-btn[data-tab="settings"]');
        if (settingsTabBtn) settingsTabBtn.classList.add('active');
        const settingsTab = document.getElementById('settings-tab');
        if (settingsTab) settingsTab.classList.add('active');
        setTimeout(renderScheduleUI, 80);
    });
};

function renderDashboardSchedule() {
    const target = document.getElementById('dashboardScheduleContent');
    if (!target) return;
    ensureDefaultSchedule();
    const sched = adminData && adminData.settings && adminData.settings.schedule ? adminData.settings.schedule : null;
    if (!sched) {
        target.textContent = 'Nenhuma configuração';
        return;
    }
    // mostrar linhas compactas (ex: Seg: 10:00-22:00)
    const lines = [];
    const labelMap = { mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom' };
    Object.keys(labelMap).forEach(k => {
        const it = sched[k];
        if (it && it.enabled) lines.push(`${labelMap[k]} ${it.open}–${it.close}`);
        else lines.push(`${labelMap[k]} Fechado`);
    });
    target.innerHTML = `<div class="dash-sched-lines">${lines.map(l => `<div>${l}</div>`).join('')}</div>`;
}

// Fallback para imagens quebradas no admin também
function imageFallback(img) {
    try {
        if (img.dataset.fallbackApplied) return;
        const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23777777' font-family='Arial, Helvetica, sans-serif' font-size='16'>Imagem indisponível</text></svg>`;
        img.src = svg;
        img.dataset.fallbackApplied = '1';
        img.classList.add('img-fallback');
        img.onerror = null;
    } catch (e) {
        img.onerror = null;
    }
}
