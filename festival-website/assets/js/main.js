document.addEventListener('DOMContentLoaded', function () {
    function loadComponent(containerId, url, callback) {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.text();
            })
            .then(html => {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = html;
                    if (callback) callback();
                }
            })
            .catch(error => {
                console.error('Error loading component:', error);
                if (containerId === 'header-container') {
                    ensureHeaderVisibility();
                }
            });
    }

    function ensureHeaderVisibility() {
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.style.display = 'block';
            headerContainer.style.position = 'relative';
            headerContainer.style.zIndex = '1000';
        }
    }

    function initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const body = document.body;

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const isActive = mobileMenuToggle.classList.contains('active');

                if (isActive) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                } else {
                    mobileMenuToggle.classList.add('active');
                    mobileMenu.classList.add('active');
                    body.classList.add('menu-open');
                }
            });

            const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-nav a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function () {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                });
            });

            document.addEventListener('click', function (e) {
                if (!mobileMenuToggle.contains(e.target) &&
                    !mobileMenu.contains(e.target) &&
                    mobileMenu.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            });

            window.addEventListener('resize', function () {
                if (window.innerWidth > 900) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            });
        }
    }

    loadComponent('header-container', 'components/header.html', function () {
        initializeMobileMenu();
        ensureHeaderVisibility();
    });

    loadComponent('sidebar-container', 'components/sidebar.html');
    loadComponent('modals-container', 'components/modals.html');

    setTimeout(function () {
        const header = document.querySelector('#header-container header');
        if (!header || header.offsetHeight === 0) {
            ensureHeaderVisibility();
            console.warn('Header visibility was forced due to loading issues');
        }
    }, 2000);
});

window.onload = function () {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            if (typeof currentFilter !== 'undefined') {
                currentFilter = btn.dataset.filter;
            }
            if (typeof map !== 'undefined' && typeof loadMapLayers === 'function') {
                map.eachLayer(l => l.remove());
                loadMapLayers();
            }
        };
    });
};

function changeMonth(dir) {
    if (typeof currentMonth !== 'undefined') {
        currentMonth += dir;
        if (typeof renderCalendar === 'function') {
            renderCalendar();
        }
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('d-none');
    }
}
// ========================================
// FUNCIONES PRINCIPALES DE MODAL
// ========================================

/**
 * Abre un modal específico
 * @param {string} modalId - ID del modal a abrir
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('d-none');
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Focus en el primer input del modal
        setTimeout(() => {
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    } else {
        console.error('Modal no encontrado:', modalId);
    }
}

/**
 * Cierra un modal específico
 * @param {string} modalId - ID del modal a cerrar
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('d-none');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        // Limpiar formularios si es necesario
        const form = modal.querySelector('form');
        if (form && (modalId === 'loginModal' || modalId === 'registerModal' || modalId === 'forgotPasswordModal')) {
            // No limpiar estos formularios automáticamente
        }
    }
}

/**
 * Cierra todos los modales abiertos
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('d-none');
        modal.style.display = 'none';
    });
    document.body.classList.remove('modal-open');
}

// ========================================
// INICIALIZACIÓN DE EVENTOS DE MODAL
// ========================================

/**
 * Inicializa todos los eventos relacionados con modales
 */
function initializeModalEvents() {
    // Evento para cerrar modal con botón X
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-btn')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });

    // Evento para cerrar modal clickeando fuera del contenido
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Evento para cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:not(.d-none)');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });

    // Prevenir que se cierre el modal al hacer click dentro del contenido
    document.addEventListener('click', function(e) {
        if (e.target.closest('.modal-content')) {
            e.stopPropagation();
        }
    });
}

// ========================================
// CSS NECESARIO PARA LOS MODALES
// ========================================

/**
 * Agrega los estilos CSS necesarios para los modales
 */
function addModalStyles() {
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            /* Estilos base para modales */
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            .modal.d-none {
                display: none !important;
            }

            .modal-content {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(1);
                transition: transform 0.3s ease;
            }

            .modal-content.modal-large {
                max-width: 700px;
            }

            .modal-content.modal-small {
                max-width: 400px;
            }

            .close-btn {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0.5rem;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .close-btn:hover {
                background-color: #f5f5f5;
                color: #333;
            }

            /* Prevenir scroll del body cuando el modal está abierto */
            body.modal-open {
                overflow: hidden;
            }

            /* Estilos para formularios dentro de modales */
            .modal-form {
                margin-top: 1rem;
            }

            .form-group {
                margin-bottom: 1rem;
            }

            .form-row {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .form-row .form-group {
                flex: 1;
                margin-bottom: 0;
            }

            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #eee;
            }

            .form-links {
                margin-top: 1rem;
                text-align: center;
            }

            .form-links a {
                color: #007bff;
                text-decoration: none;
                font-size: 0.9rem;
                display: block;
                margin: 0.5rem 0;
            }

            .form-links a:hover {
                text-decoration: underline;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .modal-content {
                    margin: 1rem;
                    padding: 1.5rem;
                }

                .form-row {
                    flex-direction: column;
                    gap: 0;
                }

                .form-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos CSS
    addModalStyles();
    
    // Inicializar eventos de modal
    initializeModalEvents();
    
    console.log('Sistema de modales inicializado correctamente');
});

// También inicializar si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addModalStyles();
        initializeModalEvents();
    });
} else {
    addModalStyles();
    initializeModalEvents();
}

// ========================================
// HACER FUNCIONES GLOBALES
// ========================================

// Hacer las funciones disponibles globalmente
window.openModal = openModal;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;