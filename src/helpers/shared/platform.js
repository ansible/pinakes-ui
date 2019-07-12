import OpenshiftPlatformIcon from '../../assets/images/platform-openshift.svg';
import AmazonPlatformIcon from '../../assets/images/platform-amazon.png';
import TowerPlatformIcon from '../../assets/images/platform-tower.png';

// TO DO - use webpack to load all images
const platformTypeIcon = {
  1: OpenshiftPlatformIcon,
  2: AmazonPlatformIcon,
  3: TowerPlatformIcon
};

export const defaultPlatformIcon = (platformId) => {
  const source = platforms.find(item => item.id == platformId);
  if (source) {
    return platformTypeIcon[source];
  }
}