const fs = require('fs');

// 读取文件内容
const content = fs.readFileSync('./src/pages/agent/AgentBuilder.tsx', 'utf8');
const lines = content.split('\n');

// 记录开放和关闭的标签计数
let openBoxCount = 0;
let closeBoxCount = 0;
let openPaperCount = 0;
let closePaperCount = 0;

// 遍历每一行计数
lines.forEach((line, index) => {
  const boxOpenMatches = line.match(/<Box/g);
  const boxCloseMatches = line.match(/<\/Box>/g);
  const paperOpenMatches = line.match(/<Paper/g);
  const paperCloseMatches = line.match(/<\/Paper>/g);
  
  if (boxOpenMatches) openBoxCount += boxOpenMatches.length;
  if (boxCloseMatches) closeBoxCount += boxCloseMatches.length;
  if (paperOpenMatches) openPaperCount += paperOpenMatches.length;
  if (paperCloseMatches) closePaperCount += paperCloseMatches.length;
});

console.log('Box tags: open =', openBoxCount, 'close =', closeBoxCount);
console.log('Paper tags: open =', openPaperCount, 'close =', closePaperCount);

if (openBoxCount !== closeBoxCount) {
  console.log('ERROR: Box tags are unbalanced!');
}

if (openPaperCount !== closePaperCount) {
  console.log('ERROR: Paper tags are unbalanced!');
}
