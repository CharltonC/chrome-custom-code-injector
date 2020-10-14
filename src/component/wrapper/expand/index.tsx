import { cloneElement, Children, ReactElement } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { IProps, IState, IChildExtraProps } from './type';

export class ExpandWrapper extends MemoComponent<IProps, IState> {
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
            expandProps: {
                isOpen,
                onClick: () => {
                    this.setState({isOpen: !isOpen})
                    callback?.(!isOpen);
                }
            } as any
        };
    }
}