import { useEffect, useState } from 'react'

function TypingGame() {

    const [key, setKey] = useState()
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            const id = e.key
            console.log("Tecla:", id); // Esto imprime la tecla 
            setKey(id)
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <main className='main' >
            <h1>Typing-pong</h1>
            <p>Presiona cualquier tecla...</p>
            <p>{key}</p>
        </main>
    )
}

export default TypingGame