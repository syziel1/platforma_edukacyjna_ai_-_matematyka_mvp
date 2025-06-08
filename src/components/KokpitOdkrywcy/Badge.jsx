import React from 'react';

const Badge = ({ iconUrl, name }) => {
  return (
    <div 
      className="aspect-square bg-gradient-to-br from-accent-secondary/20 to-accent-primary/20 rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer border border-accent-primary/30"
      title={name}
    >
      {iconUrl}
    </div>
  );
};

export default Badge;