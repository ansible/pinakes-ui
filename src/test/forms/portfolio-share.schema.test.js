import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';

describe('create portfolio share schema', () => {
  const permissionVerbs = [
    {
      value: 'first-verb-value',
      label: 'First verb value'
    }
  ];

  const newSharePartial = [
    {
      component: 'sub-form',
      description: 'share.new.description',
      name: 'new_share',
      key: '1',
      fields: [
        {
          name: 'group-selection',
          component: 'share-group-select',
          loadOptions: expect.any(Function),
          isSearchable: true,
          permissions: permissionVerbs
        }
      ]
    }
  ];

  const existingSharePartial = [
    {
      component: 'sub-form',
      name: 'current-groups-sub-form',
      fields: [
        {
          name: 'shared-groups',
          permissionVerbs,
          component: 'share-group-edit'
        }
      ]
    }
  ];

  it('should create schema with both new shares and current shares', () => {
    const expectedSchema = {
      fields: [...newSharePartial, ...existingSharePartial]
    };
    const schema = createPortfolioShareSchema(
      () => {},
      permissionVerbs,
      true,
      true
    );
    expect(schema).toEqual(expectedSchema);
  });

  it('should create schema with only new shares', () => {
    const expectedSchema = {
      fields: [...newSharePartial]
    };
    const schema = createPortfolioShareSchema(
      () => {},
      permissionVerbs,
      true,
      false
    );
    expect(schema).toEqual(expectedSchema);
  });

  it('should create schema with only existing shares', () => {
    const expectedSchema = {
      fields: [...existingSharePartial]
    };
    const schema = createPortfolioShareSchema(
      () => {},
      permissionVerbs,
      false,
      true
    );
    expect(schema).toEqual(expectedSchema);
  });
});
