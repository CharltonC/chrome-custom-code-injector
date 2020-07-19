import { Component, memo, cloneElement, Children, ReactElement } from 'react';
import { IProps, IState, IChildExtraProps } from './type';

export class _ExpandWrapper extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const { initial } = props;
        this.state = {
            isOpen: typeof initial !== 'undefined' ? initial : true
        };
    }

    render() {
        const { children } = this.props;
        const extraProps: IChildExtraProps = this.getChildProps(this.state.isOpen);
        return Children.map(children, (child: ReactElement) => cloneElement(child, extraProps));
    }

    getChildProps(isOpen: boolean): IChildExtraProps {
        return {
            toggleProps: {
                isOpen,
                // TODO: +Note `() => this.setState(..)` instead of `this.onSOmething.bind(this)`
                onToggle: () => this.setState({isOpen: !isOpen})
            } as any
        };
    }
}

export const ExpandWrapper = memo(_ExpandWrapper);