import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import mapData from '../../data/mapData.json';
import { useProgress } from '../../contexts/ProgressContext';

const ConstellationMap = () => {
  const svgRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const { getProgress } = useProgress();

  // Update node statuses based on progress
  const updateNodeStatuses = (nodeData) => {
    return nodeData.map(node => {
      if (node.id === 'centrum') return node;
      
      // Check if node should be completed based on progress
      const progress = getProgress(node.id);
      if (progress > 0) {
        return { ...node, status: 'completed' };
      }
      
      // Check if node should be available based on dependencies
      if (node.dependencies.length === 0) {
        return { ...node, status: 'available' };
      }
      
      const allDependenciesCompleted = node.dependencies.every(depId => {
        const depProgress = getProgress(depId);
        return depProgress > 0;
      });
      
      return {
        ...node,
        status: allDependenciesCompleted ? 'available' : 'locked'
      };
    });
  };

  useEffect(() => {
    const updatedNodes = updateNodeStatuses(mapData);
    setNodes(updatedNodes);
  }, [getProgress]);

  useEffect(() => {
    if (nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    svg.attr("width", width).attr("height", height);

    // Create container for zoom/pan
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create starfield background
    const stars = container.append("g").attr("class", "stars");
    for (let i = 0; i < 100; i++) {
      stars.append("circle")
        .attr("cx", Math.random() * width)
        .attr("cy", Math.random() * height)
        .attr("r", Math.random() * 1.5)
        .attr("fill", "white")
        .attr("opacity", Math.random() * 0.8 + 0.2);
    }

    // Calculate positions for nodes
    const positionedNodes = nodes.map(node => {
      if (node.id === 'centrum') {
        return { ...node, x: centerX, y: centerY };
      }
      
      if (node.type === 'planet') {
        const angle = (node.angle * Math.PI) / 180;
        return {
          ...node,
          x: centerX + Math.cos(angle) * node.orbitRadius,
          y: centerY + Math.sin(angle) * node.orbitRadius
        };
      }
      
      if (node.type === 'moon' && node.parentId) {
        const parent = nodes.find(n => n.id === node.parentId);
        if (parent) {
          const parentAngle = (parent.angle * Math.PI) / 180;
          const parentX = centerX + Math.cos(parentAngle) * parent.orbitRadius;
          const parentY = centerY + Math.sin(parentAngle) * parent.orbitRadius;
          
          const moonAngle = (node.angle * Math.PI) / 180;
          return {
            ...node,
            x: parentX + Math.cos(moonAngle) * node.orbitRadius,
            y: parentY + Math.sin(moonAngle) * node.orbitRadius
          };
        }
      }
      
      return { ...node, x: centerX, y: centerY };
    });

    // Draw orbital paths
    const orbits = container.append("g").attr("class", "orbits");
    
    // Planet orbits
    orbits.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 150)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5");

    // Moon orbits around planets
    positionedNodes.filter(n => n.type === 'planet').forEach(planet => {
      orbits.append("circle")
        .attr("cx", planet.x)
        .attr("cy", planet.y)
        .attr("r", 80)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.05)")
        .attr("stroke-width", 1);
    });

    // Draw connections
    const connections = container.append("g").attr("class", "connections");
    
    positionedNodes.forEach(node => {
      if (node.dependencies && node.dependencies.length > 0) {
        node.dependencies.forEach(depId => {
          const dependency = positionedNodes.find(n => n.id === depId);
          if (dependency) {
            connections.append("line")
              .attr("x1", dependency.x)
              .attr("y1", dependency.y)
              .attr("x2", node.x)
              .attr("y2", node.y)
              .attr("stroke", "rgba(100,200,255,0.3)")
              .attr("stroke-width", 1)
              .attr("stroke-dasharray", "3,3");
          }
        });
      }
    });

    // Draw nodes
    const nodeGroups = container.selectAll(".node")
      .data(positionedNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", d => (d.status === 'available' || d.status === 'completed') ? "pointer" : "default");

    // Add glow filters
    const defs = svg.append("defs");
    
    const glowFilter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    
    glowFilter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Draw node circles
    nodeGroups.append("circle")
      .attr("r", d => {
        if (d.type === 'sun') return 25;
        if (d.type === 'planet') return 15;
        return 8;
      })
      .attr("fill", d => {
        if (d.status === 'locked') return '#4a5568';
        if (d.status === 'completed') return '#9f7aea';
        if (d.status === 'available') {
          if (d.type === 'sun') return '#ffd700';
          if (d.type === 'planet') return '#4299e1';
          return '#68d391';
        }
        return '#718096';
      })
      .attr("stroke", d => {
        if (d.status === 'completed') return '#9f7aea';
        if (d.status === 'available') return '#ffffff';
        return 'none';
      })
      .attr("stroke-width", d => d.status === 'completed' ? 2 : 1)
      .attr("opacity", d => d.status === 'locked' ? 0.4 : 1)
      .style("filter", d => {
        if (d.status === 'available' || d.status === 'completed') {
          return "url(#glow)";
        }
        return "none";
      });

    // Add pulsing animation for available nodes
    nodeGroups.selectAll("circle")
      .filter(d => d.status === 'available')
      .transition()
      .duration(2000)
      .ease(d3.easeSinInOut)
      .attr("r", d => {
        const baseRadius = d.type === 'sun' ? 25 : d.type === 'planet' ? 15 : 8;
        return baseRadius * 1.1;
      })
      .transition()
      .duration(2000)
      .ease(d3.easeSinInOut)
      .attr("r", d => {
        const baseRadius = d.type === 'sun' ? 25 : d.type === 'planet' ? 15 : 8;
        return baseRadius;
      })
      .on("end", function repeat() {
        d3.select(this)
          .transition()
          .duration(2000)
          .ease(d3.easeSinInOut)
          .attr("r", d => {
            const baseRadius = d.type === 'sun' ? 25 : d.type === 'planet' ? 15 : 8;
            return baseRadius * 1.1;
          })
          .transition()
          .duration(2000)
          .ease(d3.easeSinInOut)
          .attr("r", d => {
            const baseRadius = d.type === 'sun' ? 25 : d.type === 'planet' ? 15 : 8;
            return baseRadius;
          })
          .on("end", repeat);
      });

    // Add labels
    nodeGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", d => {
        const radius = d.type === 'sun' ? 25 : d.type === 'planet' ? 15 : 8;
        return radius + 20;
      })
      .attr("fill", "white")
      .attr("font-size", d => d.type === 'sun' ? "14px" : d.type === 'planet' ? "12px" : "10px")
      .attr("font-weight", d => d.type === 'sun' ? "bold" : "normal")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)")
      .text(d => d.label)
      .each(function(d) {
        const text = d3.select(this);
        const words = d.label.split(' ');
        if (words.length > 1 && d.type !== 'sun') {
          text.text('');
          words.forEach((word, i) => {
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', i === 0 ? 0 : '1.2em')
              .text(word);
          });
        }
      });

    // Add interaction handlers
    nodeGroups
      .on("mouseover", function(event, d) {
        if (d.status === 'available' || d.status === 'completed') {
          setTooltip({
            visible: true,
            x: event.pageX + 10,
            y: event.pageY - 10,
            content: `${d.label} - ${d.status === 'completed' ? 'Ukończone' : 'Dostępne'}`
          });
        } else {
          setTooltip({
            visible: true,
            x: event.pageX + 10,
            y: event.pageY - 10,
            content: `${d.label} - Zablokowane`
          });
        }
      })
      .on("mousemove", function(event) {
        setTooltip(prev => ({
          ...prev,
          x: event.pageX + 10,
          y: event.pageY - 10
        }));
      })
      .on("mouseout", function() {
        setTooltip({ visible: false, x: 0, y: 0, content: '' });
      })
      .on("click", function(event, d) {
        if (d.status === 'available' || d.status === 'completed') {
          if (d.url) {
            // Handle navigation based on URL
            if (d.url.includes('chicken-coop')) {
              window.location.href = '/#chicken-coop';
            } else if (d.url.includes('multiply-divide')) {
              window.location.href = '/#multiplication-game';
            } else {
              console.log(`Navigate to: ${d.url}`);
              // For now, just show an alert for unimplemented lessons
              alert(`Lekcja "${d.label}" będzie dostępna wkrótce!`);
            }
          }
        }
      });

    // Center the view initially
    const initialTransform = d3.zoomIdentity.translate(0, 0).scale(1);
    svg.call(zoom.transform, initialTransform);

  }, [nodes]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: 'radial-gradient(ellipse at center, rgba(30,41,59,0.8) 0%, rgba(15,23,42,1) 100%)' }}
      />
      
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50 pointer-events-none border border-gray-600"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 left-4 bg-gray-800/80 rounded-lg p-3 text-white text-sm">
        <div className="mb-2 font-semibold">Sterowanie:</div>
        <div>🖱️ Przeciągnij - przesuwanie</div>
        <div>🔍 Scroll - powiększanie</div>
        <div>👆 Klik - przejdź do lekcji</div>
      </div>
    </div>
  );
};

export default ConstellationMap;