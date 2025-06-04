import React from 'react';

const MapGrid = ({ boardData, playerPosition, currentLevelSize }) => {
  return (
    <div 
      className="grid border border-gray-400 shadow-md"
      style={{ 
        gridTemplateColumns: `repeat(${currentLevelSize}, 1fr)` 
      }}
    >
      {boardData.map((cellData) => {
        const isPlayerHere = cellData.row === playerPosition.row && cellData.col === playerPosition.col;
        
        return (
          <div
            key={`${cellData.row}-${cellData.col}`}
            className="w-[35px] h-[35px] border border-gray-300 flex justify-center items-center text-xs relative bg-clip-padding"
            style={{
              backgroundColor: cellData.grass < 10 
                ? '#F0E68C' 
                : cellData.grass <= 100 
                  ? '#78B134' 
                  : '#A0522D'
            }}
          >
            {cellData.isBonus && !cellData.bonusCollected && (
              <span className="absolute top-0.5 right-0.5 text-yellow-400 text-sm\" style={{ textShadow: '0 0 2px black' }}>
                ⭐
              </span>
            )}
            
            {isPlayerHere && (
              <div 
                className={`absolute w-0 h-0 border-transparent border-[7px]
                  ${playerPosition.direction === 'N' && 'border-b-[10px] border-b-red-500'} 
                  ${playerPosition.direction === 'E' && 'border-l-[10px] border-l-red-500'} 
                  ${playerPosition.direction === 'S' && 'border-t-[10px] border-t-red-500'} 
                  ${playerPosition.direction === 'W' && 'border-r-[10px] border-r-red-500'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MapGrid;