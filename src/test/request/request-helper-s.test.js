import { fetchRequestWithSubrequests } from '../../../helpers/request/request-helper-s';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import { APPROVAL_APPROVER_PERSONA, REQUESTER_PERSONA } from '../../../helpers/shared/helpers';

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
      apiClientMock.get(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`, mockOnce({
        body: {
          data: [
            { id: 'id1', description: 'some desc', metadata: { a: 'b' }}
          ]
        }
      }));

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({ data: [
        {
          description: 'some desc',
          id: 'id1',
          metadata: {
            a: 'b'
          }
        }
      ]});
    });

    it('is approver - data', async () => {
      persona = APPROVAL_APPROVER_PERSONA;

      apiClientMock.get(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`, mockOnce({
        body: {
          data: [
            {
              description: 'some desc',
              id: 'id1',
              metadata: {
                a: 'b'
              }
            }
          ]
        }
      })
      );

      apiClientMock.get(
        `${APPROVAL_API_BASE}/requests/some-id/requests`,
        mockOnce({
          body: {
            data: [
              { id: 'id1', description: 'some desc', metadata: { a: 'b' }}
            ]
          }
        })
      );

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

      apiClientMock.get(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`, mockOnce({
        body: {
          data: {
            requests: [
              {
                number_of_children: 0,
                requests: []
              }
            ]
          }
        }
      }
      ));

      apiClientMock.get(
        `${APPROVAL_API_BASE}/requests/some-id`,
        mockOnce({
          body:
              { id: 'id1', description: 'some desc', metadata: { something: 'some' }}
        })
      );

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
      apiClientMock.get(`${APPROVAL_API_BASE}/requests/some-id/?extra=true`, mockOnce({
        body:
            {
              data: {
                requests: [
                  {
                    number_of_children: 1,
                    extra_data: {
                      subrequests: [{
                        name: 'request-1',
                        id: 'id1'
                      }]
                    }
                  }
                ]
              }
            }
      }
      ));

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
