
# <div align="center"><img  src="https://user-images.githubusercontent.com/58886915/166198400-c2134044-1198-4647-a8b6-da9c4a204c68.svg" width="40"/> </br>Pingvin Share</div>

---

*Leer esto en otro idioma: [Inglés](README.md), [Español](README.es.md)* 

---

Pingvin Share es una plataforma de intercambio de archivos autoalojada y una alternativa a WeTransfer.

## ✨ Características

- Compartir archivos utilizando un enlace
- Tamaño de archivo ilimitado (unicamente restringido por el espacio en disco)
- Establecer una fecha de caducidad para los recursos compartidos
- Uso compartido seguro con límites de visitantes y contraseñas
- Destinatarios de correo electrónico
- Integración con ClamAV para escaneos de seguridad

## 🐧 Conoce Pingvin Share

- [Demo](https://pingvin-share.dev.eliasschneider.com)
- [Reseña por DB Tech](https://www.youtube.com/watch?v=rWwNeZCOPJA)

<img src="https://user-images.githubusercontent.com/58886915/225038319-b2ef742c-3a74-4eb6-9689-4207a36842a4.png" width="700"/>

## ⌨️ Instalación

> Nota: Pingvin Share está en sus primeras etapas y puede contener errores.

### Instalación con Docker (recomendada)

1. Descarge el archivo `docker-compose.yml` 
2. Ejecute `docker-compose up -d`

El sitio web ahora está esperando conexiones en `http://localhost:3000`, ¡diviértase usando Pingvin Share 🐧!

### Instalación autónoma

Herramientas requeridas:

- [Node.js](https://nodejs.org/en/download/) >= 16
- [Git](https://git-scm.com/downloads)
- [pm2](https://pm2.keymetrics.io/) para ejecutar Pingvin Share en segundo plano

```bash
git clone https://github.com/stonith404/pingvin-share
cd pingvin-share

# Consultar la última versión
git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

# Iniciar el backend
cd backend
npm install
npm run build
pm2 start --name="pingvin-share-backend" npm -- run prod

# Iniciar el frontend
cd ../frontend
npm install
npm run build
pm2 start --name="pingvin-share-frontend" npm -- run start
```

El sitio web ahora está esperando conexiones en `http://localhost:3000`, ¡diviértase usando Pingvin Share 🐧!

### Integraciones

#### ClamAV (Unicamente con Docker)

ClamAV se utiliza para escanear los recursos compartidos en busca de archivos maliciosos y eliminarlos si los encuentra.

1. Añade el contenedor ClamAV al stack de Docker Compose (ver `docker-compose.yml`) e inicie el contenedor.
2. Docker esperará a que ClamAV se inicie antes de iniciar Pingvin Share. Esto puede tardar uno o dos minutos.
3. Los registros de Pingvin Share ahora deberían decir "ClamAV está activo".

Por favor, ten en cuenta que ClamAV necesita muchos [recursos](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements).

### Recursos adicionales

- [Instalación en Synology NAS (Inglés)](https://mariushosting.com/how-to-install-pingvin-share-on-your-synology-nas/)

### Actualizar a una nueva versión

Dado que Pingvin Share se encuentra en una fase inicial, consulte las notas de la versión para conocer los cambios de última hora antes de actualizar.

#### Docker

```bash
docker compose pull
docker compose up -d
```

#### Instalación autónoma

1. Deten la aplicación en ejecución
   
   ```bash
   pm2 stop pingvin-share-backend pingvin-share-frontend
   ```

2. Repite los pasos de la [guía de instalación](#instalación-autonoma) excepto el paso de `git clone`.
   
   ```bash
   cd pingvin-share
   
   # Consultar la última versión
   git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)
   
   # Iniciar el backend
   cd backend
   npm run build
   pm2 restart pingvin-share-backend
   
   # Iniciar frontend
   cd ../frontend
   npm run build
   pm2 restart pingvin-share-frontend
   ```

### Marca personalizada

Puedes cambiar el nombre y el logotipo de la aplicación visitando la página de configuración de administrador.

## 🖤 Contribuye

¡Eres bienvenido a contribuir a Pingvin Share! Sige la [guía de contribución](/CONTRIBUTING.md) para empezar.
