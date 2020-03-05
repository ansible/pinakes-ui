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
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';

import {
  getAxiosInstance,
  getServicePlansApi
} from '../../helpers/shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { Bullseye } from '@patternfly/react-core';
import { SurveyEditingToolbar } from '../portfolio/portfolio-item-detail/portfolio-item-detail-toolbar';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

const componentProperties = {
  [componentTypes.TEXT_FIELD]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.HELPER_TEXT,
      fieldProperties.PLACEHOLDER,
      fieldProperties.IS_DISABLED,
      fieldProperties.IS_READ_ONLY,
      fieldProperties.HIDE_FIELD
    ]
  },
  [componentTypes.CHECKBOX]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.IS_DISABLED,
      fieldProperties.OPTIONS,
      fieldProperties.HIDE_FIELD
    ]
  },
  [componentTypes.SELECT]: {
    attributes: [
      fieldProperties.OPTIONS,
      fieldProperties.LABEL,
      fieldProperties.IS_DISABLED,
      fieldProperties.PLACEHOLDER,
      fieldProperties.HELPER_TEXT,
      fieldProperties.HIDE_FIELD
    ]
  },
  [componentTypes.DATE_PICKER]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.TODAY_BUTTON_LABEL,
      fieldProperties.IS_CLEARABLE,
      fieldProperties.CLOSE_ON_DAY_SELECT,
      fieldProperties.SHOW_TODAY_BUTTON,
      fieldProperties.HIDE_FIELD
    ]
  },
  [componentTypes.PLAIN_TEXT]: {
    attributes: [fieldProperties.MULTI_LINE_LABEL]
  },
  [componentTypes.RADIO]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.IS_DISABLED,
      fieldProperties.OPTIONS,
      fieldProperties.HIDE_FIELD
    ]
  },
  [componentTypes.SWITCH]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.IS_READ_ONLY,
      fieldProperties.IS_DISABLED,
      fieldProperties.HIDE_FIELD
    ]
  },
  [componentTypes.TEXTAREA]: {
    attributes: [
      fieldProperties.LABEL,
      fieldProperties.HELPER_TEXT,
      fieldProperties.IS_READ_ONLY,
      fieldProperties.IS_DISABLED,
      fieldProperties.HIDE_FIELD
    ]
  }
};

const pf4Skin = {
  componentMapper: builderMapper,
  pickerMapper,
  propertiesMapper,
  componentProperties
};

const BuilderWrapper = (props) => <FormBuilder {...props} />;

const SurveyEditor = ({ closeUrl, search, portfolioItem, uploadIcon }) => {
  const [schema, setSchema] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [baseSchema, setBaseSchema] = useState();
  const [servicePlan, setServicePlan] = useState();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const getServicePlan = () =>
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
        if (servicePlan[0].imported) {
          return getAxiosInstance()
            .get(`${CATALOG_API_BASE}/service_plans/${servicePlan[0].id}/base`)
            .then((baseSchema) => {
              setBaseSchema(baseSchema.create_json_schema.schema);
              return schema;
            });
        }

        return schema;
      })
      .then((schema) => {
        setSchema(schema);
        setIsFetching(false);
      });
  useEffect(() => {
    getServicePlan();
  }, []);

  const modifySurvey = (editedTemplate) =>
    getServicePlansApi().patchServicePlanModified(`${servicePlan.id}`, {
      modified: { schema: editedTemplate }
    });
  const createSurvey = (editedTemplate) =>
    getServicePlansApi()
      .createServicePlan({ portfolio_item_id: portfolioItem.id })
      .then(([{ id }]) => id)
      .then((id) =>
        getServicePlansApi().patchServicePlanModified(`${id}`, {
          modified: { schema: editedTemplate }
        })
      );
  const handleSaveSurvey = (editedTemplate) => {
    setIsFetching(true);
    let submitCall = servicePlan.imported ? modifySurvey : createSurvey;

    return submitCall(editedTemplate)
      .then(() => {
        setIsFetching(false);
        dispatch(
          addNotification({
            variant: 'success',
            title: `Survey of ${portfolioItem.name} has been modified.`,
            dismissable: true
          })
        );
        return push({ pathname: closeUrl, search });
      })
      .catch((error) => {
        setIsFetching(false);
        dispatch({ type: 'EDIT_SURVEY_REJECTED', payload: error });
      });
  };

  const handleResetSurvey = (id) => {
    setSchema(undefined);
    getServicePlansApi()
      .resetServicePlanModified(id)
      .then(getServicePlan)
      .then(() =>
        dispatch(
          addNotification({
            variant: 'success',
            title: `Survey of ${portfolioItem.name} has been restored.`,
            dismissable: true
          })
        )
      );
  };

  return (
    <Fragment>
      {schema ? (
        <BuilderWrapper
          {...pf4Skin}
          schema={schema}
          disableDrag
          schemaTemplate={baseSchema}
          mode="subset"
          controlPanel={({ getSchema, isValid }) => (
            <SurveyEditingToolbar
              key="survey-editor-toolbar"
              uploadIcon={uploadIcon}
              product={portfolioItem}
              handleSaveSurvey={() => handleSaveSurvey(getSchema())}
              isValid={isValid}
              closeUrl={closeUrl}
              search={search}
              isFetching={isFetching || !schema}
              modified={servicePlan.modified}
              handleResetSurvey={() => handleResetSurvey(servicePlan.id)}
            />
          )}
        />
      ) : (
        <Fragment>
          <SurveyEditingToolbar
            uploadIcon={uploadIcon}
            product={portfolioItem}
            handleSaveSurvey={handleSaveSurvey}
            closeUrl={closeUrl}
            search={search}
            isFetching={!schema || isFetching}
          />
          <Bullseye>
            <Spinner />
          </Bullseye>
        </Fragment>
      )}
    </Fragment>
  );
};

SurveyEditor.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  uploadIcon: PropTypes.func.isRequired,
  portfolioItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  portfolio: PropTypes.object.isRequired
};

export default SurveyEditor;
