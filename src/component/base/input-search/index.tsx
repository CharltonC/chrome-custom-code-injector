import React from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps } from './type';

const $clearIcon = inclStaticIcon('close');
const $searchIcon = inclStaticIcon('search');

export class SearchInput extends MemoComponent<IProps> {
    $input: HTMLInputElement;

    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        const text: string = evt.target.value;
        const gte3Char = text.length >= 3;
        this.props.onInputChange?.(evt, text, gte3Char);
    }

    onClick(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this.$input.value = '';
        this.$input.focus();
        this.props.onInputClear?.(evt);
    }

    render() {
        const { id, value, disabled, onInputChange, onInputClear, ...props } = this.props;
        const ROOT_CLS = 'search' + (disabled ? ' search--disabled' : '');

        return (
            <label className={ROOT_CLS} htmlFor={id}>
                <input
                    id={id}
                    className="search__input"
                    type="text"
                    placeholder="Search"
                    value={value}
                    disabled={disabled}
                    ref={e => this.$input = e}
                    onChange={this.onChange}
                    {...props}
                    >
                </input>
                {
                    value ?
                    <button
                        className="search__clear"
                        type="button"
                        title="clear the search"
                        disabled={disabled}
                        onClick={this.onClick}
                        >
                        {$clearIcon}
                    </button> :
                    $searchIcon
                }
            </label>
        );
    }
}