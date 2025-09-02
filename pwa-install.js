// Código para la instalación de PWA
function initializePWA() {
  let deferredPrompt;
  const installButton = document.getElementById('installButton');

  // Ocultar el botón por defecto
  if (installButton) {
    installButton.style.display = 'none';
  }

  // Escuchar el evento beforeinstallprompt
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
        // Ocultar el botón de instalación
        installButton.style.display = 'none';
      }
    });
  }

  // Ocultar el botón si la app ya está instalada
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    if (installButton) {
      installButton.style.display = 'none';
    }
  });
}

// Inicializar PWA cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePWA);
} else {
  initializePWA();
}