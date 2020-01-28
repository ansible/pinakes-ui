import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import FormBuilder from '@data-driven-forms/form-builder';
import {
  builderMapper,
  fieldProperties,
  pickerMapper,
  propertiesMapper
} from '@data-driven-forms/form-builder/dist/pf4-builder-mappers';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import {
  getAxiosInstance,
  getServicePlansApi
} from '../../helpers/shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { Bullseye } from '@patternfly/react-core';
import { SurveyEditingToolbar } from '../portfolio/portfolio-item-detail/portfolio-item-detail-toolbar';

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
  [componentTypes.CHECKBOX]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.IS_DISABLED,
      fieldProperties.OPTIONS
    ]
  },
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
  [componentTypes.PLAIN_TEXT]: {
    attributes: [fieldProperties.MULTI_LINE_LABEL]
  },
  [componentTypes.RADIO]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.IS_DISABLED,
      fieldProperties.OPTIONS
    ]
  },
  [componentTypes.SWITCH]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.IS_READ_ONLY,
      fieldProperties.IS_DISABLED
    ]
  },
  [componentTypes.TEXTAREA]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.HELPER_TEXT,
      fieldProperties.IS_READ_ONLY,
      fieldProperties.IS_DISABLED
    ]
  },
  [componentTypes.SUB_FORM]: {
    isContainer: true,
    attributes: [fieldProperties.TITLE, fieldProperties.DESCRIPTION]
  }
};

const pf4Skin = {
  componentMapper: builderMapper,
  pickerMapper,
  propertiesMapper,
  componentProperties
};

const SurveyEditor = ({
  closeUrl,
  search,
  portfolioItem,
  uploadIcon,
  portfolio
}) => {
  const [schema, setSchema] = useState();
  const [baseSchema, setBaseSchema] = useState();
  const [servicePlan, setServicePlan] = useState();
  const [editedTemplate, setEditedTemplate] = useState({ fields: [] });
  const { push } = useHistory();
  useEffect(() => {
    getAxiosInstance()
      .get(
        `${CATALOG_API_BASE}/portfolio_items/${portfolioItem.id}/service_plans`
      )
      .then((servicePlan) => {
        const [
          {
            create_json_schema: { schema }
          }
        ] = servicePlan;
        setServicePlan(servicePlan[0]);
        if (servicePlan[0].modified) {
          return getAxiosInstance()
            .get(`${CATALOG_API_BASE}/service_plans/${servicePlan[0].id}/base`)
            .then((baseSchema) => {
              setBaseSchema(baseSchema.create_json_schema.schema);
              return schema;
            });
        }

        return schema;
      })
      .then((schema) => setSchema(schema));
  }, []);
  const handleSaveSurvey = () => {
    if (servicePlan.modified) {
      return getServicePlansApi()
        .patchServicePlanModified(`${servicePlan.id}`, {
          modified: { schema: editedTemplate }
        })
        .then(() => push({ pathname: closeUrl, search }));
    }

    return getServicePlansApi()
      .createServicePlan({ portfolio_item_id: portfolioItem.id })
      .then(([{ id }]) => id)
      .then((id) =>
        getServicePlansApi()
          .patchServicePlanModified(`${id}`, {
            modified: { schema: editedTemplate }
          })
          .then(() => push({ pathname: closeUrl, search }))
      );
  };

  return (
    <Fragment>
      <SurveyEditingToolbar
        uploadIcon={uploadIcon}
        product={portfolioItem}
        handleSaveSurvey={handleSaveSurvey}
        closeUrl={closeUrl}
        search={search}
      />
      {schema ? (
        <FormBuilder
          {...pf4Skin}
          schema={schema}
          onChange={setEditedTemplate}
          disableDrag
          schemaTemplate={baseSchema}
          mode="subset"
        />
      ) : (
        <Bullseye>
          <Spinner />
        </Bullseye>
      )}
    </Fragment>
  );
};

SurveyEditor.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  portfolioItem: PropTypes.shape({ id: PropTypes.string.isRequired })
    .isRequired,
  uploadIcon: PropTypes.func.isRequired,
  portfolio: PropTypes.object.isRequired
};

export default SurveyEditor;
