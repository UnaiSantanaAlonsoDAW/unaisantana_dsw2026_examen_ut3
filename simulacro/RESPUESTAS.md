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
