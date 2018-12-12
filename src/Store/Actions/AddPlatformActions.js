import * as ActionTypes from '../../Store/ActionTypes';
import * as AddPlatformHelper from '../../Helpers/Platform/AddPlatformHelper';
import { addAlert } from './AlertActions';

export const addPlatform = (apiProps) => dispatch => ({
  type: ActionTypes.ADD_PLATFORM,
  payload: new Promise((resolve) => {
    resolve(AddPlatformHelper.addPlatform(apiProps));
  })
  .then(() =>
    dispatch(addAlert({
      variant: 'success',
      title: 'Success adding platform',
      description: 'The platform was added successfully.'
    })))
  .catch(() =>
    dispatch(addAlert({
      variant: 'danger',
      title: 'Failed adding platform',
      description: 'The platform was not added successfuly.'
    })))
});
