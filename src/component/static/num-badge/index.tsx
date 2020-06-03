import React, { ReactElement } from "react";

export function inclStaticNumBadge(total: number = 0): ReactElement {
    const isGt9: boolean = total > 9;
    const isLt0: boolean = total < 0;

    const badgeText: string = isGt9 ? '9+' : (isLt0 ? '0' : `${total}`);

    return (
        <span className="badge">{badgeText}</span>
    );
};