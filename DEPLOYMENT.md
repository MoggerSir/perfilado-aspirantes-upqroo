# Despliegue de Nexo Idiomas

## Arquitectura

La aplicación es un frontend estático. GitHub Actions ejecuta las validaciones, construye `dist/` y publica el resultado en GitHub Pages. Cloudflare administra únicamente el DNS del subdominio; no se utiliza Cloudflare Tunnel porque no existe un servidor de origen que deba permanecer conectado.

## Dominio previsto

`https://idiomas.josmargalindo.com`

En la zona DNS de `josmargalindo.com` debe existir este registro:

| Tipo | Nombre | Destino | Proxy inicial | TTL |
| --- | --- | --- | --- | --- |
| CNAME | `idiomas` | `MoggerSir.github.io` | Solo DNS | Automático |

Se recomienda conservar el registro en **Solo DNS** mientras GitHub verifica el dominio y emite el certificado. El CNAME debe apuntar al dominio de usuario `MoggerSir.github.io`, sin incluir el nombre del repositorio.

## Flujo automático

1. Un cambio llega a `main`.
2. El workflow instala dependencias con `npm ci`.
3. Ejecuta lint, pruebas y compilación mediante `npm run check`.
4. Genera `404.html` para permitir entradas directas a las rutas de la SPA.
5. Publica `dist/` en GitHub Pages.

La configuración del dominio personalizado se conserva en GitHub Pages y no depende de un archivo `CNAME` dentro del artefacto generado por Actions.
