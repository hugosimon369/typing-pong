import { useEffect, useState } from 'react'
import './App.css'
import TypingGame from './components/typyng'
import Game from './components/game'
import introVideo from './assets/maquina-retro-typig.mp4'
import bgVideo from './assets/BgVideo.mp4'

function App() {

  const [introFinished, setIntroFinished] = useState(false)
  const [showFlash, setShowFlash] = useState(false)


  const handleVideoEnd = () => {
    setIntroFinished(!introFinished)
  }

  const handleTimeUpdate = (e) => {
    // Si faltan menos de 0.4 segundos para terminar, cortamos.
    // Ajusta el '0.4' si quieres cortar antes o después.
    if (e.target.duration - e.target.currentTime < 2.4) {
      setIntroFinished(true)
      setShowFlash(true) // ¡Disparamos el flash!
    }
  }


  useEffect(() => {
    if (showFlash) {
      const timer = setTimeout(() => setShowFlash(false), 500); // 500ms dura el flash
      return () => clearTimeout(timer);
    }
  }, [showFlash]);


  return (
    <>
      {showFlash && <div className="flash-overlay"></div>}
      {!introFinished &&
        <video
          className='video-intro'
          src={introVideo}
          autoPlay
          muted
          onTimeUpdate={handleTimeUpdate}>
        </video>
      }
      {introFinished &&
        <main className='main-container'>
          <video
          className='video-bg'
            src={bgVideo} 
            autoPlay 
            muted
            loop>
          </video>
          <Game></Game>
        </main>
      }
    </>
  )
}

export default App
