import { useEffect, useState } from 'react'

function TypingGame() {

    const [key, setKey] = useState()

    const [cursor, setCursor] = useState(0)

    const [target, setTarget] = useState("hola mundo")

    const [palabra, setPalabra] = useState("")

    const [next, setNext] = useState(false)

    const [error, setError] = useState(false)

    const [startTime, setStartTime] = useState(null)

    const [wpm, setWpm] = useState(0)

    const [keyIncorrect, setKeyIncorrect] = useState(0)

    const [accuracy, setAccuracy] = useState()

    const [timeInMinutes, setTimeInMinuetes] = useState()

    const [timeLeft, setTimeLeft] = useState(600)

    let netWpm = Math.max(0, wpm - (keyIncorrect / timeInMinutes))

    let newNetWpm = (wpm * accuracy) / 100

    let time = (60 - (timeLeft / 10)).toFixed(1)

    useEffect(() => {
        const handleKeyDown = (e) => {
            const id = e.key
            console.log("Tecla:", id); // Esto imprime la tecla 
            setKey(id)
            if (startTime === null && id === target[cursor]) {
                setStartTime(Date.now())
            }
            if (palabra === target) { // Verifica si ya termino el objetivo
                setNext(true)
                setStartTime(null)
                console.log("target completado")
            } else {
                setNext(false)
            }
            if (id === target[cursor]) {
                setCursor(cursor + 1)
                setPalabra(palabra + target[cursor])
                setError(false)
                let tiempo = (Date.now() - startTime) / 60000
                setTimeInMinuetes(tiempo)
                const keyTotal = keyIncorrect + cursor
                const accuracy = (cursor / keyTotal) * 100
                setAccuracy(accuracy)
                setWpm((((cursor + 1) / 5) / tiempo))
            } else {
                if (startTime) setKeyIncorrect((keyIncorrect + 1))
                setError(true)
                console.log(keyIncorrect + 1)
            }
            if (id === "Backspace") {
                setCursor(0)
                setPalabra("")
                setKeyIncorrect(0)
                setTimeLeft(600)
            }
            if (startTime === null && id === target[cursor]) {
                setStartTime(Date.now())
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [cursor, palabra, key, keyIncorrect, startTime]);


    useEffect(() => {
        console.log(timeLeft) //verificacion de montaje
        let interval
        if (startTime && timeLeft > 0 && palabra !== target) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1)
                console.log("restando 1 segundo")
            }, 100);
            return () => clearInterval(interval)
        }



    }, [timeLeft, startTime, setInterval])



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
            <p>presicion: {accuracy.toFixed(2)}</p>
            <p>WPM: {wpm.toFixed(2)}</p>
            <p>net WPM {netWpm.toFixed(2)}</p>
            <p>new net WPM: {newNetWpm.toFixed(2)}</p>
            {next && <button>avanzar</button>}
        </main>
    )
}

export default TypingGame