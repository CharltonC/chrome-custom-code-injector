import React from 'react';
import ShallowRenderer  from 'react-test-renderer/shallow';
import { IconSwitch } from '.';

describe('Component - Icon Switch', () => {
    const shallow = new ShallowRenderer();

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Render/DOM', () => {
        const MOCK_ID = 'id';
        const MOCK_LABEL = 'add';

        it('should render icon switch', () => {
            shallow.render(<IconSwitch
                id={MOCK_ID}
                label={MOCK_LABEL}
                icon
                disabled
                />);
            const { props: wrapperProps } = shallow.getRenderOutput();
            const [ childOne, childTwo ] = wrapperProps.children;

            expect(wrapperProps.htmlFor).toBe(MOCK_ID);
            expect(childOne.props.id).toBe(MOCK_ID);
            expect(childOne.props.disabled).toBe(true);
            expect(childTwo.props.className).toContain(MOCK_LABEL);
        });

        it('should render text switch', () => {
            shallow.render(<IconSwitch
                id={MOCK_ID}
                label={MOCK_LABEL}
                />);
            const { props: wrapperProps } = shallow.getRenderOutput();
            const { className } = wrapperProps.children[1].props;
            expect(className).toBe('icon-switch__label');
        });
    });
});

