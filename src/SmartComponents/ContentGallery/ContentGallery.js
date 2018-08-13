import React, { Component } from 'react';
import './content-gallery.scss';
import { BarLoader } from 'react-spinners';
import propTypes from 'prop-types';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { Bullseye } from '@patternfly/react-core';


class ContentGallery extends Component {
    constructor(props) {
        super(props);
        this.fetchData = this.props.fetchData.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <Bullseye>
                    <BarLoader color={'#00b9e4'} loading={this.props.isLoading} />
                </Bullseye>
                <div className="pf-l-grid pf-m-gutter">
                    {this.props.items}
                </div>
                <div>
                    <Pagination
                        numberOfItems={this.props.pageSize * this.props.pages}
                        page={this.props.page}
                        amountOfPages={this.props.pages}
                        itemsPerPage={this.props.pageSize}
                        onSetPage={page => this.fetchData({ page })}
                        onPerPageSelect={page_size => this.fetchData({ page_size })}
                    />
                    <br />
                </div>
            </React.Fragment>
        );
    }
}

ContentGallery.propTypes = {
    isLoading: propTypes.bool,
    items: propTypes.array,
    page: propTypes.number,
    pages: propTypes.number,
    pageSize: propTypes.number,
    fetchData: propTypes.func
};
export default ContentGallery;
