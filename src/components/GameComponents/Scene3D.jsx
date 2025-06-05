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

  return (
    <div 
      className="flex justify-center items-end gap-0 mt-10 mb-10 w-full h-[250px] p-0 box-border perspective-[800px] relative"
      role="img"
      aria-label="3D view of the jungle from player's perspective"
    >
      {displayOrderCoords.map((coords, index) => {
        const cellData = getCell(coords.r, coords.c);
        const isInFrontGroup = index > 0 && index < 4;
        const isOutOfBounds = coords.r < 0 || coords.r >= currentLevelSize || coords.c < 0 || coords.c >= currentLevelSize;

        const cellContent = (
          <div 
            className="scene-cell-content transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: getCellBackgroundColor(cellData),
              height: getCellHeight(cellData),
              position: 'relative',
              width: '100%',
              alignSelf: 'flex-end'
            }}
          >
            {/* Add bonus star if present */}
            {cellData?.isBonus && !cellData?.bonusCollected && (
              <span 
                className="absolute top-1 right-1 text-yellow-400 text-xs"
                style={{ textShadow: '0 0 2px black' }}
                aria-label="Bonus item"
              >
                ⭐
              </span>
            )}
            
            {/* Add texture/pattern for out-of-bounds areas */}
            {isOutOfBounds && (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px)'
                }}
              />
            )}
          </div>
        );

        if (isInFrontGroup) {
          return (
            <div
              key={`${coords.r}-${coords.c}-${index}`}
              className={`scene-cell ${viewClasses[index]} border border-[#1a1a1a] flex items-end`}
              style={{
                width: '33.33%',
                height: '180px',
                opacity: 1,
                transform: 'rotateY(0deg) translateZ(0px) translateX(0px)',
                transition: 'all 0.3s ease'
              }}
            >
              {cellContent}
            </div>
          );
        }

        return (
          <div
            key={`${coords.r}-${coords.c}-${index}`}
            className={`scene-cell ${viewClasses[index]} absolute border border-[#1a1a1a] flex items-end`}
            style={{
              width: '45%',
              height: '200px',
              opacity: 0.9,
              transform: index === 0 
                ? 'rotateY(65deg) translateX(55px)'
                : 'rotateY(-65deg) translateX(-55px)',
              transformOrigin: index === 0 ? 'left center' : 'right center',
              left: index === 0 ? 0 : 'auto',
              right: index === 4 ? 0 : 'auto',
              bottom: 0,
              zIndex: index === 0 ? 10 : 5,
              transition: 'all 0.3s ease'
            }}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
};

export default Scene3D;