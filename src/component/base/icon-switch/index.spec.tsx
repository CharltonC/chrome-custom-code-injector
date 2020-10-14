import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { IconSwitch } from '.';

describe('Component - Icon Switch', () => {
    const MOCK_ID = 'id';
    const MOCK_LABEL = 'add';

    it('should render icon switch', () => {
        const { props: wrapperProps } = TestUtil.renderShallow(
            <IconSwitch
                id={MOCK_ID}
                label={MOCK_LABEL}
                icon
                disabled
                />);
        const [ childOne, childTwo ] = wrapperProps.children;

        expect(wrapperProps.htmlFor).toBe(MOCK_ID);
        expect(childOne.props.id).toBe(MOCK_ID);
        expect(childOne.props.disabled).toBe(true);
        expect(childTwo.props.className).toContain(MOCK_LABEL);
    });

    it('should render text switch', () => {
        const { props: wrapperProps } = TestUtil.renderShallow(
            <IconSwitch
                id={MOCK_ID}
                label={MOCK_LABEL}
                />);
        const { className } = wrapperProps.children[1].props;
        expect(className).toBe('icon-switch__label');
    });
});

