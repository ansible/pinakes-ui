import React from 'react';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import {
  APPROVAL_ADMIN_ROLE,
  APPROVAL_APPR_ROLE
} from '../../utilities/approval-constants';

const activeStates = ['notified'];
export const APPROVAL_ADMINISTRATOR_ROLE = 'approval-admin';
export const APPROVAL_APPROVER_ROLE = 'approval-approver';
export const APPROVAL_ADMIN_PERSONA = 'approval/admin';
export const APPROVAL_APPROVER_PERSONA = 'approval/approver';

export const ADMIN_PERSONA = 'admin';
export const APPROVER_PERSONA = 'approver';
export const REQUESTER_PERSONA = 'requester';

export const isRequestStateActive = (state) => activeStates.includes(state);

export const timeAgo = (date) => (
  <span key={date}>
    <DateFormat date={date} type="relative" />
  </span>
);

export const useIsApprovalAdmin = (roles = []) =>
  roles ? roles.includes(APPROVAL_ADMIN_ROLE) : false;
export const useIsApprovalApprover = (roles = []) =>
  roles ? roles.includes(APPROVAL_APPR_ROLE) : false;

export const approvalPersona = (userRoles) => {
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  if (isApprovalAdmin) {
    return ADMIN_PERSONA;
  } else if (isApprovalApprover) {
    return APPROVER_PERSONA;
  }

  return REQUESTER_PERSONA;
};

export const approvalRoles = (roles = []) => {
  const userRoles = {};
  if (roles.includes(APPROVAL_ADMIN_ROLE)) {
    userRoles[APPROVAL_ADMIN_ROLE] = true;
  } else if (roles.includes(APPROVAL_APPR_ROLE)) {
    userRoles[APPROVAL_APPR_ROLE] = true;
  }

  return userRoles;
};
