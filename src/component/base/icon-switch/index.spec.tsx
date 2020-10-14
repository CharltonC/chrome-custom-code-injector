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
        const MOCK_ICON = 'add';

        it('should render', () => {
            shallow.render(<IconSwitch
                id={MOCK_ID}
                icon={MOCK_ICON}
                disabled
                />);
            const { props: wrapperProps } = shallow.getRenderOutput();
            const [ childOne, childTwo ] = wrapperProps.children;

            expect(wrapperProps.htmlFor).toBe(MOCK_ID);
            expect(childOne.props.id).toBe(MOCK_ID);
            expect(childOne.props.disabled).toBe(true);
            expect(childTwo.props.className).toContain(MOCK_ICON);
        });
    });
});

