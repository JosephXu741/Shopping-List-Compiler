import './searchBar.css';
import Tesseract from "tesseract.js"
import React, { useState, useRef, useEffect } from 'react';
import { Popup } from '../Popup/popup.js';
import {addRecipeToBasket, removeFromBasket, toUnits} from "../Utils/unit_converter"
export function SearchBar(props) {

    const [search, setSearch] = useState('');
    const [popUp, setPopUp] = React.useState(false);
    const [urls, setUrls] = React.useState([]);
    const [img, setImg] = React.useState();
    const [image, setImage] = useState(false);
    const ref = useRef(null);
    const [basket, setBasket] = useState(new Map())

    const [list, setList] = useState([])

    const popUpOpen = () => {
        setPopUp(true);
    }
    const popUpClose = () => {
        setPopUp(false);
    }

    
    const parseImage = async (image) => {

        return new Promise((resolve,reject)=> {
            Tesseract.recognize(
                image,
                'eng',
                {logger: m => {
                    if (m.status === "recognizing text") {
                        //setLoading(m.progress)
                    }
                }}
            ).then(({data: {text} }) => {
                const lines = text.split("\n")
                setList(lines)
                resolve({});
            })
        })



    }


    

    const OCRthenPopUp = () => {
        console.log(img)
        parseImage(img)
        .then(()=> {
 
            popUpOpen();
        })

    }

    const OCRDone = () => {
        setImage(false)
        setImg()
    }

    const handlePaste = (e) => {

        try {
            const item = e.clipboardData.items[0]
            const imagee = item.getAsFile()
            if(item !== null) {
                if(item.type !== 'text/plain') {
                    setImage(true);
                    let fr = new FileReader();
                    fr.onload = function() {
                        document.getElementById('imgPlaceHolder').src = fr.result;
                    }
                    fr.readAsDataURL(imagee)
                    //sets img
                    //console.log(imagee)
                    setImg(imagee)
                    //console.log(img)
                } else {
                    console.log(item)
                }

            }
        } catch (err) {
            console.log(err);
        }

    }

    const handleDrop = (e) => {
        e.preventDefault();
        try {
            const item = e.dataTransfer.items[0]
            const imagee = item.getAsFile()
            if(item !== null) {
                if(item.type !== 'text/plain') {
                    setImage(true);
                    let fr = new FileReader();
                    fr.onload = function() {
                        document.getElementById('imgPlaceHolder').src = fr.result;
                    }
                    fr.readAsDataURL(imagee)
                    //sets img
                    //console.log(imagee)
                    setImg(imagee)
                    //console.log(img)
                } else {
                    console.log(item)
                }

            
            }
            
        } catch (err) {
            console.log(err);
        }

    }



    const [disable, setDisable] = useState(true);
    function handleDisable(search) {
        setDisable(search.target.value === '');
    }



    const handleEnter = async () => {
        const url = ref.current.value 

        const response = await fetch('http://127.0.0.1:5000/request', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"url":url})
        })
        const data = await response.json();
        
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

        setUrls([...urls, url])
    }

    useEffect(() => {
        const values = JSON.parse(localStorage.getItem("websites"))
        if (values !== null) {
            setUrls(values)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("websites",JSON.stringify(urls));
    }, [urls])

    useEffect(() => {
        localStorage.setItem("ingredients",JSON.stringify(basket));
    }, [basket])


    return (
        <div>
            <div className="Search-container">
                <div className="Search-prompt">
                    I want...
                </div>
                <div className="testbox">
                        <input                    
                            className="Search-bar"
                            type="text"
                            id="search"
                            placeholder="Paste a recipe link or screenshot here!"
                            onChange={handleDisable}
                            onPaste={handlePaste}
                            onDrop={handleDrop}
                            ref={ref}
                        />
                        {image && 
                        <img id="imgPlaceHolder" 
                        style={{'width': '70px', 
                                'height': '70px',
                                'position': 'absolute',
                                'display': 'flex',
                                'margin-left': '20%',
                                'margin-top': '5px'
                                }}
                        />}
   
                   
                    <div
                        className="Search-button-camera"
                        onClick={OCRthenPopUp}
                        >
                        <img src="Circle-camera.svg"/>
                    </div>
                    <div
                        className="Search-button-arrow"
                        > 
                        <img onClick={handleEnter} src='Circle-arrow.svg'/>             
                    </div>
                </div>
                {popUp && <Popup basket={basket} setBasket={setBasket} handlePopUp={popUpClose} url={urls[urls.length - 1]} img={img} ingredients={list} OCRDone={OCRDone}/>}
            </div>
            
        </div>
    );
}