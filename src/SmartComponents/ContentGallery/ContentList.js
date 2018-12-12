import React, { Component } from 'react';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Table, Section } from '@red-hat-insights/insights-frontend-components';
import { Bullseye } from '@patternfly/react-core';

class ContentList extends Component {
  render() {
    if (this.props.isLoading || (this.props.items && this.props.items.length) > 0) {
      return (
        <React.Fragment>
          <br />
          <Bullseye>
            <div>
              { this.props.isLoading && (<span color={ '#00b9e4' }> Loading...</span>) }
            </div>
          </Bullseye>
          <Section type='content'>
            { (this.props.items && this.props.items.length > 0) && (
              <Table
                header={ Object.keys(this.props.items[0]) }
                rows={ this.props.items.map(item => {
                  let row = {};
                  row.cells = (Object.values(item)).map(val => val === undefined ? '' : val.toString());
                  return row;
                }) }
              />)
            }
          </Section>
        </React.Fragment>
      );
    }

    // why div?
    return (
      <div>
        <PageHeader>
          <PageHeaderTitle title={ 'No Orders' }/>
        </PageHeader>
      </div>
    );
  }
}

ContentList.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.array,
  pageSize: propTypes.number,
  fetchData: propTypes.func
};
export default ContentList;
