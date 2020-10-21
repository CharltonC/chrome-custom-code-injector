import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { SliderSwitch } from './';

describe('Component - Slider Switch', () => {
    const MOCK_ID = 'id';
    const MOCK_LABEL = 'label';

    it('should render without label if not provided', () => {
        const [ $checkbox, $label ] = TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} />).props.children;
        expect($checkbox.props.id).toBe(MOCK_ID);
        expect($label).toBeFalsy();
    });

    it('should render with label at left by default', () => {
        const { className, children } =  TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} label={MOCK_LABEL} />).props;
        expect(className).not.toContain('lt-label');
        expect(children[1]).toBeTruthy();
    });

    it('should render with label at right', () => {
        const { className, children } =  TestUtil.renderShallow(<SliderSwitch id={MOCK_ID} label={MOCK_LABEL} ltLabel/>).props;
        expect(className).toContain('lt-label');
        expect(children[1]).toBeTruthy();
    });
});

