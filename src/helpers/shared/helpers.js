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

