import React from 'react';
import sharePorfolioMessage, {
  bold
} from '../../../helpers/portfolio/share-portfolio-message';

describe('#sharePorfolioMessage', () => {
  let shareData;
  let initialGroups;
  let removedGroups;
  let newGroups;
  let formatMessage;
  let portfolioName;

  let result;

  beforeEach(() => {
    shareData = [];
    initialGroups = [];
    removedGroups = [];
    newGroups = [];
    formatMessage = ({ defaultMessage }, values) => ({
      defaultMessage,
      values
    });
    portfolioName = () => 'Porfolio';
  });

  it('only sharing', () => {
    const newGroup = {
      permissions: 'read',
      group_uuid: '123',
      groupName: 'group-name'
    };

    initialGroups = [];
    shareData = [newGroup];
    newGroups = [newGroup];

    result = {
      description: {
        defaultMessage:
          'Portfolio <b>{name}</b> was shared with <b>{group}</b>.',
        values: {
          b: expect.any(Function),
          group: 'group-name',
          name: 'Porfolio'
        }
      },
      title: {
        defaultMessage: 'Success sharing portfolio',
        values: undefined
      }
    };

    expect(
      sharePorfolioMessage({
        shareData,
        initialGroups,
        removedGroups,
        newGroups,
        formatMessage,
        portfolioName
      })
    ).toEqual(result);
  });

  it('only unsharing', () => {
    const removedGroup = {
      permissions: 'read',
      group_uuid: '123',
      groupName: 'group-name'
    };

    initialGroups = [removedGroup];
    removedGroups = [removedGroup];

    result = {
      description: {
        defaultMessage:
          'Portfolio <b>{name}</b> was unshared with <b>{group}</b>.',
        values: {
          b: expect.any(Function),
          group: 'group-name',
          name: 'Porfolio'
        }
      },
      title: {
        defaultMessage: 'Success unsharing portfolio',
        values: undefined
      }
    };

    expect(
      sharePorfolioMessage({
        shareData,
        initialGroups,
        removedGroups,
        newGroups,
        formatMessage,
        portfolioName
      })
    ).toEqual(result);
  });

  it('only changing permissions', () => {
    const originalGroup = {
      permissions: 'read',
      group_uuid: '123',
      groupName: 'group-name'
    };
    const changedGroup = {
      permissions: 'read,update',
      group_uuid: '123',
      groupName: 'group-name'
    };

    initialGroups = [originalGroup];
    newGroups = [changedGroup];
    shareData = [changedGroup];

    result = {
      description: {
        defaultMessage: 'Share permissions for <b>{group}</b> were updated.',
        values: {
          b: expect.any(Function),
          group: 'group-name'
        }
      },
      title: {
        defaultMessage: 'Success changing permissions',
        values: undefined
      }
    };

    expect(
      sharePorfolioMessage({
        shareData,
        initialGroups,
        removedGroups,
        newGroups,
        formatMessage,
        portfolioName
      })
    ).toEqual(result);
  });

  it('combination', () => {
    const originalGroup = {
      permissions: 'read',
      group_uuid: '123',
      groupName: 'group-name'
    };
    const changedGroup = {
      permissions: 'read,update',
      group_uuid: '123',
      groupName: 'group-name'
    };
    const removedGroup = {
      permissions: 'read',
      group_uuid: '12342',
      groupName: 'group-name-123'
    };

    initialGroups = [originalGroup, removedGroup];
    newGroups = [changedGroup];
    shareData = [changedGroup];
    removedGroups = [removedGroup];

    result = {
      description: undefined,
      title: {
        defaultMessage: 'Share permissions were updated successfully',
        values: undefined
      }
    };

    expect(
      sharePorfolioMessage({
        shareData,
        initialGroups,
        removedGroups,
        newGroups,
        formatMessage,
        portfolioName
      })
    ).toEqual(result);
  });

  it('renders bold', () => {
    expect(bold('Some text')).toEqual(<b>Some text</b>);
  });
});
