import React, { useMemo, useEffect, useState } from 'react';

const Scene3D = ({ boardData, playerPosition, currentLevelSize, level, playSound }) => {
  const { row: pr, col: pc, direction: pdir } = playerPosition;
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Trigger animation when player moves
  useEffect(() => {
    setAnimationTrigger(prev => prev + 1);
    if (playSound) {
      playSound('move');
    }
  }, [pr, pc, pdir, playSound]);

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
    
    // Enhanced bonus icons based on level and position
    const bonusTypes = [
      { icon: '💎', glow: 'rgba(147, 197, 253, 0.8)', name: 'Diamond' },
      { icon: '🏆', glow: 'rgba(251, 191, 36, 0.8)', name: 'Trophy' },
      { icon: '🎯', glow: 'rgba(248, 113, 113, 0.8)', name: 'Target' },
      { icon: '⚡', glow: 'rgba(253, 224, 71, 0.8)', name: 'Lightning' },
      { icon: '🔥', glow: 'rgba(251, 146, 60, 0.8)', name: 'Fire' },
      { icon: '🌟', glow: 'rgba(196, 181, 253, 0.8)', name: 'Star' },
      { icon: '💰', glow: 'rgba(34, 197, 94, 0.8)', name: 'Treasure' },
      { icon: '🎁', glow: 'rgba(244, 114, 182, 0.8)', name: 'Gift' },
      { icon: '🗝️', glow: 'rgba(163, 163, 163, 0.8)', name: 'Key' },
      { icon: '👑', glow: 'rgba(251, 191, 36, 0.9)', name: 'Crown' },
      { icon: '🎪', glow: 'rgba(139, 92, 246, 0.8)', name: 'Circus' },
      { icon: '🎨', glow: 'rgba(245, 101, 101, 0.8)', name: 'Art' }
    ];
    
    const bonusIndex = (cellData.row + cellData.col + level) % bonusTypes.length;
    return bonusTypes[bonusIndex];
  };

  const getParticleEffect = (cellData) => {
    if (!cellData || cellData.grass >= 10) return null;
    
    // Particle effects for cleared areas
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

  const render3DCell = (coords, index, isInFrontGroup, currentCellColor) => {
    const cellData = getCell(coords.r, coords.c);
    const isOutOfBounds = coords.r < 0 || coords.r >= currentLevelSize || coords.c < 0 || coords.c >= currentLevelSize;
    const grassHeight = cellData ? Math.min(100, Math.max(20, (cellData.grass / 100) * 100)) : 60;
    const bonusData = getBonusIcon(cellData);
    
    if (isInFrontGroup) {
      return (
        <div
          key={`${coords.r}-${coords.c}-${index}-${animationTrigger}`}
          className={`scene-cell ${viewClasses[index]} relative flex items-end overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105`}
          style={{
            width: '33.33%',
            height: '180px',
            border: '2px solid #2a2a2a',
            borderRadius: '8px',
            background: `linear-gradient(180deg, 
              #87CEEB 0%, 
              #E0F6FF 20%, 
              #F0F8FF 40%, 
              ${currentCellColor} 100%)`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            animation: `cellPulse 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          {/* Sky with animated clouds */}
          <div className="absolute top-0 w-full h-16 overflow-hidden">
            <div 
              className="absolute w-8 h-4 bg-white/30 rounded-full animate-float"
              style={{
                top: '20%',
                left: '10%',
                animationDelay: `${index * 0.5}s`,
                animationDuration: '4s'
              }}
            />
            <div 
              className="absolute w-6 h-3 bg-white/20 rounded-full animate-float"
              style={{
                top: '40%',
                right: '15%',
                animationDelay: `${index * 0.7}s`,
                animationDuration: '5s'
              }}
            />
          </div>

          {/* Ground/Grass Layer with enhanced textures */}
          <div 
            className="absolute bottom-0 w-full transition-all duration-700 ease-out"
            style={{
              height: `${grassHeight}%`,
              background: `linear-gradient(180deg, 
                ${getCellBackgroundColor(cellData)} 0%, 
                ${getCellBackgroundColor(cellData)}dd 60%, 
                ${getCellBackgroundColor(cellData)}bb 80%,
                ${getCellBackgroundColor(cellData)}99 100%)`,
              boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.1)'
            }}
          >
            {/* Enhanced grass texture with depth */}
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, 
                    transparent 0px, 
                    rgba(0,0,0,0.1) 1px, 
                    transparent 2px, 
                    transparent 4px
                  ), 
                  repeating-linear-gradient(0deg, 
                    transparent 0px, 
                    rgba(255,255,255,0.15) 1px, 
                    transparent 2px, 
                    transparent 6px
                  ),
                  radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)`
              }}
            />

            {/* Animated grass blades for grassy areas */}
            {cellData && cellData.grass > 50 && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 w-0.5 bg-green-600/60 animate-sway"
                    style={{
                      height: `${15 + (i % 3) * 8}%`,
                      left: `${15 + i * 15}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${2 + (i % 2)}s`,
                      borderRadius: '0 0 50% 50%'
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Enhanced bonus with 3D effect and particles */}
            {bonusData && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="relative animate-bounce-gentle"
                  style={{ 
                    filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 0 12px ${bonusData.glow})`,
                    transform: 'perspective(100px) rotateX(15deg)',
                    animation: 'bonusFloat 3s ease-in-out infinite'
                  }}
                >
                  <span 
                    className="text-2xl block transform hover:scale-110 transition-transform duration-200"
                    style={{ 
                      textShadow: `0 0 12px ${bonusData.glow}, 0 0 24px ${bonusData.glow}50`,
                      fontSize: '20px'
                    }}
                  >
                    {bonusData.icon}
                  </span>
                  
                  {/* Floating particles around bonus */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-orbit"
                        style={{
                          background: bonusData.glow,
                          left: '50%',
                          top: '50%',
                          transformOrigin: `${15 + i * 3}px ${15 + i * 3}px`,
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: '4s'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Pulsing glow effect */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse-glow"
                  style={{
                    background: `radial-gradient(circle, ${bonusData.glow}30 0%, transparent 70%)`,
                    animation: 'pulseGlow 2s ease-in-out infinite'
                  }}
                />
              </div>
            )}

            {/* Particle effects for cleared areas */}
            {getParticleEffect(cellData)}
          </div>
          
          {/* Out of bounds pattern with enhanced visual */}
          {isOutOfBounds && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  repeating-linear-gradient(45deg, 
                    rgba(139,69,19,0.4) 0px, 
                    rgba(139,69,19,0.4) 8px, 
                    rgba(160,82,45,0.3) 8px, 
                    rgba(160,82,45,0.3) 16px
                  )`,
                mixBlendMode: 'multiply'
              }}
            />
          )}

          {/* Level indicator overlay */}
          <div 
            className="absolute top-2 left-2 text-xs font-bold text-white/70 bg-black/20 px-1 rounded"
            style={{ fontSize: '10px' }}
          >
            {coords.r},{coords.c}
          </div>
        </div>
      );
    }

    // Enhanced side cells with improved 3D perspective
    const isLeftSide = index === 0;
    return (
      <div
        key={`${coords.r}-${coords.c}-${index}-${animationTrigger}`}
        className={`scene-cell ${viewClasses[index]} absolute overflow-hidden transition-all duration-500 ease-out`}
        style={{
          width: '35%',
          height: '200px',
          bottom: 0,
          left: isLeftSide ? '-5%' : 'auto',
          right: isLeftSide ? 'auto' : '-5%',
          transform: isLeftSide 
            ? 'perspective(500px) rotateY(45deg) rotateX(-3deg) translateZ(25px) scale(0.95)'
            : 'perspective(500px) rotateY(-45deg) rotateX(-3deg) translateZ(25px) scale(0.95)',
          transformOrigin: isLeftSide ? 'right center' : 'left center',
          zIndex: 8,
          border: '2px solid #1a1a1a',
          borderRadius: '8px',
          background: `linear-gradient(${isLeftSide ? '135deg' : '225deg'}, 
            #87CEEB 0%, 
            #B0E0E6 15%, 
            #E0F6FF 35%, 
            #F0F8FF 50%, 
            ${currentCellColor} 100%)`,
          boxShadow: isLeftSide 
            ? '12px 6px 24px rgba(0,0,0,0.5), inset -3px 0 6px rgba(0,0,0,0.3)'
            : '-12px 6px 24px rgba(0,0,0,0.5), inset 3px 0 6px rgba(0,0,0,0.3)',
          animation: `sideSlide 0.6s ease-out ${index * 0.1}s both`
        }}
      >
        {/* Enhanced sky with animated elements */}
        <div className="absolute inset-x-0 top-0 h-20 overflow-hidden">
          <div 
            className="absolute w-6 h-3 bg-white/25 rounded-full animate-drift"
            style={{
              top: '25%',
              [isLeftSide ? 'left' : 'right']: '20%',
              animationDelay: `${index * 0.8}s`,
              animationDuration: '6s'
            }}
          />
        </div>
        
        {/* Enhanced ground section with 3D depth */}
        <div 
          className="absolute bottom-0 w-full transition-all duration-700 ease-out"
          style={{
            height: `${grassHeight}%`,
            background: `linear-gradient(${isLeftSide ? '145deg' : '215deg'}, 
              ${getCellBackgroundColor(cellData)} 0%, 
              ${getCellBackgroundColor(cellData)}f0 30%, 
              ${getCellBackgroundColor(cellData)}dd 60%,
              ${getCellBackgroundColor(cellData)}cc 80%,
              ${getCellBackgroundColor(cellData)}aa 100%)`,
            boxShadow: `
              inset 0 6px 18px rgba(0,0,0,0.5), 
              inset ${isLeftSide ? '6px' : '-6px'} 0 12px rgba(0,0,0,0.3),
              inset 0 -2px 4px rgba(255,255,255,0.1)`
          }}
        >
          {/* 3D grass texture with enhanced depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  ${isLeftSide ? '55deg' : '-55deg'}, 
                  transparent 0px, 
                  rgba(0,0,0,0.2) 1px, 
                  transparent 2px, 
                  transparent 6px
                ),
                repeating-linear-gradient(
                  ${isLeftSide ? '-35deg' : '35deg'}, 
                  transparent 0px, 
                  rgba(255,255,255,0.15) 1px, 
                  transparent 2px, 
                  transparent 10px
                ),
                radial-gradient(ellipse at ${isLeftSide ? '20%' : '80%'} 70%, 
                  rgba(255,255,255,0.1) 0%, transparent 60%)`,
              opacity: 0.7
            }}
          />
          
          {/* Enhanced side highlight with depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: isLeftSide 
                ? 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)'
                : 'linear-gradient(270deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)'
            }}
          />
          
          {/* Enhanced bonus with 3D side perspective */}
          {bonusData && (
            <div 
              className="absolute top-3 animate-float-side"
              style={{ 
                [isLeftSide ? 'left' : 'right']: '12px',
                filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.7)) drop-shadow(0 0 16px ${bonusData.glow})`,
                fontSize: '16px',
                transform: `perspective(150px) rotateY(${isLeftSide ? '25deg' : '-25deg'}) rotateX(10deg)`,
                animation: 'bonusFloatSide 2.5s ease-in-out infinite'
              }}
            >
              <span 
                className="block transform transition-transform duration-200 hover:scale-110"
                style={{ 
                  textShadow: `0 0 16px ${bonusData.glow}, 0 0 32px ${bonusData.glow}40`,
                }}
              >
                {bonusData.icon}
              </span>
              
              {/* Side particle effects */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-0.5 rounded-full animate-sparkle"
                    style={{
                      background: bonusData.glow,
                      left: `${-5 + i * 8}px`,
                      top: `${-3 + i * 6}px`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '3s'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced out of bounds pattern for side cells */}
        {isOutOfBounds && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                ${isLeftSide ? '145deg' : '35deg'}, 
                rgba(139,69,19,0.5) 0px, 
                rgba(139,69,19,0.5) 6px, 
                rgba(160,82,45,0.4) 6px, 
                rgba(160,82,45,0.4) 12px
              )`,
              mixBlendMode: 'multiply'
            }}
          />
        )}
        
        {/* Enhanced 3D edge highlighting */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: isLeftSide 
              ? `inset 4px 0 8px rgba(255,255,255,0.4), 
                 inset 0 4px 8px rgba(255,255,255,0.3),
                 inset 0 -2px 4px rgba(0,0,0,0.2)`
              : `inset -4px 0 8px rgba(255,255,255,0.4), 
                 inset 0 4px 8px rgba(255,255,255,0.3),
                 inset 0 -2px 4px rgba(0,0,0,0.2)`,
            borderRadius: '8px'
          }}
        />
      </div>
    );
  };

  // Get current player position cell data for background color
  const currentPlayerCell = getCell(pr, pc);
  const currentCellColor = getCellBackgroundColor(currentPlayerCell);

  return (
    <>
      <style jsx>{`
        @keyframes cellPulse {
          0% { transform: scale(0.95) translateY(10px); opacity: 0.8; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes sideSlide {
          0% { 
            transform: perspective(500px) rotateY(${index === 0 ? '65deg' : '-65deg'}) 
                      rotateX(-5deg) translateZ(40px) scale(0.8);
            opacity: 0.6;
          }
          100% { 
            transform: perspective(500px) rotateY(${index === 0 ? '45deg' : '-45deg'}) 
                      rotateX(-3deg) translateZ(25px) scale(0.95);
            opacity: 1;
          }
        }
        
        @keyframes bonusFloat {
          0%, 100% { 
            transform: perspective(100px) rotateX(15deg) translateY(0px) rotateZ(0deg); 
          }
          33% { 
            transform: perspective(100px) rotateX(15deg) translateY(-3px) rotateZ(5deg); 
          }
          66% { 
            transform: perspective(100px) rotateX(15deg) translateY(-1px) rotateZ(-3deg); 
          }
        }
        
        @keyframes bonusFloatSide {
          0%, 100% { 
            transform: perspective(150px) rotateY(${index === 0 ? '25deg' : '-25deg'}) 
                      rotateX(10deg) translateY(0px); 
          }
          50% { 
            transform: perspective(150px) rotateY(${index === 0 ? '25deg' : '-25deg'}) 
                      rotateX(10deg) translateY(-4px); 
          }
        }
        
        @keyframes animate-float {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          33% { transform: translateX(2px) translateY(-1px); }
          66% { transform: translateX(-1px) translateY(1px); }
        }
        
        @keyframes animate-drift {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(8px); }
        }
        
        @keyframes animate-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes animate-orbit {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        
        @keyframes animate-sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.1); 
          }
        }
        
        .animate-float { animation: animate-float 4s ease-in-out infinite; }
        .animate-drift { animation: animate-drift 6s ease-in-out infinite; }
        .animate-sway { animation: animate-sway 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bonusFloat 3s ease-in-out infinite; }
        .animate-float-side { animation: bonusFloatSide 2.5s ease-in-out infinite; }
        .animate-orbit { animation: animate-orbit 4s linear infinite; }
        .animate-sparkle { animation: animate-sparkle 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>
      
      <div 
        className="flex justify-center items-end gap-0 mt-10 mb-10 w-full h-[280px] p-0 box-border relative transition-all duration-500 ease-in-out"
        style={{ 
          perspective: '900px',
          perspectiveOrigin: 'center center',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))'
        }}
        role="img"
        aria-label="Enhanced 3D view of the jungle from player's perspective"
      >
        {/* Ambient lighting effect */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            background: `radial-gradient(ellipse at center bottom, 
              rgba(255,255,255,0.1) 0%, 
              rgba(255,255,255,0.05) 40%, 
              transparent 70%)`,
            zIndex: 10
          }}
        />

        {displayOrderCoords.map((coords, index) => {
          const isInFrontGroup = index > 0 && index < 4;
          return render3DCell(coords, index, isInFrontGroup, currentCellColor);
        })}

        {/* Environmental effects overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated light rays */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,0,0.1) 50%, transparent 100%)',
              animation: 'lightRay 8s ease-in-out infinite',
              transform: 'translateX(-100%)'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes lightRay {
          0%, 100% { transform: translateX(-100%) skewX(-20deg); }
          50% { transform: translateX(100%) skewX(-20deg); }
        }
      `}</style>
    </>
  );
};

export default Scene3D;