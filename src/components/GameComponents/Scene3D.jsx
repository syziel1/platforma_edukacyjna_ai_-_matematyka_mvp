import React from 'react';

const Scene3D = ({ boardData, playerPosition }) => {
  const { row: pr, col: pc, direction: pdir } = playerPosition;

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

  return (
    <div 
      className="flex justify-center items-end gap-0 mt-10 mb-10 w-full h-[250px] p-0 box-border perspective-[800px] relative"
    >
      {displayOrderCoords.map((coords, index) => {
        const cellData = getCell(coords.r, coords.c);
        const isInFrontGroup = index > 0 && index < 4;

        const cellContent = cellData && (
          <div 
            className="scene-cell-content"
            style={{
              backgroundColor: cellData.grass < 10 ? '#F0E68C' : cellData.grass <= 100 ? '#78B134' : '#A0522D',
              height: `${Math.min(100, (cellData.grass / 100) * 100)}%`
            }}
          />
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
                transform: 'rotateY(0deg) translateZ(0px) translateX(0px)'
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
              height: '200px',
              opacity: 0.9,
              transform: index === 0 
                ? 'rotateY(65deg) translateX(55px)'
                : 'rotateY(-65deg) translateX(-55px)',
              transformOrigin: index === 0 ? 'left center' : 'right center',
              left: index === 0 ? 0 : 'auto',
              right: index === 4 ? 0 : 'auto',
              bottom: 0,
              zIndex: index === 0 ? 10 : 5
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