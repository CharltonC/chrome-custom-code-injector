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
            hsSelectIdx: Number.isInteger(selectIdx) && typeof list[selectIdx] !== 'undefined'
        };
    }

    onSelect(evt: React.ChangeEvent<HTMLSelectElement>): void {
        const { onSelect } = this.props;
        // this is the actual index of the list item or `<option>`
        const selectValueAttrVal: string = evt.target.value;
        if (onSelect) onSelect(evt, selectValueAttrVal);
    }

    render() {
        const { id, list, listTxtTransform, border, selectIdx, onSelect, ...props } = this.props;
        const { hsList, hsSelectIdx } = this.state;

        const baseCls: string = 'dropdown';
        const wrapperCls: string = border ? `${baseCls} ${baseCls}--border` : `${baseCls} ${baseCls}--plain`;
        const selecteProps = hsSelectIdx ? { ...props, value: selectIdx } : props;

        return hsList ?
            <div className={wrapperCls}>
                <select
                    {...selecteProps}
                    id={id}
                    onChange={this.onSelect}
                    >{ list.map((text: string | number, idx: number) =>
                        /* we use the list index as a generic value as we cant gurantee that the text is not empty or is diff. */
                        <option
                            key={`${id}-${idx}`}
                            value={idx}
                            >
                            {listTxtTransform ? listTxtTransform(text) : text}
                        </option>
                    )}
                </select>
                { dnArrowElem }
            </div> :
            null;
    }
}

export const Dropdown = memo(_Dropdown);