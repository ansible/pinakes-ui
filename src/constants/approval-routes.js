const routes = {
  allrequest: {
    index: '/approval/allrequest',
    comment: '/approval/allrequest/comment',
    approve: '/approval/allrequest/approve',
    deny: '/approval/allrequest/deny'
  },
  allrequests: {
    index: '/approval/allrequests'
  },
  request: {
    index: '/approval/request',
    comment: '/approval/request/comment',
    approve: '/approval/request/approve',
    deny: '/approval/request/deny'
  },
  requests: {
    index: '/approval/requests',
    comment: '/approval/requests/comment',
    approve: '/approval/requests/approve',
    deny: '/approval/requests/deny'
  },
  workflows: {
    index: '/approval/workflows',
    add: '/approval/workflows/add-workflow',
    remove: '/approval/workflows/remove',
    edit: '/approval/workflows/edit'
  }
};

export default routes;
