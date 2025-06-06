import React, { useState, useEffect, useCallback } from 'react';
import LessonHeader from './LessonHeader';
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

  // Add timer effect
  useEffect(() => {
    let timer;
    if (!gameState.showWelcome && !gameState.showQuestion) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.showWelcome, gameState.showQuestion]);

  const createNewCellData = useCallback((r, c, isStartCell) => {
    return {
      row: r,
      col: c,
      grass: isStartCell ? 0 : 100,
      question: `${r + 1} x ${c + 1}`,
      originalMultiplier1: r + 1,
      originalMultiplier2: c + 1,
      isBonus: Math.random() < 0.15, // 15% chance for bonus
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

  const calculateCellScore = (row, col, isBonus = false) => {
    const baseScore = row + col;
    return isBonus ? baseScore * 2 : baseScore;
  };

  const handleAnswer = (answer) => {
    const currentCell = gameState.boardData.find(
      cell => cell.row === gameState.currentQuestion.row && cell.col === gameState.currentQuestion.col
    );
    
    const correctAnswer = currentCell.originalMultiplier1 * currentCell.originalMultiplier2;
    
    if (parseInt(answer) === correctAnswer) {
      const newBoardData = gameState.boardData.map(cell => {
        if (cell.row === currentCell.row && cell.col === currentCell.col) {
          const newGrass = Math.max(0, cell.grass - Math.ceil(cell.grass * 0.50));
          const wasCleared = newGrass === 0;
          
          return {
            ...cell,
            grass: newGrass,
            isRevealed: true,
            hintGivenForHardReset: false,
            wasEverZeroGrass: wasCleared ? true : cell.wasEverZeroGrass,
            bonusCollected: wasCleared && cell.isBonus ? true : cell.bonusCollected
          };
        }
        return cell;
      });

      // Calculate score based on coordinates and bonus
      const cellScore = calculateCellScore(currentCell.row, currentCell.col, currentCell.isBonus);
      const bonusMessage = currentCell.isBonus ? ' (Bonus x2!)' : '';

      setGameState(prev => ({
        ...prev,
        boardData: newBoardData,
        score: prev.score + cellScore,
        showQuestion: false,
        currentQuestion: null,
        playerPosition: {
          ...prev.playerPosition,
          row: currentCell.row,
          col: currentCell.col
        }
      }));

      showMessage(`Świetnie! +${cellScore} punktów${bonusMessage}`, 2000);
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
        score: Math.max(0, prev.score - 1),
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
          // Check if stepping on a bonus cell that hasn't been collected
          if (targetCell.isBonus && !targetCell.bonusCollected && targetCell.grass === 0) {
            const bonusScore = calculateCellScore(targetCell.row, targetCell.col, true);
            
            // Mark bonus as collected
            const newBoardData = gameState.boardData.map(cell => {
              if (cell.row === targetCell.row && cell.col === targetCell.col) {
                return { ...cell, bonusCollected: true };
              }
              return cell;
            });

            setGameState(prev => ({
              ...prev,
              boardData: newBoardData,
              score: prev.score + bonusScore,
              playerPosition: {
                ...prev.playerPosition,
                row: newRow,
                col: newCol
              }
            }));

            showMessage(`Bonus zebrano! +${bonusScore} punktów!`, 2000);
          } else {
            // Normal movement to cleared cell
            setGameState(prev => ({
              ...prev,
              playerPosition: {
                ...prev.playerPosition,
                row: newRow,
                col: newCol
              }
            }));
          }
          moved = true;
        } else {
          // Show question for grassy cell
          setGameState(prev => ({
            ...prev,
            showQuestion: true,
            currentQuestion: targetCell,
            wrongAnswersCount: 0 // Reset wrong answers for new question
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

    if (moved && !gameState.showQuestion) {
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

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate grass cleared percentage correctly
  const calculateGrassClearedPercentage = () => {
    if (gameState.boardData.length === 0) return 0;
    
    // Count cells that have been cleared (grass < 10)
    const clearedCells = gameState.boardData.filter(cell => cell.grass < 10).length;
    const totalCells = gameState.boardData.length;
    
    return Math.round((clearedCells / totalCells) * 100);
  };

  return (
    <div className="h-screen flex flex-col bg-bg-main">
      <LessonHeader 
        currentStep={1} 
        totalSteps={1} 
        onBack={onBack}
        title="Gra: Szlakami tabliczki mnożenia"
      />

      {gameState.showWelcome ? (
        <WelcomeModal onStart={() => setGameState(prev => ({ ...prev, showWelcome: false }))} />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 3D View - Top Half */}
          <div 
            className="h-1/2 view-3d"
            style={{
              background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 50%, var(--current-cell-color, #F0E68C) 100%)'
            }}
          >
            <div id="playerActionFeedback" className="text-lg mb-2 text-white text-shadow min-h-[25px]" />
            <div id="avatarAnimationFeedback" className="text-2xl min-h-[30px]" />
            
            <Scene3D 
              boardData={gameState.boardData}
              playerPosition={gameState.playerPosition}
              currentLevelSize={gameState.currentLevelSize}
              level={1}
            />
          </div>

          {/* 2D View - Bottom Half, Full Width */}
          <div className="h-1/2 bg-bg-card flex">
            {/* Left Side - Map */}
            <div className="flex-1 flex flex-col justify-center items-center p-4">
              <MapGrid 
                boardData={gameState.boardData}
                playerPosition={gameState.playerPosition}
                currentLevelSize={gameState.currentLevelSize}
                level={1}
              />
            </div>

            {/* Right Side - Stats */}
            <div className="w-80 p-6 border-l border-bg-neutral">
              <div className="space-y-4">
                {/* Points */}
                <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                  <div className="text-center">
                    <div className="text-green-800 font-bold text-lg mb-1">Punkty</div>
                    <div className="text-green-700 text-2xl font-bold">
                      {gameState.score}
                    </div>
                    <div className="text-green-600 text-sm">🏆 Zdobyte</div>
                  </div>
                </div>

                {/* Time */}
                <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                  <div className="text-center">
                    <div className="text-blue-800 font-bold text-lg mb-1">Czas</div>
                    <div className="text-blue-700 text-2xl font-bold">
                      {formatTime(gameState.timeElapsed)}
                    </div>
                    <div className="text-blue-600 text-sm">⏱️ Upłynął</div>
                  </div>
                </div>

                {/* Grass Cleared Percentage */}
                <div className="bg-purple-100 p-4 rounded-lg border border-purple-300">
                  <div className="text-center">
                    <div className="text-purple-800 font-bold text-lg mb-1">Trawa usunięta</div>
                    <div className="text-purple-700 text-2xl font-bold">
                      {calculateGrassClearedPercentage()}%
                    </div>
                    <div className="text-purple-600 text-sm">🌱 Oczyszczone</div>
                  </div>
                </div>
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