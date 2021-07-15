import './popup.css'
import React from 'react'
import { Items } from '../Personalise/personalise';
import {addRecipeToBasket, removeFromBasket, toUnits} from "../Utils/unit_converter"

export function Popup(props) {

    // {"flour": {"value": "1 cup", "checked": false},"sugar": {"value": "300g", "checked": true},"butter": {"value": "500g", "checked": false}}
    const [inputIngredients, setInputIngredients] = React.useState({});
    const url = props.url;
    const img = props.img;
    const basket = props.basket
    const setBasket = props.setBasket
    // const ingredients = props.ingredients

    const popRef = React.useRef();

    React.useEffect(()=> {
        window.addEventListener('click', handleClick);

        return (()=> {
            window.removeEventListener('click', handleClick);
        })            

    },[])

    // fetch data and set
    React.useEffect(()=> {
        if(! props.ingredients) {
            // fetch data from backend and set data as inputIngredient state
            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data =>  {
                // console.log(data)
                setInputIngredients(data);
            })
        } else {
            //setInputIngredients(props.ingredients)
            const removedIngredients = parseResults(props.ingredients)

            // change list to dictionary
 
            let ing = new Object();
            props.ingredients.map((e)=> {
                //console.log(e);
                ing[e] = {'value':''};
            })
            //console.log(ing)
            setInputIngredients(ing)
        }

 
    },[]);

    const parseResults = (list) => {
        list.forEach((item, index) => {
            if(item === "") {
                list.splice(index, 1)
            }
        })
        return list;
    }




    const handleClick = async (e) => {
        try {
            const popup = popRef.current;
            
            if(e.target.id === 'submit') {
                // handle submit
                // call post function to backend

                // call post function then await response 
                // from the backend and update local storage
                
                if(props.ingredients) {
                    //post to backend
                    const response = await fetch('http://127.0.0.1:5000/tesseract', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"ingredients": props.ingredients})
                    })
                    const data = await response.json()
                    let eachRecipe = {
                        name: 'test recipe',
                        compIngredients: []
                        };
                    data.map( eachIngred => {
                        let converted = toUnits(eachIngred.replace('  ', ''));
                        eachRecipe.compIngredients.push(converted);
                    }
                    )
                    let new_basket = basket
                    addRecipeToBasket(new_basket, eachRecipe, 1);
                    setBasket(new_basket)
                    console.log(data)

                    //call ocr done
                    props.OCRDone();

                }


                // close popup

                props.handlePopUp();
                return;
            }

            if(!(popup.contains(e.target))) {
                props.handlePopUp()
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }



    return (
        
            <div className="popup" ref={popRef}>
                <p>
                    <b>
                    here are the ingredients we found...   
                    </b>
                </p>
                {Object.entries(inputIngredients).map(([key,value])=>{
                    return (
                        <Items 
                            keyy={key} 
                            value={value} 
                            style={{'width': '80%',
                                     'margin': '1rem',
                                    }}
                            checkBox={false}
                            contentEditable={true}
                            editButton={false}
                            deleteButton={false}
                        />
                    )
                })} 
                <div className="bottom">
                    <div>
                        <input type="text" placeholder="1" style={{'width':'30px', 'margin':'4px'}}/>
                        <b>
                        servings
                        </b>
                    </div>
                    <button id="submit" onClick={handleClick}>
                        Add to shopping list
                    </button>
                </div>
            </div>
        

    )
}