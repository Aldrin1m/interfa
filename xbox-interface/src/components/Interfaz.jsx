import React, { useEffect, useRef, useState } from "react";
import "../assets/estilo.css";
import jaguarImg from "../assets/imagenes/jaguar.png";
import tetrisImg from "../assets/imagenes/tetris.jpg";
import serpienteImg from "../assets/imagenes/serpiente.jpg";
import labeImg from "../assets/imagenes/labe.jpg";
import MiniLabyrinth from "./MiniLabyrinth";
import pacmanImg from "../assets/imagenes/pacman.jpg";
import solitarioimg from "../assets/imagenes/solitario.jpg";
import introimg from "../assets/imagenes/Intro.png";
const GamesRow = ({ activeTile, onTileClick }) => {
  const tiles = [
    {
      id: "jaguar",
      title: "Desafío Jaguar",
      description:
        "Aventúrate a retroalimentar los conocimientos que 'Jaguar' tiene para ti",
      img: introimg,
    },
    {
      id: "controller",
      title: "Mini Laberinto",
      description: "Resuelve laberintos rápidos y desafiantes.",
      img: labeImg,
    },  
    
  ];

  return tiles.map((tile) => (
    <div
      key={tile.id}
      role="button"
      tabIndex={0}
      aria-pressed={activeTile === tile.id}
      aria-label={tile.title || "Imagen"}
      className={`game-tile ${tile.id}-tile ${activeTile === tile.id ? "active" : ""}`}
      style={
        tile.img
          ? {
              backgroundImage: `url(${tile.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "#222", cursor: "pointer" }
      }
      onClick={() => onTileClick(tile.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onTileClick(tile.id);
        }
      }}
    >
      {tile.title && <div className="game-title">{tile.title}</div>}
      {tile.description && <div className="game-description">{tile.description}</div>}
    </div>
  ));
};

const SecondRow = ({ activeSecondRowTile, onTileClick }) => {
  const tiles = [
    {
      id: "library",
      title: "🔍 Más juegos",
      description: "Descubre más opciones de juegos interesantes para jugar y disfrutar.",
      img: null,
    },
    {
      id: "tetris",
      title: "Tetris",
      description: "¡Juega al clásico Tetris ahora!",
      img: tetrisImg,
    },
    {
      id: "game-pass",
      title: "Serpiente",
      description: "Juega al clásico juego de la serpiente en su versión más adictiva.",
      img: serpienteImg,
    },

    {
      id: "pacman",
      title: "Pac-Man",
      description: "¡Come todos los puntos y evita a los fantasmas!",
      img: pacmanImg,
    },
    {
      id: "solitaire",
      title: "Solitaire",
      description: "Disfruta del clásico juego de cartas Solitaire.",
      img: solitarioimg
    },
  ];

  return tiles.map((tile) => (
    <div
      key={tile.id}
      role="button"
      tabIndex={0}
      aria-pressed={activeSecondRowTile === tile.id}
      aria-label={tile.title}
      className={`tile ${activeSecondRowTile === tile.id ? "active" : ""}`}
      onClick={() => onTileClick(tile.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onTileClick(tile.id);
        }
      }}
      style={
        tile.img
          ? {
              backgroundImage: `url(${tile.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }
          : { cursor: "pointer" }
      }
    >
      {!tile.img && <div className="tile-title">{tile.title}</div>}
      {!tile.img && <div className="game-description">{tile.description}</div>}
    </div>
  ));
};

const XboxInterface = () => {
  const [activeTile, setActiveTile] = useState("jaguar");
  const [activeSecondRowTile, setActiveSecondRowTile] = useState(null);
  const [showLabyrinth, setShowLabyrinth] = useState(false);
  const [time, setTime] = useState("");
  const [clickLocked, setClickLocked] = useState(false);
  const gamesRowRef = useRef(null);
  const secondRowRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) / 50;
      const moveY = (e.clientY - window.innerHeight / 2) / 50;
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    const handleKeyDown = (e) => {
      if (!gamesRowRef.current || !secondRowRef.current) return;
      if (e.key === "ArrowRight") {
        gamesRowRef.current.scrollLeft += 300;
        secondRowRef.current.scrollLeft += 100;
      } else if (e.key === "ArrowLeft") {
        gamesRowRef.current.scrollLeft -= 300;
        secondRowRef.current.scrollLeft -= 100;
      }
    };

    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  const handleSecondRowTileClick = (id) => {
    if (clickLocked) return;
    setClickLocked(true);
    setTimeout(() => setClickLocked(false), 1000);

    setActiveSecondRowTile(id);
    switch (id) {
      case "game-pass":
        window.open("https://www.google.com/fbx?fbx=snake_arcade", "_blank");
        break;
      case "tetris":
        window.open("https://tetris.com/play-tetris", "_blank");
        break;
      case "library":
        alert("Próximamente más juegos");
        break;
      case "controller":
        setShowLabyrinth(true);
        break;
      case "pacman":
        window.open("https://www.google.com/fbx?fbx=pacman", "_blank");
        break;
      case "solitaire":
        window.open("https://www.solitaire.org/", "_blank");
        break;
      default:
        break;
    }
  };

  const handleTileClick = (id) => {
  setActiveTile(id);
  if (id === "controller") {
    setShowLabyrinth(true);
  }
};
  const handleExitLabyrinth = () => setShowLabyrinth(false);

  if (showLabyrinth) {
    return (
      <div>
        <button
          onClick={handleExitLabyrinth}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 999,
            padding: "10px 15px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          aria-label="Salir del mini laberinto"
        >
          ← Salir
        </button>
        <MiniLabyrinth />
      </div>
    );
  }

  return (
    <div>
      <div className="background" ref={backgroundRef} />
      <div className="overlay" />
      <div className="header">
        <div className="right-controls">
          <div className="battery" role="img" aria-label="battery">🔋</div>
          <div className="time" aria-live="polite" aria-atomic="true">{time}</div>
        </div>
      </div>

      <div className="main-content">
        <div className="games-row" ref={gamesRowRef}>
          <GamesRow activeTile={activeTile} onTileClick={handleTileClick} />
        </div>

        <div className="second-row" ref={secondRowRef}>
          <SecondRow activeSecondRowTile={activeSecondRowTile} onTileClick={handleSecondRowTileClick} />
        </div>
      </div>

      <div className="bottom-nav">
        <a
          className="nav-item"
          href="https://escarcega.tecnm.mx/index.php/parque-ecoturistico"
          target="_blank"
          rel="noopener noreferrer"
        >
          Novedades
        </a>
        <a
          className="nav-item"
          href="https://escarcega.tecnm.mx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Escárcega
        </a>
        <a
          className="nav-item"
          href="https://www.facebook.com/share/1HMjUyGpD6"
          target="_blank"
          rel="noopener noreferrer"
        >
          Comunidad
        </a>
      </div>
    </div>
  );
};

export default XboxInterface;
