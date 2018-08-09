import { withRouter } from 'react-router-dom';
import React from 'react';
import propTypes from 'prop-types';
import towerLogo from '../../assets/images/tower.png';

const card_style1 = {
    'borderRight': '2px solid lightgrey',
    'borderBottom': '1px solid lightgrey'
};

const card_style = {
    'boxShadow': '0 0.0375rem 0.125rem 0 rgba(3, 3, 3, 0.2)',
    'backgroundColor': 'white',
    'marginTop': '0px',

};

const card_header = {
    'backgroundColor': 'white',
    'textAlign': 'center',
    'borderBottom': '1px solid #D3E9FF'
};

const card_body = {
    'backgroundColor': 'white',
    'textAlign': 'left',
    'font-family': '--pf-global--FontFamily--sans-serif',
    'font-size': '--pf-global--FontSize--sm: 0.875rem;',
    'height': '96px'
};

const card_footer = {
    'backgroundColor': 'lightgrey',
    'textAlign': 'left',
    'position': 'sticky',
    'bottom': '0px',
    'height': '96px',
    'font-family': '--pf-global--FontFamily--sans-serif',
    'font-size': '--pf-global--FontSize--sm: 0.875rem;'
};

const card_description = {
    'color': 'blue',
    'textAlign': 'left',
    'font-family': '--pf-global--FontFamily--sans-serif',
    'font-size': '--pf-global--FontSize--sm: 0.875rem;',
    'height': '48px'
};

const CatalogItemShow = props => {
    return (
        <React.Fragment>
            <div className="pf-l-gallery__item" style={card_style} onClick={() => {props.history.push('/catalog/catalogitems/'.concat(props.catalog_id.props.children));}}>
                <div className="card-pf-heading" style={card_header}>
                    <img src={towerLogo} />
                </div>
                <div className="card-pf-body" style={card_body}>
                    <br />
                    <div style={card_description}>{props.name}</div>
                    <br />
                    ID: {props.catalog_id}
                </div>
                <br />
                <div className="Aligner-item Aligner-item--bottom-48" style={{'backgroundColor': 'lightgrey' }}>
                    {props.description}
                </div>
                <div className="Aligner-item Aligner-item--bottom-24" style={{'backgroundColor': 'grey'}}>
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

