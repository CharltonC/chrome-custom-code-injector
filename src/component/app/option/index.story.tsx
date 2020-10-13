import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

import { OptionApp } from '.';

export default {
    title: 'App - Option',
    component: OptionApp,
};

const defStyle = {};

export const Default = () => {
    return (
        /* `Router` wrapper needs to be root lvl */
        <Router>
            <Link to="/edit" replace>edit</Link>
            <Link to="/" replace>home</Link>
            <OptionApp />
        </Router>
    )
};