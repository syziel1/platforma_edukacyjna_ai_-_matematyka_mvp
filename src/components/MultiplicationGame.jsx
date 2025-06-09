import React, { useState, useEffect, useCallback } from 'react';
import LessonHeader from './LessonHeader';
import GlobalHeader from './GlobalHeader';
import Scene3D from './GameComponents/Scene3D';
import MapGrid from './GameComponents/MapGrid';
import QuestionModal from './GameComponents/QuestionModal';
import WelcomeModal from './GameComponents/WelcomeModal';
import InstructionsModal from './GameComponents/InstructionsModal';
import GameModeSelector from './GameComponents/GameModeSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useGameRecords } from '../contexts/GameRecordsContext';

const MultiplicationGame = ({ onBack }) => {
  const { t } = useLanguage();
  const { playSound } = useSoundEffects();
  const { updateMultiplicationGameScore } = useGameRecords();
  
  const [gameState, setGameState] = useState({
    currentLevelSize: 4,
    boardData: [],
    playerPosition: { row: 0, col: 0, direction: 'S' },
    score: 0,
    timeElapsed: 0,
    gameStartTime: null,
    showModeSelector: true,
    selectedMode: null,
    showWelcome: false,
    showInstructions: false,
    showQuestion: false,
    currentQuestion: null,
    wrongAnswersCount: 0,
    isGeminiLoading: false,
    message: '',
    showMessage: false
  });

  // Game mode configurations
  const gameModeConfig = {
    addition: {
      name: t('addition'),
      symbol: '+',
      generateQuestion: (r, c) => ({
        num1: r + 1,
        num2: c + 1,
        operation: 'addition',
        answer: (r + 1) + (c + 1),
        display: `${r + 1} + ${c + 1}`
      })
    },
    subtraction: {
      name: t('subtraction'), 
      symbol: '-',
      generateQuestion: (r, c) => {
        const num1 = Math.max(r + 1, c + 1) + Math.floor(Math.random() * 5);
        const num2 = Math.min(r + 1, c + 1);
        return {
          num1,
          num2,
          operation: 'subtraction',
          answer: num1 - num2,
          display: `${num1} - ${num2}`
        };
      }
    },
    multiplication: {
      name: t('multiplication'),
      symbol: '×',
      generateQuestion: (r, c) => ({
        num1: r + 1,
        num2: c + 1,
        operation: 'multiplication',
        answer: (r + 1) * (c + 1),
        display: `${r + 1} × ${c + 1}`
      })
    },
    division: {
      name: t('division'),
      symbol: '÷',
      generateQuestion: (r, c) => {
        const divisor = Math.max(1, Math.min(r + 1, c + 1));
        const quotient = Math.max(r + 1, c + 1);
        const dividend = divisor * quotient;
        return {
          num1: dividend,
          num2: divisor,
          operation: 'division',
          answer: quotient,
          display: `${dividend} ÷ ${divisor}`
        };
      }
    },
    exponentiation: {
      name: t('exponentiation'),
      symbol: '^',
      generateQuestion: (r, c) => {
        const base = Math.max(2, Math.min(r + 1, c + 1, 5)); // Limit base to 2-5
        const exponent = Math.max(1, Math.min(Math.max(r, c), 3)); // Limit exponent to 1-3
        return {
          num1: base,
          num2: exponent,
          operation: 'exponentiation',
          answer: Math.pow(base, exponent),
          display: `${base}^${exponent}`
        };
      }
    },
    'square-root': {
      name: t('squareRoot'),
      symbol: '√',
      generateQuestion: (r, c) => {
        // Generate perfect squares for easier calculation
        const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
        const maxIndex = Math.min(perfectSquares.length - 1, Math.max(r, c) + 2);
        const randomSquare = perfectSquares[Math.min(maxIndex, perfectSquares.length - 1)];
        return {
          num1: randomSquare,
          num2: null,
          operation: 'square-root',
          answer: Math.sqrt(randomSquare),
          display: `√${randomSquare}`
        };
      }
    }
  };

  // Add timer effect
  useEffect(() => {
    let timer;
    if (!gameState.showModeSelector && !gameState.showWelcome && !gameState.showInstructions && !gameState.showQuestion) {
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
  }, [gameState.showModeSelector, gameState.showWelcome, gameState.showInstructions, gameState.showQuestion]);

  // Generate bonus positions - maximum 1 per 8 cells
  const generateBonusPositions = useCallback((size) => {
    const totalCells = size * size;
    const maxBonuses = Math.floor(totalCells / 8); // Maximum 1 bonus per 8 cells
    const bonusPositions = new Set();
    
    // Don't place bonus on starting position (0,0)
    const availablePositions = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!(r === 0 && c === 0)) { // Skip starting position
          availablePositions.push(`${r}-${c}`);
        }
      }
    }
    
    // Randomly select bonus positions
    for (let i = 0; i < maxBonuses && availablePositions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions.splice(randomIndex, 1)[0];
      bonusPositions.add(position);
    }
    
    return bonusPositions;
  }, []);

  const createNewCellData = useCallback((r, c, isStartCell, bonusPositions) => {
    const questionData = gameState.selectedMode 
      ? gameModeConfig[gameState.selectedMode].generateQuestion(r, c)
      : { num1: r + 1, num2: c + 1, answer: (r + 1) * (c + 1), display: `${r + 1} × ${c + 1}` };

    const isBonus = bonusPositions.has(`${r}-${c}`);

    return {
      row: r,
      col: c,
      grass: isStartCell ? 0 : 100,
      question: questionData.display,
      questionData: questionData,
      originalMultiplier1: questionData.num1,
      originalMultiplier2: questionData.num2,
      correctAnswer: questionData.answer,
      isBonus: isBonus,
      isRevealed: isStartCell,
      bonusCollected: false,
      wasEverZeroGrass: isStartCell,
      hintGivenForHardReset: false
    };
  }, [gameState.selectedMode]);

  const initializeGame = useCallback(() => {
    if (!gameState.selectedMode) return;
    
    const newBoardData = [];
    const size = gameState.currentLevelSize;
    const bonusPositions = generateBonusPositions(size);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isStartCell = r === 0 && c === 0;
        newBoardData.push(createNewCellData(r, c, isStartCell, bonusPositions));
      }
    }

    setGameState(prev => ({
      ...prev,
      boardData: newBoardData,
      playerPosition: { row: 0, col: 0, direction: 'S' },
      gameStartTime: Date.now()
    }));
  }, [gameState.currentLevelSize, gameState.selectedMode, createNewCellData, generateBonusPositions]);

  useEffect(() => {
    if (!gameState.showModeSelector && !gameState.showWelcome && !gameState.showInstructions && gameState.boardData.length === 0) {
      initializeGame();
    }
  }, [gameState.showModeSelector, gameState.showWelcome, gameState.showInstructions, gameState.boardData.length, initializeGame]);

  const calculateCellScore = (row, col, isBonus = false) => {
    const baseScore = row + col + 2; // +2 because coordinates start from 0
    return isBonus ? baseScore * 2 : baseScore;
  };

  const handleModeSelect = (mode) => {
    playSound('move');
    setGameState(prev => ({
      ...prev,
      selectedMode: mode,
      showModeSelector: false,
      showWelcome: true
    }));
  };

  const handleCancel = () => {
    playSound('move');
    onBack();
  };

  const handleShowInstructions = () => {
    playSound('move');
    setGameState(prev => ({
      ...prev,
      showWelcome: false,
      showInstructions: true
    }));
  };

  const handleBackToWelcome = () => {
    playSound('move');
    setGameState(prev => ({
      ...prev,
      showInstructions: false,
      showWelcome: true
    }));
  };

  const handleStartGame = () => {
    playSound('move');
    setGameState(prev => ({
      ...prev,
      showWelcome: false,
      showInstructions: false
    }));
  };

  // Function to handle game end and save score
  const handleGameEnd = useCallback(() => {
    if (gameState.gameStartTime) {
      const gameTimeSpent = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
      updateMultiplicationGameScore(gameState.score, gameTimeSpent);
      
      // Show game end message
      showMessage(`🎉 Gra zakończona! Wynik: ${gameState.score} punktów`, 3000);
    }
  }, [gameState.score, gameState.gameStartTime, updateMultiplicationGameScore]);

  const handleAnswer = (answer) => {
    const currentCell = gameState.boardData.find(
      cell => cell.row === gameState.currentQuestion.row && cell.col === gameState.currentQuestion.col
    );
    
    const correctAnswer = currentCell.correctAnswer;
    
    if (parseInt(answer) === correctAnswer) {
      playSound('correct');
      
      const newBoardData = gameState.boardData.map(cell => {
        if (cell.row === currentCell.row && cell.col === currentCell.col) {
          const newGrass = Math.max(0, cell.grass - Math.ceil(cell.grass * 0.50));
          const wasCleared = newGrass <= 50; // FIXED: Bonus collected when grass <= 50%
          
          return {
            ...cell,
            grass: newGrass,
            isRevealed: true,
            hintGivenForHardReset: false,
            wasEverZeroGrass: newGrass === 0 ? true : cell.wasEverZeroGrass,
            // FIXED: Mark bonus as collected when grass <= 50%
            bonusCollected: (wasCleared && cell.isBonus && !cell.bonusCollected) ? true : cell.bonusCollected
          };
        }
        return cell;
      });

      // Calculate score based on coordinates and bonus
      let cellScore = calculateCellScore(currentCell.row, currentCell.col, false);
      let bonusMessage = '';
      
      // FIXED: Check if this is a bonus cell and grass dropped to 50% or less
      const updatedCell = newBoardData.find(c => c.row === currentCell.row && c.col === currentCell.col);
      if (currentCell.isBonus && updatedCell.grass <= 50 && !currentCell.bonusCollected) {
        const bonusPoints = calculateCellScore(currentCell.row, currentCell.col, true) - cellScore;
        cellScore = calculateCellScore(currentCell.row, currentCell.col, true);
        bonusMessage = ` (${t('bonusPoints')} +${bonusPoints}!)`;
        playSound('bonus');
      }

      setGameState(prev => ({
        ...prev,
        boardData: newBoardData,
        score: prev.score + cellScore,
        showQuestion: false,
        currentQuestion: null,
        wrongAnswersCount: 0,
        playerPosition: {
          ...prev.playerPosition,
          row: currentCell.row,
          col: currentCell.col
        }
      }));

      showMessage(`${t('great')} +${cellScore} ${t('points')}${bonusMessage}`, 2000);
    } else {
      playSound('wrong');
      
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

      showMessage(t('wrong'), 2000);
    }
  };

  const handleKeyPress = useCallback((e) => {
    if (gameState.showModeSelector || gameState.showWelcome || gameState.showInstructions || gameState.showQuestion) return;

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
          playSound('move');
          
          // FIXED: Check if stepping on a bonus cell that hasn't been collected and grass <= 50%
          if (targetCell.isBonus && !targetCell.bonusCollected && targetCell.grass <= 50) {
            const bonusScore = calculateCellScore(targetCell.row, targetCell.col, false); // Base score for stepping on
            
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

            playSound('bonus');
            showMessage(`${t('bonusCollected')} +${bonusScore} ${t('points')}!`, 2000);
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
          playSound('question');
          setGameState(prev => ({
            ...prev,
            showQuestion: true,
            currentQuestion: targetCell,
            wrongAnswersCount: 0 // Reset wrong answers for new question
          }));
        }
      } else {
        playSound('error');
        showMessage(t('cannotGo'), 1500);
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
      if (e.key !== 'ArrowUp') {
        playSound('move');
      }
      setGameState(prev => ({
        ...prev,
        playerPosition: {
          row: newRow,
          col: newCol,
          direction: newDirection
        }
      }));
    }
  }, [gameState.showModeSelector, gameState.showWelcome, gameState.showInstructions, gameState.showQuestion, gameState.playerPosition, gameState.currentLevelSize, gameState.boardData, t, playSound]);

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

  const getGameTitle = () => {
    if (gameState.selectedMode && gameModeConfig[gameState.selectedMode]) {
      return `${t('multiplicationGameTitle')} - ${gameModeConfig[gameState.selectedMode].name}`;
    }
    return t('multiplicationGameTitle');
  };

  // Handle game exit - save score when leaving
  const handleBackWithSave = () => {
    if (gameState.score > 0 && gameState.gameStartTime) {
      handleGameEnd();
    }
    onBack();
  };

  return (
    <div className="h-screen flex flex-col bg-bg-main">
      {gameState.showModeSelector || gameState.showWelcome || gameState.showInstructions ? (
        <GlobalHeader 
          title={getGameTitle()}
          onBack={handleBackWithSave}
          showBackButton={true}
        />
      ) : (
        <GlobalHeader 
          title={getGameTitle()}
          onBack={handleBackWithSave}
          showBackButton={true}
        />
      )}

      {gameState.showModeSelector ? (
        <GameModeSelector 
          onModeSelect={handleModeSelect} 
          onCancel={handleCancel}
        />
      ) : gameState.showWelcome ? (
        <WelcomeModal 
          selectedMode={gameState.selectedMode}
          gameModeConfig={gameModeConfig}
          onStart={handleStartGame}
          onShowInstructions={handleShowInstructions}
        />
      ) : gameState.showInstructions ? (
        <InstructionsModal 
          selectedMode={gameState.selectedMode}
          gameModeConfig={gameModeConfig}
          onBack={handleBackToWelcome}
          onStart={handleStartGame}
        />
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
              playSound={playSound}
              selectedMode={gameState.selectedMode}
              gameModeConfig={gameModeConfig}
            />
          </div>

          {/* 2D View - Bottom Half */}
          <div className="h-1/2 bg-bg-card flex flex-col md:flex-row">
            {/* Map Section - Full width on mobile, 60% on desktop */}
            <div className="flex-1 md:w-3/5 flex flex-col justify-center items-center p-2 md:p-4">
              <MapGrid 
                boardData={gameState.boardData}
                playerPosition={gameState.playerPosition}
                currentLevelSize={gameState.currentLevelSize}
                level={1}
              />
            </div>

            {/* Stats Section - Full width on mobile, 40% on desktop */}
            <div className="md:w-2/5 p-2 md:p-6 md:border-l border-bg-neutral">
              <div className="h-full">
                {/* Game Mode Display */}
                {gameState.selectedMode && (
                  <div className="bg-amber-100 p-2 md:p-4 rounded-lg border border-amber-300 mb-2 md:mb-4">
                    <div className="text-center">
                      <div className="text-amber-800 font-bold text-sm md:text-lg mb-1">{t('gameMode')}</div>
                      <div className="text-amber-700 text-base md:text-xl font-bold">
                        {gameModeConfig[gameState.selectedMode].name}
                      </div>
                      <div className="text-amber-600 text-xs md:text-sm">
                        {gameModeConfig[gameState.selectedMode].symbol} {t('operations')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats in responsive grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
                  {/* Points */}
                  <div className="bg-green-100 p-2 md:p-4 rounded-lg border border-green-300">
                    <div className="text-center">
                      <div className="text-green-800 font-bold text-xs md:text-base mb-1">{t('points')}</div>
                      <div className="text-green-700 text-lg md:text-xl font-bold">
                        {gameState.score}
                      </div>
                      <div className="text-green-600 text-xs">🏆 {t('earned')}</div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="bg-blue-100 p-2 md:p-4 rounded-lg border border-blue-300">
                    <div className="text-center">
                      <div className="text-blue-800 font-bold text-xs md:text-base mb-1">{t('time')}</div>
                      <div className="text-blue-700 text-lg md:text-xl font-bold">
                        {formatTime(gameState.timeElapsed)}
                      </div>
                      <div className="text-blue-600 text-xs">⏱️ {t('elapsed')}</div>
                    </div>
                  </div>

                  {/* Grass Cleared Percentage */}
                  <div className="bg-purple-100 p-2 md:p-4 rounded-lg border border-purple-300">
                    <div className="text-center">
                      <div className="text-purple-800 font-bold text-xs md:text-base mb-1">{t('grassCleared')}</div>
                      <div className="text-purple-700 text-lg md:text-xl font-bold">
                        {calculateGrassClearedPercentage()}%
                      </div>
                      <div className="text-purple-600 text-xs">🌱 {t('cleared')}</div>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="bg-orange-100 p-2 md:p-4 rounded-lg border border-orange-300">
                    <div className="text-center">
                      <div className="text-orange-800 font-bold text-xs md:text-base mb-1">{t('level')}</div>
                      <div className="text-orange-700 text-lg md:text-xl font-bold">
                        {gameState.currentLevelSize}×{gameState.currentLevelSize}
                      </div>
                      <div className="text-orange-600 text-xs">🌴 Rozmiar</div>
                    </div>
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
          playSound={playSound}
          selectedMode={gameState.selectedMode}
          gameModeConfig={gameModeConfig}
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