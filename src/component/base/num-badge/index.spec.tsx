import React from "react";
import { TestUtil } from '../../../asset/ts/test-util';
import { NumBadge } from '.';

describe('Static Component: Number Badge', () => {
    const { renderShallow } = TestUtil;

    it('should have a default badge of `0` if no number is provided or if number is less than 0', () => {
        expect(renderShallow(<NumBadge />).props.children).toBe('0');
    });

    it('should have a badge of `9+` if number is greater than 9', () => {
        expect(renderShallow(<NumBadge total={11} />).props.children).toBe('9+');
    });

    it('should have a badge of same number if number is greater than 0 & less than and equal to 9', () => {
        expect(renderShallow(<NumBadge total={6} />).props.children).toEqual('6');
        expect(renderShallow(<NumBadge total={9} />).props.children).toBe('9');
    });
});

