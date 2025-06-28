import { useState, useEffect, useCallback } from 'react';
import { useGameRecords } from '../contexts/GameRecordsContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTimer } from '../hooks/useGlobalTimer';
import { useGameModeConfig } from '../config/gameModes';

export const useJungleGame = (startWithModeSelector = false) => {
  const { updateJungleGameScore } = useGameRecords();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { startLearning, stopLearning } = useGlobalTimer();
  const gameModeConfig = useGameModeConfig();

  // Generate user-specific storage key
  const getUserStorageKey = useCallback((mode) => {
    const userId = user?.id || 'anonymous';
    return `jungleGame_${mode}_${userId}`;
  }, [user]);

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

  // Extract visible portion of the board based on current view size
  const extractVisibleBoard = useCallback((fullBoard, viewSize) => {
    return fullBoard.filter(cell => 
      cell.row < viewSize && cell.col < viewSize
    );
  }, []);

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
    }
  }, [gameState.currentViewSize, gameState.fullBoardData, extractVisibleBoard]);

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

  // Game action handlers
  const handleModeSelect = (mode) => {
    setGameState(prev => ({
      ...prev,
      selectedMode: mode,
      showModeSelector: false,
      showWelcome: true
    }));
  };

  const handleShowInstructions = () => {
    setGameState(prev => ({
      ...prev,
      showWelcome: false,
      showInstructions: true
    }));
  };

  const handleBackToWelcome = () => {
    setGameState(prev => ({
      ...prev,
      showInstructions: false,
      showWelcome: true
    }));
  };

  const handleStartGame = () => {
    setGameState(prev => ({
      ...prev,
      showWelcome: false,
      showInstructions: false
    }));
    
    // NAPRAWIONE: Start learning timer when game actually starts
    startLearning();
    
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
      // Correct answer logic
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
        bonusMessage = ` (Bonus points +${bonusPoints}!)`;
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

      showMessage(`Great! +${cellScore} points${bonusMessage}`, 2000);
      
      // Check for level progression after successful answer
      setTimeout(() => {
        checkLevelProgression();
      }, 100);
    } else {
      // Wrong answer logic - lose points based on error count
      const pointsLost = gameState.wrongAnswersCount + 1; // 1x, 2x, 3x
      
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
        score: Math.max(0, prev.score - pointsLost),
        wrongAnswersCount: prev.wrongAnswersCount + 1
      }));

      // Close modal after 3rd wrong answer
      if (gameState.wrongAnswersCount + 1 >= 3) {
        showMessage(`Wrong answer! -${pointsLost} points. Too many errors - try again!`, 2000);
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            showQuestion: false,
            currentQuestion: null,
            wrongAnswersCount: 0
          }));
        }, 1500);
      } else {
        showMessage(`Wrong answer! -${pointsLost} points. Grass is growing back...`, 2000);
      }
    }
  };

  // NAPRAWIONE: Start learning timer when game actually starts (nie w modalu)
  useEffect(() => {
    if (!gameState.showModeSelector && !gameState.showWelcome && !gameState.showInstructions && gameState.selectedMode) {
      startLearning();
    }
  }, [gameState.showModeSelector, gameState.showWelcome, gameState.showInstructions, gameState.selectedMode, startLearning]);

  return {
    gameState,
    setGameState,
    gameModeConfig,
    handleModeSelect,
    handleShowInstructions,
    handleBackToWelcome,
    handleStartGame,
    handleAnswer,
    handleGameEnd,
    calculateGrassClearedPercentage,
    showMessage,
    formatTime,
    initializeGameBoard
  };
};