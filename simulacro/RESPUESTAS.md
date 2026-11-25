## Instalación del proyecto y arranque

Para instalar hacemos fork al repo del profsor y lo clonamos en nuestra máquina. Una vez hecho esto paso el código de mi backend grupal en mi carpeta simulacro e intalo dependencias con `npm install`. Una vez instalada las dependendencias podemos hacer `nom run dev` para ejecutar el código en tiempo real o `npm run build` para hacer una dist y arrancarla con `npm run start`.

## Puerto y donde se carga

El puerto se configura en **.env** y se carga en `src/config/env.ts`:

```typescript
process.loadEnvFile();

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  APP_NAME: process.env.APP_NAME,
};
```

Podemos ver que se crea la variable PORT que es igual a la conversión de la variable del env PORT, en caso de fallar o que no exista pues se pone como predeterminado el puerto 3000.

## .env y .env.example

El .env contiene contraseñas reales las cuales no podemos dar a otros usuarios, por eso se usa el .example como una especia de placeholder para que el usuario que se baje nuestro proyuecto sepa qué variables necesita y añada las suyas propias.

## ResourceNotFound

El error se crea en el controlador de documentos, en la función de getById al ver que no se encuentra lanza el error que acabamos de crear en la carpeta errors.

En bruno a lo siguiente:

```json
{
  "message": "Document with id 'idinexistente' not found",
  "resourceId": "idinexistente"
}
```

Lo que confirma que el mensaje que programamos en el error se devuelve.

Además en la consola salta el log que he puesto en el errorHandler cuando la instancia hereda del nuevo error:

```pwsh
ResourceNotFoundError capturado
{"requestId":"c284cce9-641b-403b-9a8f-1f4c8a168b74","method":"GET","path":"/api/v1/admin/documents/idinexistente","status":404,"durationMs":11,"timestamp":"2026-11-24T19:44:00.328Z"}
```

## Diferencia recorrido error centralizado

La diferencia radica en que el ResourceNotFoundError se encuentra en el controlador y de ahí lanza un error que está en error que hereda de la clase Error para acabar en el ErrorHandler. Mientras que por otro lado el error este actúa en el mismo controlador y lo devuelve directamente.

## Log en on y en off

Si hago una petición al live con el log en on:

```pwsh
  {"requestId":"2ab452b0-82ea-4a59-9273-666dacbbf961","method":"GET","path":"/live","status":200,"durationMs":8,"timestamp":"2026-11-25T09:57:38.432Z"}
```

Si lo hago con el log en off no me devuelve nada.

LA diferencia radica en lo que acabo de programar, la sentencia if habilita o deshabilita el logger según lo configurado en el .env

## 9

Implemento ruta que lance el error temporalmente:

```typescript
app.get('/api/v1/crash', () => {
  throw new Error('Fallo interno de prueba');
});
```

Al hacer la petición con el modo development:

```pwsh
{"requestId":"0c19b750-6dbe-4426-bb5e-99bb2ee6dd49","error":"Fallo interno de prueba","stack":"Error: Fallo interno de prueba\n    at <anonymous> (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\src\\app.ts:37:9)\n    at Layer.handleRequest (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\layer.js:152:17)\n    at next (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\route.js:157:13)\n    at Route.dispatch (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\route.js:117:3)\n    at handle (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:435:11)\n    at Layer.handleRequest (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\layer.js:152:17)\n    at C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:295:15\n    at processParams (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:582:12)\n    at next (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:291:5)\n    at read (C:\\Users\\Unai\\Documents\\DAW\\Entorno de Servidor\\unaisantana_dsw2026_examen_ut3\\simulacro\\node_modules\\body-parser\\lib\\read.js:53:5)"}
{"requestId":"0c19b750-6dbe-4426-bb5e-99bb2ee6dd49","method":"GET","path":"/api/v1/crash","status":500,"durationMs":12,"timestamp":"2026-11-25T19:08:26.247Z"}
```

Al hacerla a una funcional:

```pwsh
{"requestId":"0c19b750-6dbe-4426-bb5e-99bb2ee6dd49","method":"GET","path":"/api/v1/crash","status":500,"durationMs":12,"timestamp":"2026-11-25T19:08:26.247Z"}
{"requestId":"a7da773e-451d-4b05-9627-cdf171b705c3","method":"GET","path":"/live","status":200,"durationMs":2,"timestamp":"2026-11-25T19:11:26.922Z"}
```

Ahora con **NODE_ENV=production**

```pwsh
{"requestId":"e84238da-b21e-4c7c-a220-8371651ca188","method":"GET","path":"/live","status":200,"durationMs":10,"timestamp":"2026-11-25T19:13:36.767Z"}
```

```pwsh
{"requestId":"e1444eac-8f2b-4c67-b6ce-12b5dfbfd5d4","error":"Fallo interno de prueba"}
{"requestId":"e1444eac-8f2b-4c67-b6ce-12b5dfbfd5d4","method":"GET","path":"/api/v1/crash","status":500,"durationMs":3,"timestamp":"2026-11-25T19:14:21.077Z"}
```

- **¿Cambiar `NODE_ENV` desactiva automáticamente el logger?**
  No. Como muestran los registros en `production` (`GET /live` con estado `200` y `GET /api/v1/crash` con estado `500`), el `logger` sigue activo porque su ejecución depende únicamente de que `LOG=ON`, independientemente del valor de `NODE_ENV`.

- **¿Qué diferencias observas en la respuesta al error inesperado?**
  - En **`development`**, la respuesta HTTP `500` incluye el mensaje real del error (`"Fallo interno de prueba"`) y detalles de depuración (como el `stack`) para ayudar al desarrollador.
  - En **`production`**, la respuesta HTTP `500` devuelve un mensaje genérico sin `stack`, ocultando detalles internos del servidor al cliente por seguridad.

- **¿Qué diferencias observas en los registros del manejador de errores?**
  - En **`development`**, el `errorHandler` imprime en consola un JSON con `requestId`, `error` y la traza completa (`stack`).
  - En **`production`**, el `errorHandler` sigue registrando el `requestId` y el mensaje real (`"error":"Fallo interno de prueba"`), pero **omite la propiedad `stack`** para generar logs más limpios.

- **¿Qué instrucciones de tu código explican esos resultados?**
  - En **`src/app.ts` / `src/middlewares/logger.ts`**: la comprobación `env.LOG === 'ON'`, que habilita el middleware de trazas sin consultar `env.NODE_ENV`.
  - En **`src/middlewares/errorHandler.ts`**: el condicional sobre `env.NODE_ENV` (`=== 'development'` / `=== 'production'`), que controla tanto si se añade `stack` al objeto enviado a `console.error(...)` como si `res.status(500).json(...)` expone el mensaje real o uno genérico.

  ## 10

### Primera prueba: `notFound` antes de los routers


- **Qué esperaba que sucediera antes de probarlo:**
  Que la petición devolviera un `404 Not Found` en lugar de llegar a la ruta válida, ya que `notFound` se ejecuta para cualquier petición que lo alcance.
- **Qué sucedió realmente:**
  El servidor interceptó la petición antes de evaluar los routers y la rechazó como ruta inexistente.
- **Qué respuesta recibí o si quedó esperando:**
  Se recibió inmediatamente una respuesta JSON con estado HTTP `404 Not Found`.
- **Qué parte del flujo explica el resultado:**
  Express ejecuta los middlewares de forma secuencial según el orden en que se registran con `app.use()`. Al colocar `app.use(notFound)` antes de los routers, captura todas las peticiones entrantes, responde directamente con `404` y no llama a `next()`, impidiendo que la petición alcance las rutas definidas debajo.
- **Cómo lo corregí:**
  Moviendo `app.use(notFound)` de nuevo al final de la cadena de rutas, justo antes de `app.use(errorHandler)`, para que solo actúe cuando ninguna ruta previa haya coincidido.

---

### Segunda prueba: `logger` sin llamar a `next()`

- **Qué esperaba que sucediera antes de probarlo:**
  Que la petición se quedara bloqueada sin llegar nunca al router ni devolver respuesta al cliente.
- **Qué sucedió realmente:**
  El servidor recibió la petición, registró el evento `finish` en el middleware pero nunca avanzó hacia los siguientes middlewares ni hacia las rutas, ni tampoco imprimió el log en consola.
- **Qué respuesta recibí o si quedó esperando:**
  No se recibió ninguna respuesta; la petición quedó esperando indefinidamente en Bruno hasta cancelarla manualmente (o agotar el _timeout_).
- **Qué parte del flujo explica el resultado:**
  En Express, un middleware que no envía una respuesta (`res.json()`, `res.send()`, etc.) está obligado a llamar a `next()` para ceder el control al siguiente eslabón de la cadena. Al eliminar `next()`, el flujo se detiene dentro de `logger` y, como nunca se envía respuesta, tampoco llega a dispararse el evento `finish` de `res`.
- **Cómo lo corregí:**
  Restaurando la llamada a `next()` dentro del middleware `logger` en `src/middlewares/logger.ts`.

## 11

### Recorrido de las peticiones

1. **Consulta de un documento existente (`GET /api/v1/documents/:id`)**
   * **Recorrido:** `requestId` → **entrada a `logger`** (guarda el tiempo inicial y registra el listener `finish`) → `express.json()` → `documentsRouter` → `documentsController.getById` → `documentsService.getById` → **callback `finish` de `logger`** (imprime el log con estado `200`).
   * **Dónde se genera la respuesta:** En `documentsController.getById` (`res.status(200).json({ data: document })`).
   * **¿Se ejecuta `errorHandler`?:** No.

2. **Consulta de un documento inexistente (`GET /api/v1/documents/:id`)**
   * **Recorrido:** `requestId` → **entrada a `logger`** (registra `finish`) → `express.json()` → `documentsRouter` → `documentsController.getById` → `documentsService.getById` (devuelve `undefined`) → `documentsController.getById` lanza `ResourceNotFoundError` y llama a `next(err)` → `errorHandler` → **callback `finish` de `logger`** (imprime el log con estado `404`).
   * **Dónde se genera la respuesta:** En `errorHandler` (`res.status(404).json(...)`).
   * **¿Se ejecuta `errorHandler`?:** Sí.

3. **Petición a una URL que no existe (`GET /ruta-inexistente`)**
   * **Recorrido:** `requestId` → **entrada a `logger`** (registra `finish`) → `express.json()` → recorre los routers sin encontrar coincidencia → `notFound` → **callback `finish` de `logger`** (imprime el log con estado `404`).
   * **Dónde se genera la respuesta:** En el middleware `notFound` (`res.status(404).json(...)`).
   * **¿Se ejecuta `errorHandler`?:** No.

4. **Creación de un aviso con JSON bien formado, pero título inválido (`POST /api/v1/notices`)**
   * **Recorrido:** `requestId` → **entrada a `logger`** (registra `finish`) → `express.json()` (parsea el cuerpo correctamente) → `noticesRouter` → `noticesController.create` (falla la validación, lanza `AppError` y llama a `next(err)`) → `errorHandler` → **callback `finish` de `logger`** (imprime el log con estado `400`). No llega a llamarse a `noticesService.create`.
   * **Dónde se genera la respuesta:** En `errorHandler` (`res.status(400).json(...)`).
   * **¿Se ejecuta `errorHandler`?:** Sí.

5. **Petición con un cuerpo JSON mal formado (`POST /api/v1/notices` con sintaxis inválida)**
   * **Recorrido:** `requestId` → **entrada a `logger`** (registra `finish`) → `express.json()` (falla al parsear el JSON y pasa un `SyntaxError` a `next(err)`) → `errorHandler` → **callback `finish` de `logger`** (imprime el log con estado `400`). No llega a ningún router ni controlador.
   * **Dónde se genera la respuesta:** En `errorHandler` (`res.status(400).json(...)`).
   * **¿Se ejecuta `errorHandler`?:** Sí.

6. **Actualización de un documento con título vacío usando respuesta directa (`PATCH /api/v1/documents/:id`)**
   * **Recorrido:** `requestId` → **entrada a `logger`** (registra `finish`) → `express.json()` → `documentsRouter` → `documentsController.update` (detecta el título vacío y responde directamente cortando la ejecución con `return`) → **callback `finish` de `logger`** (imprime el log con estado `400`). No llega a `documentsService.update`.
   * **Dónde se genera la respuesta:** En `documentsController.update` (`res.status(400).json(...)`).
   * **¿Se ejecuta `errorHandler`?:** No.

---

### Preguntas teóricas

* **¿Por qué este `notFound` no llama a `next()`?**
  Porque su función es cerrar el ciclo de las peticiones que no coincidieron con ninguna ruta devolviendo directamente un `404 Not Found`. Al ser el último eslabón normal antes de `errorHandler`, no tiene sentido continuar a una ruta siguiente ni delegar como excepción un caso que ya resuelve por sí mismo.

* **Cuando un controlador llama a `next(err)`, ¿por qué no se ejecuta el `notFound` que está registrado a continuación?**
  Porque al pasar un argumento a `next(err)`, Express entra en modo de error y omite todos los middlewares y rutas ordinarias posteriores (incluido `notFound`), saltando directamente al primer middleware declarado con 4 parámetros (`errorHandler`).

* **¿Por qué el manejador de errores necesita cuatro parámetros aunque no use el último?**
  Porque Express identifica el tipo de middleware inspeccionando el número de argumentos declarados en su firma (`fn.length`). Solo si tiene exactamente 4 parámetros `(err, req, res, next)` lo registra como manejador de errores; con 3 lo trataría como un middleware normal.

* **¿Qué diferencia hay entre una ruta inexistente y un recurso inexistente?**
  * **Ruta inexistente:** La URL o método HTTP no está definido en ningún router de la aplicación (ej. `GET /api/v1/inventado`). La intercepta el middleware `notFound`.
  * **Recurso inexistente:** El endpoint sí existe (ej. `GET /api/v1/documents/999`), pero el elemento concreto buscado por ese ID no está en los datos. Lo detecta el controlador y lo gestiona lanzando `ResourceNotFoundError`.

* **¿Por qué el logger utiliza el evento `finish` para registrar el estado de la respuesta?**
  Porque al entrar en `logger` al inicio de la petición todavía no se ha ejecutado el controlador ni se conoce qué código HTTP (`200`, `400`, `404`, `500`) ni cuánto tiempo llevará procesarla. Escuchar `res.on('finish', ...)` asegura que el log se escriba justo cuando la respuesta ya se ha enviado por completo al cliente.

* **¿Para qué sirve `requestId`? Muestra registros de una misma petición que puedas relacionar mediante él.**
  Sirve para identificar de forma única cada petición HTTP y poder agrupar en los logs todos los mensajes generados durante su procesamiento (especialmente útil cuando hay múltiples peticiones simultáneas).
  Ejemplo de dos registros relacionados de una misma petición fallida:
  ```json
  {"requestId":"0c19b750-6dbe-4426-bb5e-99bb2ee6dd49","error":"Fallo interno de prueba","stack":"Error: Fallo interno de prueba..."}
  {"requestId":"0c19b750-6dbe-4426-bb5e-99bb2ee6dd49","method":"GET","path":"/api/v1/crash","status":500,"durationMs":12,"timestamp":"2026-11-25T19:08:26.247Z"}