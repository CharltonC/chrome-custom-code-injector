import React from 'react';
import { IChildExtraProps } from './type';
import { ExpandWrapper } from '.';

export default {
    title: 'Visible Wrapper',
    component: ExpandWrapper,
};


export const WithoutControl = () => {
    return (
        <ExpandWrapper>
            <h1>lorem sum</h1>
        </ExpandWrapper>
    );
};

export const WithControl = () => {
    const btnStyle = {
        background: 'lightgray',
        padding: 10
    };

    const InnerComponent = ({ toggleProps }: IChildExtraProps) => {
        const { isOpen, onToggle } = toggleProps;
        return (
            <div>
                <button
                    type="button"
                    style={btnStyle}
                    onClick={onToggle}
                    >
                    {isOpen ? 'hide' : 'show'}
                </button>
                { isOpen && <h1>lorem sum</h1> }
            </div>
        );
    };

    return (
        <ExpandWrapper>
            <InnerComponent />
        </ExpandWrapper>
    );
};