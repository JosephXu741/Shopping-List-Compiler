import React from 'react'

function ModifyCard(props) {
    const {list, refprop, handleChange, handleClick} = props
    return (
            <div> 
                <div ref={refprop} onChange={handleChange} contentEditable={true} >
                    {list.map(item => 
                            item !== "" ? <li>{item}</li> : null
                        )}
                </div> 
                <button onClick={handleClick}>Submit!</button>
            </div>
    )
}

export default ModifyCard
