import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './platformitem.scss';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../Shared/ImageWithDefault';
import { PlatformStore, fetchPlatformItems } from '../../Store/Actions/PlatformActions';
import { hideModal, showModal } from '../../Store/Actions/MainModalActions';
import { GridItem, Card, CardHeader, CardBody, CardFooter, Checkbox } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownPosition, DropdownToggle } from '@patternfly/react-core';
import itemDetails from '../../PresentationalComponents/Shared/CardCommon';
import { bindMethods, consoleLog } from '../../Helpers/Shared/Helper';
import CardCheckbox from '../Shared/CardCheckbox';

const TO_DISPLAY = [ 'description' ];

const mapDispatchToProps = dispatch => {
    return {
        hideModal: () => dispatch(hideModal()),
        showModal: (modalProps, modalType) => {
            dispatch(showModal({ modalProps, modalType }));
        }
    };
};

class PlatformItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: true, showMenu: false, isEditMode: false };
    };

    onSelect = (event) => {
        consoleLog('This is the selected state:', this.state);
        consoleLog('This is the selected event:', event);

        this.props.showModal({
            open: true,
            itemdata: this.props,
            closeModal: this.props.hideModal
        }, 'addportfolio');

        this.setState({
            ...this.state,
            isOpen: !this.state.isOpen
        });
    };

    isChecked = () => {
        if (this.props.isChecked)
        {return this.props.isChecked(this.props.id);}
        else
        {return false;}
    }

    render() {
        return (
            <GridItem key={ this.props.id } GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
                <Card key={ this.props.id }>
                    <CardHeader className="card_header">
                        <ImageWithDefault src={ this.props.imageUrl || CatItemSvg } defaultSrc={ CatItemSvg } width="50" height="50" />
                        { this.props.isEditMode && <CardCheckbox id={ this.props.id } checked={ this.isChecked } onChange={ this.props.onCheckboxClick } /> }
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
    showModal: propTypes.func,
    hideModal: propTypes.func,
    imageUrl: propTypes.string,
    id: propTypes.string,
    name: propTypes.string,
    isEditMode: propTypes.string,
    checkedItems: propTypes.object,
    isChecked: propTypes.string,
    onCheckboxClick: propTypes.func,
    onCheckboxClick: propTypes.func
};

export default withRouter(PlatformItem);

