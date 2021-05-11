import React from 'react';

import { connectCrudManager } from 'core/helpers/CrudManager';
import { ISystemMessage } from '..';
import { ICrudManager } from 'superdesk-api';

interface IProps {
    items: ICrudManager<ISystemMessage>;
}

class BaseSystemMessagesComponent extends React.PureComponent<IProps> {

    componentDidMount() {
        this.setState({activeFilters: [{is_active: true}]}, () => {
            this.props.items.read(1, {field: '_id', direction: 'descending'}, {is_active: true});
        });
    }

    render() {
        if (this.props.items?._items?.length) {
            this.props.items._items.forEach((message: ISystemMessage) => {
                console.info("message", message);
            });
        }

        return null;
    }
}

export const SystemMessagesComponent = connectCrudManager(BaseSystemMessagesComponent, 'items', 'system_message');