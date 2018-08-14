import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
import { PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import towerLogo from '../../assets/images/tower.png';
import './catalogitem.scss';
import propTypes from 'prop-types';
import {fetchSelectedCatalogItem} from "../../Store/Actions/CatalogItemActions";

class CatalogItem extends Component {

    fetchData(id) {
        let defaultProps = {};
        this.props.fetchCatalogItem(id);
    }

    componentDidMount() {
        const id = this.props.computedMatch.params.catalog_id;
        this.fetchData(id);
    }

    render( store ) {
        let catalogItem = {
            ...this.props.catalogItem,
            isLoading: this.props.isLoading,
            fetchData: id => this.fetchData(id)
        };
        console.log(catalogItem);

        return (
            <div className="pf-l-stack">
                <div className="pf-l-stack__item pf-m-secondary ">
                    <PageHeader>
                        <PageHeaderTitle title= 'Catalog Item' />
                    </PageHeader>
                </div>
                <div className="pf-l-stack__item pf-m-secondary ">
                    <Section type="content">
                        <div className="pf-l-grid pf-m-gutters">
                            <div className="pf-l-grid__item pf-m-6-col">
                                <div className="pf-c-card ">
                                    <div className="pf-c-card__header ">
                                        <h6 className="pf-c-title pf-m-xl pf-m-margin">
                                            <img src={towerLogo} />
                                        </h6>
                                    </div>
                                    <div className="pf-c-card__body ">
                                        <table className="content-gallery">
                                            <tbody>
                                            <tr>
                                                <td>Name:  </td>
                                                <td>{catalogItem.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Description:  </td>
                                                <td>{catalogItem.description}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <br/>
                                <Button variant="tertiary" onClick={this.props.history.goBack}>
                                    Back to the Catalog Items List
                                </Button>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { catalogItem: state.CatalogStore.catalogItem,
        isLoading: state.CatalogStore.isLoading};
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCatalogItem: catalog_id => dispatch(fetchSelectedCatalogItem(catalog_id)),
    };
};

CatalogItem.propTypes = {
    catalogItem: propTypes.object,
    isLoading: propTypes.bool,
    history: propTypes.object,
    fetchCatalogItem: propTypes.func
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CatalogItem)
);
