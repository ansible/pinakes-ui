import * as ActionTypes from '../action-types';
import * as TemplateHelper from '../../helpers/template/template-helper';
import templateMessages from '../../messages/templates.messages';

export const fetchTemplates = (pagination) => (dispatch, getState) => {
  const { templates, filterValue } = getState().templateReducer;

  let finalPagination = pagination;

  if (!pagination && templates) {
    const { limit, offset } = templates.meta;
    finalPagination = { limit, offset };
  }

  return dispatch({
    type: ActionTypes.FETCH_TEMPLATES,
    payload: TemplateHelper.fetchTemplates(filterValue, finalPagination)
  });
};

export const fetchTemplate = (apiProps) => ({
  type: ActionTypes.FETCH_TEMPLATE,
  payload: TemplateHelper.fetchTemplate(apiProps)
});

export const addTemplate = (templateData, intl) => ({
  type: ActionTypes.ADD_TEMPLATE,
  payload: TemplateHelper.addTemplate(templateData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(templateMessages.addTemplateSuccessTitle),
        description: intl.formatMessage(
          templateMessages.addTemplateSuccessDescription
        )
      }
    }
  }
});

export const updateTemplate = (templateData, intl) => ({
  type: ActionTypes.UPDATE_TEMPLATE,
  payload: TemplateHelper.updateTemplate(templateData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(templateMessages.updateTemplateSuccessTitle),
        description: intl.formatMessage(
          templateMessages.updateTemplateSuccessDescription
        )
      }
    }
  }
});

export const removeTemplate = (template, intl) => ({
  type: ActionTypes.REMOVE_TEMPLATE,
  payload: TemplateHelper.removeTemplate(template),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(templateMessages.removeTemplatesSuccessTitle),
        description: intl.formatMessage(
          templateMessages.removeTemplateSuccessDescription
        )
      }
    }
  }
});

export const removeTemplates = (templates, intl) => ({
  type: ActionTypes.REMOVE_TEMPLATES,
  payload: TemplateHelper.removeTemplates(templates),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(templateMessages.removeTemplatesSuccessTitle),
        description: intl.formatMessage(
          templateMessages.removeTemplatesSuccessDescription
        )
      }
    }
  }
});

export const setFilterValueTemplates = (filterValue) => ({
  type: ActionTypes.SET_FILTER_TEMPLATES,
  payload: filterValue
});

export const clearFilterValueTemplates = () => ({
  type: ActionTypes.CLEAR_FILTER_TEMPLATES
});
