import { useEffect, useState } from 'react'

function Game() {

    const [play, setPlay] = useState(false)

    const [key, setKey] = useState()

    const [target, setTarget] = useState("")

    const [palabra, setPalabra] = useState("")

    const [palabraEnviada, setPalabraEnviada] = useState()

    const [usedWords, setUsedWords] = useState([])

    const [startTime, setStartTime] = useState(null)

    const [gameOver, setGameOver] = useState(false)

    const [wpm, setWpm] = useState(0)

    const [accuracy, setAccuracy] = useState()

    const [timeInMinutes, setTimeInMinuetes] = useState()

    const [timeLeft, setTimeLeft] = useState(5)

    const [keyUsed, setKeyUsed] = useState(0)

    const [playerUno, setPlayerUno] = useState(false)

    const [playerDos, setPlayerDos] = useState(false)


    let newNetWpm = (wpm * accuracy) / 100

    let time = (60 - (timeLeft / 10)).toFixed(1)



    useEffect(() => { // Key detector
        const handleKeyDown = (e) => {
            const id = e.key
            const number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            setKey(id)
            console.log(id)
            //agregando letra
            if (id !== 'Enter'
                && id !== number[id]
                && id !== 'Backspace'
                && play) {
                setPalabra(palabra + id)
                setKeyUsed(keyUsed + 1)
                if (startTime === null) {
                    setStartTime(Date.now())
                }
                console.log({ keyUsed })
            }
            // enviando palabra
            if (id === 'Enter') {
                processTurn()
            }
            // borrar letra, aun no completado (ahora borra todo)
            if (id === "Backspace") {
                setPalabra("")
            }
        };
        // oyente del evento
        window.addEventListener('keydown', handleKeyDown);
        // remover el oyente
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [palabra, key, startTime, keyUsed, target, timeLeft, play]);


    useEffect(() => { // cronometro
        let interval
        if (startTime && timeLeft >= 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 0.1)
            }, 100);
            return () => {
                if (timeLeft < 0.1) {
                    setGameOver(true)
                }

                clearInterval(interval)
            }
        }
    }, [timeLeft, startTime, setInterval])


    useEffect(() => { // API
        const getTarget = async () => {
            if (playerUno) {
                try {
                    const response = await fetch(`https://api.datamuse.com/words?sp=${palabra}*&v=es`)
                    const data = await response.json()
                    console.log("data: ", data)
                    setTarget(data)
                } catch (error) {
                    console.log("error: ", error)
                }
            }
            if (playerDos) {
                try {
                    const response = await fetch(`https://api.datamuse.com/words?sp=${palabra}*&v=es`)
                    const data = await response.json()
                    console.log("data: ", data)
                    setTarget(data)
                } catch (error) {
                    console.log("error: ", error)
                }
            }
        }
        if (palabraEnviada) getTarget()
    }, [palabraEnviada])


    useEffect(() => {
        if (gameOver) {
            setTarget("GAME-OVER")
            setPalabra("")
            setStartTime(null)
            setKeyUsed(0)
            setTimeLeft(5)
        } else {
            return
        }
    }, [gameOver])


    const handlePlayButton = () => {
        setPlay(!play)
        if (play) {
            setTarget("")
            setPalabra("")
            setStartTime(null)
            setKeyUsed(0)
            setTimeLeft(5)
        }
    }

    const processTurn = () => {
        if (palabra)

            if (usedWords.includes(palabra)) { // verficacion de palabra usada
                setGameOver(true) // logica de game-over
            } else {
                setUsedWords(usedWords + palabra)
                console.log(usedWords + palabra)
            }

        let tiempo = (Date.now() - startTime) / 60000
        const accuracy = ((palabra.length / keyUsed) * 100).toFixed(2)
        setAccuracy(accuracy)
        setWpm((((keyUsed + 1) / 5) / tiempo))
        setStartTime(null)
        handlePlayButton()
        setPalabraEnviada(palabra)
        console.log("palabra enviada a verificar: ", { palabra }, "time: ", { tiempo })
    }



    return (
        <main className='main' >
            <h1>Typing-pong</h1>
            {!play && <p>Presiona Enter para empezar...</p>}
            <p>Enviada: <strong>'{palabraEnviada}'</strong></p>
            <p>Respuesta: <strong>'{}'</strong></p>
            <p>Objetivo: <strong>'{target}'</strong></p>
            <p>Respuesta: {palabra}</p>
            <p>keys: {keyUsed}</p>
            <p>tiempo: {timeLeft.toFixed(1)}</p>
            <p>presicion: {accuracy}</p>
            <p>WPM: {wpm.toFixed(2)}</p>
            <p>new net WPM: {newNetWpm.toFixed(2)}</p>
            {play && <button onClick={handlePlayButton} value="avanzar">avanzar</button>}
            {!play && <button onClick={handlePlayButton} value='iniciar'>iniciar</button>}
        </main>
    )
}

export default Game