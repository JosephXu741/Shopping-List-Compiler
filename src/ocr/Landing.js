import React, {useState, useRef} from 'react'
import Tesseract from "tesseract.js"
import Loading from './Loading'
import ModifyCard from './ModifyCard'

function Landing() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(0)
    const ref = useRef(null)

    const parseImage = async (image) => {
        Tesseract.recognize(
            image,
            'eng',
            {logger: m => {
                if (m.status === "recognizing text") {
                    setLoading(m.progress)
                }
            }}
        ).then(({data: {text} }) => {
            const lines = text.split("\n")
            setList(lines)
            console.log(lines)
        })

    }

    const handlePaste = e => {
        const item = e.clipboardData.items[0]
        const image = item.getAsFile()
        parseImage(image)

    }
    const handleChange = e => {
        console.log(e)
    }

    const handleClick = () => {
        let parsedLines = ref.current.innerText;
        parsedLines = parsedLines.split("\n")
        console.log(parsedLines)
    }

    return (
        <div>
            <form>
                <input type="text" onPaste={handlePaste} />
            </form>
            <div>
                {(loading < 1 && loading > 0) ? 
                    <Loading progress={loading}/> 
                : null}

                {loading === 1 ? 
                    <ModifyCard list={list} refprop={ref} handleChange={handleChange} handleClick={handleClick} />
                : null }
            </div>
        </div>
    )
}

export default Landing
