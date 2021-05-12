import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { Checkbox } from './';

describe('Component - Checkbox', () => {
    const MOCK_ID = 'id';
    const MOCK_LABEL = 'label';

    function getChildElem(props, rtnChildren: boolean = true) {
        const { props: wrapperProps } = TestUtil.renderShallow(<Checkbox {...props} />);
        return rtnChildren ? wrapperProps.children : wrapperProps;
    }

    it('should render without label', () => {
        const [ $input, $label ] = getChildElem({ id: MOCK_ID });
        expect($input.props.id).toBe(MOCK_ID);
        expect($input.props.name).toBe(MOCK_ID);
        expect($label).toBeFalsy();
    });

    it('should render with right positioned label by default', () => {
        const { className, children } = getChildElem({ id: MOCK_ID, label: MOCK_LABEL }, false);
        const [ , $label ] = children;
        expect(className).not.toContain('lt-label');
        expect($label.type).toBe('label');
        expect($label.props.children).toBe(MOCK_LABEL);
        expect($label.props.htmlFor).toBe(MOCK_ID);
    });

    it('should render with left positioned label', () => {
        const { className } = getChildElem({ id: MOCK_ID, label: MOCK_LABEL, ltLabel: true }, false);
        expect(className).toContain('lt-label');
    });
});

