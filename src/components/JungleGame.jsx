import React, { useCallback } from 'react';
import GlobalHeader from './GlobalHeader';
import Scene3D from './GameComponents/Scene3D';
import MapGrid from './GameComponents/MapGrid';
import QuestionModal from './GameComponents/QuestionModal';
import WelcomeModal from './GameComponents/WelcomeModal';
import InstructionsModal from './GameComponents/InstructionsModal';
import GameModeSelector from './GameComponents/GameModeSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';
import { useJungleGame } from '../hooks/useJungleGame';
import { useSettings } from '../contexts/SettingsContext';

const JungleGame = ({ onBack, startWithModeSelector = false }) => {
  const { t } = useLanguage();
  const { t: tJungle } = useTranslation('jungleGame');
  const { playSound } = useSoundEffects();
  const { stopLearning } = useGlobalTimer();
  const { settings } = useSettings();
  
  const {
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
    formatTime
  } = useJungleGame(startWithModeSelector);

  const handleCancel = () => {
    playSound('move');
    // Stop learning timer
    stopLearning();
    onBack();
  };

  const handleBackWithSave = () => {
    if (gameState.score > 0 && gameState.gameStartTime) {
      handleGameEnd();
    }
    // Stop learning timer
    stopLearning();
    onBack();
  };

  // ESC key handler for exiting game
  const handleEscapeKey = useCallback((e) => {
    if (e.key === 'Escape') {
      // If in a modal, close the modal first
      if (gameState.showQuestion) {
        setGameState(prev => ({
          ...prev,
          showQuestion: false,
          currentQuestion: null,
          wrongAnswersCount: 0
        }));
        return;
      }
      
      if (gameState.showInstructions) {
        setGameState(prev => ({
          ...prev,
          showInstructions: false,
          showWelcome: true
        }));
        return;
      }
      
      if (gameState.showWelcome) {
        setGameState(prev => ({
          ...prev,
          showWelcome: false,
          showModeSelector: true
        }));
        return;
      }
      
      if (gameState.showModeSelector) {
        handleCancel();
        return;
      }
      
      // If in main game, show confirmation dialog
      if (confirm(tJungle('exitGameConfirm'))) {
        if (gameState.score > 0 && gameState.gameStartTime) {
          handleGameEnd();
        }
        handleCancel();
      }
    }
  }, [gameState, handleCancel, handleGameEnd, tJungle]);

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

            const newVisibleBoardData = gameState.visibleBoardData.map(cell => {
              if (cell.row === targetCell.row && cell.col === targetCell.col) {
                return { ...cell, bonusCollected: true };
              }
              return cell;
            });

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
            showMessage(`${tJungle('bonusCollected')} +${bonusScore} ${tJungle('points')}!`, 2000);
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
        showMessage(tJungle('cannotGo'), 1500);
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
  }, [gameState, tJungle, playSound]);

  // Combined keyboard event handler
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleEscapeKey(e);
      } else {
        handleKeyPress(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, handleEscapeKey]);

  const calculateCellScore = (row, col, isBonus = false) => {
    const baseScore = row + col + 2;
    return isBonus ? baseScore * 2 : baseScore;
  };

  const getGameTitle = () => {
    if (gameState.selectedMode && gameModeConfig[gameState.selectedMode]) {
      return `${t('jungleGameTitle')}: ${gameModeConfig[gameState.selectedMode].name}`;
    }
    return t('jungleGameTitle');
  };

  const handleModeSelectWithSound = (mode) => {
    playSound('move');
    handleModeSelect(mode);
  };

  const handleShowInstructionsWithSound = () => {
    playSound('move');
    handleShowInstructions();
  };

  const handleBackToWelcomeWithSound = () => {
    playSound('move');
    handleBackToWelcome();
  };

  const handleStartGameWithSound = () => {
    playSound('move');
    handleStartGame();
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
          onModeSelect={handleModeSelectWithSound} 
          onCancel={handleCancel}
        />
      ) : gameState.showWelcome ? (
        <WelcomeModal 
          selectedMode={gameState.selectedMode}
          gameModeConfig={gameModeConfig}
          onStart={handleStartGameWithSound}
          onShowInstructions={handleShowInstructionsWithSound}
          onCancel={handleCancel}
        />
      ) : gameState.showInstructions ? (
        <InstructionsModal 
          selectedMode={gameState.selectedMode}
          gameModeConfig={gameModeConfig}
          onBack={handleBackToWelcomeWithSound}
          onStart={handleStartGameWithSound}
          onCancel={handleCancel}
        />
      ) : (
        <div className="flex-1 flex flex-col pt-14 overflow-hidden">
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
                      <div className="text-green-800 font-bold text-xs md:text-base mb-1">{tJungle('points')}</div>
                      <div className="text-green-700 text-lg md:text-xl font-bold">
                        {gameState.score}
                      </div>
                      <div className="text-green-600 text-xs">🏆 {tJungle('earned')}</div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="bg-blue-100 p-2 md:p-4 rounded-lg border border-blue-300">
                    <div className="text-center">
                      <div className="text-blue-800 font-bold text-xs md:text-base mb-1">{tJungle('time')}</div>
                      <div className="text-blue-700 text-lg md:text-xl font-bold">
                        {formatTime(gameState.timeElapsed)}
                      </div>
                      <div className="text-blue-600 text-xs">⏱️ {tJungle('elapsed')}</div>
                    </div>
                  </div>

                  {/* Grass Cleared Percentage */}
                  <div className="bg-purple-100 p-2 md:p-4 rounded-lg border border-purple-300">
                    <div className="text-center">
                      <div className="text-purple-800 font-bold text-xs md:text-base mb-1">{tJungle('grassCleared')}</div>
                      <div className="text-purple-700 text-lg md:text-xl font-bold">
                        {calculateGrassClearedPercentage()}%
                      </div>
                      <div className="text-purple-600 text-xs">🌱 {tJungle('cleared')}</div>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="bg-orange-100 p-2 md:p-4 rounded-lg border border-orange-300">
                    <div className="text-center">
                      <div className="text-orange-800 font-bold text-xs md:text-base mb-1">{tJungle('level')}</div>
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
          onCancel={() => setGameState(prev => ({
            ...prev,
            showQuestion: false,
            currentQuestion: null,
            wrongAnswersCount: 0
          }))}
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