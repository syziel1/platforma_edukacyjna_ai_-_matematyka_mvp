import React, { useMemo, useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Scene3D = ({ 
  boardData, 
  playerPosition, 
  currentLevelSize, 
  level, 
  playSound, 
  selectedMode, 
  gameModeConfig 
}) => {
  const { t } = useLanguage();
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

  // FIXED: Dynamic color based on grass height
  const getCellBackgroundColor = (cellData) => {
    if (!cellData) return '#8B4513'; // Brown for out-of-bounds cells
    
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

  const getCellHeight = (cellData) => {
    if (!cellData) return '60%';
    return `${Math.min(100, Math.max(20, (cellData.grass / 100) * 100))}%`;
  };

  const getBonusIcon = (cellData) => {
    if (!cellData || !cellData.isBonus || cellData.grass <= 50) return null;
    
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

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'addition': return '➕';
      case 'subtraction': return '➖';
      case 'multiplication': return '✖️';
      case 'division': return '➗';
      case 'exponentiation': return '⚡';
      case 'square-root': return '√';
      default: return '🧮';
    }
  };

  const getModeColor = (mode) => {
    switch(mode) {
      case 'addition': return '#22c55e'; // green-500
      case 'subtraction': return '#ef4444'; // red-500
      case 'multiplication': return '#3b82f6'; // blue-500
      case 'division': return '#a855f7'; // purple-500
      case 'exponentiation': return '#eab308'; // yellow-500
      case 'square-root': return '#f97316'; // orange-500
      default: return '#3b82f6';
    }
  };

  const formatQuestionDisplay = (cellData) => {
    if (!cellData || !cellData.questionData) {
      return cellData?.question || '';
    }

    const { questionData } = cellData;
    switch(questionData.operation) {
      case 'addition':
        return `${questionData.num1} + ${questionData.num2} = ?`;
      case 'subtraction':
        return `${questionData.num1} - ${questionData.num2} = ?`;
      case 'multiplication':
        return `${questionData.num1} × ${questionData.num2} = ?`;
      case 'division':
        return `${questionData.num1} ÷ ${questionData.num2} = ?`;
      case 'exponentiation':
        return `${questionData.num1}^${questionData.num2} = ?`;
      case 'square-root':
        return `√${questionData.num1} = ?`;
      default:
        return cellData.question;
    }
  };

  // Get the cell directly in front of the player (center front view)
  const getFrontCenterCell = () => {
    const frontCenterCoords = currentViewConfig.frontView[1]; // Middle cell of front view
    return getCell(frontCenterCoords.r, frontCenterCoords.c);
  };

  const frontCenterCell = getFrontCenterCell();

  // Get current player position cell data for background color
  const currentCell = getCell(pr, pc);
  const currentCellColor = getCellBackgroundColor(currentCell);

  // Create gradient background that transitions from sky to current cell color
  const getBackgroundGradient = () => {
    const skyColor = 'rgba(135, 206, 235, 0)'; // Transparent sky blue
    return `linear-gradient(180deg, ${skyColor} 0%, ${skyColor} 50%, ${currentCellColor} 100%)`;
  };

  // FIXED: Handle side view clicks for left/right rotation
  const handleSideViewClick = (isLeftSide) => {
    const keyCode = isLeftSide ? 'ArrowLeft' : 'ArrowRight';
    const event = new KeyboardEvent('keydown', {
      key: keyCode,
      code: keyCode,
      keyCode: isLeftSide ? 37 : 39,
      which: isLeftSide ? 37 : 39,
      bubbles: true
    });
    
    window.dispatchEvent(event);
  };

  // Handle task click/touch - simulate arrow up key press
  const handleTaskClick = (cellData) => {
    if (!cellData || cellData.grass < 10) return; // Only clickable if grassy
    
    // Create a synthetic keyboard event for arrow up
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: 38,
      which: 38,
      bubbles: true
    });
    
    // Dispatch the event to trigger the existing keyboard handler
    window.dispatchEvent(event);
  };

  const render3DCell = (coords, index, isInFrontGroup, currentCellColor) => {
    const cellData = getCell(coords.r, coords.c);
    const isOutOfBounds = coords.r < 0 || coords.r >= currentLevelSize || coords.c < 0 || coords.c >= currentLevelSize;
    const grassHeight = cellData ? Math.min(100, Math.max(20, (cellData.grass / 100) * 100)) : 60;
    const bonusData = getBonusIcon(cellData);
    const isFrontCenter = index === 2; // Center front cell
    const isClickable = cellData && cellData.grass >= 10; // Only grassy cells are clickable
    
    if (isInFrontGroup) {
      return (
        <div
          key={`${coords.r}-${coords.c}-${index}-${animationTrigger}`}
          className={`scene-cell ${viewClasses[index]} relative flex items-end overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 ${isClickable ? 'cursor-pointer' : ''}`}
          style={{
            width: '33.33%',
            height: '180px',
            border: '2px solid #2a2a2a',
            borderRadius: '8px',
            background: `linear-gradient(180deg, 
              rgba(135, 206, 235, 0) 0%, 
              rgba(224, 246, 255, 0) 20%, 
              rgba(240, 248, 255, 0) 40%, 
              ${currentCellColor} 100%)`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            animation: `cellPulse 0.5s ease-out ${index * 0.1}s both`
          }}
          onClick={() => isClickable && handleTaskClick(cellData)}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (isClickable) handleTaskClick(cellData);
          }}
        >
          {/* FIXED: Transparent sky section */}
          <div className="absolute top-0 w-full h-16 overflow-hidden bg-transparent">
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

          {/* Mathematical task display for front center cell */}
          {isFrontCenter && cellData && cellData.grass >= 10 && (
            <div 
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
              onClick={() => handleTaskClick(cellData)}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTaskClick(cellData);
              }}
            >
              <div 
                className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border-2 animate-bounce-gentle hover:scale-105 transition-transform duration-200 active:scale-95"
                style={{ 
                  borderColor: getModeColor(selectedMode),
                  boxShadow: `0 4px 12px rgba(0,0,0,0.2), 0 0 0 2px ${getModeColor(selectedMode)}40`
                }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-lg mr-1">{getModeIcon(selectedMode)}</span>
                    <div className="text-sm font-bold text-gray-800">
                      {t('task')}
                    </div>
                  </div>
                  <div 
                    className="text-lg font-bold mb-1"
                    style={{ color: getModeColor(selectedMode) }}
                  >
                    {formatQuestionDisplay(cellData)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {t('pressUpToSolve')}
                  </div>
                  {/* Click/Touch indicator */}
                  <div className="text-xs text-gray-500 mt-1 opacity-75">
                    👆 Kliknij lub naciśnij ↑
                  </div>
                </div>
              </div>
            </div>
          )}

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
        </div>
      );
    }

    // Enhanced side cells with improved 3D perspective and click handling
    const isLeftSide = index === 0;
    const startRotation = isLeftSide ? '65deg' : '-65deg';
    const endRotation = isLeftSide ? '45deg' : '-45deg';

    return (
      <div
        key={`${coords.r}-${coords.c}-${index}-${animationTrigger}`}
        className={`scene-cell ${viewClasses[index]} absolute overflow-hidden transition-all duration-500 ease-out cursor-pointer`}
        style={{
          width: '35%',
          height: '180px',
          bottom: 26%,
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
            rgba(135, 206, 235, 0) 0%, 
            rgba(176, 224, 230, 0) 15%, 
            rgba(224, 246, 255, 0) 35%, 
            rgba(240, 248, 255, 0) 50%, 
            ${currentCellColor} 100%)`,
          boxShadow: isLeftSide 
            ? '12px 6px 24px rgba(0,0,0,0.5), inset -3px 0 6px rgba(0,0,0,0.3)'
            : '-12px 6px 24px rgba(0,0,0,0.5), inset 3px 0 6px rgba(0,0,0,0.3)',
          '--start-rotation': startRotation,
          '--end-rotation': endRotation,
          animation: 'sideSlide 0.6s ease-out both'
        }}
        onClick={() => handleSideViewClick(isLeftSide)}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleSideViewClick(isLeftSide);
        }}
      >
        {/* FIXED: Transparent sky with animated elements */}
        <div className="absolute inset-x-0 top-0 h-20 overflow-hidden bg-transparent">
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

        {/* Click indicator for side views */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <div className="text-2xl">
              {isLeftSide ? '⬅️' : '➡️'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes cellPulse {
          0% { transform: scale(0.95) translateY(10px); opacity: 0.8; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes sideSlide {
          0% { 
            transform: perspective(500px) rotateY(var(--start-rotation)) 
                      rotateX(-5deg) translateZ(40px) scale(0.8);
            opacity: 0.6;
          }
          100% { 
            transform: perspective(500px) rotateY(var(--end-rotation)) 
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
            transform: perspective(150px) rotateY(var(--end-rotation)) 
                      rotateX(10deg) translateY(0px); 
          }
          50% { 
            transform: perspective(150px) rotateY(var(--end-rotation)) 
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
        className="flex justify-center items-center gap-0 w-full p-0 box-border relative transition-all duration-500 ease-in-out"
        style={{ 
          perspective: '900px',
          perspectiveOrigin: 'center center',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))',
          background: getBackgroundGradient(),
          height: '100%'
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