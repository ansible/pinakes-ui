import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const StyledLazyLoadImage = styled(LazyLoadImage)`
  height: ${({ height, hidden }) => (hidden ? '0px' : `${height}px` || '40px')};
  display: ${({ hidden }) => (hidden ? 'none' : 'inherit')};
  float: ${({ hidden }) => (hidden ? 'left' : 'inherit')};
  width: ${({ hidden }) => (hidden ? 0 : 'inherit')};
`;

export default StyledLazyLoadImage;
