import { useEffect, useState } from 'react'

function Game() {
    // --- ESTADOS DEL JUEGO ---
    const [play, setPlay] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [target, setTarget] = useState("")         // Palabra que responde la máquina
    const [palabra, setPalabra] = useState("")       // Lo que escribe el usuario
    const [palabraEnviada, setPalabraEnviada] = useState("") // Disparador de la API
    const [usedWords, setUsedWords] = useState([])   // Historial para no repetir
    const [language, setLanguage] = useState('es')

    // --- MÉTRICAS ---
    const [startTime, setStartTime] = useState(null)
    const [timeLeft, setTimeLeft] = useState(5)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [keyUsed, setKeyUsed] = useState(0)

    // Cálculo visual (evita NaN si es 0)
    const netWpm = wpm > 0 ? (wpm * accuracy) / 100 : 0;

    // 1. MANEJO DE TECLAS (INPUT)
    useEffect(() => {
        if (!play || gameOver) return; // Bloquear si no está jugando
        const handleKeyDown = (e) => {
            const { key } = e;
            // Detectar letras (ignora teclas especiales salvo Backspace/Enter)
            if (key.length === 1 && key.match(/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/)) {
                if (startTime === null) setStartTime(Date.now()); // Inicia timer primera tecla
                setPalabra(prev => prev + key);
                setKeyUsed(prev => prev + 1);
            }
            if (key === 'Backspace') {
                setPalabra(prev => prev.slice(0, -1)); // Borrado seguro
            }
            if (key === 'Enter') {
                processTurn(); // Procesar jugada
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [play, gameOver, palabra, startTime]);


    // 2. CRONÓMETRO (Cuenta Regresiva)
    useEffect(() => {
        if (!play || gameOver || startTime === null) return
        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0.1) {
                    clearInterval(interval);
                    triggerGameOver("¡SE ACABÓ EL TIEMPO!");
                    return 0;
                }
                return prevTime - 0.1;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [play, gameOver, startTime]);


    // 3. API: CEREBRO DEL JUEGO (Turno de la Máquina)
    useEffect(() => {
        const fetchNewWord = async () => {
            if (!palabraEnviada) return;
            try {
                // LA MAGIA: Buscar palabras que empiecen con las últimas 2 letras
                const verification = await fetch(`https://api.datamuse.com/words?sp=${palabraEnviada}*&v=${language}&max=1`)
                const verificacionData = await verification.json()
                console.log(verificacionData)
                if (verificacionData.length <= 0) {
                    triggerGameOver('palabra ireal')
                    return
                }
                const semilla = palabraEnviada.slice(-2);
                const response = await fetch(`https://api.datamuse.com/words?sp=${semilla}*&v=${language}&max=10`);
                const data = await response.json();
                if (data.length > 0) {
                    // Elegir una al azar
                    const randomIndex = Math.floor(Math.random() * data.length);
                    const nuevaPalabra = data[randomIndex].word;
                    setTarget(nuevaPalabra);
                    // Reset para el turno del jugador
                    setPalabra("");
                    setTimeLeft(5);      // Restaurar tiempo
                    setStartTime(null);  // Esperar tecla para arrancar de nuevo
                    setKeyUsed(0);       // Resetear contador de teclas de este turno
                    console.log(verificacionData)
                } else {
                    triggerGameOver("LA MÁQUINA SE RINDIÓ (No hay palabras)");
                }
            } catch (error) {
                console.error("Error API:", error);
                triggerGameOver("ERROR DE CONEXIÓN");
            }
        };
        fetchNewWord();
    }, [palabraEnviada, language]);


    // --- LÓGICA DEL JUEGO ---


    const processTurn = () => {
        if (!palabra) return;
        // Validación 1: No repetir
        if (usedWords.includes(palabra)) {
            triggerGameOver("¡PALABRA REPETIDA!");
            return;
        }
        // Validación 2: Verificar coincidencia (Opcional, Pong Estricto)
        // Si hay target, la palabra debe empezar con las ultimas 2 del target
        if (target && !palabra.startsWith(target.slice(-2))) {
            triggerGameOver('No hay pong :( "devuelve una palabra empezando con la silaba final de tu rival"')
            return
        }
        // Guardar en historial
        setUsedWords(prev => [...prev, palabra]);
        // Calcular Métricas
        if (startTime) {
            const timeElapsedMin = (Date.now() - startTime) / 60000; // Minutos reales
            // Evitar división por cero
            if (timeElapsedMin > 0) {
                const currentWpm = (palabra.length / 5) / timeElapsedMin;
                const currentAccuracy = (palabra.length / keyUsed) * 100;

                setWpm(currentWpm);
                setAccuracy(currentAccuracy);
            }
        }
        // Pasar turno a la API
        setPalabraEnviada(palabra);
    };


    const triggerGameOver = (motivo) => {
        setGameOver(true);
        setTarget(motivo);
    };
    const handleStartGame = () => {
        setPlay(true);
        setGameOver(false);
        setTarget("");
        setPalabra("");
        setPalabraEnviada("");
        setUsedWords([]);
        setTimeLeft(5);
        setWpm(0);
        setAccuracy(0);
        setStartTime(null);
        setKeyUsed(0);
    };


    return (
        <main className='main'>
            <h1>Typing-Pong 🏓</h1>

            {/* Panel de Estadísticas */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
                <p>⏱️ {timeLeft.toFixed(1)}s</p>
                <p>⚡ WPM: {wpm.toFixed(0)}</p>
                <p>🎯 Precisión: {accuracy ? accuracy.toFixed(0) : 0}%</p>
                <p>📊 Net: {netWpm.toFixed(0)}</p>
            </div>
            {/* Área de Juego */}
            {!play ? (
                <button onClick={handleStartGame}>
                    {gameOver ? "Jugar de Nuevo" : "Iniciar Juego"}
                </button>
            ) : (
                <div>
                    {target && !gameOver && (
                        <p style={{ fontSize: '1.2em', color: '#888' }}>
                            La máquina dijo: <strong style={{ color: 'yellow', fontSize: '1.3em' }}>{target}</strong> (Responde empezando con:  <span style={{ color: 'green', fontSize: '1.3em' }}>{target.slice(-2)}</span>)
                        </p>
                    )}

                    {gameOver ? (
                        <h2 style={{ color: 'red' }}>{target}</h2>
                    ) : (
                        <>
                            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>
                                {palabra}<span className="cursor">|</span>
                            </p>
                            <small>Historial: {usedWords.length} palabras</small>
                        </>
                    )}
                </div>
            )}
        </main>
    )
}

export default Game