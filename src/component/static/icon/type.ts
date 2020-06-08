export enum EMode {
    light = 'light',
    dark = 'dark'
}

export type TName =
    'setting' |
    'valid' |
    'close' |
    'power' |
    'lock-close' |
    'lock-open' |
    'radio-on' |
    'radio-off' |
    'download' |
    'add-outline' |
    'add' |
    'checkbox-off' |
    'checkbox-on' |
    'arrow-up' |
    'arrow-dn' |
    'search' |
    'arrow-rt' |
    'arrow-lt' |
    'edit' |
    'delete' |
    'save' |
    'doc';

export interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
}