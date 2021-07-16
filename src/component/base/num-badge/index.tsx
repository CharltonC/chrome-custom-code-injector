import React, { memo } from "react";
import { IProps } from './type';

export const NumBadge: React.FC<IProps> = memo(({ total }) => {
    const isGt9 = total > 9;
    const isLt0 = total < 0;
    const badgeText = isGt9 ? '9+' : (isLt0 ? '0' : `${total}`);

    return (
        <span className="badge">{badgeText}</span>
    );
});

NumBadge.defaultProps = {
    total: 0
};