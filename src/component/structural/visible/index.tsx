import { Component, memo, cloneElement, Children, ReactElement } from 'react';
import { IProps, IState, IChildVisibleProps } from './type';

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
        const styleProps = isVisible ? {} : { style: { display: 'none' } };
        const visibleProps: IChildVisibleProps = {
            isVisible,
            onVisibleChange: this.onVisibleChange.bind(this)
        };
        return Children.map(
            children,
            (child: ReactElement) => cloneElement(child, {...styleProps, visibleProps})
        );
    }

    onVisibleChange(): void {
        this.setState({isVisible: !this.state.isVisible});
    }
}

export const VisibleWrapper = memo(_VisibleWrapper);