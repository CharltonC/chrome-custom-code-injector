import React from 'react';
import ShallowRenderer  from 'react-test-renderer/shallow';
import { SliderSwitch } from './';

describe('Component - TODO: Component Name', () => {
    const shallow = new ShallowRenderer();

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - onChange: On Checkbox status change', () => {
        let mockOnChange: jest.Mock;
        let cmp: SliderSwitch;

        beforeEach(() => {
            mockOnChange = jest.fn();
        });

        it('should not call if `onChange` callback is not provided', () => {
            cmp = new SliderSwitch({id: ''});
            cmp.onChange({} as any);
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        it('should call if `onChange` callback is provided', () => {
            const mockEvt: any = {};
            cmp = new SliderSwitch({id: '', onChange: mockOnChange});
            cmp.onChange(mockEvt);
            expect(mockOnChange).toHaveBeenCalledWith(mockEvt);
        });
    });

    describe('Render/DOM', () => {
        const MOCK_ID = 'id';
        const MOCK_LABEL = 'label';

        it('should render', () => {
            shallow.render(<SliderSwitch id={MOCK_ID} label={MOCK_LABEL} />);
            const childTwo = shallow.getRenderOutput().props.children[1];
            expect(childTwo.type).toBe('span');
        });
    });
});

