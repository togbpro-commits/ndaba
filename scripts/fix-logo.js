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
    let original = content;
    
    // Replace the raw logo elements surgically
    content = content.replace(/>NDABAS</g, ">NDABA&apos;S<");
    content = content.replace(/>NDABAS ATTORNEYS</g, ">NDABA&apos;S ATTORNEYS<");
    content = content.replace(/"Ndabas Attorneys CRM"/g, '"Ndaba\'s Attorneys CRM"');
    content = content.replace(/title="Ndabas Attorneys CRM"/g, 'title="Ndaba\'s Attorneys CRM"');
    
    // Also cover other occurrences where NDABAS is used in JSX templates
    content = content.replace(/NDABAS CRM/g, "NDABA&apos;S CRM");
    content = content.replace(/NDABAS ATTORNEYS CRM/g, "NDABA&apos;S ATTORNEYS CRM");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed logo in: ${path.relative(path.join(__dirname, '..'), filePath)}`);
    }
  }
});

console.log('Logo typography correction completed successfully!');
