import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState} from './type';

const dnArrowElem: ReactElement = inclStaticIcon('arrow-dn');

export class Dropdown extends MemoComponent<IProps, IState> {
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

    render() {
        const { id, label, ltLabel, list, listTxtTransform, border, selectIdx, onSelect, clsSuffix, ...props } = this.props;
        const { hsList, hsSelectIdx } = this.state;
        const className: string = this.getClsName(clsSuffix, border, ltLabel);
        const selectProps = hsSelectIdx ? { ...props, value: selectIdx } : props;

        return hsList && (
            <div className={className}>
                <select
                    {...selectProps}
                    id={id}
                    onChange={this.onSelect}
                    >{ list.map((text: string | number, idx: number) =>
                    /* we use the list index as a generic value as we cant gurantee that the text is not empty or is diff. */
                    <option key={`${id}-${idx}`} value={idx}>
                        { listTxtTransform ? listTxtTransform(text) : text }
                    </option>
                    )}
                </select>
                { dnArrowElem }
                { label && <label htmlFor={id}>{label}</label> }
            </div>
        );
    }

    getInitialState({list, selectIdx}: Partial<IProps>): IState {
        return {
            hsList: !!list.length,
            hsSelectIdx: Number.isInteger(selectIdx) && typeof list[selectIdx] !== 'undefined'
        };
    }

    onSelect(evt: React.ChangeEvent<HTMLSelectElement>): void {
        // this is the actual index of the list item or `<option>`
        const selectValueAttrVal: number = Number(evt.target.value);
        this.props.onSelect?.(evt, selectValueAttrVal);
    }

    getClsName(clsSuffix: string = '', border: boolean, ltLabel: boolean = false): string {
        const suffix: string = clsSuffix
            + ` ${border ? 'border' : 'plain'}`
            + ` ${ltLabel ? 'lt-label' : ''}`;
        return this.cssCls('dropdown', suffix);
    }
}