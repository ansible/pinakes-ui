import asyncDebounce from '../utilities/async-form-validator';
import { fetchFilterApprovalGroups } from '../helpers/group/group-helper';

export default asyncDebounce(fetchFilterApprovalGroups);
