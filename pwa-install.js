// Código para la instalación de PWA
function initializePWA() {
  let deferredPrompt;
  const installButton = document.getElementById('installButton');

  // Ocultar el botón por defecto
  if (installButton) {
    installButton.style.display = 'none';
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir que Chrome muestre el mensaje automático
    e.preventDefault();
    // Guardar el evento para usarlo más tarde
    deferredPrompt = e;
    
    // Mostrar el botón de instalación
    if (installButton) {
      installButton.style.display = 'flex';
    }
  });

  // Configurar el evento de clic del botón
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Mostrar el mensaje de instalación
        deferredPrompt.prompt();
        // Esperar a que el usuario responda al mensaje
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // Limpiar el prompt guardado
        deferredPrompt = null;
        // Ocultar el botón de instalación, ya que la aplicación se está instalando
        installButton.style.display = 'none';
      }
    });
  }

  // Ocultar el botón si la aplicación ya está instalada
  if (window.matchMedia('(display-mode: standalone)').matches) {
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  window.addEventListener('appinstalled', (evt) => {
    console.log('PWA fue instalada');
    if (installButton) {
      installButton.style.display = 'none';
    }
    // Opcional: Mostrar mensaje de confirmación
    alert('¡Aplicación instalada correctamente!');
  });
}

// Inicializar PWA cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePWA);
} else {
  initializePWA();
}