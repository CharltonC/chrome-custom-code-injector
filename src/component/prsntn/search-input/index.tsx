import React, { memo, ReactElement, Component } from 'react';

import { staticIconElem } from '../../static/icon';
import * as NSearch from './type';

export class _SearchInput extends Component<NSearch.IProps, NSearch.State> {
    private inputElem: HTMLInputElement;
    private hsExtState: boolean;

    constructor(props: NSearch.IProps) {
        super(props);

        // internal state only
        const { text } = this.props;
        this.hsExtState = typeof text !== 'undefined';
        this.state = { hsText: this.hsExtState ? !!text : false };

        // handlers
        this.onInputChange = this.onInputChange.bind(this);
        this.onBtnClick = this.onBtnClick.bind(this);
    }

    onInputChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        // handle two way binding internally
        const text: string = evt.target.value;
        const lt3Char: boolean = text.length >= 2;
        this.setState({hsText: !!text});

        // run any external callback (incl. sync external state if needed)
        const { onChange } = this.props;
        if (onChange) onChange(evt, text, lt3Char);
    }

    onBtnClick(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        // handle two way binding internally
        this.inputElem.value = '';
        this.setState({hsText: false});
        this.inputElem.focus();

        // run any external callback (incl. sync external state if needed)
        const { onClear } = this.props;
        if (onClear) onClear(evt);
    }

    render() {
        const {id, text, disabled, onClear, onChange, ...props} = this.props;

        // State
        const inputProps = this.hsExtState ? {...props, value: text} : {...props};

        // Label / Input + Button
        const labelCls: string = 'search' + (disabled ? ' search--disabled' : '');
        const isDisabled: boolean = typeof disabled === 'undefined' ? false : disabled;

        // Icon
        const clearIcon: ReactElement = staticIconElem('close');
        const searchIcon: ReactElement = staticIconElem('search');

        return (
            <label className={labelCls} htmlFor={id}>
                <input
                    id={id}
                    className="search__input"
                    type="text"
                    placeholder="Search"
                    ref={elem => this.inputElem = elem}
                    disabled={isDisabled}
                    onChange={this.onInputChange}
                    {...inputProps}
                    >
                </input>
                {
                    this.state.hsText ?
                    <button
                        className="search__clear"
                        type="button"
                        title="clear the search"
                        disabled={isDisabled}
                        onClick={this.onBtnClick}
                        >
                        {clearIcon}
                    </button> :
                    searchIcon
                }
            </label>
        );
    }
}

export const SearchInput = memo(_SearchInput);