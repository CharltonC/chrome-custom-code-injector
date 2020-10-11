import React, { memo } from 'react';
import { IconBtn } from '../../base/icon-btn';
import { SearchInput } from '../../base/search-input';

// TODO: click handler and show/hide edit related buttons
export const NavHeader = memo(() => {
    return (
        <nav className="nav-header">
            {/* For Edit */}
            <IconBtn icon="arrow-lt" theme="white" />
            <IconBtn icon="save" theme="white" />
            <IconBtn icon="delete" theme="white" />
            <IconBtn icon="add" theme="white" />

            {/* For both Edit and List */}
            <SearchInput id="search" />
            <IconBtn icon="add-outline" theme="white" />
            <IconBtn icon="setting" theme="white" />
            <IconBtn icon="doc" theme="white" />
            <IconBtn icon="download" theme="white" />
            <IconBtn icon="download" theme="white" className="icon-btn icon-btn--upload" />
        </nav>
    );
});