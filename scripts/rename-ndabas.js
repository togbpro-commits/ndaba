const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const srcDir = path.join(__dirname, '..', 'src');

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Strict word boundary replace
    let original = content;
    content = content.replace(/\bNDABAS\b/g, "NDABA'S");
    content = content.replace(/\bNdabas\b/g, "Ndaba's");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated typos in: ${path.relative(path.join(__dirname, '..'), filePath)}`);
    }
  }
});

console.log('Typo replacement completed successfully!');
