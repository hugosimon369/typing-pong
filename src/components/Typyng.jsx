import { useEffect, useState } from 'react'

function TypingGame() {

    const [key, setKey] = useState()

    const [cursor, setCursor] = useState(0)

    const [target, setTarget] = useState("")

    const [palabra, setPalabra] = useState("")

    const [next, setNext] = useState(false)

    const [error, setError] = useState(false)

    const [startTime, setStartTime] = useState(null)

    const [wpm, setWpm] = useState(0)

    const [keyIncorrect, setKeyIncorrect] = useState(0)

    const [accuracy, setAccuracy] = useState()

    const [timeInMinutes, setTimeInMinuetes] = useState()

    const [timeLeft, setTimeLeft] = useState(600)

    const [usedWords, setUsedWords] = useState([])



    let netWpm = Math.max(0, wpm - (keyIncorrect / timeInMinutes))

    let newNetWpm = (wpm * accuracy) / 100

    let time = (60 - (timeLeft / 10)).toFixed(1)



    useEffect(() => {
        const handleKeyDown = (e) => {
            const id = e.key
            setKey(id)
            if (startTime === null && id === target[cursor]) { // inica el tiempo
                setStartTime(Date.now())
            }
            if (palabra === target) { // Verifica si ya termino el objetivo
                setNext(true)
                setStartTime(null)
            } else {
                setNext(false)
            }
            if (id === target[cursor]) { // verificacion de KEY
                setCursor(cursor + 1)
                setPalabra(palabra + target[cursor])
                setError(false)
                let tiempo = (Date.now() - startTime) / 60000
                setTimeInMinuetes(tiempo)
                const keyTotal = keyIncorrect + cursor
                const accuracy = ((cursor / keyTotal) * 100).toFixed(2)
                setAccuracy(accuracy)
                setWpm((((cursor + 1) / 5) / tiempo))
            } else {
                if (startTime) setKeyIncorrect((keyIncorrect + 1))
                setError(true)
            }
            if (id === "Backspace") { // reiniciar
                setCursor(0)
                setPalabra("")
                setKeyIncorrect(0)
                setTimeLeft(600)
            }

            if (target === ""){
                
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [cursor, palabra, key, keyIncorrect, startTime]);


    useEffect(() => { // cronometro
        let interval
        if (startTime && timeLeft > 0 && palabra !== target) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1)
            }, 100);
            return () => clearInterval(interval)
        }
    }, [timeLeft, startTime, setInterval])


    useEffect(() => {
        const getTarget = async () => {
            try {
                const response = await fetch(`https://api.datamuse.com/words?sp=${target}*&v=${a}`)
                const data = await response.json()

            } catch (error) {
                console.log("error: ", error)
            }
        }
        getTarget()
    }, [])


    const handlePlayButton = () => {
        if (target === ""){

        }
    }



    return (
        <main className='main' >
            <h1>Typing-pong</h1>
            <p>Presiona cualquier tecla...</p>
            <p>Objetivo: <strong>' {target.split("").map((letra, index) => {
                let clase = "";
                if (index < cursor) clase = "check"
                if (index === cursor) clase = "target"
                if (index > cursor) clase = ""
                return (
                    <span key={index} className={clase}>
                        {letra}
                    </span>
                )
            })} '</strong></p>
            <p className="letra-presionada">
                {target.split('').map((letra, index) => {
                    if (index === cursor && !error) {
                        return <span key={index} className="correct">{key}</span>
                    }
                    if (index === cursor && error) {
                        return <span key={index} className="incorrect">{key}</span>;
                    }
                })}
            </p>
            <p>{palabra}</p>
            <p>tiempo: {time}</p>
            <p>presicion: {accuracy}</p>
            <p>WPM: {wpm.toFixed(2)}</p>
            <p>net WPM {netWpm.toFixed(2)}</p>
            <p>new net WPM: {newNetWpm.toFixed(2)}</p>
            {next && <button>avanzar</button>}
            {!next && <button onClick={handlePlayButton}>iniciar</button>}
        </main>
    )
}

export default TypingGame