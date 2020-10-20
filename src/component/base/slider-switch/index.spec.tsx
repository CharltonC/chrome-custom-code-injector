import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { SliderSwitch } from './';

describe('Component - Slider Switch', () => {
    const MOCK_ID = 'id';
    const MOCK_LABEL = 'label';

    it('should render without label if not provided', () => {
        const [ $ltLabel, $checkbox, $rtLabel ] = TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} />).props.children;
        expect($checkbox.props.id).toBe(MOCK_ID);
        expect($ltLabel).toBeFalsy();
        expect($rtLabel).toBeFalsy();
    });

    it('should render with label at left by default', () => {
        const [ $ltLabel, , $rtLabel ] =  TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} label={MOCK_LABEL} />).props.children;
        expect($ltLabel.type).toBe('span');
        expect($rtLabel).toBeFalsy();
    });

    it('should render with label at right', () => {
        const [ $ltLabel, , $rtLabel ] =  TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} label={MOCK_LABEL} rtLabel />).props.children;
        expect($ltLabel).toBeFalsy();
        expect($rtLabel.type).toBe('span');
    });
});

