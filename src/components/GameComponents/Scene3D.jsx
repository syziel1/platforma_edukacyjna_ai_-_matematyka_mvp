import React, { useMemo, useEffect, useState } from 'react';

const Scene3D = ({ boardData, playerPosition, currentLevelSize, level, playSound }) => {
  const { row: pr, col: pc, direction: pdir } = playerPosition;
  const [animationTrigger, setAnimationTrigger] = useState(0);

  useEffect(() => {
    setAnimationTrigger(prev => prev + 1);
    if (playSound) {
      playSound('move');
    }
  }, [pr, pc, pdir, playSound]);

  const cellMap = useMemo(() => {
    const map = new Map();
    boardData.forEach(cell => {
      map.set(`${cell.row}-${cell.col}`, cell);
    });
    return map;
  }, [boardData]);

  const viewCoordsConfig = {
    'N': { 
      frontView: [{r: pr - 1, c: pc - 1}, {r: pr - 1, c: pc}, {r: pr - 1, c: pc + 1}],
      sideView:  [{r: pr, c: pc - 1}, {r: pr, c: pc + 1}],
      backView: [{r: pr + 1, c: pc - 1}, {r: pr + 1, c: pc}, {r: pr + 1, c: pc + 1}]
    },
    'E': { 
      frontView: [{r: pr - 1, c: pc + 1}, {r: pr, c: pc + 1}, {r: pr + 1, c: pc + 1}],
      sideView:  [{r: pr - 1, c: pc}, {r: pr + 1, c: pc}],
      backView: [{r: pr - 1, c: pc - 1}, {r: pr, c: pc - 1}, {r: pr + 1, c: pc - 1}]
    },
    'S': { 
      frontView: [{r: pr + 1, c: pc + 1}, {r: pr + 1, c: pc}, {r: pr + 1, c: pc - 1}],
      sideView:  [{r: pr, c: pc + 1}, {r: pr, c: pc - 1}],
      backView: [{r: pr - 1, c: pc + 1}, {r: pr - 1, c: pc}, {r: pr - 1, c: pc - 1}]
    },
    'W': { 
      frontView: [{r: pr + 1, c: pc - 1}, {r: pr, c: pc - 1}, {r: pr - 1, c: pc - 1}],
      sideView:  [{r: pr + 1, c: pc}, {r: pr - 1, c: pc}],
      backView: [{r: pr + 1, c: pc + 1}, {r: pr, c: pc + 1}, {r: pr - 1, c: pc + 1}]
    }
  };

  const currentViewConfig = viewCoordsConfig[pdir];
  const displayOrderCoords = [
    currentViewConfig.sideView[0],  
    currentViewConfig.frontView[0], 
    currentViewConfig.frontView[1], 
    currentViewConfig.frontView[2], 
    currentViewConfig.sideView[1]   
  ];
  
  const viewClasses = ['view-far-left', 'view-near-left', 'view-front', 'view-near-right', 'view-far-right'];

  const getCell = (row, col) => {
    if (row < 0 || row >= currentLevelSize || col < 0 || col >= currentLevelSize) {
      return null;
    }
    return cellMap.get(`${row}-${col}`) || null;
  };

  const getCellBackgroundColor = (cellData) => {
    if (!cellData) return '#8B4513'; // Brown for out-of-bounds cells
    
    if (cellData.grass < 10) return '#F0E68C'; // Light khaki for cleared cells
    if (cellData.grass <= 100) return '#78B134'; // Green for normal grass
    return '#A0522D'; // Brown for overgrown grass
  };

  const getCellHeight = (cellData) => {
    if (!cellData) return '60%';
    return `${Math.min(100, Math.max(20, (cellData.grass / 100) * 100))}%`;
  };

  const getBonusIcon = (cellData) => {
    if (!cellData || !cellData.isBonus || cellData.bonusCollected) return null;
    
    const bonusTypes = [
      { icon: '💎', glow: 'rgba(147, 197, 253, 0.8)', name: 'Diamond' },
      { icon: '🏆', glow: 'rgba(251, 191, 36, 0.8)', name: 'Trophy' },
      { icon: '🎯', glow: 'rgba(248, 113, 113, 0.8)', name: 'Target' },
      { icon: '⚡', glow: 'rgba(253, 224, 71, 0.8)', name: 'Lightning' },
      { icon: '🔥', glow: 'rgba(251, 146, 60, 0.8)', name: 'Fire' },
      { icon: '🌟', glow: 'rgba(196, 181, 253, 0.8)', name: 'Star' },
      { icon: '💰', glow: 'rgba(34, 197, 94, 0.8)', name: 'Treasure' },
      { icon: '🎁', glow: 'rgba(244, 114, 182, 0.8)', name: 'Gift' }
    ];
    
    const bonusIndex = (cellData.row + cellData.col + level) % bonusTypes.length;
    return bonusTypes[bonusIndex];
  };

  const getParticleEffect = (cellData) => {
    if (!cellData || cellData.grass >= 10) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${20 + (i * 12)}%`,
              top: `${10 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    );
  };

  const render3DCell = (coords, index) => {
    const cellData = getCell(coords.r, coords.c);
    const isOutOfBounds = !cellData;
    const currentCell = getCell(pr, pc);
    
    return (
      <div
        key={`${coords.r}-${coords.c}-${index}-${animationTrigger}`}
        className={`scene-cell ${viewClasses[index]} relative`}
        style={{
          width: index === 2 ? '33.33%' : '25%',
          height: '140px',
          marginTop: '20px',
          transform: `
            perspective(800px) 
            translateY(-40px)
            ${index === 0 ? 'translateX(-10%) rotateY(45deg)' : ''}
            ${index === 4 ? 'translateX(10%) rotateY(-45deg)' : ''}
          `,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Sky background */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-200"
          style={{
            transform: 'translateZ(-50px)',
            borderRadius: '8px 8px 0 0'
          }}
        />

        {/* Ground/Cell content */}
        <div 
          className="absolute inset-0 flex items-end"
          style={{
            background: getCellBackgroundColor(cellData),
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: `translateZ(${isOutOfBounds ? '-20px' : '0px'})`
          }}
        >
          {/* Grass texture */}
          {cellData && cellData.grass > 10 && (
            <div 
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 5px,
                  rgba(0,0,0,0.1) 5px,
                  rgba(0,0,0,0.1) 10px
                )`
              }}
            />
          )}

          {/* Bonus item */}
          {cellData && cellData.isBonus && !cellData.bonusCollected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl animate-bounce">{getBonusIcon(cellData)?.icon}</span>
            </div>
          )}

          {/* Cell coordinates */}
          <div className="absolute top-2 left-2 text-xs text-white bg-black/50 px-1 rounded">
            {coords.r},{coords.c}
          </div>
        </div>
      </div>
    );
  };

  // Current cell floor
  const currentCell = getCell(pr, pc);
  const floorColor = getCellBackgroundColor(currentCell);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start pt-8">
      {/* Scene container */}
      <div className="relative flex justify-center items-start gap-1 w-full max-w-2xl">
        {displayOrderCoords.map((coords, index) => render3DCell(coords, index))}
      </div>

      {/* Floor */}
      <div 
        className="absolute bottom-0 w-full h-24 transform-gpu"
        style={{
          background: floorColor,
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              ${floorColor} 0%,
              ${floorColor}88 70%,
              transparent 100%
            )`,
            transform: 'rotateX(60deg) translateZ(-20px)',
            transformOrigin: 'bottom'
          }}
        />
      </div>
    </div>
  );
};

export default Scene3D;