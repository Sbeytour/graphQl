export const createAuditRatioPieChart = (containerId, totalUp, totalDown) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // If no data is available
    if (totalUp === 0 && totalDown === 0) {
        container.innerHTML = '<div class="no-data">No audit data available</div>';
        return;
    }

    // Calculate total and percentages
    const total = totalUp + totalDown;
    const upPercentage = Math.round((totalUp / total) * 100) || 0;
    const downPercentage = Math.round((totalDown / total) * 100) || 0;

    // Chart dimensions
    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, 300);
    const radius = size / 2 * 0.8;
    const centerX = size / 2;
    const centerY = size / 2;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.display = 'block';
    svg.style.margin = '0 auto';

    // Function to create pie slices
    const createSlice = (startAngle, endAngle, color) => {
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        // Determine which arc to use (large or small)
        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

        // Create path for slice
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        path.setAttribute('d', d);
        path.setAttribute('fill', color);
        return path;
    };

    // Calculate angles (in radians)
    const upAngle = (upPercentage / 100) * Math.PI * 2;
    const downAngle = (downPercentage / 100) * Math.PI * 2;

    // Create the pie slices
    const startAngle = -Math.PI / 2; // Start at top (270 degrees)
    if (upPercentage > 0) {
        const upSlice = createSlice(startAngle, startAngle + upAngle, '#27ae60');
        svg.appendChild(upSlice);
    }

    if (downPercentage > 0) {
        const downSlice = createSlice(startAngle + upAngle, startAngle + upAngle + downAngle, '#e74c3c');
        svg.appendChild(downSlice);
    }

    // Add the SVG to the container
    container.appendChild(svg);

    // Create legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    legend.style.display = 'flex';
    legend.style.justifyContent = 'center';
    legend.style.marginTop = '20px';
    legend.style.gap = '20px';

    // Legend for audit up
    const legendUp = document.createElement('div');
    legendUp.className = 'legend-item';
    legendUp.style.display = 'flex';
    legendUp.style.alignItems = 'center';
    legendUp.style.gap = '5px';

    const colorBoxUp = document.createElement('div');
    colorBoxUp.style.width = '15px';
    colorBoxUp.style.height = '15px';
    colorBoxUp.style.backgroundColor = '#27ae60';
    colorBoxUp.style.borderRadius = '2px';

    const labelUp = document.createElement('span');
    labelUp.textContent = `Audits Given: ${upPercentage}% (${totalUp})`;

    legendUp.appendChild(colorBoxUp);
    legendUp.appendChild(labelUp);

    // Legend for audit down
    const legendDown = document.createElement('div');
    legendDown.className = 'legend-item';
    legendDown.style.display = 'flex';
    legendDown.style.alignItems = 'center';
    legendDown.style.gap = '5px';

    const colorBoxDown = document.createElement('div');
    colorBoxDown.style.width = '15px';
    colorBoxDown.style.height = '15px';
    colorBoxDown.style.backgroundColor = '#e74c3c';
    colorBoxDown.style.borderRadius = '2px';

    const labelDown = document.createElement('span');
    labelDown.textContent = `Audits Received: ${downPercentage}% (${totalDown})`;

    legendDown.appendChild(colorBoxDown);
    legendDown.appendChild(labelDown);

    // Add legend items to legend
    legend.appendChild(legendUp);
    legend.appendChild(legendDown);

    // Add the legend to the container
    container.appendChild(legend);

    // Add Title
    const title = document.createElement('h3');
    title.textContent = 'Audit Distribution';
    title.style.textAlign = 'center';
    title.style.marginBottom = '15px';
    container.prepend(title);

    // Add animation to make the chart more engaging
    const animateSlices = () => {
        const slices = svg.querySelectorAll('path');
        slices.forEach((slice, index) => {
            slice.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            slice.style.opacity = '0';
            slice.style.transformOrigin = 'center';
            slice.style.transform = 'scale(0.8)';

            setTimeout(() => {
                slice.style.opacity = '1';
                slice.style.transform = 'scale(1)';
            }, 100 * index);
        });
    };

    // Run animation
    setTimeout(animateSlices, 100);

    // Make the chart responsive
    window.addEventListener('resize', () => {
        // Only recreate the chart if the container size has significantly changed
        const newWidth = container.getBoundingClientRect().width;
        if (Math.abs(newWidth - size) > 50) {
            createAuditRatioPieChart(containerId, totalUp, totalDown);
        }
    });

    // Add hover effects
    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
        path.addEventListener('mouseover', () => {
            path.style.opacity = '0.8';
            path.style.transform = 'scale(1.05)';
            path.style.transition = 'opacity 0.3s, transform 0.3s';
        });

        path.addEventListener('mouseout', () => {
            path.style.opacity = '1';
            path.style.transform = 'scale(1)';
        });
    });
};