import React from 'react';
import {
  createRows,
  GroupsLabels,
  MoveButtons,
  SelectBox
} from '../../../smart-components/workflow/workflow-table-helpers';

describe('notification setings table helpers', () => {
  it('should create rows correctly', () => {
    const data = [
      {
        name: 'Name',
        id: '1',
        description: 'Description',
        notification_type: 1,
        settings: [{ name: 'Name1' }]
      },
      {
        name: 'should be in result',
        id: '2',
        description: '',
        notification_type: 2,
        settings: [{ name: 'Name2' }]
      }
    ];

    const expectedData = [
      {
        id: '1',
        cells: [
          <React.Fragment key="1-buttons">
            <MoveButtons id="1" ouiaId={'1-buttons'} />
          </React.Fragment>,
          <React.Fragment key="1-checkbox">
            <SelectBox id="1" />
          </React.Fragment>,
          'Name',
          'Description',
          <React.Fragment key="1">
            <GroupsLabels key="1" id="1" />
          </React.Fragment>
        ]
      },
      {
        id: '2',
        cells: [
          <React.Fragment key="2-buttons">
            <MoveButtons id="2" ouiaId={'2-buttons'} />
          </React.Fragment>,
          <React.Fragment key="2-checkbox">
            <SelectBox id="2" />
          </React.Fragment>,
          'should be in result',
          '',
          <React.Fragment key="2">
            <GroupsLabels key="2" id="2" />
          </React.Fragment>
        ]
      }
    ];
    expect(JSON.stringify(createRows(data, 'result'))).toEqual(
      JSON.stringify(expectedData)
    );
  });
});
