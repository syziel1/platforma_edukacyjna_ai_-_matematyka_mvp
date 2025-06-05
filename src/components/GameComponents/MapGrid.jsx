import React from 'react';

const MapGrid = ({ boardData, playerPosition, currentLevelSize, level }) => {
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

  const getCellAnimation = (cellData, isPlayerHere) => {
    let animationClass = '';
    
    if (isPlayerHere) {
      animationClass += ' animate-pulse';
    }
    
    if (cellData.isBonus && !cellData.bonusCollected) {
      animationClass += ' bonus-glow';
    }
    
    if (cellData.grass < 10) {
      animationClass += ' sand-shimmer';
    }
    
    return animationClass;
  };

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
          animation: playerPulse 1s ease-in-out infinite alternate;
        }
        
        @keyframes playerPulse {
          0% { transform: rotate(var(--rotation)) scale(1); }
          100% { transform: rotate(var(--rotation)) scale(1.1); }
        }
      `}</style>
      
      <div 
        className="grid border-2 border-amber-600 shadow-lg rounded-lg overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${currentLevelSize}, 1fr)`,
          gap: '1px',
          background: 'linear-gradient(45deg, #8B4513, #A0522D)'
        }}
      >
        {boardData.map((cellData) => {
          const isPlayerHere = cellData.row === playerPosition.row && cellData.col === playerPosition.col;
          const animationClass = getCellAnimation(cellData, isPlayerHere);
          
          return (
            <div
              key={`${cellData.row}-${cellData.col}`}
              className={`w-[35px] h-[35px] border border-gray-400 flex justify-center items-center text-xs relative bg-clip-padding transition-all duration-300 ease-in-out ${animationClass}`}
              style={{
                backgroundColor: cellData.grass < 10 
                  ? '#F0E68C' // Light khaki for cleared cells
                  : cellData.grass <= 100 
                    ? '#78B134' // Green for normal grass
                    : '#A0522D', // Brown for overgrown grass
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
              
              {/* Bonus indicator with enhanced visual */}
              {cellData.isBonus && !cellData.bonusCollected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="bonus-icon text-lg z-10" 
                    style={{ 
                      textShadow: '0 0 8px rgba(255,215,0,0.8), 0 0 4px rgba(0,0,0,0.5)',
                      fontSize: '16px'
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
              
              {/* Player indicator with enhanced styling */}
              {isPlayerHere && (
                <div 
                  className="absolute player-indicator"
                  style={{
                    '--rotation': getDirectionRotation(playerPosition.direction)
                  }}
                >
                  <div 
                    className="w-0 h-0 border-[7px] border-transparent"
                    style={{
                      borderTopWidth: '12px',
                      borderTopColor: '#ef4444',
                      transform: `rotate(${getDirectionRotation(playerPosition.direction)})`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  {/* Player glow effect */}
                  <div 
                    className="absolute -inset-1 rounded-full opacity-50"
                    style={{
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
      
      {/* Level progress indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          <span className="text-amber-800 font-medium">Poziom {level}</span>
          <span className="text-amber-600">🌴</span>
          <span className="text-amber-700 text-sm">{currentLevelSize}×{currentLevelSize}</span>
        </div>
      </div>
    </>
  );
};

export default MapGrid;