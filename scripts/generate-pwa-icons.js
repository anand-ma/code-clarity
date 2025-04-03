import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [192, 512];
const sourceIcon = path.join(process.cwd(), 'public', 'icon.svg');
const outputDir = path.join(process.cwd(), 'public');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach(async (size) => {
  try {
    await sharp(sourceIcon)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    console.log(`Generated ${size}x${size} icon`);
  } catch (error) {
    console.error(`Error generating ${size}x${size} icon:`, error);
  }
});

// Generate apple-touch-icon
try {
  await sharp(sourceIcon)
    .resize(180, 180)
    .png()
    .toFile(path.join(outputDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon');
} catch (error) {
  console.error('Error generating apple-touch-icon:', error);
}

// Generate favicon
try {
  await sharp(sourceIcon)
    .resize(32, 32)
    .toFile(path.join(outputDir, 'favicon.ico'));
  console.log('Generated favicon');
} catch (error) {
  console.error('Error generating favicon:', error);
}

// Generate masked-icon (SVG)
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1e1e1e"/>
  <path d="M160 256L120 296L160 336" stroke="#00FF9D" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M352 256L392 296L352 336" stroke="#00FF9D" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="200" y="180" width="112" height="24" rx="4" fill="#00FF9D"/>
  <rect x="200" y="240" width="80" height="24" rx="4" fill="#00FF9D"/>
  <rect x="200" y="300" width="96" height="24" rx="4" fill="#00FF9D"/>
</svg>
`;

fs.writeFileSync(path.join(outputDir, 'masked-icon.svg'), svgContent);
console.log('Generated masked-icon.svg'); 