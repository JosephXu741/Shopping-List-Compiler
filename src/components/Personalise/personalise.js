import './personalise.css';
import Tab from '../Tabs/Tab';
import '../Tabs/Tab.css';
import React, {useState} from 'react';
import { react } from '@babel/types';
// import { Checkbox } from './checkbox';



export function Personalise(props) {
    // {"flour": {"value": "1 cup", "checked": false},"sugar": {"value": "300g", "checked": true},"butter": {"value": "500g", "checked": false}}
    // {"websites": ["link1", "link2", "link3"]};
    const [items, setItems] = useState({});
    const [view, setView] = useState('myList');
    const [force, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [site, setSite] = useState([]);

    const handleSubmit = (prevState, newState) => {
        try {
            const {prevKey, prevValue}  = prevState
            const {newKey, newValue}  = newState
            // now change the state in localstorage

            let ingredients = JSON.parse(localStorage.getItem('ingredients'));
            if(prevKey !== newKey) {
                // initialise checked as false again
            
                ingredients[newKey] = {'value': newValue}
                delete ingredients[prevKey]
                localStorage.setItem('ingredients', JSON.stringify(ingredients))


                //console.log(newObject)
                setItems(ingredients)
                
                console.log(ingredients)
            }

        } catch(err) {
            console.log(err);
        }
    }

    const handleDelete = (prevState) => {
        // change the checked data in localStorage
        const {prevKey}  = prevState
        let changedData = JSON.parse(localStorage.getItem("ingredients"));   //lol dont delete this line
        
        delete changedData[prevKey];
        localStorage.setItem("ingredients",JSON.stringify(changedData));
        setItems(changedData)
        console.log(items.length)
        forceUpdate();
    }
    
    React.useEffect(()=> {

        try {
            let ingredients = JSON.parse(localStorage["ingredients"]);
            // console.log(ingredients)
            setItems(ingredients);
            // let websites = JSON.parse(localStorage["websites"]);
            // setSites(websites);


        } catch(err) {
            console.log('there is no ingredients')
        }

    },[])

    React.useEffect(()=> {
        let website = JSON.parse(localStorage.getItem("websites"));
        let current = site;
        console.log(current);
        Array.prototype.push.apply(current,website);

        // console.log(site);
        console.log(current);
        setSite(current);
        console.log(site);

    },[])
    return (
        <div className="margins">
        <Tab setView={setView}/>

        {(view === "myList") &&
            <div className="shopping-checklist-container">
                {Object.entries(items).map(([key,value])=>{
                    console.log(`key: ${key}`)
                    console.log(`value ${value}`)
                    return (
                        <Items keyy={key} 
                        value={value} 
                        checkBox={true} 
                        handleSubmit={handleSubmit} 
                        handleDelete={handleDelete}
                        forceUpdate={forceUpdate}
                        editButton={true}
                        deleteButton={true}
                        />
                    )
                })}       
            </div>

        }
        {(view === 'history') && 
            <div className="history-container">
                
                {site.map((value)=>{
                    if (value !== '') {
                    return (
                        <a href={value}>
                            <Items 
                            keyy={value}
                            value={{'value': ''}}
                            editButton={false}
                            deleteButton={false}
                            style={{
                                'color': 'black',
                                'word-wrap': 'break-word',
                        }}
                            >
                            </Items>
                        </a>
                    )}
                })}

            </div>
        }
        </div>

    )
}

/*
im just going to export this
*/
export function Items(props) {
    const [editable, setEditable] = React.useState(false);
    const itemRef = React.useRef();
    const valueRef = React.useRef();
    const keyRef = React.useRef();
    const [displayValue, setDisplayValue] = React.useState('');
    const prevKey = props.keyy;
    const prevValue = props.value.value;

    const toggleEdit = (e) => {
        if(editable) {
            const newValue = valueRef.current.value
            const newKey = keyRef.current.value

            const prevValue = valueRef.current.defaultValue
            const prevKey = keyRef.current.defaultValue

            props.handleSubmit({prevKey, prevValue},{newKey, newValue})

            //previous state is <input defaultvalue>

            /*
            console.log(value);
            props.handleSubmit(props.keyy, newValues);
            */
          
        }
        setEditable(!editable);
    }


    const clickDelete = (e) => {
        try{
            props.handleDelete({prevKey})   
        } catch(err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        if(props.keyy !== undefined && props.value !== undefined) {
            const display = props.value.value + ' ' + props.keyy
            console.log(display)
            setDisplayValue(display)
        }
    },[props])


    return (

        <div className="checklist-item-container" style={props.style} checkBox={props.checkBox}
            contentEditable={props.contentEditable}
            ref={itemRef}
            >
            {/*(props.checkBox) && <Checkbox ingredient = {props.keyy}/>*/}
            {editable && 
                <>
                <input ref={valueRef} defaultValue={props.value.value} style={{'width': '30%'}}/>
                <input ref={keyRef} defaultValue={props.keyy} style={{'width':'40%'}}/>                
                </>
            }
            {!editable && 
                <div>
                    {displayValue}
                </div>
                
            }
            {props.editButton &&
                <div className="edit-button" onClick={toggleEdit}>
                    <img src="edit.svg"/>
                </div>
            }
            
            {props.deleteButton && <div className="delete-button" ingredient={props.keyy} onClick={clickDelete}><img src="delete.svg"/></div>}
        </div>

    )

}

