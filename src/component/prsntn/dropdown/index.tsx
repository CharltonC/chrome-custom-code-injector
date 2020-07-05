import React, { Component, memo, ReactElement } from "react";
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState} from './type';

const dnArrowElem: ReactElement = inclStaticIcon('arrow-dn');

export class _Dropdown extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = this.getInitialState(props);
        this.onSelect = this.onSelect.bind(this);
    }

    UNSAFE_componentWillReceiveProps({selectIdx}: IProps): void {
        const { list, selectIdx: oldSelectIdx } = this.props;
        const shallGetInitialState = typeof oldSelectIdx !== 'undefined' && selectIdx !== oldSelectIdx;

        // Deal with `selectIdx` changes
        if (shallGetInitialState) {
            const state: IState = this.getInitialState({list, selectIdx});
            this.setState(state);
        }
    }

    getInitialState({list, selectIdx}: Partial<IProps>): IState {
        return {
            hsList: !!list.length,
            hsSelectIdx: typeof selectIdx !== 'undefined' && !!list[selectIdx]
        };
    }

    onSelect(evt: React.ChangeEvent<HTMLSelectElement>): void {
        const { onSelect } = this.props;
        const selectIdx: number = parseInt(evt.target.value);
        if (onSelect) onSelect(evt, selectIdx);
    }

    render() {
        const { id, list, border, selectIdx } = this.props;
        const { hsList, hsSelectIdx } = this.state;

        const baseCls: string = 'dropdown';
        const wrapperCls: string = border ? `${baseCls} ${baseCls}--border` : `${baseCls} ${baseCls}--plain`;
        const selectValueProps = hsSelectIdx ? { value: selectIdx } : {};

        return hsList ?
            <div className={wrapperCls}>
                <select id={id}
                    {...selectValueProps}
                    onChange={this.onSelect}
                    >
                    { list.map((text: string | number, idx: number) =>
                        <option
                            key={`${id}-${idx}`}
                            value={idx}
                            >
                            {text}
                        </option>
                    )}
                </select>
                { dnArrowElem }
            </div> :
            null;
    }
}

export const Dropdown = memo(_Dropdown);