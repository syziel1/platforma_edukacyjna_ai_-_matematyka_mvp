import React from 'react';

const MapGrid = ({ boardData, playerPosition, currentLevelSize }) => {
  const getDirectionRotation = (direction) => {
    switch (direction) {
      case 'N': return '0deg';
      case 'E': return '90deg';
      case 'S': return '180deg';
      case 'W': return '270deg';
      default: return '0deg';
    }
  };

  return (
    <div 
      className="grid border border-gray-400 shadow-md"
      style={{ 
        gridTemplateColumns: `repeat(${currentLevelSize}, 1fr)`,
        gap: '1px'
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
                ? '#F0E68C' // Light khaki for cleared cells
                : cellData.grass <= 100 
                  ? '#78B134' // Green for normal grass
                  : '#A0522D', // Brown for overgrown grass
              transition: 'all 0.3s ease'
            }}
          >
            {cellData.isBonus && !cellData.bonusCollected && (
              <span className="absolute top-0.5 right-0.5 text-yellow-400 text-sm\" style={{ textShadow: '0 0 2px black' }}>
                ⭐
              </span>
            )}
            
            {isPlayerHere && (
              <div 
                className="absolute w-0 h-0 border-[7px] border-transparent"
                style={{
                  borderTopWidth: '10px',
                  borderTopColor: '#ef4444',
                  transform: `rotate(${getDirectionRotation(playerPosition.direction)})`,
                  transition: 'transform 0.3s ease'
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MapGrid;