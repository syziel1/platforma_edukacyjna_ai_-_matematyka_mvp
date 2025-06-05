import React, { useMemo } from 'react';

const Scene3D = ({ boardData, playerPosition, currentLevelSize }) => {
  const { row: pr, col: pc, direction: pdir } = playerPosition;

  // Create a lookup map for efficient cell retrieval
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
      sideView:  [{r: pr, c: pc - 1}, {r: pr, c: pc + 1}] 
    },
    'E': { 
      frontView: [{r: pr - 1, c: pc + 1}, {r: pr, c: pc + 1}, {r: pr + 1, c: pc + 1}],
      sideView:  [{r: pr - 1, c: pc}, {r: pr + 1, c: pc}]
    },
    'S': { 
      frontView: [{r: pr + 1, c: pc + 1}, {r: pr + 1, c: pc}, {r: pr + 1, c: pc - 1}],
      sideView:  [{r: pr, c: pc + 1}, {r: pr, c: pc - 1}]
    },
    'W': { 
      frontView: [{r: pr + 1, c: pc - 1}, {r: pr, c: pc - 1}, {r: pr - 1, c: pc - 1}],
      sideView:  [{r: pr + 1, c: pc}, {r: pr - 1, c: pc}]
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
    // Use proper boundary checking with currentLevelSize
    if (row < 0 || row >= currentLevelSize || col < 0 || col >= currentLevelSize) {
      return null;
    }
    // Use efficient lookup map instead of find()
    return cellMap.get(`${row}-${col}`) || null;
  };

  const getCellBackgroundColor = (cellData) => {
    if (!cellData) return '#8B4513'; // Brown for out-of-bounds cells
    
    if (cellData.grass < 10) return '#F0E68C'; // Light khaki for cleared cells
    if (cellData.grass <= 100) return '#78B134'; // Green for normal grass
    return '#A0522D'; // Brown for overgrown grass
  };

  const getCellHeight = (cellData) => {
    if (!cellData) return '60%'; // Default height for out-of-bounds
    return `${Math.min(100, Math.max(20, (cellData.grass / 100) * 100))}%`;
  };

  const render3DCell = (coords, index, isInFrontGroup) => {
    const cellData = getCell(coords.r, coords.c);
    const isOutOfBounds = coords.r < 0 || coords.r >= currentLevelSize || coords.c < 0 || coords.c >= currentLevelSize;
    const grassHeight = cellData ? Math.min(100, Math.max(20, (cellData.grass / 100) * 100)) : 60;
    
    if (isInFrontGroup) {
      return (
        <div
          key={`${coords.r}-${coords.c}-${index}`}
          className={`scene-cell ${viewClasses[index]} relative flex items-end overflow-hidden`}
          style={{
            width: '33.33%',
            height: '180px',
            border: '2px solid #2a2a2a',
            borderRadius: '4px',
            background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 30%, #F0E68C 100%)',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Ground/Grass Layer */}
          <div 
            className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
            style={{
              height: `${grassHeight}%`,
              background: `linear-gradient(180deg, 
                ${getCellBackgroundColor(cellData)} 0%, 
                ${getCellBackgroundColor(cellData)}dd 70%, 
                ${getCellBackgroundColor(cellData)}aa 100%)`,
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.3)'
            }}
          >
            {/* Grass texture overlay */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg, 
                  transparent 0px, 
                  rgba(0,0,0,0.1) 1px, 
                  transparent 2px, 
                  transparent 4px
                ), repeating-linear-gradient(
                  0deg, 
                  transparent 0px, 
                  rgba(255,255,255,0.1) 1px, 
                  transparent 2px, 
                  transparent 6px
                )`
              }}
            />
            
            {/* Bonus star */}
            {cellData?.isBonus && !cellData?.bonusCollected && (
              <div 
                className="absolute top-2 right-2 text-yellow-300 animate-pulse"
                style={{ 
                  textShadow: '0 0 4px rgba(255,215,0,0.8), 0 0 8px rgba(255,215,0,0.4)',
                  fontSize: '16px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}
              >
                ⭐
              </div>
            )}
          </div>
          
          {/* Out of bounds pattern */}
          {isOutOfBounds && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(45deg, rgba(139,69,19,0.3) 0px, rgba(139,69,19,0.3) 8px, transparent 8px, transparent 16px)',
                mixBlendMode: 'multiply'
              }}
            />
          )}
        </div>
      );
    }

    // Side cells with 3D perspective effect
    const isLeftSide = index === 0;
    return (
      <div
        key={`${coords.r}-${coords.c}-${index}`}
        className={`scene-cell ${viewClasses[index]} absolute overflow-hidden`}
        style={{
          width: '35%',
          height: '200px',
          bottom: 0,
          left: isLeftSide ? '-5%' : 'auto',
          right: isLeftSide ? 'auto' : '-5%',
          transform: isLeftSide 
            ? 'perspective(400px) rotateY(45deg) rotateX(-2deg) translateZ(20px)'
            : 'perspective(400px) rotateY(-45deg) rotateX(-2deg) translateZ(20px)',
          transformOrigin: isLeftSide ? 'right center' : 'left center',
          zIndex: 8,
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          border: '2px solid #1a1a1a',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 20%, #F0F8FF 40%, #F0E68C 100%)',
          boxShadow: isLeftSide 
            ? '8px 4px 16px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.2)'
            : '-8px 4px 16px rgba(0,0,0,0.4), inset 2px 0 4px rgba(0,0,0,0.2)'
        }}
      >
        {/* Sky gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 30%, #E0F6FF 60%, #F5F5DC 100%)'
          }}
        />
        
        {/* Ground/Grass section */}
        <div 
          className="absolute bottom-0 w-full transition-all duration-500 ease-out"
          style={{
            height: `${grassHeight}%`,
            background: `linear-gradient(${isLeftSide ? '135deg' : '225deg'}, 
              ${getCellBackgroundColor(cellData)} 0%, 
              ${getCellBackgroundColor(cellData)}ee 40%, 
              ${getCellBackgroundColor(cellData)}cc 70%,
              ${getCellBackgroundColor(cellData)}aa 100%)`,
            boxShadow: `inset 0 4px 12px rgba(0,0,0,0.4), 
                       inset ${isLeftSide ? '4px' : '-4px'} 0 8px rgba(0,0,0,0.2)`
          }}
        >
          {/* 3D grass texture with depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  ${isLeftSide ? '45deg' : '-45deg'}, 
                  transparent 0px, 
                  rgba(0,0,0,0.15) 1px, 
                  transparent 2px, 
                  transparent 5px
                ),
                repeating-linear-gradient(
                  ${isLeftSide ? '-45deg' : '45deg'}, 
                  transparent 0px, 
                  rgba(255,255,255,0.1) 1px, 
                  transparent 2px, 
                  transparent 8px
                )`,
              opacity: 0.6
            }}
          />
          
          {/* Side highlight effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: isLeftSide 
                ? 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 40%)'
                : 'linear-gradient(270deg, rgba(255,255,255,0.2) 0%, transparent 40%)'
            }}
          />
          
          {/* Bonus star with 3D effect */}
          {cellData?.isBonus && !cellData?.bonusCollected && (
            <div 
              className="absolute top-2 animate-bounce"
              style={{ 
                [isLeftSide ? 'left' : 'right']: '8px',
                textShadow: '0 0 6px rgba(255,215,0,0.9), 0 0 12px rgba(255,215,0,0.5)',
                fontSize: '14px',
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))',
                transform: `perspective(100px) rotateY(${isLeftSide ? '15deg' : '-15deg'})`
              }}
            >
              <span className="text-yellow-300">⭐</span>
            </div>
          )}
        </div>
        
        {/* Out of bounds diagonal stripes for side cells */}
        {isOutOfBounds && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                ${isLeftSide ? '135deg' : '45deg'}, 
                rgba(139,69,19,0.4) 0px, 
                rgba(139,69,19,0.4) 6px, 
                transparent 6px, 
                transparent 12px
              )`,
              mixBlendMode: 'multiply'
            }}
          />
        )}
        
        {/* 3D edge highlighting */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: isLeftSide 
              ? 'inset 3px 0 6px rgba(255,255,255,0.3), inset 0 3px 6px rgba(255,255,255,0.2)'
              : 'inset -3px 0 6px rgba(255,255,255,0.3), inset 0 3px 6px rgba(255,255,255,0.2)',
            borderRadius: '6px'
          }}
        />
      </div>
    );
  };

  return (
    <div 
      className="flex justify-center items-end gap-0 mt-10 mb-10 w-full h-[250px] p-0 box-border relative"
      style={{ 
        perspective: '800px',
        perspectiveOrigin: 'center center'
      }}
      role="img"
      aria-label="3D view of the jungle from player's perspective"
    >
      {displayOrderCoords.map((coords, index) => {
        const isInFrontGroup = index > 0 && index < 4;
        return render3DCell(coords, index, isInFrontGroup);
      })}
    </div>
  );
};

export default Scene3D;