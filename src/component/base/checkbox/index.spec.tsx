import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { Checkbox } from './';

describe('Component - Checkbox', () => {
    const MOCK_ID = 'id';
    const MOCK_LABEL = 'label';

    function getChildElem(props) {
        return TestUtil.renderShallow(<Checkbox {...props} />).props.children;
    }

    it('should render without label', () => {
        const [ $ltLabel, $input, $rtLabel ] = getChildElem({ id: MOCK_ID });
        expect($input.props.id).toBe(MOCK_ID);
        expect($input.props.name).toBe(MOCK_ID);
        expect($ltLabel).toBeFalsy();
        expect($rtLabel).toBeFalsy();
    });

    it('should render with left positioned label', () => {
        const [ $ltLabel, , $rtLabel ] = getChildElem({ id: MOCK_ID, label: MOCK_LABEL });
        expect($ltLabel.type).toBe('label');
        expect($ltLabel.props.children).toBe(MOCK_LABEL);
        expect($ltLabel.props.htmlFor).toBe(MOCK_ID);
        expect($rtLabel).toBeFalsy();
    });

    it('should render with right positioned label', () => {
        const [ $ltLabel, , $rtLabel ] = getChildElem({ id: MOCK_ID, label: MOCK_LABEL, rtLabel: true });
        expect($ltLabel).toBeFalsy();
        expect($rtLabel.type).toBe('label');
        expect($rtLabel.props.children).toBe(MOCK_LABEL);
        expect($rtLabel.props.htmlFor).toBe(MOCK_ID);
    });
});

