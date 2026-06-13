const https = require('https');

https.get('https://github.com/users/Omerfaruk-aydn/contributions', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const regex = /data-level="(\d+)"/g;
    let match;
    const levels = [];
    while ((match = regex.exec(data)) !== null) {
      levels.push(parseInt(match[1]));
    }
    console.log(`Found ${levels.length} days of data`);
    console.log(levels.slice(-20)); // Last 20 days
  });
});
