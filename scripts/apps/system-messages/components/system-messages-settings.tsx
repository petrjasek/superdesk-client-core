import React from 'react';
import ng from 'core/services/ng';

import {gettext} from 'core/utils';
import {SettingsPage} from 'apps/settings/settings-page';
import {FormFieldType} from 'core/ui/components/generic-form/interfaces/form';
import {ListItem, ListItemActionsMenu, ListItemColumn} from 'core/components/ListItem';
import {getFormFieldPreviewComponent} from 'core/ui/components/generic-form/form-field';
import {getGenericListPageComponent} from 'core/ui/components/ListPage/generic-list-page';
import {IBaseRestApiResponse, IFormGroup, IGenericListPageComponent, IUser} from 'superdesk-api';
import {Label} from 'superdesk-ui-framework/react/components/Label';
import {assertNever} from 'core/helpers/typescript-helpers';

interface IMessage extends IBaseRestApiResponse {
    type: 'warning' | 'alert' | 'primary' | 'success';
    is_active: boolean;
    message_title: string;
    message: string;
    user_id: IUser['_id'];
}

const getTypeLabel = (type: IMessage["type"]) => {
    switch(type) {
        case 'alert':
            return gettext('Alert');
        case 'primary':
            return gettext('Info');
        case 'warning':
            return gettext('Warning');
        case 'success':
            return gettext('Success');
        default:
            assertNever(type);
    }
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
                            {id: 'primary', label: getTypeLabel('primary')},
                            {id: 'success', label: getTypeLabel('success')},
                            {id: 'warning', label: getTypeLabel('warning')},
                            {id: 'alert', label: getTypeLabel('alert')},
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
                    value: ng.get('session').identity._id,
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
                    <b>{item.message_title}</b>
                    {' '}
                    <Label type={item.type} text={getTypeLabel(item.type)} />
                </ListItemColumn>
                <ListItemColumn ellipsisAndGrow noBorder>
                    {getFormFieldPreviewComponent(item, formConfig.form[3], {showAsPlainText: true})}
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
                <ListComponent
                    renderRow={renderRow}
                    formConfig={formConfig}
                    defaultSortOption={{field: 'message_title', direction: 'ascending'}}
                />
            </SettingsPage>
        );
    }
}
