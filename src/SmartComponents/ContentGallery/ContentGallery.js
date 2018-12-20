import React, { Component } from 'react';
import './content-gallery.scss';
import propTypes from 'prop-types';
import { Section, Pagination, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Grid, Title } from '@patternfly/react-core';

class ContentGallery extends Component {
    render() {
        if (this.props.isLoading || (this.props.items && this.props.items.length) > 0) {
            return (
                <div>
                    <br />
                    <div>
                        { this.props.isLoading && (<span> Loading...</span>) }
                    </div>
                    { this.props.title && (<Title size={ '2xl' } style={{marginLeft: '25px'}}> { this.props.title }</Title>) }
                    <Section type='content'>
                        <Grid gutter='md' >
                            { this.props.items }
                        </Grid>
                    </Section>
                </div>
            );
        }
        else if (!this.props.isLoading) {
            return (
                <Section type='content'>
                    <div>
                    </div>
                </Section>
            );
        }
    }
}

ContentGallery.propTypes = {
    isLoading: propTypes.bool,
    items: propTypes.array,
    page: propTypes.number,
    pages: propTypes.number,
    pageSize: propTypes.number,
    title: propTypes.string,
    fetchData: propTypes.func
};
export default ContentGallery;
