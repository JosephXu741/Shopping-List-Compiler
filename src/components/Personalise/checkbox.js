import { useState, useEffect } from "react"
import './personalise.css';

export function Checkbox(props) {


    //cannot do this VVVVVV --> cannot initialise state based
    //something that is could be undefined
    //const [checked, setChecked] = useState(isItChecked);
    
    const [checked, setChecked] = useState(false);

    //solves persistence
    useEffect(()=> {
        try {
            // is the ingredient checked?
            let changedData = JSON.parse(localStorage.getItem("ingredients"));
            if(changedData !== undefined && props.ingredient !== undefined) {
                //console.log(changedData)
                //console.log(props.ingredient)
                //console.log(changedData[`{props.ingredient}`])
                const isItChecked = changedData[props.ingredient]["checked"];
                setChecked(isItChecked);
            }
        } catch (err) {
            console.log(err);
        }
    },[])
    


    const toggleCheck = (e) => {
        try {

            //setChecked(!checked);
            // change the checked data in localStorage
            let changedData = JSON.parse(localStorage.getItem("ingredients"));   //lol dont delete this line
            //this is a hack
            const ingredient = e.currentTarget.nextSibling.nextSibling.innerText
            changedData[ingredient].checked = !changedData[ingredient].checked;
            localStorage.setItem("ingredients",JSON.stringify(changedData));
            setChecked(!checked)
            
  
        } catch(err) {
            console.log(err);
        }
        
    }

    return (
        <div onClick={toggleCheck} className={checked?"checked-button":"unchecked-button"}></div>
    )
}