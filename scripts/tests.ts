import 'vendor';
import 'angular-mocks';
import 'core';
import 'apps';
import 'core/tests/mocks';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {DEFAULT_ENGLISH_TRANSLATIONS} from 'core/utils';

window.translations = DEFAULT_ENGLISH_TRANSLATIONS;

Enzyme.configure({adapter: new Adapter()});

const importAll = (r) => r.keys().map(r);

// avoid importing scripts due to extensions
importAll(require.context('scripts/core', true, /.[Ss]pec.(ts|tsx)$/));
importAll(require.context('scripts/apps', true, /.[Ss]pec.(ts|tsx)$/));