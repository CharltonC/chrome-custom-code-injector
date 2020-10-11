import React from 'react';
import ShallowRenderer  from 'react-test-renderer/shallow';
import { SliderSwitch } from './';

describe('Component - Slider Switch', () => {
    const shallow = new ShallowRenderer();

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Render/DOM', () => {
        const MOCK_ID = 'id';
        const MOCK_LABEL = 'label';

        it('should render', () => {
            shallow.render(<SliderSwitch id={MOCK_ID} label={MOCK_LABEL} />);
            const [ childOne, childTwo ] = shallow.getRenderOutput().props.children;
            expect(childOne.props.id).toBe(MOCK_ID);
            expect(childTwo.type).toBe('span');
        });
    });
});

