import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import FormBuilder from '@data-driven-forms/form-builder';
import { builderMapper, fieldProperties, pickerMapper, propertiesMapper } from '@data-driven-forms/form-builder/dist/pf4-builder-mappers';
import { getAxiosInstance, getServicePlainsApi } from '../../helpers/shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';

const componentProperties = {
  [componentTypes.TEXT_FIELD]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.HELPER_TEXT,
      fieldProperties.PLACEHOLDER,
      fieldProperties.INPUT_TYPE,
      fieldProperties.IS_DISABLED,
      fieldProperties.IS_READ_ONLY
    ]
  },
  [componentTypes.CHECKBOX]: { attributes: [ fieldProperties.LABEL, fieldProperties.IS_DISABLED, fieldProperties.OPTIONS ]},
  [componentTypes.SELECT]: {
    attributes: [
      fieldProperties.OPTIONS,
      fieldProperties.LABEL,
      fieldProperties.IS_DISABLED,
      fieldProperties.PLACEHOLDER,
      fieldProperties.HELPER_TEXT
    ]
  },
  [componentTypes.DATE_PICKER]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.TODAY_BUTTON_LABEL,
      fieldProperties.IS_CLEARABLE,
      fieldProperties.CLOSE_ON_DAY_SELECT,
      fieldProperties.SHOW_TODAY_BUTTON
    ]
  },
  [componentTypes.PLAIN_TEXT]: { attributes: [ fieldProperties.MULTI_LINE_LABEL ]},
  [componentTypes.RADIO]: { attributes: [ fieldProperties.LABEL, fieldProperties.IS_DISABLED, fieldProperties.OPTIONS ]},
  [componentTypes.SWITCH]: { attributes: [ fieldProperties.LABEL, fieldProperties.IS_READ_ONLY, fieldProperties.IS_DISABLED ]},
  [componentTypes.TEXTAREA]: {
    attributes: [ fieldProperties.LABEL, fieldProperties.HELPER_TEXT, fieldProperties.IS_READ_ONLY, fieldProperties.IS_DISABLED ]
  },
  [componentTypes.SUB_FORM]: {
    isContainer: true,
    attributes: [ fieldProperties.TITLE, fieldProperties.DESCRIPTION ]
  }
};

const pf4Skin = {
  componentMapper: builderMapper,
  pickerMapper,
  propertiesMapper,
  componentProperties
};

const SurveyEditor = ({ portfolioItemId }) => {
  const [ schema, setSchema ] = useState();
  const [ editedTemplate, setEditedTemplate ] = useState({ fields: []});
  useEffect(() => {
    getAxiosInstance()
    .get(`${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/service_plans`)
    .then(([{ create_json_schema: { schema }}]) => setSchema(schema));
  }, []);
  const handleSaveSurvey = () => {
    return getServicePlainsApi().createServicePlan({ portfolio_item_id: portfolioItemId }).then(([{ id }]) => id)
    .then(id => getServicePlainsApi().patchServicePlanModified(`${id}`, { modified: { schema: editedTemplate }}));
  };

  return (
    <div style={ {
      zIndex: 300,
      position: 'fixed',
      top: 0,
      left: 0,
      margin: 8,
      height: 'calc(100vh - 16px)',
      width: 'calc(100vw - 16px)',
      background: 'papayawhip',
      overflowY: 'auto'
    } }>
      { schema
        ? <FormBuilder { ...pf4Skin } schema={ schema } onChange={ setEditedTemplate } />
        : <div>Loading</div>
      }
      <button onClick={ handleSaveSurvey }>Save changes</button>
    </div>
  );
};

SurveyEditor.propTypes = {
  portfolioItemId: PropTypes.string.isRequired
};

const SurveyEditorPortal = props => createPortal(<SurveyEditor { ...props } />, document.body);

export default SurveyEditorPortal;
