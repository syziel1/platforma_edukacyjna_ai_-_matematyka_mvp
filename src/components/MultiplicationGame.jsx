import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import Scene3D from './GameComponents/Scene3D';
import MapGrid from './GameComponents/MapGrid';

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
    isGeminiLoading: false
  });

  const [userId, setUserId] = useState(null);
  const [db, setDb] = useState(null);

  const createNewCellData = useCallback((r, c, isStartCell) => {
    return {
      row: r,
      col: c,
      grass: isStartCell ? 0 : 100,
      question: `${r + 1} x ${c + 1}`,
      originalMultiplier1: r + 1,
      originalMultiplier2: c + 1,
      isBonus: false,
      isRevealed: isStartCell,
      bonusCollected: false,
      hintGivenForHardReset: false,
      wasEverZeroGrass: isStartCell
    };
  }, []);

  const initializeGame = useCallback((newSize) => {
    const oldBoardDataSnapshot = gameState.boardData.length > 0 
      ? JSON.parse(JSON.stringify(gameState.boardData)) 
      : [];
    const previousLevelSize = oldBoardDataSnapshot.length > 0 
      ? Math.sqrt(oldBoardDataSnapshot.length) 
      : 0;

    const newBoardData = [];

    for (let r = 0; r < newSize; r++) {
      for (let c = 0; c < newSize; c++) {
        const isStartCell = r === 0 && c === 0;
        let cellDataToPush;

        if (r < previousLevelSize && c < previousLevelSize && oldBoardDataSnapshot.length > 0) {
          const existingCell = oldBoardDataSnapshot.find(cell => cell.row === r && cell.col === c);
          if (existingCell) {
            cellDataToPush = { ...existingCell };
            cellDataToPush.question = `${r + 1} x ${c + 1}`;
          } else {
            cellDataToPush = createNewCellData(r, c, isStartCell);
          }
        } else {
          cellDataToPush = createNewCellData(r, c, isStartCell);
        }
        newBoardData.push(cellDataToPush);
      }
    }

    setGameState(prev => ({
      ...prev,
      currentLevelSize: newSize,
      boardData: newBoardData,
      playerPosition: { row: 0, col: 0, direction: 'S' }
    }));
  }, [createNewCellData, gameState.boardData]);

  useEffect(() => {
    initializeGame(4);
  }, [initializeGame]);

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
      moved = true;
    } else if (e.key === 'ArrowLeft') {
      const dirs = ['N', 'W', 'S', 'E'];
      const currentIndex = dirs.indexOf(pdir);
      newDirection = dirs[(currentIndex + 1) % 4];
    } else if (e.key === 'ArrowRight') {
      const dirs = ['N', 'E', 'S', 'W'];
      const currentIndex = dirs.indexOf(pdir);
      newDirection = dirs[(currentIndex + 1) % 4];
    }

    if (moved || newDirection !== pdir) {
      setGameState(prev => ({
        ...prev,
        playerPosition: {
          row: newRow,
          col: newCol,
          direction: newDirection
        }
      }));
    }
  }, [gameState.showWelcome, gameState.showQuestion, gameState.playerPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-bg-main relative">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center gap-2 text-text-color hover:text-accent-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Powrót do menu
      </button>

      <div className="flex min-h-screen">
        <div className="flex-1 bg-[#87CEEB] flex flex-col items-center justify-center border-r-2 border-[#3A3A3A] relative p-4">
          <div id="playerActionFeedback" className="text-lg mb-2 text-white text-shadow min-h-[25px]" />
          <div id="avatarAnimationFeedback" className="text-2xl min-h-[30px]" />
          
          <Scene3D 
            boardData={gameState.boardData}
            playerPosition={gameState.playerPosition}
          />
        </div>

        <div className="w-1/2 bg-[#F5F5DC] flex flex-col p-5">
          <div className="flex-1 flex justify-center items-center mb-5">
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
            <div>Trawa usunięta: {Math.round((gameState.boardData.reduce((sum, cell) => 
              sum + (cell.row === 0 && cell.col === 0 ? 0 : Math.min(100, cell.grass)), 0) / 
              ((gameState.currentLevelSize * gameState.currentLevelSize - 1) * 100)) * 100)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplicationGame;