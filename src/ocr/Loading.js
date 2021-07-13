import React from 'react'

function Loading(props) {
    const {progress} = props
    return (
        <div>
            {progress}
        </div>
    )
}

export default Loading
