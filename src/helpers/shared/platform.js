import { useSelector } from 'react-redux';
import OpenshiftIcon from '../../assets/images/openshift-icon.svg';
import AmazonIcon from '../../assets/images/amazon-icon.png';
import TowerIcon from '../../assets/images/tower-icon.svg';
import CardIconDefault from '../../assets/images/card-icon-default.svg';

// TO DO - use webpack to load all images
const platformTypeIcon = {
  1: OpenshiftIcon,
  2: AmazonIcon,
  3: TowerIcon
};

export const defaultPlatformIcon = (platformId) => {
  console.log('DEBUG - getting the default platform icon for platformID: ', platformId);
  const platformList = useSelector(state => state.platformReducer.platforms);
  console.log('DEBUG - platformList: ', platformList);
  if (!platformList || platformList.empty || !platformId) {
    return CardIconDefault;
  }

  const source = platformList.find(item => item.id === platformId);
  console.log('DEBUG - source: ', source);
  if (source) {
    return platformTypeIcon[source.source_type_id];
  }
};
