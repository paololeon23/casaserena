# Casa Serena Otuzco

Página para presentar el alojamiento y solicitar una reserva por WhatsApp. No cobra, no crea cuentas y no marca fechas como libres: el encargado confirma la disponibilidad.

Los textos públicos salen del perfil de TikTok [@casaserenaotuzco](https://www.tiktok.com/@casaserenaotuzco): la bio y el teléfono `936020432` publicado para reservas. La dirección, los precios, las camas, los horarios y las políticas se dejaron vacíos porque no estaban en ese perfil.

## Requisitos

Instala [Node.js 22 LTS](https://nodejs.org/) y vuelve a abrir la terminal. En esta computadora `node` no estaba en el PATH.

## Instalar y ejecutar

En la carpeta del proyecto:

```bash
npm install
npm test
npm run dev
```

Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

Para generar la versión que se publica:

```bash
npm run build
npm run preview
```

La carpeta `dist` es el sitio listo.

## Dónde se edita todo

El archivo `src/config/site.ts` concentra:

- teléfono de WhatsApp
- dirección, coordenadas y mapa
- horarios y políticas
- habitaciones, precios y fotos
- galería y foto de portada

Las fotos van en `public/media`. Ejemplo: si el archivo es `public/media/portada.jpg`, en la configuración escribes `"/media/portada.jpg"`.

Los videos se cargan con el reproductor oficial de TikTok. No hace falta descargarlos. Si más adelante copias el ID de un video (Compartir, Insertar), agrégalo a `tiktokVideoIds`.

## Datos que el propietario debe completar antes de publicar

1. Confirmar que el WhatsApp `936 020 432` corresponde a Casa Serena y que el prefijo `+51` es el correcto.
2. Escribir la dirección real. Si quieres el mapa, agrega también `latitude` y `longitude`, o pega el `src` del iframe de Google Maps en `mapEmbedUrl`.
3. Agregar la fotografía de portada en `heroImage`.
4. Cargar las fotos de la galería.
5. Reemplazar las habitaciones de ejemplo: nombre, capacidad, tipo de cama, servicios, precio y fotos. Van en `realRooms`.
6. Completar `checkInTime` y `checkOutTime`.
7. Redactar `reservationPolicy` y `cancellationPolicy`.
8. Agregar el correo en `contact.email`, si existe.
9. Cuando `realRooms` tenga las fichas reales, los ejemplos dejan de mostrarse. Si todavía no hay habitaciones, pon `showExampleRooms` en `false` para no publicar fichas de mentira.
10. Cuando tengas dominio, escribe la URL en `publicUrl` y cambia las metas `og:image` de `index.html` a la dirección absoluta, por ejemplo `https://tudominio.com/og.jpg`.

Mientras `showExampleRooms` esté activo y no haya habitaciones reales, la web muestra una franja coral: “Vista con datos de ejemplo”.

## Cómo publicar y obtener un enlace

1. Sube esta carpeta a un repositorio de GitHub.
2. Entra a [Vercel](https://vercel.com), importa el repositorio y acepta Vite. El comando de build es `npm run build` y la carpeta de salida es `dist`.
3. Vercel entrega un enlace público. Luego puedes conectar un dominio propio.

También sirve en Netlify o Cloudflare Pages con el mismo comando y la misma carpeta `dist`.

No hace falta configurar rutas: toda la web es una sola página.

## Pruebas del calendario y de WhatsApp

Automáticas:

```bash
npm test
```

Cubren fechas pasadas, el cálculo de noches, la validación del formulario y que el enlace `https://wa.me/51936020432?text=...` lleve el nombre, la habitación, las fechas, los huéspedes, las noches y la consulta.

A mano, en el celular o con el modo responsive del navegador:

1. Abre la portada y pulsa **Consultar fechas**.
2. Intenta elegir un día anterior a hoy: no debe seleccionarse.
3. Elige ingreso y una salida posterior. El resumen debe mostrar las noches y el texto “Disponibilidad pendiente de confirmación”.
4. Deja el nombre vacío y pulsa **Solicitar reserva**. Deben aparecer los avisos, sin abrir WhatsApp.
5. Escribe un nombre, marca la casilla y vuelve a solicitar. WhatsApp debe abrirse con el mensaje ya escrito.
6. En un ancho de teléfono, comprueba la barra inferior **Reservar por WhatsApp** y que el calendario muestre un solo mes.

Enviar ese mensaje no confirma la reserva.

## Disponibilidad real más adelante

`src/lib/availability.ts` define `AvailabilityProvider`. Hoy todas las fechas futuras quedan como `selectable`: se pueden elegir, pero no se anuncian como libres ni se bloquean. Para conectar una base de datos, crea otro proveedor que consulte tus reservas y cámbialo en `activeAvailabilityProvider`. El calendario no necesita rehacerse.
