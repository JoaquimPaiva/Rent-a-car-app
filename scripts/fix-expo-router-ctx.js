const fs = require('fs');
const path = require('path');

const expoRouterDir = path.join(process.cwd(), 'node_modules/expo-router');
const targets = [];

if (fs.existsSync(expoRouterDir)) {
  for (const fileName of fs.readdirSync(expoRouterDir)) {
    if (fileName.startsWith('_ctx') && fileName.endsWith('.js')) {
      targets.push(path.join(expoRouterDir, fileName));
    }
  }
}

targets.push(path.join(process.cwd(), 'node_modules/expo-router/build/_ctx.js'));

for (const target of targets) {
  try {
    if (!fs.existsSync(target)) continue;
    const before = fs.readFileSync(target, 'utf8');
    let after = before.replaceAll('process.env.EXPO_ROUTER_APP_ROOT', "'../../app'");
    after = after.replaceAll('process.env.EXPO_ROUTER_IMPORT_MODE', "'sync'");
    if (before !== after) {
      fs.writeFileSync(target, after, 'utf8');
      console.log(`patched ${path.relative(process.cwd(), target)}`);
    }
  } catch (error) {
    console.warn(`failed patching ${target}:`, error.message);
  }
}
