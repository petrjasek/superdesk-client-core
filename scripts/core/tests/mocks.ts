import ng from 'core/services/ng';
import {mockDataApi} from './mockDataApi';

/**
 * Mock services that call server on init and thus would require mocking all the time
 */
angular.module('superdesk.mocks', [])
    .config(['$qProvider', ($qProvider) => $qProvider.errorOnUnhandledRejections(false)])
    .run(['$injector', ng.register])
    .run(['$httpBackend', ($httpBackend) => {
        $httpBackend.whenGET('http://localhost:5000/api').respond(200, {
            _links: {child: [
                {title: 'auth', href: 'auth'},
                {title: 'auth_db', href: 'auth_db'},
                {title: 'users', href: 'users'},
                {title: 'workspace', href: 'users/<regex():user_id>/workspace'},
            ]},
        });
    }])
    .constant('config', {
        editor: {},
        server: {url: 'http://localhost:5000/api', ws: ''},
        model: {
            dateformat: 'DD/MM/YYYY',
            timeformat: 'HH:mm:ss',
        },
        iframely: {key: ''},
        profileLanguages: ['en', 'de_DE'],
    })
    .service('features', () => { /* no-op */ })
    .service('preferencesService', function($q) {
        this.mock = true;

        this.get = function() {
            return $q.when(null);
        };

        this.getSync = function() {
            return {};
        };

        this.getActions = function() {
            return $q.when([]);
        };

        this.update = function() {
            return $q.when(null);
        };

        this.getPrivileges = function() {
            return $q.when({});
        };
    })
    .service('beta', function($q) {
        this.isBeta = function() {
            return $q.when(false);
        };
    });

beforeEach(window.module(($provide) => {
    $provide.constant('lodash', window._);
}));

beforeEach(window.module('superdesk.mocks'));
beforeEach(window.module('superdesk.core.auth.session'));
beforeEach(window.module('superdesk.core.services.storage'));

beforeAll(mockDataApi);