# Superdesk Client Core — Copilot Instructions

## About this project

Superdesk Client Core is the frontend for the Superdesk news CMS. It is a hybrid **Angular 1.6 + React 16** application written in **TypeScript**, used for article authoring, content workflows, desks, and publishing.

---

## Commands

```bash
# Development server (Webpack + hot reload)
grunt server

# Full test suite (lint + unit + API verification)
npm test

# Unit tests only
npm run unit

# Unit tests in watch/debug mode (opens Chrome)
npm run debug-unit-tests

# Lint (Python grep-lint + tsc type check + ESLint)
npm run lint

# Auto-fix lint issues
npm run lint-fix

# Production build
grunt build
```

### Running a single test

Karma does not have native single-file support. Use the `--grep` flag to filter by spec description:

```bash
./node_modules/.bin/karma start karma.conf.js --single-run --grep="description of test"
```

---

## Architecture

### Hybrid Angular/React

- **Angular 1.6** handles routing, older feature modules, and DI-based services (in `scripts/apps/` and `scripts/core/`).
- **React 16** is used for all modern features. React components are bridged into Angular templates via `reactToAngular1(MyComponent, ['prop1'])`.
- New code should be React + TypeScript. Avoid adding Angular directives or controllers.

### Key source directories

| Path | Purpose |
|------|---------|
| `scripts/core/` | Framework primitives: API client, auth, editor, UI components, notifications |
| `scripts/apps/` | Feature modules (authoring, search, monitoring, desks, publishing, etc.) |
| `scripts/extensions/` | Bundled extensions using the IExtension plugin API |
| `scripts/api/` | Thin API functions used across the app |
| `scripts/core/superdesk-api.d.ts` | The public extension API surface (4,000+ lines) |

### Extension system

External and bundled extensions implement `IExtension` from `superdesk-api`:

```typescript
const extension: IExtension = {
    activate: () => Promise.resolve({
        contributions: {
            entities: {
                article: { getActions: (article) => [] },
            },
        },
    }),
};
export default extension;
```

Extensions are registered in the app entry point:

```typescript
startApp([{ id: 'my-extension', load: () => import('my-extension') }]);
```

Extension CSS is automatically namespaced at build time. Use `superdesk.utilities.CSS.getClass('my-class')` to reference prefixed class names at runtime.

### Data layer

- **`Immutable.js` (`OrderedMap`)** — used for entity collections in `dataStore` (`scripts/data-store.ts`).
- **Plain React state** — preferred for local component state.
- **Redux** — used only inside editor3 (Draft.js content state).
- **WebSocket live updates** — `WithLiveQuery` HOC and `addWebsocketEventListener` handle real-time content changes.

### Path aliases

Configured in `jsconfig.json`:

```typescript
import {sdApi} from 'api';
import {gettext} from 'core/utils';
import {Button} from 'superdesk-ui-framework/react';
import {MyComponent} from 'apps/search/components';
```

---

## Conventions

### Components

- Prefer **functional components with hooks** over class components.
- Class components exist in legacy code; `SuperdeskReactComponent` is a custom base class used in older parts.
- Component files use **PascalCase** (e.g., `ArticleItem.tsx`); utilities use **kebab-case** (e.g., `date-utils.ts`).
- Test files are co-located or in a `tests/` subdirectory and named `*.spec.ts(x)`.

### Testing

Per `CONTRIBUTING.md`: **only use `data-test-id` attributes** to query DOM in tests. Do not query by class names or DOM structure.

```tsx
// Component
<button data-test-id="save-button">Save</button>

// Test
container.querySelector('[data-test-id="save-button"]')
```

### CSS / Styling

- Styles are written in **SCSS**.
- Naming follows **BEM** conventions (`block__element--modifier`).
- Each component has its own `.scss` file alongside the `.tsx` file.

### Translations

- Use `gettext('string')` for user-facing strings.
- Extract strings with `npm run gettext-extract` (runs `grunt gettext:extract`).
- Extension translations live in a `po/` directory inside the extension.

### Runtime configuration

Runtime config is in `superdesk.config.js`:

```javascript
module.exports = function(grunt) {
    return {
        server: { url: 'http://localhost:5000/api' },
        features: { swimlane: { defaultNumberOfColumns: 4 } },
    };
};
```

### TypeScript

- TypeScript is enforced via `tsc --noEmit` as part of `npm run lint`.
- The compiler does **not** transpile; Webpack/Babel handles transpilation.
- `scripts/core/superdesk-api.d.ts` is the authoritative public API type surface — check it before inventing new types for articles, profiles, or extensions.

### Network requests

```typescript
import {httpRequestJsonLocal} from 'core/helpers/network';

const result = await httpRequestJsonLocal<IArticle>({
    method: 'GET',
    path: `/articles/${id}`,
});
```

### Required field indicators

Add the `sd-validate` CSS class to a wrapper element to automatically render a required-field asterisk via the `label:after` pseudo-element (defined in `styles/sass/forms.scss`).

### Authoring field widths

Fields use `sdWidth` values `'full' | 'half' | 'third' | 'quarter'` which map to 100 / 50 / 33 / 25% widths (see `styles/sass/mixins.scss`).
