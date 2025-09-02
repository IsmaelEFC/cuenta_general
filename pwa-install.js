// Código para la instalación de PWA
let deferredPrompt;
const installButton = document.getElementById('installButton');

// Ocultar el botón por defecto
if (installButton) {
  installButton.style.display = 'none';
}

// Escuchar el evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que el navegador muestre el mensaje automático
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
      // Mostrar el prompt de instalación
      deferredPrompt.prompt();
      // Esperar a que el usuario responda al prompt
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
function hideInstallButton() {
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone || 
      document.referrer.includes('android-app://') ||
      window.matchMedia('(display-mode: fullscreen)').matches) {
    if (installButton) {
      installButton.style.display = 'none';
    }
    return true;
  }
  return false;
}

// Verificar al cargar
if (hideInstallButton()) {
  console.log('Running in standalone mode');
}

window.addEventListener('appinstalled', (evt) => {
  console.log('PWA fue instalada');
  if (installButton) {
    installButton.style.display = 'none';
  }
  // Opcional: Mostrar mensaje de confirmación
  alert('¡Aplicación instalada correctamente!');
});

// Verificar si la PWA ya está instalada
window.addEventListener('load', () => {
  hideInstallButton();
});