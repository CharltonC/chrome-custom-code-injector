import React from 'react';
import ShallowRenderer  from 'react-test-renderer/shallow';
import { TextBtn } from './';

describe('Component - Text Button', () => {
    const mockBtnTxt = 'abc';
    const shallow = new ShallowRenderer();

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render button with default fill mode', () => {
        shallow.render(<TextBtn text={mockBtnTxt} />);
        const { className } = shallow.getRenderOutput().props;

        expect(className).toContain('--fill');
    });

    it('should render button with outline mode', () => {
        shallow.render(<TextBtn text={mockBtnTxt} outline />);
        const { className } = shallow.getRenderOutput().props;

        expect(className).toContain('--outline');
    });

    it('should pass rest of the props to button element', () => {
        const mockTitle = 'loremsum';
        shallow.render(<TextBtn text={mockBtnTxt} title={mockTitle} />);
        const { children, title } = shallow.getRenderOutput().props;

        expect(children).toBe(mockBtnTxt);
        expect(title).toBe(mockTitle);
    });
});

