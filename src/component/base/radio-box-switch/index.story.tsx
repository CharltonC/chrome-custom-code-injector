import React, { useState } from 'react';
import { BoxSwitch } from '.';

export default {
    title: 'Base/Form - Radio/Box Tab Switch',
    component: BoxSwitch,
};

const defStyle = {padding: '15px'};

export const Default = () => {
    const labels = [ 'css', 'js' ];
    const [ activeLabel, setActiveLabel ] = useState('js');
    const onChange = (evt) => {
        const { value } = evt.target;
        setActiveLabel(value);
    }

    return (
        <div style={defStyle} >
            <BoxSwitch
                name="demo-box-switch"
                labels={labels}
                activeLabel={activeLabel}
                onChange={onChange}
                />
        </div>
    )
};
