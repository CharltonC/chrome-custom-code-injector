import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util';
import { SymbolSwitch } from '.';

describe('Component - Symbol Switch', () => {
    const MOCK_ID = 'id';
    const MOCK_LABEL = 'label';

    it('should render', () => {
        const { props: wrapperProps } = TestUtil.renderShallow(<SymbolSwitch
            id={MOCK_ID}
            label={MOCK_LABEL}
            disabled
            />);
        const [ childOne, childTwo ] = wrapperProps.children;

        expect(wrapperProps.htmlFor).toBe(MOCK_ID);
        expect(childOne.props.id).toBe(MOCK_ID);
        expect(childOne.props.disabled).toBe(true);
        expect(childTwo.props.children).toBe(MOCK_LABEL);
    });
});

