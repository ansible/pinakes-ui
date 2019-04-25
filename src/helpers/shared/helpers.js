import moment from 'moment';

export const scrollToTop = () => document.getElementById('root').scrollTo({
  behavior: 'smooth',
  top: 0,
  left: 0
});

export const filterServiceOffering = ({ display_name, name }, filter) => {
  const filterAtrribute = display_name || name;
  return filterAtrribute.trim().toLowerCase().includes(filter.toLowerCase());
};

export const allowNull = wrappedPropTypes => (props, propName, ...rest) => {
  if (props[propName] === null) {
    return null;
  }

  return wrappedPropTypes(props, propName, ...rest);
};

const oneDay = 24 * 60 * 60 * 1000;
export const calcuateDiffDays = (firstDate, secondDate) => Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

export const createModifiedLabel = (date, user) => `Last modified ${calcuateDiffDays(new Date(), date)} days ago${ user ? ` by ${user}.` : '.'  }`;

export const createOrderedLabel = date => {
  const orderedAgo = calcuateDiffDays(date, new Date());
  return `Ordered ${orderedAgo} ${orderedAgo > 1 ? 'days' : 'day'} ago`;
};

export const createUpdatedLabel = orderItem => {
  if (!orderItem[0]) {
    return null;
  };

  const orderedAgo = calcuateDiffDays(new Date(orderItem[0].updated_at), new Date());
  return `Updated ${orderedAgo} ${orderedAgo > 1 ? 'days' : 'day'} ago`;
};

export const createDateString = date => moment(new Date(date).toUTCString(), 'DD-MMM-YYYY, HH:mm').format('DD MMM YYYY, HH:mm UTC');
