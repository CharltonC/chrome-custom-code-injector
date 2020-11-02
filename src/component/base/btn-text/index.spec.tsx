import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { TextBtn } from '.';

describe('Component - Text Button', () => {
    const mockBtnTxt = 'abc';

    it('should render button with default fill mode', () => {
        const { className } = TestUtil.renderShallow(<TextBtn text={mockBtnTxt} />).props;
        expect(className).toContain('--fill');
    });

    it('should render button with outline mode', () => {
        const { className } = TestUtil.renderShallow(<TextBtn text={mockBtnTxt} outline />).props;
        expect(className).toContain('--outline');
    });

    it('should pass rest of the props to button element', () => {
        const mockTitle = 'loremsum';
        const { children, title } = TestUtil.renderShallow(<TextBtn text={mockBtnTxt} title={mockTitle} />).props;
        expect(children).toBe(mockBtnTxt);
        expect(title).toBe(mockTitle);
    });
});

