import React from 'react';

const Scene3D = ({ boardData, playerPosition }) => {
  const { row: pr, col: pc, direction: pdir } = playerPosition;

  // Configure which cells to show based on player direction
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
    if (row < 0 || row >= Math.sqrt(boardData.length) || col < 0 || col >= Math.sqrt(boardData.length)) return null;
    return boardData.find(cell => cell.row === row && cell.col === col);
  };

  const getCellColor = (grass) => {
    if (grass < 10) return '#F0E68C'; // Light khaki for cleared cells
    if (grass <= 100) return '#78B134'; // Green for normal grass
    return '#A0522D'; // Brown for overgrown grass
  };

  return (
    <div 
      className="flex justify-center items-end gap-0 mt-10 mb-10 w-full h-[250px] p-0 box-border perspective-[800px] relative"
      style={{ backgroundColor: '#87CEEB' }}
    >
      {displayOrderCoords.map((coords, index) => {
        const cellData = getCell(coords.r, coords.c);
        const isInFrontGroup = index > 0 && index < 4;

        const cellContent = cellData && (
          <div 
            className="scene-cell-content"
            style={{
              backgroundColor: getCellColor(cellData.grass),
              height: `${Math.min(100, (cellData.grass / 100) * 100)}%`,
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.2)'
            }}
          >
            {cellData.isBonus && !cellData.bonusCollected && (
              <div className="absolute top-2 right-2 text-yellow-400 text-xl" style={{ textShadow: '0 0 3px black' }}>
                ⭐
              </div>
            )}
          </div>
        );

        if (isInFrontGroup) {
          return (
            <div
              key={`${coords.r}-${coords.c}`}
              className={`scene-cell ${viewClasses[index]} border border-[#1a1a1a]`}
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
            key={`${coords.r}-${coords.c}`}
            className={`scene-cell ${viewClasses[index]} absolute border border-[#1a1a1a]`}
            style={{
              width: '45%',
              height: '240px',
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