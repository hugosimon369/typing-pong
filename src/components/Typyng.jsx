import { useEffect, useState } from 'react'

function TypingGame() {

    const [key, setKey] = useState()

    const [cursor, setCursor] = useState(0)

    const [target, setTarget] = useState("hola mundo")

    const [palabra, setPalabra] = useState("")

    const [next, setNext] = useState(false)

    const [error, setError] = useState(false)


    useEffect(() => {
        const handleKeyDown = (e) => {
            const id = e.key
            console.log("Tecla:", id); // Esto imprime la tecla 
            setKey(id)
            if (id === target[cursor]) {
                setCursor(cursor + 1)
                setPalabra(palabra + target[cursor])
                setError(false)
            } else {
                setError(true)
            }
            if (id === "Backspace") {
                setCursor(0)
                setPalabra("")
            }
            if (palabra === target) {
                setNext(true)
            } else {
                setNext(false)
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [cursor, palabra, key]);

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
            {next && <button>avanzar</button>}
        </main>
    )
}

export default TypingGame