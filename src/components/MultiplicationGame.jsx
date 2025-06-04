import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import Scene3D from './GameComponents/Scene3D';
import MapGrid from './GameComponents/MapGrid';
import QuestionModal from './GameComponents/QuestionModal';
import WelcomeModal from './GameComponents/WelcomeModal';

const MultiplicationGame = ({ onBack }) => {
  const [gameState, setGameState] = useState({
    currentLevelSize: 4,
    boardData: [],
    playerPosition: { row: 0, col: 0, direction: 'S' },
    score: 0,
    timeElapsed: 0,
    showWelcome: true,
    showQuestion: false,
    currentQuestion: null,
    wrongAnswersCount: 0,
    isGeminiLoading: false,
    message: '',
    showMessage: false
  });

  const createNewCellData = useCallback((r, c, isStartCell) => {
    return {
      row: r,
      col: c,
      grass: isStartCell ? 0 : 100,
      question: `${r + 1} x ${c + 1}`,
      originalMultiplier1: r + 1,
      originalMultiplier2: c + 1,
      isBonus: Math.random() < 0.1, // 10% chance for bonus
      isRevealed: isStartCell,
      bonusCollected: false,
      wasEverZeroGrass: isStartCell,
      hintGivenForHardReset: false
    };
  }, []);

  const initializeGame = useCallback(() => {
    const newBoardData = [];
    const size = gameState.currentLevelSize;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isStartCell = r === 0 && c === 0;
        newBoardData.push(createNewCellData(r, c, isStartCell));
      }
    }

    setGameState(prev => ({
      ...prev,
      boardData: newBoardData,
      playerPosition: { row: 0, col: 0, direction: 'S' }
    }));
  }, [gameState.currentLevelSize, createNewCellData]);

  useEffect(() => {
    if (!gameState.showWelcome && gameState.boardData.length === 0) {
      initializeGame();
    }
  }, [gameState.showWelcome, gameState.boardData.length, initializeGame]);

  const handleAnswer = (answer) => {
    const currentCell = gameState.boardData.find(
      cell => cell.row === gameState.currentQuestion.row && cell.col === gameState.currentQuestion.col
    );
    
    const correctAnswer = currentCell.originalMultiplier1 * currentCell.originalMultiplier2;
    
    if (parseInt(answer) === correctAnswer) {
      const newBoardData = gameState.boardData.map(cell => {
        if (cell.row === currentCell.row && cell.col === currentCell.col) {
          const newGrass = Math.max(0, cell.grass - Math.ceil(cell.grass * 0.50));
          return {
            ...cell,
            grass: newGrass,
            isRevealed: true,
            hintGivenForHardReset: false,
            wasEverZeroGrass: newGrass === 0 ? true : cell.wasEverZeroGrass
          };
        }
        return cell;
      });

      setGameState(prev => ({
        ...prev,
        boardData: newBoardData,
        score: prev.score + 10,
        showQuestion: false,
        currentQuestion: null,
        playerPosition: {
          ...prev.playerPosition,
          row: currentCell.row,
          col: currentCell.col
        }
      }));

      showMessage('Świetnie! Trawa ścięta!', 2000);
    } else {
      const newBoardData = gameState.boardData.map(cell => {
        if (cell.row === currentCell.row && cell.col === currentCell.col) {
          const newGrass = Math.min(200, cell.grass + Math.ceil(cell.grass * 0.20));
          return {
            ...cell,
            grass: newGrass
          };
        }
        return cell;
      });

      setGameState(prev => ({
        ...prev,
        boardData: newBoardData,
        score: Math.max(0, prev.score - 5),
        wrongAnswersCount: prev.wrongAnswersCount + 1
      }));

      showMessage('Niestety, źle. Trawa odrasta...', 2000);
    }
  };

  const handleKeyPress = useCallback((e) => {
    if (gameState.showWelcome || gameState.showQuestion) return;

    const { row: pr, col: pc, direction: pdir } = gameState.playerPosition;
    let newRow = pr, newCol = pc, newDirection = pdir;
    let moved = false;

    if (e.key === 'ArrowUp') {
      switch (pdir) {
        case 'N': newRow--; break;
        case 'E': newCol++; break;
        case 'S': newRow++; break;
        case 'W': newCol--; break;
        default: break;
      }

      if (newRow >= 0 && newRow < gameState.currentLevelSize && 
          newCol >= 0 && newCol < gameState.currentLevelSize) {
        const targetCell = gameState.boardData.find(cell => cell.row === newRow && cell.col === newCol);
        
        if (targetCell.grass < 10) {
          moved = true;
        } else {
          setGameState(prev => ({
            ...prev,
            showQuestion: true,
            currentQuestion: targetCell
          }));
        }
      } else {
        showMessage("Nie możesz tam iść (ściana!)", 1500);
      }
    } else if (e.key === 'ArrowLeft') {
      const dirs = ['N', 'W', 'S', 'E'];
      const currentIndex = dirs.indexOf(pdir);
      newDirection = dirs[(currentIndex + 1) % 4];
      moved = true;
    } else if (e.key === 'ArrowRight') {
      const dirs = ['N', 'E', 'S', 'W'];
      const currentIndex = dirs.indexOf(pdir);
      newDirection = dirs[(currentIndex + 1) % 4];
      moved = true;
    }

    if (moved) {
      setGameState(prev => ({
        ...prev,
        playerPosition: {
          row: newRow,
          col: newCol,
          direction: newDirection
        }
      }));
    }
  }, [gameState.showWelcome, gameState.showQuestion, gameState.playerPosition, gameState.currentLevelSize, gameState.boardData]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const showMessage = (text, duration = 2000) => {
    setGameState(prev => ({ ...prev, message: text, showMessage: true }));
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showMessage: false }));
    }, duration);
  };

  return (
    <div className="h-screen flex flex-col bg-bg-main">
      <div className="flex items-center p-4 border-b border-bg-neutral">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-color hover:text-accent-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Powrót do menu
        </button>
      </div>

      {gameState.showWelcome ? (
        <WelcomeModal onStart={() => setGameState(prev => ({ ...prev, showWelcome: false }))} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="view-3d">
            <div id="playerActionFeedback" className="text-lg mb-2 text-white text-shadow min-h-[25px]" />
            <div id="avatarAnimationFeedback" className="text-2xl min-h-[30px]" />
            
            <Scene3D 
              boardData={gameState.boardData}
              playerPosition={gameState.playerPosition}
            />
          </div>

          <div className="controls-2d">
            <div className="map-grid-container">
              <MapGrid 
                boardData={gameState.boardData}
                playerPosition={gameState.playerPosition}
                currentLevelSize={gameState.currentLevelSize}
              />
            </div>

            <div className="flex justify-around p-3 bg-gray-200 rounded-lg shadow">
              <div>Czas: {gameState.timeElapsed}s</div>
              <div>Punkty: {gameState.score}</div>
              <div>Poziom: {gameState.currentLevelSize}x{gameState.currentLevelSize}</div>
              <div>
                Trawa usunięta: {Math.round((gameState.boardData.filter(cell => 
                  cell.row === 0 && cell.col === 0 ? 0 : Math.min(100, cell.grass)
                ).length / (gameState.currentLevelSize * gameState.currentLevelSize - 1)) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.showQuestion && (
        <QuestionModal
          question={gameState.currentQuestion}
          onAnswer={handleAnswer}
          wrongAnswersCount={gameState.wrongAnswersCount}
          isGeminiLoading={gameState.isGeminiLoading}
        />
      )}

      {gameState.showMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-5 py-3 rounded-lg z-50">
          {gameState.message}
        </div>
      )}
    </div>
  );
};

export default MultiplicationGame;