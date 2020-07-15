import { createPortfolioShareSchema } from '../../forms/portfolio-share-form.schema';

describe('create portfolio share schema', () => {
  const shareInfo = [
    {
      group_name: 'existing-share'
    }
  ];

  const newSharePartial = [
    {
      component: 'sub-form',
      description: 'share.new.description',
      fields: [
        {
          component: 'share-group-select',
          inputName: 'group_uuid',
          isSearchable: true,
          loadOptions: expect.any(Function),
          name: 'group-selection',
          permissions: [
            {
              label: 'First verb value',
              value: 'first-verb-value'
            }
          ],
          selectName: 'permissions'
        }
      ],
      key: '1',
      name: 'new_share'
    }
  ];

  const existingSharePartial = [
    {
      component: 'sub-form',
      description: 'share.groups.access',
      fields: [
        {
          component: 'sub-form',
          fields: [
            {
              component: 'share-group-edit',
              isClearable: true,
              label: 'existing-share',
              name: 'existing-share',
              options: [
                {
                  label: 'First verb value',
                  value: 'first-verb-value'
                }
              ]
            }
          ],
          key: 'existing-share',
          name: 'existing-share'
        }
      ],
      key: 'share_list',
      name: 'share_list'
    }
  ];

  const permissionVerbs = [
    {
      value: 'first-verb-value',
      label: 'First verb value'
    }
  ];

  it('should create schema with both new shares and current shares', () => {
    const expectedSchema = {
      fields: [...newSharePartial, ...existingSharePartial]
    };
    const schema = createPortfolioShareSchema(
      shareInfo,
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
      shareInfo,
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
      shareInfo,
      () => {},
      permissionVerbs,
      false,
      true
    );
    expect(schema).toEqual(expectedSchema);
  });
});
