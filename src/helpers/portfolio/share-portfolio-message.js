import React from 'react';
import portfolioMessages from '../../messages/portfolio.messages';

export const bold = (chunks) => <b>{chunks}</b>;

const sharePorfolioMessage = ({
  shareData,
  initialGroups,
  removedGroups,
  newGroups,
  formatMessage,
  portfolioName
}) => {
  let title = formatMessage(portfolioMessages.shareSuccessTitle);
  let description;

  const changedPermissions = shareData.filter(({ permissions, group_uuid }) => {
    const originalGroup = initialGroups.find(
      (group) => group.group_uuid === group_uuid
    );

    return (
      originalGroup &&
      permissions?.split(',').length !==
        originalGroup.permissions?.split(',').length
    );
  });
  const unshared =
    removedGroups.filter(
      ({ group_uuid }) =>
        initialGroups.find((group) => group.group_uuid === group_uuid) &&
        group_uuid !== changedPermissions[0]?.group_uuid
    ).length === 1;
  const shared =
    newGroups.filter(
      ({ group_uuid }) =>
        !initialGroups.find((group) => group.group_uuid === group_uuid) &&
        group_uuid !== changedPermissions[0]?.group_uuid
    ).length === 1;

  if (unshared && !shared && changedPermissions.length === 0) {
    title = formatMessage(portfolioMessages.shareSuccessTitleOnlyUnsharing);
    description = formatMessage(
      portfolioMessages.shareSuccessDescriptionOnlyUnsharing,
      {
        name: portfolioName(),
        group: removedGroups[0].groupName,
        b: bold
      }
    );
  }

  if (!unshared && shared && changedPermissions.length === 0) {
    title = formatMessage(portfolioMessages.shareSuccessTitleOnlySharing);
    description = formatMessage(
      portfolioMessages.shareSuccessDescriptionOnlySharing,
      {
        name: portfolioName(),
        group: newGroups[0].groupName,
        b: bold
      }
    );
  }

  if (!unshared && !shared && changedPermissions.length === 1) {
    title = formatMessage(
      portfolioMessages.shareSuccessTitleOnlyChaningPermissions
    );
    description = formatMessage(
      portfolioMessages.shareSuccessDescriptionOnlyChaningPermissions,
      {
        group: changedPermissions[0].groupName,
        b: bold
      }
    );
  }

  return { title, description };
};

export default sharePorfolioMessage;
