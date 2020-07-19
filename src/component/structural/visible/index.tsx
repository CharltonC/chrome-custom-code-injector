import { Component, memo, cloneElement, Children, ReactElement } from 'react';
import { IProps, IState, IChildExtraProps } from './type';

export class _VisibleWrapper extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = this.createState(props);
    }

    render() {
        const extraProps: IChildExtraProps = this.getChildProps(this.state);
        return Children.map(
            this.props.children,
            (child: ReactElement) => cloneElement(child, extraProps)
        );
    }

    createState({ show, toggle }: IProps): IState {
        return {
            isVisible: typeof show !== 'undefined' ? show : true,
            toggle: typeof toggle !== 'undefined' ? toggle : false
        };
    }

    getChildProps({ isVisible, toggle }: IState): IChildExtraProps {
        const styleProps = isVisible ? {} : { style: { display: 'none' } };
        return toggle ?
            {
                ...styleProps,
                toggleProps: {
                    isVisible,
                    // TODO: +Note `() => this.setState(..)` instead of `this.onSOmething.bind(this)`
                    onVisibleChange: () => this.setState({isVisible: !isVisible})
                } as any
            } :
            { ...styleProps };
    }

    hasDiffProps(modProps: IProps, state: IState): [boolean, boolean] {
        const { show: isVisible, toggle } = modProps;
        const { isVisible: currIsVisible, toggle: currToggle } = state;
        return [
            typeof isVisible !== 'undefined' && isVisible !== currIsVisible,
            typeof toggle !== 'undefined' && toggle !== currToggle
        ];
    }
}

export const VisibleWrapper = memo(_VisibleWrapper);