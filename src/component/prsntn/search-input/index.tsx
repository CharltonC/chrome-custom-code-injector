import React, { memo, ReactElement, Component } from 'react';

import { inclStaticIcon } from '../../static/icon';
import { IProps, IState } from './type';

export class _SearchInput extends Component<IProps, IState> {
    inputElem: HTMLInputElement;

    constructor(props: IProps) {
        super(props);

        // internal state only
        const { text } = this.props;
        this.state = this.getIntState(text);

        // handlers
        this.onInputChange = this.onInputChange.bind(this);
        this.onBtnClick = this.onBtnClick.bind(this);
    }

    getIntState(text?: string): IState {
        const hsExtState: boolean = typeof text !== 'undefined';
        return {
            hsExtState,
            hsText: hsExtState ? !!text : false
        };
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
        const { hsExtState } = this.state;

        // State
        const inputProps = hsExtState ? {...props, value: text} : {...props};

        // Label / Input + Button
        const labelCls: string = 'search' + (disabled ? ' search--disabled' : '');
        const isDisabled: boolean = typeof disabled === 'undefined' ? false : disabled;

        // Icon
        const clearIcon: ReactElement = inclStaticIcon('close');
        const searchIcon: ReactElement = inclStaticIcon('search');

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