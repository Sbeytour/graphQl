import { formatXP } from "./utils.js";

// Create a simple pie chart for audit ratio
export const createAuditRatioPieChart = (containerId, totalUp, totalDown) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // If no data available
    if (totalUp === 0 && totalDown === 0) {
        container.innerHTML = '<div class="no-data">No audit data available</div>';
        return;
    }
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', '0 0 200 200');
    
    // Calculate percentages
    const total = totalUp + totalDown;
    const upPercentage = (totalUp / total) * 100;
    const downPercentage = (totalDown / total) * 100;
    
    // Create pie chart
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    // Draw up slice (given)
    const upSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const upAngle = (upPercentage / 100) * Math.PI * 2;
    
    // Calculate coordinates
    const startX = centerX;
    const startY = centerY - radius;
    
    const endX = centerX + radius * Math.sin(upAngle);
    const endY = centerY - radius * Math.cos(upAngle);
    
    // Create path
    const largeArcFlag = upPercentage > 50 ? 1 : 0;
    
    upSlice.setAttribute('d', `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`);
    upSlice.setAttribute('fill', '#27ae60');
    
    svg.appendChild(upSlice);
    
    // Draw down slice (received)
    const downSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    downSlice.setAttribute('d', `M ${centerX} ${centerY} L ${endX} ${endY} A ${radius} ${radius} 0 ${largeArcFlag === 0 ? 1 : 0} 1 ${startX} ${startY} Z`);
    downSlice.setAttribute('fill', '#e74c3c');
    
    svg.appendChild(downSlice);
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Audit Distribution';
    title.className = 'chart-title';
    
    // Add legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    
    legend.innerHTML = `
        <div class="legend-item">
            <span class="color-box" style="background-color: #27ae60;"></span>
            <span>Audits Given: ${upPercentage.toFixed(1)}% (${formatXP(totalUp)})</span>
        </div>
        <div class="legend-item">
            <span class="color-box" style="background-color: #e74c3c;"></span>
            <span>Audits Received: ${downPercentage.toFixed(1)}% (${formatXP(totalDown)})</span>
        </div>
    `;
    
    // Add elements to container
    container.appendChild(title);
    container.appendChild(svg);
    container.appendChild(legend);
};

// Create a simple SVG bar chart for skills
export const createSkillsBarChart = (containerId, skillsData) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // If no data available
    if (!skillsData || skillsData.length === 0) {
        container.innerHTML = '<div class="no-data">No skills data available</div>';
        return;
    }
    
    // Process skill data
    const skillMap = new Map();
    
    skillsData.forEach(item => {
        const skillName = item.type.replace('skill_', '');
        const currentAmount = item.amount;
        
        if (!skillMap.has(skillName) || currentAmount > skillMap.get(skillName)) {
            skillMap.set(skillName, currentAmount);
        }
    });
    
    // Convert to array and sort alphabetically
    const sortedSkills = Array.from(skillMap)
        .map(([name, amount]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            amount
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Skills Distribution';
    title.className = 'chart-title';
    container.appendChild(title);
    
    // Calculate dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 500 - margin.left - margin.right;
    const barHeight = 25;
    const height = Math.max(200, sortedSkills.length * (barHeight + 10));
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    svg.style.overflow = 'visible';
    
    // Create chart group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    
    // Find max value for scaling
    const maxValue = Math.max(...sortedSkills.map(skill => skill.amount));
    
    // Create bars and labels
    sortedSkills.forEach((skill, index) => {
        const y = index * (barHeight + 10);
        const barWidth = (skill.amount / maxValue) * width;
        
        // Create bar
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('y', y);
        bar.setAttribute('height', barHeight);
        bar.setAttribute('width', barWidth);
        bar.setAttribute('fill', '#3498db');
        bar.setAttribute('rx', '3');
        g.appendChild(bar);
        
        // Create skill name label
        const nameLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameLabel.setAttribute('x', -5);
        nameLabel.setAttribute('y', y + barHeight / 2 + 5);
        nameLabel.setAttribute('text-anchor', 'end');
        nameLabel.setAttribute('fill', '#333');
        nameLabel.textContent = skill.name;
        g.appendChild(nameLabel);
        
        // Create value label
        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueLabel.setAttribute('x', barWidth + 5);
        valueLabel.setAttribute('y', y + barHeight / 2 + 5);
        valueLabel.setAttribute('fill', '#555');
        valueLabel.textContent = skill.amount;
        g.appendChild(valueLabel);
    });
    
    // Add the SVG to container
    svg.appendChild(g);
    container.appendChild(svg);
    
    // Make the container scrollable if there are many skills
    if (sortedSkills.length > 8) {
        container.style.overflowY = 'auto';
        container.style.maxHeight = '500px';
    }
};