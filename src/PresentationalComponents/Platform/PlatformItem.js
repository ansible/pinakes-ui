import React from 'react';
import './platformcard.scss';
import propTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../Shared/ImageWithDefault';
import { GridItem, Card, CardHeader, CardBody, CardFooter, Text, TextContent, TextVariants } from '@patternfly/react-core';
import ItemDetails from '../../PresentationalComponents/Shared/CardCommon';
import CardCheckbox from '../Shared/CardCheckbox';

const TO_DISPLAY = [ 'description' ];

class PlatformItem extends React.Component {
    state = {
      isOpen: true
    };

    render() {
      return (
        <GridItem key={ this.props.id } sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
          <Card key={ this.props.id }>
            <CardHeader className="pcard_header">
              <ImageWithDefault src={ this.props.imageUrl || CatItemSvg } width="30" height="20" />
              { this.props.editMode && (
                <CardCheckbox
                  id={ this.props.id }
                  checked={ this.props.checked }
                  onChange={ this.props.onToggleItemSelect }
                />
              ) }
            </CardHeader>
            <CardBody>
              <TextContent>
                <Text component={ TextVariants.h3 }>{ this.props.name }</Text>
              </TextContent>
              <ItemDetails { ...this.props } toDisplay={ TO_DISPLAY } />
            </CardBody>
            <CardFooter/>
          </Card>
        </GridItem>
      );
    };
}

PlatformItem.propTypes = {
  imageUrl: propTypes.string,
  id: propTypes.string,
  name: propTypes.string,
  editMode: propTypes.bool,
  checked: propTypes.bool,
  onToggleItemSelect: propTypes.func
};

export default PlatformItem;
