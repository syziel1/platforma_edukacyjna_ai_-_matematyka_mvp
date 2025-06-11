import React from 'react';

const MapGrid = ({ boardData, playerPosition, currentLevelSize, level, showGrassPercentage = false }) => {
  const getDirectionRotation = (direction) => {
    switch (direction) {
      case 'N': return '180deg';
      case 'E': return '-90deg';
      case 'S': return '0deg';
      case 'W': return '90deg';
      default: return '0deg';
    }
  };

  const getBonusIcon = (cellData) => {
    // Different bonus icons based on level or randomization
    const bonusIcons = ['💎', '🏆', '🎯', '⚡', '🔥', '🌟', '💰', '🎁'];
    const iconIndex = (cellData.row + cellData.col + level) % bonusIcons.length;
    return bonusIcons[iconIndex];
  };

  // FIXED: Dynamic color based on grass height
  const getCellBackgroundColor = (cellData) => {
    if (!cellData) return '#8B4513'; // Brown for out-of-bounds
    
    const grassPercent = cellData.grass / 100;
    
    if (grassPercent <= 0.1) {
      return '#F0E68C'; // Light khaki for cleared cells (sand)
    } else if (grassPercent <= 0.3) {
      return '#9ACD32'; // Yellow-green for low grass
    } else if (grassPercent <= 0.6) {
      return '#7CB342'; // Medium green
    } else if (grassPercent <= 0.8) {
      return '#689F38'; // Darker green
    } else {
      return '#558B2F'; // Very dark green for full grass
    }
  };

  const getCellAnimation = (cellData, isPlayerHere) => {
    let animationClass = '';
    
    if (isPlayerHere) {
      animationClass += ' animate-pulse';
    }
    
    // Only show bonus glow if bonus exists and grass > 50%
    if (cellData.isBonus && cellData.grass > 50) {
      animationClass += ' bonus-glow';
    }
    
    if (cellData.grass < 10) {
      animationClass += ' sand-shimmer';
    }
    
    return animationClass;
  };

  // Calculate responsive cell size based on container and grid size
  const getCellSize = () => {
    // Base size calculation - aim for cells that fit the container
    const baseSize = Math.floor(Math.min(
      (window.innerWidth * 0.4) / currentLevelSize, // 40% of screen width divided by grid size
      (window.innerHeight * 0.35) / currentLevelSize  // 35% of screen height divided by grid size
    ));
    
    // Ensure minimum and maximum sizes
    return Math.max(20, Math.min(35, baseSize));
  };

  const cellSize = getCellSize();

  return (
    <>
      {/* CSS animations */}
      <style jsx>{`
        @keyframes bonusGlow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
            transform: scale(1.02);
          }
        }
        
        @keyframes sandShimmer {
          0%, 100% { 
            box-shadow: inset 0 0 5px rgba(240, 230, 140, 0.3);
          }
          50% { 
            box-shadow: inset 0 0 10px rgba(240, 230, 140, 0.6);
          }
        }
        
        @keyframes bonusBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2px) scale(1.1); }
        }
        
        @keyframes bonusCollected {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }
        
        .bonus-glow {
          animation: bonusGlow 2s ease-in-out infinite;
        }
        
        .sand-shimmer {
          animation: sandShimmer 3s ease-in-out infinite;
        }
        
        .bonus-icon {
          animation: bonusBounce 1.5s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        .bonus-collected {
          animation: bonusCollected 0.5s ease-out forwards;
          filter: grayscale(70%) brightness(0.7);
        }
        
        .grass-wave {
          position: relative;
          overflow: hidden;
        }
        
        .grass-wave::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.2) 50%, 
            transparent 100%);
          animation: grassWave 3s ease-in-out infinite;
        }
        
        @keyframes grassWave {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .player-indicator {
          filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.5));
        }
        
        .player-arrow {
          animation: playerPulse 1s ease-in-out infinite alternate;
          transition: transform 0.3s ease;
        }
        
        @keyframes playerPulse {
          0% { transform: rotate(var(--rotation)) scale(1); }
          100% { transform: rotate(var(--rotation)) scale(1.1); }
        }
      `}</style>
      
      <div 
        className="grid border-2 border-amber-600 shadow-lg rounded-lg overflow-hidden mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${currentLevelSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${currentLevelSize}, ${cellSize}px)`,
          gap: '1px',
          background: 'linear-gradient(45deg, #8B4513, #A0522D)',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {boardData.map((cellData) => {
          const isPlayerHere = cellData.row === playerPosition.row && cellData.col === playerPosition.col;
          const animationClass = getCellAnimation(cellData, isPlayerHere);
          
          return (
            <div
              key={`${cellData.row}-${cellData.col}`}
              className={`border border-gray-400 flex justify-center items-center relative bg-clip-padding transition-all duration-300 ease-in-out ${animationClass}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: getCellBackgroundColor(cellData),
                fontSize: `${Math.max(8, cellSize * 0.3)}px`
              }}
            >
              {/* Grass texture overlay for grassy cells */}
              {cellData.grass >= 10 && (
                <div 
                  className="absolute inset-0 grass-wave opacity-30"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      rgba(0,0,0,0.1) 0px,
                      rgba(0,0,0,0.1) 1px,
                      transparent 1px,
                      transparent 3px
                    )`
                  }}
                />
              )}
              
              {/* Bonus indicator - only show if grass > 50% */}
              {cellData.isBonus && cellData.grass > 50 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="z-10 bonus-icon"
                    style={{ 
                      textShadow: '0 0 8px rgba(255,215,0,0.8), 0 0 4px rgba(0,0,0,0.5)',
                      fontSize: `${Math.max(10, cellSize * 0.4)}px`
                    }}
                  >
                    {getBonusIcon(cellData)}
                  </span>
                  {/* Bonus glow effect */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
                      animation: 'bonusGlow 2s ease-in-out infinite'
                    }}
                  />
                </div>
              )}
              
              {/* Grass percentage display */}
              {showGrassPercentage && cellData.grass < 100 && cellData.grass > 0 && (
                <div 
                  className="absolute top-0 left-0 font-bold text-white bg-black/50 px-1 rounded-br"
                  style={{ fontSize: `${Math.max(6, cellSize * 0.2)}px` }}
                >
                  {Math.round(cellData.grass)}%
                </div>
              )}
              
              {/* Player indicator with enhanced styling */}
              {isPlayerHere && (
                <div className="absolute player-indicator">
                  <div 
                    className="border-transparent player-arrow"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: `${Math.max(4, cellSize * 0.2)}px solid transparent`,
                      borderRight: `${Math.max(4, cellSize * 0.2)}px solid transparent`,
                      borderTop: `${Math.max(6, cellSize * 0.3)}px solid #ef4444`,
                      '--rotation': getDirectionRotation(playerPosition.direction)
                    }}
                  />
                  {/* Player glow effect */}
                  <div 
                    className="absolute rounded-full opacity-50"
                    style={{
                      inset: `-${Math.max(2, cellSize * 0.1)}px`,
                      background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
                      animation: 'playerPulse 1s ease-in-out infinite alternate'
                    }}
                  />
                </div>
              )}
              
              {/* Grass height indicator for visual feedback */}
              {cellData.grass >= 10 && (
                <div 
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-800 to-transparent opacity-20"
                  style={{
                    height: `${Math.min(100, (cellData.grass / 200) * 100)}%`
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MapGrid;