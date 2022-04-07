const routes = {
  allrequests: {
    index: '/approval/allrequests'
  },
  requests: {
    index: '/approval/requests',
    comment: '/approval/requests/comment',
    approve: '/approval/requests/approve',
    deny: '/approval/requests/deny'
  },
  request: {
    index: '/approval/request',
    comment: '/approval/request/comment',
    approve: '/approval/request/approve',
    deny: '/approval/request/deny'
  },
  allrequest: {
    index: '/approval/allrequest',
    comment: '/approval/allrequest/comment',
    approve: '/approval/allrequest/approve',
    deny: '/approval/allrequest/deny'
  },
  workflows: {
    index: '/approval/workflows',
    add: '/approval/workflows/add-workflow',
    remove: '/approval/workflows/remove',
    edit: '/approval/workflows/edit'
  }
};

export default routes;
