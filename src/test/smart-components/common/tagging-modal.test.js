import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import TaggingModal from '../../../smart-components/common/tagging-modal';
import { Modal } from '@patternfly/react-core';

describe('<TaggingModal />', () => {
  let initialProps = {};
  beforeEach(() => {
    initialProps = {
      loadTags: jest.fn().mockResolvedValue([]),
      getInitialTags: jest.fn().mockResolvedValue([]),
      onSubmit: jest.fn().mockResolvedValue([]),
      title: 'title',
      subTitle: 'sub title',
      onClose: jest.fn(),
      existingTagsMessage: 'exist'
    };
  });

  it('should mount and fetch initialData and load select options', async () => {
    jest.useFakeTimers();
    const loadTags = jest.fn().mockResolvedValue([]);
    const getInitialTags = jest.fn().mockResolvedValue([]);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <TaggingModal
          {...initialProps}
          getInitialTags={getInitialTags}
          loadTags={loadTags}
        />
      );
    });

    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });
    expect(loadTags).toHaveBeenCalledTimes(1);
    expect(getInitialTags).toHaveBeenCalledTimes(1);
  });

  it('should correctly set title and sub title', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(<TaggingModal {...initialProps} />);
    });
    wrapper.update();
    expect(wrapper.find(Modal).prop('title')).toEqual('title');
    expect(wrapper.find('p#sub-title').text()).toEqual('sub title');
  });

  it('should only send tags to link on submit', async () => {
    jest.useFakeTimers();
    let wrapper;
    const onSubmit = jest.fn();
    const loadTags = jest.fn().mockResolvedValue([
      {
        label: 'tag-one',
        value: 'tag-to-link'
      }
    ]);
    await act(async () => {
      wrapper = mount(
        <TaggingModal
          {...initialProps}
          loadTags={loadTags}
          onSubmit={onSubmit}
        />
      );
    });

    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });

    await act(async () => {
      wrapper
        .find('.pf-c-select__toggle')
        .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('button.pf-c-select__menu-item')
        .last()
        .simulate('click');
    });

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith(['tag-to-link'], []);
  });

  it('should only send tags to unlink on submit', async () => {
    jest.useFakeTimers();
    let wrapper;
    const onSubmit = jest.fn();
    const getInitialTags = jest.fn().mockResolvedValue([
      {
        id: 'tag-to-unlink',
        name: 'tag to unlink'
      }
    ]);
    await act(async () => {
      wrapper = mount(
        <TaggingModal
          {...initialProps}
          getInitialTags={getInitialTags}
          onSubmit={onSubmit}
        />
      );
    });

    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });

    await act(async () => {
      wrapper
        .find('.pf-c-chip')
        .last()
        .find('button')
        .simulate('click');
    });

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith([], ['tag-to-unlink']);
  });

  it('should only send tags to link and unlink on submit', async () => {
    jest.useFakeTimers();
    let wrapper;
    const onSubmit = jest.fn();
    const loadTags = jest.fn().mockResolvedValue([
      {
        label: 'tag-one',
        value: 'tag-one'
      },
      {
        label: 'tag-two',
        value: 'tag-to-link'
      }
    ]);
    const getInitialTags = jest.fn().mockResolvedValue([
      {
        id: 'tag-to-unlink',
        name: 'tag to unlink'
      }
    ]);
    await act(async () => {
      wrapper = mount(
        <TaggingModal
          {...initialProps}
          getInitialTags={getInitialTags}
          loadTags={loadTags}
          onSubmit={onSubmit}
        />
      );
    });

    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });

    await act(async () => {
      wrapper
        .find('.pf-c-chip')
        .last()
        .find('button')
        .simulate('click');
    });

    jest.runAllTimers();
    await act(async () => {
      wrapper.update();
    });

    await act(async () => {
      wrapper
        .find('.pf-c-select__toggle')
        .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('button.pf-c-select__menu-item')
        .last()
        .simulate('click');
    });

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith(['tag-to-link'], ['tag-to-unlink']);
  });
});
