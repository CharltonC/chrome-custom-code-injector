import React from 'react';
import { VisibleWrapper } from './';

export default {
    title: 'Visible Wrapper',
    component: VisibleWrapper,
};


export const WithoutControl = () => {
    return (
        <VisibleWrapper>
            <h1>lorem sum</h1>
        </VisibleWrapper>
    );
};

export const WithControl = () => {
    const btnStyle = {
        background: 'lightgray',
        padding: 10
    };

    const InnerComponent = ({ visibleProps }: any) => {
        const { isVisible, onVisibleChange } = visibleProps;
        return (
            <div>
                <button
                    type="button"
                    style={btnStyle}
                    onClick={onVisibleChange}
                    >
                    {isVisible ? 'hide' : 'show'}
                </button>
                { isVisible && <h1>lorem sum</h1> }
            </div>
        );
    };

    return (
        <VisibleWrapper>
            <InnerComponent />
        </VisibleWrapper>
    );
};