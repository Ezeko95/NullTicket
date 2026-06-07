# NullTicket

Monorepo base con esta estructura:

- `front`: frontend con Next.js + TypeScript
- `back`: backend simple con Express + TypeScript
- `packages/types`: tipos compartidos del workspace

TypeScript queda desacoplado por paquete. Si en el futuro queres sacarlo de `back` y dejarlo solo en `front`, o viceversa, no hace falta moverlo al root: cada app declara sus propias dependencias y scripts.

Formateo y lint:

- Usamos `ESLint` para reglas de codigo y `Prettier` para formateo automatico.
- El tooling vive en el root del monorepo para que todo el equipo use la misma configuracion.
- Para correr lint en todos los paquetes: `pnpm lint`
- Para corregir lo que ESLint pueda arreglar: `pnpm lint:fix`
- Para formatear todo el repo: `pnpm format`
- Para chequear formato sin escribir cambios: `pnpm format:check`

> **Importante:** `better-sqlite3` requiere compilar sus bindings nativos. Si no lo hacés, todos los endpoints que usan la base de datos van a fallar. Después de hacer `pnpm install`, corré:
>
> ```
> pnpm approve-builds
> ```
>
> Seleccioná `better-sqlite3` y confirmá. Luego volvé a correr `pnpm install`.

Archivos base agregados:

- `package.json` root
- `pnpm-workspace.yaml`
- `eslint.config.mjs`
- `.prettierrc.json`
- `.prettierignore`
- `back/package.json`
- `back/package.json`
- `back/tsconfig.json`
- `back/src/index.ts`
- `packages/types/package.json`
- `packages/types/src/index.ts`
