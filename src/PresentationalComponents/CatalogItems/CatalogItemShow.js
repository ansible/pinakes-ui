import { withRouter } from 'react-router-dom';
import './catalogitemshow.scss';
import React from 'react';
import propTypes from 'prop-types';
import AnsibleSvg from '../../assets/images/vendor-ansible.svg';
import { Ansible } from '@red-hat-insights/insights-frontend-components';


const propLine = (prop, value) => {
    return(<div className = "card_element">  {prop} : {value} </div>);
};

const defaultProperty = property => {
    return ['match', 'location', 'history'].includes(property)
}

const propDetails = item => {
    let details = [];

    for (let property in item) {
        if (item.hasOwnProperty(property) && !defaultProperty(property)) {
            if (item[property] !== undefined) {
                details.push(propLine(property, item[property].toString()));
            }
        }
    }
    return details;
};

const itemDetails = props => {
    let details = propDetails(props);
    return (
        <React.Fragment>
            <div>{details}</div>
        </React.Fragment>
    );
};

const CatalogItemShow = props => {
    return (
        <React.Fragment>
            <div className="pf-l-grid__item pf-m-2-col pf-m-6-row" onClick={() => {props.history.push('/catalog/catalogitems/'.concat(props.catalog_id));}}>
                <div className="card_style">
                    <div className="card_header">
                        <img src = {AnsibleSvg} width="40" height="40" />
                    </div>
                    <div className="card_body">
                        {itemDetails(props)}
                    </div>
                    <br />
                    <div className="bottom-48">
                        {props.description}
                    </div>
                    <div className="bottom-24">
                        Approval Required
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

CatalogItemShow.propTypes = {
    history: propTypes.object,
    catalog_id: propTypes.string
};

export default withRouter(CatalogItemShow);

