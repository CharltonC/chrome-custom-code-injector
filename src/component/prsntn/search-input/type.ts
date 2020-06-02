/**
 * Props (Read-only )
 *
 * @param id - input `id` and label element `for` attributes
 * @param text - input text (to be as state) passed from parent
 * @param disabled - disable the input and clear button in the search (`disabled` attribute)
 * @param onClear - event handler called when input is clear (for communication with parent component)
 * @param onChange - event handler called when input is changed (for communication with parent component)
 */
export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    text?: string;
    disabled?: boolean;
    onClear?: (...args: any[]) => void;
    onChange?: (...args: any[]) => void;
}

/**
 * State
 *
 * @param hsText - whether the input has value (i.e. non-empty)
 * - internal only to control show/hide of certain element (instead of relying on external state, i.e. `IProps.text`)
 * - not named `text` as not to conflict in case there is an external state
 */
export class IState {
    hsExtState: boolean;
    hsText: boolean = false;
}