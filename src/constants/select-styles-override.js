const style = {
  container: provided => ({
    ...provided,
    '&:focus': {
      outline: 'none'
    }
  }),
  control: (provided, { isFocused }) => ({
    ...provided,
    borderRadius: 0,
    borderColor: '#EDEDED',
    backgroundColor: '#FFFFFF',
    borderBottomColor: isFocused ? '#007bba' : '#282d33',
    cursor: 'pointer',
    boxShadow: 'none',
    minHeight: 36,
    width: 256,
    '&:hover': {
      borderBottomColor: '#007bba'
    }
  }),
  indicatorSeparator: () => ({}),
  dropdownIndicator: provided => ({
    ...provided,
    color: '#282d33',
    paddingBottom: 6,
    paddingTop: 6
  }),
  menu: provided => ({
    ...provided,
    borderRadius: 'none',
    boxShadow:
      '0 0.0625rem 0.0625rem 0rem rgba(3,3,3,.05),0 0.25rem 0.5rem 0.25rem rgba(3,3,3,.06)',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    marginTop: 4,
    width: 'calc(100% - 4px)',
    marginRight: 2,
    marginLeft: 2
  }),
  option: (provided, { isFocused }) => ({
    ...provided,
    cursor: 'pointer',
    textAlign: 'left',
    color: '#282d33',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    backgroundColor: isFocused ? '#ededed' : 'transparent',
    '&:hover': {
      backgroundColor: '#ededed'
    }
  }),
  placeholder: provided => ({
    ...provided,
    left: 20
  }),
  singleValue: provided => ({
    ...provided,
    left: 20,
    maxWidth: 'calc(100% - 28px)'
  })
};

export default style;
