# Aplicación de Control de Personal OS9

Aplicación web progresiva (PWA) para el control de personal del Departamento de Investigación de Organizaciones Criminales.

## Características

- Funciona sin conexión
- Instalable en dispositivos móviles y de escritorio
- Interfaz responsiva
- Sincronización automática cuando hay conexión

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install canvas
   ```
3. Genera los íconos necesarios:
   ```bash
   node generate-icons.js
   ```
4. Sirve la aplicación con un servidor web (por ejemplo, `http-server` o `live-server`)

## Uso

1. Abre la aplicación en un navegador compatible con PWA (Chrome, Edge, Firefox, Safari)
2. Instala la aplicación desde el menú del navegador
3. La aplicación estará disponible sin conexión

## Estructura de archivos

- `index.html` - Página principal de la aplicación
- `style.css` - Estilos de la aplicación
- `script.js` - Lógica de la aplicación
- `sw.js` - Service Worker para funcionalidad offline
- `manifest.json` - Configuración de la PWA
- `icons/` - Carpeta con los íconos de la aplicación
- `generate-icons.js` - Script para generar íconos en diferentes tamaños

## Requisitos

- Navegador web moderno
- Node.js (solo para desarrollo)
- Servidor web para servir los archivos estáticos

## Notas

- Asegúrate de servir la aplicación a través de HTTPS en producción
- Para desarrollo local, puedes usar `http-server` o `live-server`
- La primera carga puede tardar un poco mientras se instala el Service Worker
