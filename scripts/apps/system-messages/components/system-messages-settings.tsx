import React from 'react';

import {gettext} from 'core/utils';
import {SettingsPage} from 'apps/settings/settings-page';
import {SettingsPageHeader} from 'apps/settings/settings-page-header';
import {SettingsPageContent} from 'apps/settings/settings-page-content';
import {getGenericListPageComponent} from 'core/ui/components/ListPage/generic-list-page';
import {ListItem, ListItemActionsMenu, ListItemColumn} from 'core/components/ListItem';
import { FormFieldType } from 'core/ui/components/generic-form/interfaces/form';
import { IBaseRestApiResponse, IFormGroup, IGenericListPageComponent, IUser } from 'superdesk-api';

interface IMessage extends IBaseRestApiResponse {
    type: 'warning' | 'alert' | 'primary/info' | 'success';
    is_active: boolean;
    message_title: string;
    message: string;
    user_id: IUser['_id'];
}

export class SystemMessagesSettingsComponent extends React.PureComponent {
    render() {
        const formConfig: IFormGroup = {
            type: 'inline',
            direction: 'vertical',
            form: [
                {
                    field: 'is_active',
                    label: gettext('Active'),
                    type: FormFieldType.checkbox,
                },
                {
                    field: 'type',
                    label: gettext('Style'),
                    type: FormFieldType.select,
                    component_parameters: {
                        options: [
                            {id: 'warning', label: gettext('Warning')},
                            {id: 'alert', label: gettext('Alert')},
                            {id: 'primary/info', label: gettext('Info')},
                            {id: 'success', label: gettext('Success')},
                        ],
                    },
                },
                {
                    field: 'message_title',
                    label: gettext('Title'),
                    type: FormFieldType.textSingleLine,
                },
                {
                    field: 'message',
                    label: gettext('Message'),
                    type: FormFieldType.textEditor3,
                },
                {
                    field: 'user_id',
                    type: FormFieldType.hidden,
                    value: 'foo',
                },
            ],
        };

        const renderRow = (
            key: string,
            item: IMessage,
            page: IGenericListPageComponent<IMessage>,
        ) => (
            <ListItem key={key} onClick={() => page.openPreview(item._id)}>
                <ListItemColumn bold noBorder>
                    {item.message_title}
                </ListItemColumn>
                <ListItemColumn ellipsisAndGrow noBorder>
                    {item.message}
                </ListItemColumn>
                <ListItemActionsMenu>
                    <div style={{display: 'flex'}}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                page.startEditing(item._id);
                            }}
                            title={gettext('Edit')}
                            aria-label={gettext('Edit')}
                        >
                            <i className="icon-pencil" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                page.deleteItem(item);
                            }}
                            title={gettext('Remove')}
                            aria-label={gettext('Remove')}
                        >
                            <i className="icon-trash" />
                        </button>
                    </div>
                </ListItemActionsMenu>
            </ListItem>
        );

        const ListComponent = getGenericListPageComponent<IMessage>('system_message', formConfig);

        return (
            <SettingsPage title={gettext('System Messages')}>
                <SettingsPageHeader>
                    <button className="btn btn--primary">
                        <i className="icon-plus-sign icon--white" />
                        {' '}
                        {gettext('New message')}
                    </button>
                </SettingsPageHeader>
                <SettingsPageContent>
                    <ListComponent
                        renderRow={renderRow}
                        formConfig={formConfig}
                        defaultSortOption={{field: 'message_title', direction: 'ascending'}}
                    />
                </SettingsPageContent>
            </SettingsPage>
        );
    }
}
