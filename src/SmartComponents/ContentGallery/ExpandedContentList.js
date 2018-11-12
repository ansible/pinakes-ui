import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Table, Section } from '@red-hat-insights/insights-frontend-components';
import { Bullseye } from '@patternfly/react-core';
import { Row, Col, ListView,
    ListViewGroupItem,
    ListViewGroupItemHeader,
    ListViewMainInfo,
    ListViewLeft,
    ListViewActions,
    ListViewBody,
    ListViewIcon,
    ListViewDescriptionHeading,
    ListViewDescriptionText,
    ListViewExpand,
    ListViewCheckBox,
    ListViewDescription,
    ListViewGroupItemContainer,
    ListViewInfoItem,
    ListViewItem,
    ListViewAdditionalInfo } from 'patternfly-react';

const defaultProperty = property => {
    return [].includes(property);
};

const propDetails = item => {
    let details = {};

    for (let property in item) {
        if (item.hasOwnProperty(property) && !defaultProperty(property)) {
            if (item[property] && item[property] !== undefined) {
                details[property] = item[property].toString();
            }
        }
    }

    return details;
};

const itemDetails = (item) => {
    let row = {};
    row.cells = (Object.values(item)).map(val => {return val === undefined ? '' : val.toString();});
    return (
        <ListViewItem
            actions={ <div /> }
            checkboxInput={ <input /> }
            leftContent={ <ListViewIcon /> }
            heading="Item 1"
            description="This is Item 1 description"
        >
            <Row>
                <Col sm={ 11 }>
                    { row }
                </Col>
            </Row>
        </ListViewItem>);
};

class ExpandedContentList extends Component {
    render() {
        if (this.props.isLoading || (this.props.items && this.props.items.length) > 0) {
            return (
                <React.Fragment>
                    <br />
                    <Bullseye>
                        <BarLoader color={ '#00b9e4' } loading={ this.props.isLoading } />
                    </Bullseye>
                    <Section type='content'>
                        { (this.props.items && this.props.items.length > 0) && (
                            <ListView>
                                header={ Object.keys(this.props.items[0]) }
                                { this.props.items.map(item => {itemDetails(item);}) }
                            </ListView>)
                        }
                    </Section>
                </React.Fragment>
            );
        }
        else if (!this.props.isLoading) {
            return (
                <React.Fragment>
                    <div>
                        <PageHeader>
                            <PageHeaderTitle title={ 'No Orders' }/>
                        </PageHeader>
                    </div>
                </React.Fragment>
            );
        }
    }
}

ExpandedContentList.propTypes = {
    isLoading: propTypes.bool,
    items: propTypes.array,
    pageSize: propTypes.number,
    fetchData: propTypes.func
};
export default ExpandedContentList;
