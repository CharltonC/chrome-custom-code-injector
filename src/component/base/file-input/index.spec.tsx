import React from 'react';
import { TestUtil } from '../../../asset/ts/test-util/';
import { FileInput, CLS_BASE } from './';
import { IProps } from './type';

describe('Component - TODO: Component Name', () => {
    const mockProps: IProps = {
        id: 'some-id',
        fileType: 'image/jpg',
        clsSuffix: 'some-class',
        title: 'some-title'
    };

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render', () => {
        const {
            id,
            className,
            accept,
            title
        } = TestUtil.renderShallow(<FileInput {...mockProps} />).props;

        expect(id).toBe(mockProps.id);
        expect(className).toBe(`${CLS_BASE} ${CLS_BASE}--${mockProps.clsSuffix}`);
        expect(accept).toBe(mockProps.fileType);
        expect(title).toBe(mockProps.title);
    });
});

