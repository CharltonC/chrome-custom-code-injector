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
    onInputClear?: (...args: any[]) => void;
    onInputChange?: (...args: any[]) => void;
}