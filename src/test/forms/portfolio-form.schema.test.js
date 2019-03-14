import { createPortfolioSchema } from '../../forms/portfolio-form.schema';

describe('createPortfolioSchema', () => {
  const workflows = [{
    label: 'foo',
    value: 'bar'
  }, {
    label: 'baz',
    value: 'quxx'
  }];

  it('should create new portfolio form schema variant', () => {
    const schema = createPortfolioSchema(true, workflows);
    expect(schema).toMatchSnapshot();
  });

  it('should create edit portfolio form schema variant', () => {
    const schema = createPortfolioSchema(false, workflows);
    expect(schema).toMatchSnapshot();
  });
});
