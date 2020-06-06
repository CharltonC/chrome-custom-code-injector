import React, { Component, memo, ReactElement } from "react";
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState} from './type';

const dnArrowElem: ReactElement = inclStaticIcon('arrow-dn');

export class _Dropdown extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const { list, selectIdx } = props;
        this.state = {
            hsList: !!list.length,
            hsSelectIdx: typeof selectIdx !== 'undefined' && !!list[selectIdx]
        };

        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(evt: React.ChangeEvent<HTMLSelectElement>): void {
        const { onSelect } = this.props;
        const selectIdx: number = parseInt(evt.target.value);
        if (onSelect) onSelect(evt, selectIdx);
    }

    render() {
        const { id, list, border, selectIdx, disabled } = this.props;
        const { hsSelectIdx } = this.state;

        const baseCls: string = 'dropdown';
        const wrapperCls: string = border ? `${baseCls} ${baseCls}--border` : `${baseCls} ${baseCls}--plain`;

        const selectedOptionVal: number = hsSelectIdx ? selectIdx : 0;

        return (
            <div className={wrapperCls}>
                <select id={id} value={selectedOptionVal} disabled={disabled} onChange={this.onSelect}>
                    {
                        list.map((text: string, idx: number) =>
                            <option value={idx}>{text}</option>
                        )
                    }
                </select>
                { dnArrowElem }
            </div>
        );
    }
}

export const Dropdown = memo(_Dropdown);