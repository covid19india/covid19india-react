import React from 'react'

const Display=(props)=>{

    return (
        <div className="tracker_display">
            <h4 className="line anim-typewriter">{props.children}</h4>
        </div>
    )
}

export default Display