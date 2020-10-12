import React from 'react';
import ShallowRenderer  from 'react-test-renderer/shallow';
import { SymbolSwitch } from '.';

describe('Component - SymbolSwitch', () => {
    const shallow = new ShallowRenderer();

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Render/DOM', () => {
        const MOCK_ID = 'id';
        const MOCK_LABEL = 'label';

        it('should render', () => {
            shallow.render(<SymbolSwitch
                id={MOCK_ID}
                label={MOCK_LABEL}
                disabled
                />);
            const { props: wrapperProps } = shallow.getRenderOutput();
            const [ childOne, childTwo ] = wrapperProps.children;

            expect(wrapperProps.htmlFor).toBe(MOCK_ID);
            expect(childOne.props.id).toBe(MOCK_ID);
            expect(childOne.props.disabled).toBe(true);
            expect(childTwo.props.children).toBe(MOCK_LABEL);
        });
    });
});

