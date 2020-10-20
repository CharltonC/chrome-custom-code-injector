import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState} from './type';

const dnArrowElem: ReactElement = inclStaticIcon('arrow-dn');

export class Dropdown extends MemoComponent<IProps, IState> {
    static DefaultProps: Partial<IProps> = {
        clsSuffix: ''
    };

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
        const { id, label, list, listTxtTransform, border, selectIdx, onSelect, clsSuffix, ...props } = this.props;
        const { hsList, hsSelectIdx } = this.state;
        const className: string = this.getClsName(clsSuffix, border);
        const selectProps = hsSelectIdx ? { ...props, value: selectIdx } : props;

        return hsList && (
            <div className={className}>
                { label && <label htmlFor={id}>{label}</label> }
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
        const selectValueAttrVal: string = evt.target.value;
        this.props.onSelect?.(evt, selectValueAttrVal);
    }

    getClsName(clsSuffix: string = '', border: boolean): string {
        return this.cssCls('dropdown', clsSuffix + ` ${border ? 'border' : 'plain'}`);
    }
}