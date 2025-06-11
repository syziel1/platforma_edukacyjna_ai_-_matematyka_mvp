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
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';

const JungleGame = ({ onBack, startWithModeSelector = false }) => {
  const { t } = useLanguage();
  const { playSound } = useSoundEffects();
  const { updateJungleGameScore } = useGameRecords();
  const { settings } = useSettings();
  const { user } = useAuth();
  
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
        const base = Math.max(2, Math.min(r + 1, c + 1, 5));
        const exponent = Math.max(1, Math.min(Math.max(r, c), 3));
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

  // Generate user-specific storage key
  const getUserStorageKey = (mode) => {
    const userId = user?.id || 'anonymous';
    return `jungleGame_${mode}_${userId}`;
  };

  // Generate bonus positions for 10x10 board - maximum 12 bonuses (1 per 8 cells)
  const generateBonusPositions = useCallback(() => {
    const totalCells = 100; // 10x10
    const maxBonuses = 12; // 1 per ~8 cells
    const bonusPositions = new Set();
    
    // Don't place bonus on starting position (0,0)
    const availablePositions = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!(r === 0 && c === 0)) {
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

  // Create initial 10x10 board for a specific mode
  const createInitialBoard = useCallback((mode) => {
    const boardData = [];
    const bonusPositions = generateBonusPositions();

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const isStartCell = r === 0 && c === 0;
        const questionData = gameModeConfig[mode].generateQuestion(r, c);
        const isBonus = bonusPositions.has(`${r}-${c}`);

        boardData.push({
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
        });
      }
    }

    return boardData;
  }, [gameModeConfig, generateBonusPositions]);

  // Load or create board for specific mode
  const loadOrCreateBoard = useCallback((mode) => {
    const storageKey = getUserStorageKey(mode);
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        
        // Apply grass growth based on days passed
        if (parsedData.lastPlayed) {
          const lastPlayedDate = new Date(parsedData.lastPlayed);
          const now = new Date();
          const daysPassed = Math.floor((now - lastPlayedDate) / (1000 * 60 * 60 * 24));
          
          if (daysPassed > 0) {
            // Apply grass growth formula: height = height * (1.05)^days, max 100%
            parsedData.boardData = parsedData.boardData.map(cell => ({
              ...cell,
              grass: Math.min(100, cell.grass * Math.pow(1.05, daysPassed))
            }));
          }
        }
        
        return parsedData;
      } catch (error) {
        console.error('Error loading board data:', error);
      }
    }
    
    // Create new board if none exists
    const newBoardData = createInitialBoard(mode);
    const newBoardState = {
      boardData: newBoardData,
      currentViewSize: 4,
      lastPlayed: new Date().toISOString()
    };
    
    localStorage.setItem(storageKey, JSON.stringify(newBoardState));
    return newBoardState;
  }, [createInitialBoard, getUserStorageKey, user]);

  // Save board state for specific mode
  const saveBoardState = useCallback((mode, boardData, viewSize) => {
    const storageKey = getUserStorageKey(mode);
    const boardState = {
      boardData: boardData,
      currentViewSize: viewSize,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(boardState));
  }, [getUserStorageKey]);

  // Initialize game state
  const [gameState, setGameState] = useState(() => {
    if (startWithModeSelector) {
      return {
        currentViewSize: 4,
        fullBoardData: [], // Full 10x10 board
        visibleBoardData: [], // Currently visible portion
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
      };
    }

    return {
      currentViewSize: 4,
      fullBoardData: [],
      visibleBoardData: [],
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
    };
  });

  // Extract visible portion of the board based on current view size
  const extractVisibleBoard = useCallback((fullBoard, viewSize) => {
    return fullBoard.filter(cell => 
      cell.row < viewSize && cell.col < viewSize
    );
  }, []);

  // Initialize or load board when mode is selected
  const initializeGameBoard = useCallback((mode) => {
    const boardState = loadOrCreateBoard(mode);
    const visibleBoard = extractVisibleBoard(boardState.boardData, boardState.currentViewSize);
    
    setGameState(prev => ({
      ...prev,
      fullBoardData: boardState.boardData,
      visibleBoardData: visibleBoard,
      currentViewSize: boardState.currentViewSize,
      playerPosition: { row: 0, col: 0, direction: 'S' },
      gameStartTime: Date.now()
    }));
  }, [loadOrCreateBoard, extractVisibleBoard]);

  // Save board state whenever it changes
  useEffect(() => {
    if (gameState.selectedMode && gameState.fullBoardData.length > 0 && 
        !gameState.showModeSelector && !gameState.showWelcome && !gameState.showInstructions) {
      saveBoardState(gameState.selectedMode, gameState.fullBoardData, gameState.currentViewSize);
    }
  }, [gameState.fullBoardData, gameState.currentViewSize, gameState.selectedMode, 
      gameState.showModeSelector, gameState.showWelcome, gameState.showInstructions, saveBoardState]);

  // Timer effect
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

  const calculateCellScore = (row, col, isBonus = false) => {
    const baseScore = row + col + 2;
    return isBonus ? baseScore * 2 : baseScore;
  };

  // Handle game end and save score
  const handleGameEnd = useCallback(() => {
    if (gameState.gameStartTime) {
      const gameTimeSpent = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
      updateJungleGameScore(gameState.score, gameTimeSpent);
      showMessage(`🎉 Game finished! Score: ${gameState.score} points`, 3000);
    }
  }, [gameState.score, gameState.gameStartTime, updateJungleGameScore]);

  // Calculate grass cleared percentage for visible area only
  const calculateGrassClearedPercentage = () => {
    if (gameState.visibleBoardData.length === 0) return 0;
    
    const clearedCells = gameState.visibleBoardData.filter(cell => cell.grass < 100).length;
    const totalCells = gameState.visibleBoardData.length;
    
    return Math.round((clearedCells / totalCells) * 100);
  };

  // Check for level progression (40% of visible area cleared)
  const checkLevelProgression = useCallback(() => {
    const grassClearedPercentage = calculateGrassClearedPercentage();
    
    if (grassClearedPercentage >= 40 && gameState.currentViewSize < 10) {
      const newViewSize = Math.min(10, gameState.currentViewSize + 1);
      const newVisibleBoard = extractVisibleBoard(gameState.fullBoardData, newViewSize);
      
      setGameState(prev => ({
        ...prev,
        currentViewSize: newViewSize,
        visibleBoardData: newVisibleBoard
      }));

      showMessage(`🎉 Level ${newViewSize}×${newViewSize} unlocked!`, 3000);
      if (playSound) {
        playSound('bonus');
      }
    }
  }, [gameState.currentViewSize, gameState.fullBoardData, extractVisibleBoard, playSound]);

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
    
    // Initialize board when game starts
    if (gameState.selectedMode) {
      initializeGameBoard(gameState.selectedMode);
    }
  };

  const handleAnswer = (answer) => {
    const currentCell = gameState.visibleBoardData.find(
      cell => cell.row === gameState.currentQuestion.row && cell.col === gameState.currentQuestion.col
    );
    
    const correctAnswer = currentCell.correctAnswer;
    
    if (parseInt(answer) === correctAnswer) {
      playSound('correct');
      
      // Update both full board and visible board
      const newFullBoardData = gameState.fullBoardData.map(cell => {
        if (cell.row === currentCell.row && cell.col === currentCell.col) {
          const newGrass = Math.max(0, cell.grass - Math.ceil(cell.grass * 0.50));
          const wasCleared = newGrass <= 50;
          
          return {
            ...cell,
            grass: newGrass,
            isRevealed: true,
            hintGivenForHardReset: false,
            wasEverZeroGrass: newGrass === 0 ? true : cell.wasEverZeroGrass,
            bonusCollected: (wasCleared && cell.isBonus && !cell.bonusCollected) ? true : cell.bonusCollected
          };
        }
        return cell;
      });

      const newVisibleBoardData = extractVisibleBoard(newFullBoardData, gameState.currentViewSize);

      // Calculate score
      let cellScore = calculateCellScore(currentCell.row, currentCell.col, false);
      let bonusMessage = '';
      
      const updatedCell = newFullBoardData.find(c => c.row === currentCell.row && c.col === currentCell.col);
      if (currentCell.isBonus && updatedCell.grass <= 50 && !currentCell.bonusCollected) {
        const bonusPoints = calculateCellScore(currentCell.row, currentCell.col, true) - cellScore;
        cellScore = calculateCellScore(currentCell.row, currentCell.col, true);
        bonusMessage = ` (${t('bonusPoints')} +${bonusPoints}!)`;
        playSound('bonus');
      }

      setGameState(prev => ({
        ...prev,
        fullBoardData: newFullBoardData,
        visibleBoardData: newVisibleBoardData,
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
      
      // Check for level progression after successful answer
      setTimeout(() => {
        checkLevelProgression();
      }, 100);
    } else {
      playSound('wrong');
      
      // Update both full board and visible board
      const newFullBoardData = gameState.fullBoardData.map(cell => {
        if (cell.row === currentCell.row && cell.col === currentCell.col) {
          const newGrass = Math.min(200, cell.grass + Math.ceil(cell.grass * 0.20));
          return {
            ...cell,
            grass: newGrass
          };
        }
        return cell;
      });

      const newVisibleBoardData = extractVisibleBoard(newFullBoardData, gameState.currentViewSize);

      setGameState(prev => ({
        ...prev,
        fullBoardData: newFullBoardData,
        visibleBoardData: newVisibleBoardData,
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

      if (newRow >= 0 && newRow < gameState.currentViewSize && 
          newCol >= 0 && newCol < gameState.currentViewSize) {
        const targetCell = gameState.visibleBoardData.find(cell => cell.row === newRow && cell.col === newCol);
        
        if (targetCell.grass < 10) {
          playSound('move');
          
          // Check if stepping on a bonus cell
          if (targetCell.isBonus && !targetCell.bonusCollected && targetCell.grass <= 50) {
            const bonusScore = calculateCellScore(targetCell.row, targetCell.col, false);
            
            // Update both full and visible board data
            const newFullBoardData = gameState.fullBoardData.map(cell => {
              if (cell.row === targetCell.row && cell.col === targetCell.col) {
                return { ...cell, bonusCollected: true };
              }
              return cell;
            });

            const newVisibleBoardData = extractVisibleBoard(newFullBoardData, gameState.currentViewSize);

            setGameState(prev => ({
              ...prev,
              fullBoardData: newFullBoardData,
              visibleBoardData: newVisibleBoardData,
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
            // Normal movement
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
            wrongAnswersCount: 0
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
  }, [gameState, t, playSound, extractVisibleBoard]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameTitle = () => {
    if (gameState.selectedMode && gameModeConfig[gameState.selectedMode]) {
      return `${t('jungleGameTitle')}: ${gameModeConfig[gameState.selectedMode].name}`;
    }
    return t('jungleGameTitle');
  };

  const handleBackWithSave = () => {
    if (gameState.score > 0 && gameState.gameStartTime) {
      handleGameEnd();
    }
    onBack();
  };

  return (
    <div className="h-screen flex flex-col bg-bg-main">
      <GlobalHeader 
        title={getGameTitle()}
        onBack={handleBackWithSave}
        showBackButton={true}
      />

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
          {/* 3D View - 40% of height */}
          <div className="h-2/5 view-3d">
            <div id="playerActionFeedback" className="text-lg mb-2 text-white text-shadow min-h-[25px]" />
            <div id="avatarAnimationFeedback" className="text-2xl min-h-[30px]" />
            
            <Scene3D 
              boardData={gameState.visibleBoardData}
              playerPosition={gameState.playerPosition}
              currentLevelSize={gameState.currentViewSize}
              level={gameState.currentViewSize}
              playSound={playSound}
              selectedMode={gameState.selectedMode}
              gameModeConfig={gameModeConfig}
            />
          </div>

          {/* 2D View - 60% of height */}
          <div className="h-3/5 bg-bg-card flex flex-col md:flex-row overflow-hidden">
            {/* Map Section */}
            <div className="flex-1 md:w-3/5 flex flex-col justify-center items-center p-2 md:p-4 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <MapGrid 
                  boardData={gameState.visibleBoardData}
                  playerPosition={gameState.playerPosition}
                  currentLevelSize={gameState.currentViewSize}
                  level={gameState.currentViewSize}
                  showGrassPercentage={settings.showGrassPercentage}
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="md:w-2/5 p-2 md:p-6 md:border-l border-bg-neutral overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 flex-1">
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
                        {gameState.currentViewSize}×{gameState.currentViewSize}
                      </div>
                      <div className="text-orange-600 text-xs">🌴 Size</div>
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

export default JungleGame;