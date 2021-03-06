import React from 'react';
import {
  createRows,
  GroupsLabels,
  MoveButtons,
  SelectBox
} from '../../../smart-components/template/template-table-helpers';

describe('templates table helpers', () => {
  it('should create rows correctly', () => {
    const data = [
      {
        id: '1',
        title: 'foo',
        description: 'bar',
        updated_at: new Date(Date.UTC(2022, 5, 1, 0))
      },
      {
        title: 'should be in result',
        id: '2',
        description: 'baz',
        updated_at: new Date(Date.UTC(2022, 5, 1, 0))
      }
    ];

    const expectedData = [
      {
        id: '1',
        cells: [
          {
            key: '1-checkbox',
            ref: null,
            props: {
              children: {
                key: null,
                ref: null,
                props: { id: '1' },
                _owner: null,
                _store: {}
              }
            },
            _owner: null,
            _store: {}
          },
          'foo',
          'bar',
          {
            type: 'span',
            key:
              'Wed Jun 01 2022 00:00:00 GMT+0000 (Coordinated Universal Time)',
            ref: null,
            props: {
              children: {
                key: null,
                ref: null,
                props: { date: '2022-06-01T00:00:00.000Z', type: 'relative' },
                _owner: null,
                _store: {}
              }
            },
            _owner: null,
            _store: {}
          }
        ]
      },
      {
        id: '2',
        cells: [
          {
            key: '2-checkbox',
            ref: null,
            props: {
              children: {
                key: null,
                ref: null,
                props: { id: '2' },
                _owner: null,
                _store: {}
              }
            },
            _owner: null,
            _store: {}
          },
          'should be in result',
          'baz',
          {
            type: 'span',
            key:
              'Wed Jun 01 2022 00:00:00 GMT+0000 (Coordinated Universal Time)',
            ref: null,
            props: {
              children: {
                key: null,
                ref: null,
                props: { date: '2022-06-01T00:00:00.000Z', type: 'relative' },
                _owner: null,
                _store: {}
              }
            },
            _owner: null,
            _store: {}
          }
        ]
      }
    ];
    expect(JSON.stringify(createRows(data, 'result'))).toEqual(
      JSON.stringify(expectedData)
    );
  });
});
