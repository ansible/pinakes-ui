import { fetchRequestWithSubrequests } from '../../helpers/request/request-helper';
import { APPROVAL_API_BASE } from '../../utilities/approval-constants';
import {
  APPROVAL_APPROVER_PERSONA,
  REQUESTER_PERSONA
} from '../../helpers/shared/approval-helpers';
import { mockApi } from '../../helpers/shared/__mocks__/user-login';

describe('request-helper', () => {
  describe('#fetchRequestWithSubrequests', () => {
    let id;
    let persona;

    beforeEach(() => {
      id = 'some-id';
      persona = REQUESTER_PERSONA;
      localStorage.setItem('catalog_standalone', true);
      localStorage.setItem('user', 'testUser');
    });

    afterEach(() => {
      global.localStorage.setItem('catalog_standalone', false);
      global.localStorage.removeItem('user');
      jest.clearAllMocks();
    });

    it('no data', async () => {
      mockApi
        .onGet(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`)
        .replyOnce(200, {
          data: [{ id: 'id1', description: 'some desc', metadata: { a: 'b' } }]
        });

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({
        data: [
          {
            description: 'some desc',
            id: 'id1',
            metadata: {
              a: 'b'
            }
          }
        ]
      });
    });

    it('is approver - data', async () => {
      persona = APPROVAL_APPROVER_PERSONA;

      mockApi
        .onGet(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`)
        .replyOnce(200, {
          data: [
            {
              description: 'some desc',
              id: 'id1',
              metadata: {
                a: 'b'
              }
            }
          ]
        });

      mockApi
        .onGet(`${APPROVAL_API_BASE}/requests/some-id/requests`)
        .replyOnce({
          body: {
            data: [
              { id: 'id1', description: 'some desc', metadata: { a: 'b' } }
            ]
          }
        });

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({
        data: [
          {
            description: 'some desc',
            id: 'id1',
            metadata: {
              a: 'b'
            }
          }
        ]
      });
    });

    it('is approver - no data', async () => {
      persona = APPROVAL_APPROVER_PERSONA;

      mockApi
        .onGet(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`)
        .replyOnce(200, {
          data: {
            requests: [
              {
                number_of_children: 0,
                requests: []
              }
            ]
          }
        });

      mockApi.onGet(`${APPROVAL_API_BASE}/requests/some-id`).replyOnce(200, {
        data: {
          id: 'id1',
          description: 'some desc',
          metadata: { something: 'some' }
        }
      });

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({
        data: {
          requests: [
            {
              number_of_children: 0,
              requests: []
            }
          ]
        }
      });
    });

    it('no approver persona', async () => {
      mockApi
        .onGet(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`)
        .replyOnce(200, {
          data: {
            requests: [
              {
                number_of_children: 1,
                extra_data: {
                  subrequests: [
                    {
                      name: 'request-1',
                      id: 'id1'
                    }
                  ]
                }
              }
            ]
          }
        });

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({
        data: {
          requests: [
            {
              extra_data: {
                subrequests: [
                  {
                    id: 'id1',
                    name: 'request-1'
                  }
                ]
              },
              number_of_children: 1
            }
          ]
        }
      });
    });
  });
});
