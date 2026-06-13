const https = require('https');
const fs = require('fs');
const path = require('path');

const USERNAME = 'Omerfaruk-aydn';

const theme = {
    0: { top: '#1f2335', left: '#15161e', right: '#1a1b26' },
    1: { top: '#3d59a1', left: '#294182', right: '#334e96' },
    2: { top: '#7aa2f7', left: '#5a82d6', right: '#6b92e7' },
    3: { top: '#bb9af7', left: '#9a7ad6', right: '#ab8be7' },
    4: { top: '#f7768e', left: '#d6566e', right: '#e7667e' }
};

function getColors(level) {
    return theme[level] || theme[0];
}

function drawBlock(gx, gy, level) {
    const tileW = 12;
    const tileH = 6;
    const h = level * 15 + 4; // base height 4, +15 per level
    
    // Isometric projection
    const cx = (gx - gy) * tileW;
    const cy = (gx + gy) * tileH;
    
    const colors = getColors(level);
    
    // SVG points for the three visible faces
    const top = `${cx},${cy - h} ${cx + tileW},${cy + tileH - h} ${cx},${cy + tileH * 2 - h} ${cx - tileW},${cy + tileH - h}`;
    const right = `${cx},${cy + tileH * 2 - h} ${cx + tileW},${cy + tileH - h} ${cx + tileW},${cy + tileH} ${cx},${cy + tileH * 2}`;
    const left = `${cx - tileW},${cy + tileH - h} ${cx},${cy + tileH * 2 - h} ${cx},${cy + tileH * 2} ${cx - tileW},${cy + tileH}`;
    
    return `
      <polygon points="${left}" fill="${colors.left}" />
      <polygon points="${right}" fill="${colors.right}" />
      <polygon points="${top}" fill="${colors.top}" />
    `;
}

https.get(`https://github.com/users/${USERNAME}/contributions`, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const regex = /data-level="(\d+)"/g;
        let match;
        const levels = [];
        while ((match = regex.exec(data)) !== null) {
            levels.push(parseInt(match[1]));
        }
        
        // We have ~365-371 days. Let's map them to x (week) and y (day)
        let svgBlocks = [];
        
        // Sorting by depth (back to front) for correct rendering
        // In this projection, back to front means we draw smaller y, then smaller x... 
        // wait, back is (0,0), front is (max_x, max_y). So standard loop is fine.
        
        for (let week = 0; week < 53; week++) {
            for (let day = 0; day < 7; day++) {
                const index = week * 7 + day;
                if (index < levels.length) {
                    const level = levels[index];
                    svgBlocks.push(drawBlock(week, day, level));
                }
            }
        }
        
        // Wrap in SVG
        const width = 800;
        const height = 400;
        // Center the city
        // cx runs from (-6 * tileW) to (52 * tileW)
        // cy runs from 0 to (52 + 6) * tileH
        const minX = -6 * 12;
        const maxX = 53 * 12;
        const minY = -50;
        const maxY = 59 * 6;
        
        const viewBox = `${minX - 50} ${minY - 50} ${maxX - minX + 100} ${maxY - minY + 150}`;
        
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0d1117" />
                    <stop offset="100%" stop-color="#161b22" />
                </linearGradient>
            </defs>
            <rect x="${minX-50}" y="${minY-50}" width="${maxX - minX + 100}" height="${maxY - minY + 150}" fill="url(#bg)" rx="15" />
            <g transform="translate(0, 50)">
                ${svgBlocks.join('\n')}
            </g>
        </svg>`;
        
        const dir = path.join(__dirname, 'assets');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(path.join(dir, 'skyline.svg'), svgContent);
        console.log('Successfully generated assets/skyline.svg');
    });
});
