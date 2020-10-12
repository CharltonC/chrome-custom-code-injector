import { InclStaticNumBadge } from '.';

export default {
    title: 'Static Number Badge'
};

export const NoNumber = () => InclStaticNumBadge();
export const LessThan0 = () => InclStaticNumBadge(-1);
export const LargerThan9 = () => InclStaticNumBadge(11);
export const GreaterThan0AndLessThanEqualTo9 = () => InclStaticNumBadge(6);