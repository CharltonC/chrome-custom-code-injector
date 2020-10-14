import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { SliderSwitch } from './';

describe('Component - Slider Switch', () => {
    const MOCK_ID = 'id';
    const MOCK_LABEL = 'label';

    it('should render without label', () => {
        const [ childOne, childTwo ] = TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} />).props.children;
        expect(childOne.props.id).toBe(MOCK_ID);
        expect(childTwo).toBeFalsy();
    });

    it('should render with label', () => {
        const { type } = TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} label={MOCK_LABEL} />).props.children[1];
        expect(type).toBe('span');
    });
});

