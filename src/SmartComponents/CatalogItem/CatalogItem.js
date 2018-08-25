import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import towerLogo from '../../assets/images/tower.png';
import './catalogitem.scss';
import propTypes from 'prop-types';
import {fetchSelectedCatalogItem} from "../../Store/Actions/CatalogItemActions";
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/ImageWithDefault';


class CatalogItem extends Component {
    componentDidMount() {
        const id = this.props.computedMatch.params.catalog_id;
        this.props.fetchCatalogItem(id);
    }

    render() {
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
                                          <ImageWithDefault src = {catalogItem.imageUrl || CatItemSvg} defaultSrc={CatItemSvg} width="120" height="120"  />
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
