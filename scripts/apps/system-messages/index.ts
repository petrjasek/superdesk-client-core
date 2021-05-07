import {gettext} from 'core/utils';
import {coreMenuGroups} from 'core/activity/activity';
import {reactToAngular1} from 'superdesk-ui-framework';
import {SystemMessagesSettingsComponent} from './components/system-messages-settings';

angular.module('superdesk.apps.system-messages', [
    'superdesk.core.activity',
])
    .component('systemMessagesSettings', reactToAngular1(
        SystemMessagesSettingsComponent,
        [],
        [],
    ))

    .config(['superdeskProvider', function config(superdesk) {
        superdesk.activity('/settings/system-messages', {
            label: gettext('System Messages'),
            template: '<system-messages-settings></system-messages-settings>',
            category: superdesk.MENU_SETTINGS,
            settings_menu_group: coreMenuGroups.CONTENT_CONFIG,
            priority: 5000,
        });
    }]);
