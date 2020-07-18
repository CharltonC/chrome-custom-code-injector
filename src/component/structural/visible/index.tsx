import React, { Component, memo, cloneElement, ReactElement } from 'react';
import { IProps, IState } from './type';

export class _VisibleWrapper extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const { isDefVisible } = props;
        this.state = {
            isVisible: typeof isDefVisible !== 'undefined' ? isDefVisible : true
        };
    }

    render() {
        const { isVisible } = this.state;
        const { children } = this.props;
        const styleProps = isVisible ? {} : { style: {display: 'none'}};
        const visibleProps = {
            isVisible,
            onVisibleChange: this.onExpdChange.bind(this)
        };
        return React.Children.map(children, ((child: ReactElement) => cloneElement(child, {...styleProps, visibleProps})));
    }

    onExpdChange(): void {
        const isVisible: boolean = !this.state.isVisible;
        this.setState({isVisible});
    }
}

export const VisibleWrapper = memo(_VisibleWrapper);