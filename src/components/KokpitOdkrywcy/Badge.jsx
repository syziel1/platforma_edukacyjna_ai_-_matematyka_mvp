import React from 'react';

const Badge = ({ iconUrl, name, description }) => {
  return (
    <div 
      className="aspect-square bg-gradient-to-br from-accent-secondary/20 to-accent-primary/20 rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer border border-accent-primary/30 relative group"
      title={`${name}: ${description}`}
    >
      {iconUrl}
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        <div className="font-bold">{name}</div>
        <div className="text-xs opacity-80">{description}</div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
};

export default Badge;