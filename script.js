document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. PLANTILLAS (Templates) ---
    // Inserta las cabeceras y nav-bars en todas las "pantallas principales"
    const headerTemplate = document.getElementById('header-template').innerHTML;
    const navbarTemplate = document.getElementById('navbar-template').innerHTML;
    const mainScreens = document.querySelectorAll('.main-screen');
    
    mainScreens.forEach(screen => {
        screen.insertAdjacentHTML('afterbegin', headerTemplate);
        screen.insertAdjacentHTML('beforeend', navbarTemplate);
    });

    // --- 2. POPUPS Y DIÁLOGOS ---
    const popups = document.querySelectorAll('.popup-menu, .popup-dialog');
    function hidePopups() {
        popups.forEach(p => p.classList.remove('active'));
    }
    
    function showPopup(popupId) {
        hidePopups(); // Cierra otros popups
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.add('active');
        }
    }
    
    // Cierra los popups si se hace clic fuera
    document.querySelector('.mobile-container').addEventListener('click', (e) => {
        if (!e.target.closest('.popup-menu') && !e.target.closest('.header-icons button') && !e.target.closest('.dropdown-menu') && !e.target.closest('#chat-attach-btn')) {
            hidePopups();
        }
        // CAMBIO: Ahora cierra ambos popups de borrado
        if (e.target.id === 'cancel-delete' || e.target.id === 'cancel-delete-all') {
            hidePopups();
        }
    });

    // --- 3. FUNCIÓN PRINCIPAL DE NAVEGACIÓN ---
    function showScreen(screenId) {
        hidePopups(); // Oculta popups al cambiar de pantalla
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const activeScreen = document.getElementById(screenId);
        if (activeScreen) {
            activeScreen.classList.add('active');
            
            if (activeScreen.classList.contains('main-screen')) {
                const navBar = activeScreen.querySelector('.nav-bar');
                if (navBar) {
                    navBar.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                    let activeId = screenId;
                    if (screenId.startsWith('communities-')) {
                        activeId = 'communities-screen';
                    }
                    const activeBtn = navBar.querySelector(`[data-target="${activeId}"]`);
                    if (activeBtn) {
                        activeBtn.classList.add('active');
                    }
                }
            }
        } else {
            console.error("No se encontró la pantalla:", screenId);
        }
    }

    // --- 4. EVENT LISTENERS DE NAVEGACIÓN ---
    
    // Auth (Login, Register, Reset)
    document.getElementById('login-form').addEventListener('submit', (e) => { e.preventDefault(); showScreen('trends-screen'); });
    document.getElementById('register-form').addEventListener('submit', (e) => { e.preventDefault(); showScreen('trends-screen'); });
    document.getElementById('reset-form').addEventListener('submit', (e) => { e.preventDefault(); showScreen('login-screen'); });

    // Navegación general (botones y enlaces)
    document.addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav-link');
        const navBtn = e.target.closest('.nav-btn');
        const btnBack = e.target.closest('.btn-back');
        
        let targetScreen = null;
        
        if (navLink) { e.preventDefault(); targetScreen = navLink.dataset.target; } 
        else if (navBtn) { targetScreen = navBtn.dataset.target; } 
        else if (btnBack) { targetScreen = btnBack.dataset.target; }
        
        if (targetScreen) { showScreen(targetScreen); }
    });

    // Abrir Popups
    document.addEventListener('click', (e) => {
        const userBtn = e.target.closest('.header-user-btn');
        const optionsBtn = e.target.closest('.header-options-btn');
        const langBtn = e.target.closest('.header-lang-btn');
        const communityMenu = e.target.closest('.dropdown-menu');
        const showPopupBtn = e.target.closest('.show-popup');
        const chatAttachBtn = e.target.closest('#chat-attach-btn');
        
        let popupId = null;
        
        if (userBtn) { popupId = 'user-popup'; }
        else if (optionsBtn) { popupId = 'options-popup'; }
        else if (langBtn) { popupId = 'language-popup'; }
        else if (communityMenu) { popupId = 'communities-popup'; }
        else if (showPopupBtn) { popupId = showPopupBtn.dataset.target; }
        else if (chatAttachBtn) { popupId = 'chat-attach-popup'; }
        
        if (popupId) {
            e.preventDefault();
            showPopup(popupId);
        }
    });

    // --- 5. SIMULACIÓN DE FUNCIONALIDAD ---

    // a) Tema Claro/Oscuro (Pág 16)
    document.getElementById('theme-toggle-btn').addEventListener('click', (e) => {
        const body = document.body;
        const currentTheme = body.dataset.theme;
        const newTheme = (currentTheme === 'light') ? 'dark' : 'light';
        body.dataset.theme = newTheme;
        e.target.innerText = (newTheme === 'light') ? '🌙 Tema Oscuro' : '☀️ Tema Claro';
        hidePopups();
    });

    // b) Tamaño de Letra (Pág 21)
    document.getElementById('font-size-slider').addEventListener('input', (e) => {
        const value = e.target.value;
        const sizes = ['small', 'medium', 'large'];
        document.body.dataset.fontSize = sizes[value];
    });

    // c) Simulación de Chat IA (Pág 4)
    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input-text');
        const chatArea = document.getElementById('chat-content-area');
        const message = input.value.trim();
        
        if (!message) return;
        
        chatArea.innerHTML += `<div class="chat-bubble sent">${message}</div>`;
        input.value = '';
        chatArea.scrollTop = chatArea.scrollHeight;
        
        setTimeout(() => {
            const fiabilidad = Math.floor(Math.random() * 60) + 15;
            chatArea.innerHTML += `
                <div class="chat-bubble received ai-response">
                    <p>Analizando...</p><p>Fiabilidad aproximada:</p>
                    <strong>${fiabilidad}%</strong>
                </div>
            `;
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 1500);
    });
    
    // NUEVO: Listener para TODOS los chats privados
    document.addEventListener('submit', (e) => {
        if (e.target.id && e.target.id.startsWith('private-chat-form-')) {
            e.preventDefault(); // ARREGLA EL BUG DE RECARGA
            const input = e.target.querySelector('input[type="text"]');
            // Encuentra el área de chat, que es el hermano anterior del form
            const chatArea = e.target.previousElementSibling; 
            const message = input.value.trim();
            
            if (!message) return;
            
            // Añade solo el mensaje enviado, sin respuesta
            chatArea.innerHTML += `<div class="chat-bubble sent">${message}</div>`;
            input.value = '';
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    });

    // d) Simulación de Interacciones (Likes, Follows, Comentarios)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-like')) {
            e.target.classList.toggle('liked');
            e.target.innerText = e.target.classList.contains('liked') ? '👍 7.2k+1' : '👍 7.2k';
        }
        if (e.target.classList.contains('btn-follow')) {
            e.target.classList.toggle('followed');
            e.target.innerText = e.target.classList.contains('followed') ? 'Siguiendo' : 'Seguir';
        }
        if (e.target.classList.contains('btn-thumb-up')) {
            e.target.classList.toggle('active');
            e.target.nextElementSibling.classList.remove('active');
        }
        if (e.target.classList.contains('btn-thumb-down')) {
            e.target.classList.toggle('active');
            e.target.previousElementSibling.classList.remove('active');
        }
    });

    // e) Flujo de Borrado de Historial (Pág 13)
    document.getElementById('confirm-delete').addEventListener('click', () => {
        alert("Borrando elementos seleccionados (simulado)...");
        showScreen('history-screen');
    });
    
    // NUEVO: Flujo de Borrado de Historial (Pág 11)
    document.getElementById('confirm-delete-all').addEventListener('click', () => {
        alert("Historial completo borrado (simulado).");
        // Vacía la lista en la UI
        document.getElementById('history-list-container').innerHTML = '<li style="opacity: 0.7; text-align: center;">No hay historial.</li>';
        hidePopups();
    });

    // f) Ojo de Contraseña
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('password-toggle')) {
            const input = e.target.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                e.target.innerText = '🙈';
            } else {
                input.type = 'password';
                e.target.innerText = '👁️';
            }
        }
    });

});