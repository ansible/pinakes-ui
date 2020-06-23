import {
  createPortfolioSchema,
  validateName
} from '../../forms/portfolio-form.schema';
// import { fetchPortfolioByName } from '../../helpers/portfolio/portfolio-helper';
jest.mock('../../helpers/portfolio/portfolio-helper');

describe('createPortfolioSchema', () => {
  it('should create new portfolio form schema variant', () => {
    const schema = createPortfolioSchema(true);
    expect(schema).toMatchSnapshot();
  });

  it('should create edit portfolio form schema variant', () => {
    const schema = createPortfolioSchema(false);
    expect(schema).toMatchSnapshot();
  });

  it('should pass unique name validation', () => {
    return validateName('unique', '123').then((response) => {
      expect(response).toBeUndefined();
    });
  });

  it('should not pass unique name validation', () => {
    return validateName('should-conflict', '123').catch((data) => {
      expect(data).toEqual('Name has already been taken');
    });
  });

  it('should not pass unique name validation if no name is passed', () => {
    return validateName('', '123').catch((data) => {
      expect(data).toEqual('Required');
    });
  });

  it('should pass unique name validation if the portfolio conflicts with itself', () => {
    return validateName('should-conflict', 'conflict-id').catch((data) => {
      expect(data).toBeUndefined();
    });
  });
});
