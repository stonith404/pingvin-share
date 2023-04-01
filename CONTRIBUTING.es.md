### *Leer esto en otro idioma: [Inglés](CONTRIBUTING.md), [Español](CONTRIBUTING.es.md)* 

---

# Contribuyendo

¡Nos ❤️ encantaría que contribuyas a Pingvin Share y nos ayudes a hacerlo mejor! Todas las contribuciones son bienvenidas, incluyendo problemas, sugerencias, *pull requests* y más.

## Para comenzar

Si encontraste un error, tienes una sugerencia o algo más, simplemente crea un problema (issue) en GitHub y nos pondremos en contacto contigo 😊.

## Para hacer una Pull Request

Antes de enviar la pull request para su revisión, asegúrate de que:

- El nombre de la pull request sigue las [especificaciones de Commits Convencionales](https://www.conventionalcommits.org/):
  
  `<tipo>[ámbito opcional]: <descripción>`
  
  ejemplo:
  
  ```
  feat(share): agregar protección con contraseña
  ```
  
  Donde `tipo` puede ser:
  
  - **feat** - es una nueva función
  - **doc** - cambios solo en la documentación
  - **fix** - una corrección de error
  - **refactor** - cambios en el código que no solucionan un error ni agregan una función

- Tu pull requests tiene una descripción detallada.

- Ejecutaste `npm run format` para formatear el código.

<details>
  <summary>¿No sabes como crear una pull request? Aprende cómo crear una pull request</summary>

1. Crea un fork del repositorio haciendo clic en el botón `Fork` en el repositorio de Pingvin Share.

2. Clona tu fork en tu máquina con `git clone`.

```
$ git clone https://github.com/[your_username]/pingvin-share
```

3. Trabajar - hacer commit - repetir

4. Haz un `push` de tus cambios a GitHub.

```
$ git push origin [nombre_de_tu_nueva_rama]
```

5. Envía tus cambios para su revisión. Si vas a tu repositorio en GitHub, verás un botón `Comparar y crear pull requests`. Haz clic en ese botón.
6. Inicia una Pull Request
7. Ahora envía la pull requests y haz clic en `Crear pull requests`
8. Espera a que alguien revise tu solicitud y apruebe o rechace tus cambios. Puedes ver los comentarios en la página de la solicitud en GitHub.

</details>

## Instalación del proyecto

Pingvin Share consiste de un frontend y un backend.

### Backend

El backend está hecho con [Nest.js](https://nestjs.com) y usa Typescript.

#### Instalación

1. Abrimos la carpeta `backend`
2. Instalamos las dependencias con `npm install`
3. Haz un `push` del esquema de la base de datos a la base de datos ejecutando `npx prisma db push`
4. Rellena la base de datos ejecutando `npx prisma db seed`
5. Inicia el backend con `npm run dev`

### Frontend

El frontend está hecho con [Next.js](https://nextjs.org) y usa Typescript.

#### Instalación

1. Primero inicia el backend
2. Abre la carpeta `frontend`
3. Instala las dependencias con `npm install`
4. Inicia el frontend con `npm run dev`

¡Ya está todo listo!

### Testing

Por el momento, solo tenemos pruebas para el backend. Para ejecutar estas pruebas, debes ejecutar el comando `npm run test:system` en la carpeta del backend.
