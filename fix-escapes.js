const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\\`/g, '\`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}

fix('components/player/new-slides.tsx');
fix('app/api/generate-wrap/route.ts');
