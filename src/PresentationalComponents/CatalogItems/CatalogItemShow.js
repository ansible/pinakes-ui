import { withRouter } from 'react-router-dom';
import './catalogitemshow.scss';
import React from 'react';
import propTypes from 'prop-types';
import AnsibleSvg from '../../assets/images/vendor-ansible.svg';
import { Ansible } from '@red-hat-insights/insights-frontend-components';

const CatalogItemShow = props => {
    return (
        <React.Fragment>
            <div className="card_style" onClick={() => {props.history.push('/catalog/catalogitems/'.concat(props.catalog_id));}}>
                <div className="card_header">
                    <img src = {AnsibleSvg} width="50" height="50" />
                </div>
                <div className="card_body">
                    <br />
                    <div className="card_description">{props.name}</div>
                    <br />
                    ID: {props.catalog_id}
                </div>
                <br />
                <div className="bottom-48">
                    {props.description}
                </div>
                <div className="bottom-24">
                    Approval Required
                </div>
            </div>
        </React.Fragment>
    );
};

CatalogItemShow.propTypes = {
    history: propTypes.object,
    catalog_id: propTypes.object
};

export default withRouter(CatalogItemShow);

