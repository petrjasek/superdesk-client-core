describe('superdesk.config', () => {

    const SERVER_URL = 'http://localhost:5000/api';

    angular.module('test.config', ['superdesk.config']);

    beforeEach(window.module('test.config'));

    describe('deployConfig service', () => {
        it('can provide config', (done) => inject((deployConfig, $rootScope, $httpBackend) => {
            $httpBackend.expectGET(SERVER_URL).respond({});

            deployConfig.config = {foo: 1, bar: 2, baz: 'x'};

            deployConfig.get('foo').then((result1) => {
                expect(result1).toEqual(1);

                deployConfig.all({x: 'foo', y: 'baz'}).then((result2) => {
                    expect(result2).toEqual({x: 1, y: 'x'});

                    done();
                });
            });

            $rootScope.$digest();
        }));
    });
});
