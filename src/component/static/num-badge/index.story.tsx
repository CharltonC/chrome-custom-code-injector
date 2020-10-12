import { NumBadge } from '.';

export default {
    title: 'Static Number Badge'
};

export const NoNumber = () => NumBadge();
export const LessThan0 = () => NumBadge(-1);
export const LargerThan9 = () => NumBadge(11);
export const GreaterThan0AndLessThanEqualTo9 = () => NumBadge(6);