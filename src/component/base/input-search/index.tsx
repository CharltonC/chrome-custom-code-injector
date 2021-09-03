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
        const { value } = evt.target;
        const isGte3Char = value.length >= 3;
        this.props.onInputChange?.({ evt, value, isGte3Char });
    }

    onClick(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this.$input.value = '';
        this.$input.focus();
        this.props.onInputClear?.({ evt });
    }

    render() {
        const { id, defaultValue, disabled, onInputChange, onInputClear, ...props } = this.props;
        const ROOT_CLS = 'search' + (disabled ? ' search--disabled' : '');

        return (
            <label className={ROOT_CLS} htmlFor={id}>
                <input
                    id={id}
                    className="search__input"
                    type="text"
                    placeholder="Search"
                    disabled={disabled}
                    ref={e => this.$input = e}
                    onChange={this.onChange}
                    defaultValue={defaultValue || ''}
                    {...props}
                    >
                </input>
                {
                    defaultValue ?
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