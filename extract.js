const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /<a class="card" href="tools\/([^"]+)">\s*<h3>([^<]+)<\/h3>\s*<p>([^<]+)<\/p>/g;
const tools = [];
let match;
while ((match = regex.exec(html)) !== null) {
  tools.push({ url: '/tools/' + match[1], title: match[2].trim(), description: match[3].trim() });
}
console.log(JSON.stringify(tools, null, 2));
