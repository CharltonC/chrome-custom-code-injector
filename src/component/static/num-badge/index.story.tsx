import { inclStaticNumBadge } from '.';

export default {
    title: 'Static Number Badge'
};

export const NoNumber = () => inclStaticNumBadge();
export const LessThan0 = () => inclStaticNumBadge(-1);
export const LargerThan9 = () => inclStaticNumBadge(11);
export const GreaterThan0AndLessThanEqualTo9 = () => inclStaticNumBadge(6);