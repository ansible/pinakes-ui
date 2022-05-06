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
          <React.Fragment key="1-checkbox">
            <SelectBox id="1" />
          </React.Fragment>,
          'foo',
          'bar',
          {
            type: 'span',
            key: 'Tue May 31 2022 20:00:00 GMT-0400 (Eastern Daylight Time)',
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
          <React.Fragment key="2-checkbox">
            <SelectBox id="2" />
          </React.Fragment>,
          'should be in result',
          'baz',
          {
            type: 'span',
            key: 'Tue May 31 2022 20:00:00 GMT-0400 (Eastern Daylight Time)',
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
