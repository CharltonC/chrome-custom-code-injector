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
        const { isOpen } = this.state;
        const { children, callback } = this.props;
        const extraProps: IChildExtraProps = this.getChildProps(isOpen, callback);
        return Children.map(children, (child: ReactElement) => cloneElement(child, extraProps));
    }

    getChildProps(isOpen: boolean, callback?: (...args: any[]) => any): IChildExtraProps {
        return {
            toggleProps: {
                isOpen,
                onToggle: () => {
                    this.setState({isOpen: !isOpen})
                    if (callback) callback(!isOpen);
                }
            } as any
        };
    }
}

export const ExpandWrapper = memo(_ExpandWrapper);