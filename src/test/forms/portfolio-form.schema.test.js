import { createPortfolioSchema } from '../../forms/portfolio-form.schema';

describe('createPortfolioSchema', () => {
  it('should create new portfolio form schema variant', () => {
    const schema = createPortfolioSchema(true);
    expect(schema).toMatchSnapshot();
  });

  it('should create edit portfolio form schema variant', () => {
    const schema = createPortfolioSchema(false);
    expect(schema).toMatchSnapshot();
  });
});
