const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/app/admin/page.tsx');
if (!fs.existsSync(filePath)) {
  console.error('File not found!');
  process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf8');

let openCurly = 0;
let closeCurly = 0;
let openParen = 0;
let closeParen = 0;
let openSquare = 0;
let closeSquare = 0;

let inString = false;
let stringChar = null;
let inComment = false;
let inRegex = false;

for (let i = 0; i < code.length; i++) {
  const char = code[i];
  const nextChar = code[i+1];
  const prevChar = code[i-1];

  // Handle single-line comment
  if (inComment === 'line' && char === '\n') {
    inComment = false;
    continue;
  }

  // Handle block comment
  if (inComment === 'block' && char === '*' && nextChar === '/') {
    inComment = false;
    i++;
    continue;
  }

  if (inComment) continue;

  // Handle strings
  if (inString) {
    if (char === stringChar && prevChar !== '\\') {
      inString = false;
    }
    continue;
  }

  // Start of comments
  if (char === '/' && nextChar === '/') {
    inComment = 'line';
    i++;
    continue;
  }
  if (char === '/' && nextChar === '*') {
    inComment = 'block';
    i++;
    continue;
  }

  // Start of strings
  if (char === '"' || char === "'" || char === '`') {
    inString = true;
    stringChar = char;
    continue;
  }

  if (char === '{') openCurly++;
  if (char === '}') closeCurly++;
  if (char === '(') openParen++;
  if (char === ')') {
    closeParen++;
    if (openParen < closeParen) {
      console.log(`⚠️ Unmatched closing parenthesis ) at character index ${i}, line ${code.substring(0, i).split('\n').length}`);
    }
  }
  if (char === '[') openSquare++;
  if (char === ']') closeSquare++;
}

console.log('=== BRACKET COUNT RESULTS ===');
console.log(`Curly Braces {}:  Open = ${openCurly}, Close = ${closeCurly}, Diff = ${openCurly - closeCurly}`);
console.log(`Parentheses ():   Open = ${openParen}, Close = ${closeParen}, Diff = ${openParen - closeParen}`);
console.log(`Square Brackets []: Open = ${openSquare}, Close = ${closeSquare}, Diff = ${openSquare - closeSquare}`);
