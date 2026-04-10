# NullTicket

Monorepo base con esta estructura:

- `apps/web`: frontend con Next.js + TypeScript
- `apps/api`: backend simple con Express + TypeScript
- `packages/types`: tipos compartidos del workspace

TypeScript queda desacoplado por paquete. Si en el futuro queres sacarlo de `apps/api` y dejarlo solo en `apps/web`, o viceversa, no hace falta moverlo al root: cada app declara sus propias dependencias y scripts.

Formateo y lint:

- Usamos `ESLint` para reglas de codigo y `Prettier` para formateo automatico.
- El tooling vive en el root del monorepo para que todo el equipo use la misma configuracion.
- Para correr lint en todos los paquetes: `pnpm lint`
- Para corregir lo que ESLint pueda arreglar: `pnpm lint:fix`
- Para formatear todo el repo: `pnpm format`
- Para chequear formato sin escribir cambios: `pnpm format:check`

Archivos base agregados:

- `package.json` root
- `pnpm-workspace.yaml`
- `eslint.config.mjs`
- `.prettierrc.json`
- `.prettierignore`
- `apps/web/package.json`
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/src/index.ts`
- `packages/types/package.json`
- `packages/types/src/index.ts`
