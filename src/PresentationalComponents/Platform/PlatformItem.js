import React from 'react';
import { withRouter } from 'react-router-dom';
import './platform.scss';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../Shared/ImageWithDefault';
import { PlatformStore, fetchPlatformItems } from '../../Store/Actions/PlatformActions';
import { GridItem, Card, CardHeader, CardBody, CardFooter, Checkbox } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownPosition, DropdownToggle } from '@patternfly/react-core';
import itemDetails from '../../PresentationalComponents/Shared/CardCommon';
import CardCheckbox from '../Shared/CardCheckbox';

const TO_DISPLAY = [ 'description' ];

class PlatformItem extends React.Component {
    state = {
        isOpen: true,
    };

    render() {
        return (
            <GridItem key={ this.props.id } sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
                <Card key={ this.props.id }>
                    <CardHeader className="card_header">
                        <ImageWithDefault src={ this.props.imageUrl || CatItemSvg } defaultSrc={ CatItemSvg } width="50" height="50" />
                        { this.props.editMode && <CardCheckbox id={ this.props.id } checked={ this.props.checkedItems.includes(this.props.id) } onChange={ this.props.onToggleSelect } /> }
                    </CardHeader>
                    <CardBody className="card_body">
                        <h4>{ this.props.name }</h4>
                        { itemDetails(this.props, TO_DISPLAY) }
                    </CardBody>
                    <CardFooter/>
                </Card>
            </GridItem>
        );
    };
}

PlatformItem.propTypes = {
    history: propTypes.object,
    imageUrl: propTypes.string,
    id: propTypes.string,
    name: propTypes.string,
    editMode: propTypes.bool,
    isChecked: propTypes.func,
    onCheckboxClick: propTypes.func,
    checkSelectionState: propTypes.func,
    checkedItems: propTypes.array,
    onToggleSelect: propTypes.func
};

export default withRouter(PlatformItem);

