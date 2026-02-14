import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SIZE = 128;

// Simple noise function for texture generation
function noise(x, y, seed = 0) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

// Smooth interpolation
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Generate seamless tileable texture
function generateTexture(type, seed) {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(SIZE, SIZE);
  const data = imageData.data;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = (y * SIZE + x) * 4;
      
      let value = 0;
      
      switch (type) {
        case 'experience':
          // Rough, crater-like texture
          value = generateCraterTexture(x, y, seed);
          break;
        case 'projects':
          // Tech/circuit-inspired texture with defined patterns
          value = generateTechTexture(x, y, seed);
          break;
        case 'testimonials':
          // Organic, flowing patterns
          value = generateOrganicTexture(x, y, seed);
          break;
        case 'education':
          // Unique pattern for education
          value = generateEducationTexture(x, y, seed);
          break;
        case 'star':
          // Solar surface texture with plasma-like patterns
          value = generateStarTexture(x, y, seed);
          break;
      }
      
      // Convert to gray/white (0-255)
      const gray = Math.floor(value * 255);
      data[idx] = gray;     // R
      data[idx + 1] = gray; // G
      data[idx + 2] = gray; // B
      data[idx + 3] = 255;  // A
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Crater-like texture (rough, for Experience planet)
function generateCraterTexture(x, y, seed) {
  let value = 0;
  
  // Base noise
  value += noise(x * 0.1, y * 0.1, seed) * 0.3;
  value += noise(x * 0.2, y * 0.2, seed + 100) * 0.2;
  value += noise(x * 0.4, y * 0.4, seed + 200) * 0.15;
  
  // Add crater-like circular patterns
  for (let i = 0; i < 8; i++) {
    const cx = (noise(i, seed) * SIZE) % SIZE;
    const cy = (noise(i + 100, seed) * SIZE) % SIZE;
    const dist = Math.sqrt(
      Math.pow((x - cx + SIZE) % SIZE, 2) + 
      Math.pow((y - cy + SIZE) % SIZE, 2)
    );
    const radius = 15 + noise(i, seed + 300) * 10;
    if (dist < radius) {
      const factor = 1 - (dist / radius);
      value -= factor * 0.3 * smoothstep(0, 1, factor);
    }
  }
  
  // Ensure seamless tiling by blending edges
  const edgeBlend = Math.min(x / 10, (SIZE - x) / 10, y / 10, (SIZE - y) / 10, 1);
  value = value * 0.7 + 0.3; // Normalize to lighter range
  value = Math.max(0, Math.min(1, value));
  
  return value;
}

// Tech/circuit-inspired texture with defined patterns (for Projects planet - new version)
function generateTechTexture(x, y, seed) {
  let value = 0;

  // Base noise layers with more randomization in frequencies and seed
  value += noise(x * 0.08, y * 0.08, seed) * 0.27;
  value += noise(x * 0.16 + seed % 13, y * 0.15 + (seed % 7), seed + 100) * 0.23;
  value += noise(x * 0.23 + noise(x, y, seed + 40) * 3.0, y * 0.18 + noise(y, x, seed + 80) * 4.3, seed + 187) * 0.14;

  // Hex size and orientation slight randomness
  const hexRand = 13 + (noise(seed % 31, x * 0.1, y * 0.1) * 6); // between 13 and 19
  const hexSize = hexRand;
  const hexX = ((x / hexSize) + noise(x, y, seed + 222) * 0.15) % 1;
  const hexY = ((y / hexSize) + noise(y, x, seed + 133) * 0.15) % 1;
  const hexSkew = noise(seed + 543, x * 0.01, y * 0.01) * 0.1;
  const hexPattern =
    Math.sin((hexX + hexSkew) * Math.PI * 2 + noise(seed, x) * 2) *
    Math.sin((hexY - hexSkew) * Math.PI * 2 + noise(seed, y) * 3) *
    0.18 * (0.8 + noise(x * 0.1, y * 0.1, seed + 76) * 0.4);
  value += hexPattern;

  // Random bright spots (like circuit nodes) with variable radii and patterns
  const nodeCount = 6 + Math.floor(noise(x, y, seed + 2023) * 3); // 6-8 nodes
  for (let i = 0; i < nodeCount; i++) {
    const nodeSeed = seed + 200 + i * 17;
    // Add more randomness to node positions
    const nodeX =
      (noise(i * 3 + 2, nodeSeed) * SIZE +
        noise(i * 11, x * 0.08, seed + 900) * 6) % SIZE;
    const nodeY =
      (noise(i * 3 + 1, nodeSeed + 100) * SIZE +
        noise(i * 7, y * 0.13, seed + 1100) * 6) % SIZE;

    const dist = Math.sqrt(
      Math.pow((x - nodeX + SIZE) % SIZE, 2) +
        Math.pow((y - nodeY + SIZE) % SIZE, 2)
    );
    // Radius randomized per node
    const nodeRadius = 6 + noise(i, nodeSeed + 3000) * 6; // 6-12px
    if (dist < nodeRadius) {
      const factor = 1 - dist / nodeRadius;
      // Randomize spot brightness and softness
      const spotBright = 0.24 + noise(i, nodeSeed + 9000) * 0.21;
      value += factor * spotBright * smoothstep(0, 1, factor);
    }
  }

  // Extra: add a few random "wires" as lines
  for (let w = 0; w < 3; w++) {
    // Pseudo-random line using noise
    const angle =
      noise(seed + w * 61, 23 + w * 17) * Math.PI * 2 +
      Math.sin(seed + w * 609) * 0.9;
    const cx =
      SIZE * noise(x * 0.002 + 7 * w, seed + 239 + w * 21) * 0.9 +
      SIZE * 0.05;
    const cy =
      SIZE * noise(y * 0.002 + 3 * w, seed + 500 + w * 17) * 0.9 + SIZE * 0.05;
    // Project point along the angle
    const dx = Math.cos(angle) * SIZE * 0.5;
    const dy = Math.sin(angle) * SIZE * 0.5;
    // Distance from (x, y) to the line
    const px = cx + dx * (w % 2 ? 0.7 : 0.3);
    const py = cy + dy * (w % 2 ? 0.3 : 0.7);
    // Closest approach using perpendicular vector
    const distToLine =
      Math.abs(
        (y - cy) * (dx) - (x - cx) * (dy)
      ) / (Math.sqrt(dx * dx + dy * dy) + 0.0001);
    if (distToLine < 2.2 + noise(x, y, seed + 888 + w) * 2.5) {
      // Add a bright highlight for the wire
      value += (0.09 + noise(seed + w * 8888, x, y) * 0.1) * (1 - distToLine / 4.7);
    }
  }

  // Normalize to lighter range
  value = value * 0.7 + 0.3;
  value = Math.max(0, Math.min(1, value));
  return value;
}

// Organic, flowing patterns (for Testimonials planet)
function generateOrganicTexture(x, y, seed) {
  let value = 0;
  
  // Base organic noise with multiple octaves
  value += noise(x * 0.06, y * 0.06, seed) * 0.3;
  value += noise(x * 0.12, y * 0.12, seed + 100) * 0.25;
  value += noise(x * 0.24, y * 0.24, seed + 200) * 0.2;
  value += noise(x * 0.48, y * 0.48, seed + 300) * 0.1;
  
  // Create flowing, organic patterns using Perlin-like noise
  const angle = noise(x * 0.08, y * 0.08, seed + 50) * Math.PI * 2;
  const flowX = Math.cos(angle) * 0.12;
  const flowY = Math.sin(angle) * 0.12;
  value += noise(x * 0.1 + flowX, y * 0.1 + flowY, seed + 150) * 0.2;
  
  // Add secondary flow layer for more organic movement
  const angle2 = noise(x * 0.05, y * 0.05, seed + 200) * Math.PI * 2;
  const flowX2 = Math.cos(angle2) * 0.08;
  const flowY2 = Math.sin(angle2) * 0.08;
  value += noise(x * 0.15 + flowX2, y * 0.15 + flowY2, seed + 250) * 0.15;
  
  // Add swirling patterns from center for organic flow
  const centerX = SIZE / 2;
  const centerY = SIZE / 2;
  const dx = (x - centerX + SIZE) % SIZE - SIZE / 2;
  const dy = (y - centerY + SIZE) % SIZE - SIZE / 2;
  const swirlAngle = Math.atan2(dy, dx);
  const swirlDist = Math.sqrt(dx * dx + dy * dy);
  const swirl = Math.sin(swirlAngle * 2.5 + swirlDist * 0.1 + seed) * 0.12;
  value += swirl;
  
  // Add organic blob-like formations
  for (let i = 0; i < 8; i++) {
    const blobX = (noise(i * 4, seed + 400) * SIZE) % SIZE;
    const blobY = (noise(i * 4 + 1, seed + 500) * SIZE) % SIZE;
    const baseSize = 18 + noise(i * 4 + 2, seed + 600) * 14;
    
    const distX = (x - blobX + SIZE) % SIZE;
    const distY = (y - blobY + SIZE) % SIZE;
    
    // Organic blob shape with angle-based variation
    const blobAngle = Math.atan2(distY, distX);
    const sizeVariation = noise(blobAngle * 2, seed + 700 + i) * 7;
    const blobSize = baseSize + sizeVariation;
    
    // Add distortion for organic shape
    const distort = noise(blobAngle * 3, seed + 800 + i) * 4;
    const blobDist = Math.sqrt(distX * distX + distY * distY) + distort;
    
    if (blobDist < blobSize) {
      const blobFactor = 1 - (blobDist / blobSize);
      // Soft organic edges
      const blobIntensity = smoothstep(0.2, 1, blobFactor) * 0.25;
      value += blobIntensity;
    }
  }
  
  // Add flowing stream-like patterns
  for (let i = 0; i < 5; i++) {
    const streamX = (noise(i * 5, seed + 900) * SIZE) % SIZE;
    const streamY = (noise(i * 5 + 1, seed + 1000) * SIZE) % SIZE;
    const streamAngle = noise(i * 5 + 2, seed + 1100) * Math.PI * 2;
    const streamLength = 40 + noise(i * 5 + 3, seed + 1200) * 30;
    const streamWidth = 4 + noise(i * 5 + 4, seed + 1300) * 3;
    
    const distX = (x - streamX + SIZE) % SIZE;
    const distY = (y - streamY + SIZE) % SIZE;
    
    // Distance along and perpendicular to stream
    const distAlong = distX * Math.cos(streamAngle) + distY * Math.sin(streamAngle);
    const distPerp = Math.abs(-distX * Math.sin(streamAngle) + distY * Math.cos(streamAngle));
    
    // Curved stream path
    const curve = Math.sin(distAlong / streamLength * Math.PI) * 2;
    const effectiveWidth = streamWidth + Math.abs(curve) * 1.5;
    
    if (distAlong >= 0 && distAlong <= streamLength && distPerp < effectiveWidth) {
      const streamFactor = (1 - distPerp / effectiveWidth) * (1 - distAlong / streamLength);
      value += smoothstep(0.3, 1, streamFactor) * 0.2;
    }
  }
  
  // Add soft, parallel, horizontal-ish bands at random intervals
  const numBands = 6 + Math.floor(noise(seed + 1400, 0) * 4); // 6-9 bands
  for (let i = 0; i < numBands; i++) {
    // Random Y position for each band (spaced throughout the texture)
    const bandY = (noise(i * 7, seed + 1500) * SIZE) % SIZE;
    
    // Slight angle variation (horizontal-ish, not perfectly horizontal)
    const bandAngle = (noise(i * 7 + 1, seed + 1600) - 0.5) * 0.15; // -0.075 to 0.075 radians (~-4.3° to 4.3°)
    
    // Band width varies slightly
    const bandWidth = 8 + noise(i * 7 + 2, seed + 1700) * 6; // 8-14px
    
    // Calculate distance from point to the band line
    // The band line goes through (0, bandY) with angle bandAngle
    // For a line: y = bandY + x * tan(bandAngle)
    // Distance from point (x, y) to line: |y - (bandY + x * tan(bandAngle))| / sqrt(1 + tan²(angle))
    const tanAngle = Math.tan(bandAngle);
    const distToBand = Math.abs(y - (bandY + x * tanAngle)) / Math.sqrt(1 + tanAngle * tanAngle);
    
    // Add slight variation along the band for organic feel
    const bandVariation = noise(x * 0.05, i * 7 + 3, seed + 1800) * 2;
    const effectiveDist = distToBand - bandVariation;
    
    if (effectiveDist < bandWidth) {
      const bandFactor = 1 - (effectiveDist / bandWidth);
      // Soft edges using smoothstep
      const bandIntensity = smoothstep(0.2, 0.8, bandFactor) * 0.15;
      // Vary intensity slightly along the band
      const intensityVariation = 0.85 + noise(x * 0.08, i * 7 + 4, seed + 1900) * 0.3;
      value += bandIntensity * intensityVariation;
    }
  }
  
  // Normalize to medium brightness range
  value = value * 0.65 + 0.35;
  value = Math.max(0, Math.min(1, value));
  
  return value;
}

// Unique pattern for Education planet
function generateEducationTexture(x, y, seed) {
  let value = 0;
  
  // Layered noise with structured patterns
  value += noise(x * 0.06, y * 0.06, seed) * 0.35;
  value += noise(x * 0.12, y * 0.12, seed + 100) * 0.25;
  value += noise(x * 0.24, y * 0.24, seed + 200) * 0.2;
  
  // Add grid-like structure
  const gridX = (x % 16) / 16;
  const gridY = (y % 16) / 16;
  const gridPattern = (Math.sin(gridX * Math.PI) * Math.sin(gridY * Math.PI)) * 0.1;
  value += gridPattern;
  
  // Add some circular highlights
  for (let i = 0; i < 5; i++) {
    const cx = (noise(i * 2, seed + 300) * SIZE) % SIZE;
    const cy = (noise(i * 2 + 1, seed + 400) * SIZE) % SIZE;
    const dist = Math.sqrt(
      Math.pow((x - cx + SIZE) % SIZE, 2) + 
      Math.pow((y - cy + SIZE) % SIZE, 2)
    );
    if (dist < 20) {
      const factor = 1 - (dist / 20);
      value += factor * 0.2 * smoothstep(0, 1, factor);
    }
  }
  
  // Normalize
  value = value * 0.7 + 0.3;
  value = Math.max(0, Math.min(1, value));
  
  return value;
}

// Solar surface texture with plasma-like patterns (for Star)
function generateStarTexture(x, y, seed) {
  let value = 0;
  
  // Base plasma-like noise with multiple octaves
  value += noise(x * 0.04, y * 0.04, seed) * 0.35;
  value += noise(x * 0.08, y * 0.08, seed + 100) * 0.3;
  value += noise(x * 0.16, y * 0.16, seed + 200) * 0.2;
  value += noise(x * 0.32, y * 0.32, seed + 300) * 0.15;
  
  // Add convective cell patterns (like solar granulation)
  const cellSize = 20;
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  const cellNoise = noise(cellX, cellY, seed + 400);
  const cellCenterX = (cellX + 0.5) * cellSize;
  const cellCenterY = (cellY + 0.5) * cellSize;
  const distFromCenter = Math.sqrt(
    Math.pow((x - cellCenterX + SIZE) % SIZE, 2) + 
    Math.pow((y - cellCenterY + SIZE) % SIZE, 2)
  );
  const cellRadius = cellSize * 0.4;
  if (distFromCenter < cellRadius) {
    const cellFactor = 1 - (distFromCenter / cellRadius);
    // Bright center, darker edges (granulation pattern)
    value += cellFactor * 0.25 * (cellNoise - 0.5);
  }
  
  // Add solar flare-like streaks
  for (let i = 0; i < 4; i++) {
    const flareX = (noise(i * 5, seed + 500) * SIZE) % SIZE;
    const flareY = (noise(i * 5 + 1, seed + 600) * SIZE) % SIZE;
    const flareAngle = noise(i * 5 + 2, seed + 700) * Math.PI * 2;
    const flareLength = 30 + noise(i * 5 + 3, seed + 800) * 20;
    
    // Calculate distance from flare line
    const dx = (x - flareX + SIZE) % SIZE;
    const dy = (y - flareY + SIZE) % SIZE;
    const distAlong = dx * Math.cos(flareAngle) + dy * Math.sin(flareAngle);
    const distPerp = Math.abs(-dx * Math.sin(flareAngle) + dy * Math.cos(flareAngle));
    
    if (distAlong >= 0 && distAlong <= flareLength && distPerp < 3) {
      const flareIntensity = (1 - distAlong / flareLength) * (1 - distPerp / 3);
      value += flareIntensity * 0.2;
    }
  }
  
  // Add some bright hotspots (like sunspots but bright)
  for (let i = 0; i < 3; i++) {
    const spotX = (noise(i * 7, seed + 900) * SIZE) % SIZE;
    const spotY = (noise(i * 7 + 1, seed + 1000) * SIZE) % SIZE;
    const dist = Math.sqrt(
      Math.pow((x - spotX + SIZE) % SIZE, 2) + 
      Math.pow((y - spotY + SIZE) % SIZE, 2)
    );
    if (dist < 12) {
      const factor = 1 - (dist / 12);
      value += factor * 0.3 * smoothstep(0, 1, factor);
    }
  }
  
  // Normalize to bright range (stars are bright!)
  value = value * 0.8 + 0.2;
  value = Math.max(0, Math.min(1, value));
  
  return value;
}

// Ensure seamless horizontal tiling by copying edge pixels
function makeSeamless(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
  const data = imageData.data;
  
  // Blend left and right edges
  const blendWidth = 4;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < blendWidth; x++) {
      const leftIdx = (y * SIZE + x) * 4;
      const rightIdx = (y * SIZE + (SIZE - blendWidth + x)) * 4;
      
      const blend = x / blendWidth;
      data[leftIdx] = data[leftIdx] * (1 - blend) + data[rightIdx] * blend;
      data[leftIdx + 1] = data[leftIdx + 1] * (1 - blend) + data[rightIdx + 1] * blend;
      data[leftIdx + 2] = data[leftIdx + 2] * (1 - blend) + data[rightIdx + 2] * blend;
      
      data[rightIdx] = data[rightIdx] * (1 - blend) + data[leftIdx] * blend;
      data[rightIdx + 1] = data[rightIdx + 1] * (1 - blend) + data[leftIdx + 1] * blend;
      data[rightIdx + 2] = data[rightIdx + 2] * (1 - blend) + data[leftIdx + 2] * blend;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Generate all textures
const textures = [
  { type: 'experience', seed: 1234 },
  { type: 'projects', seed: 5678 },
  { type: 'testimonials', seed: 9012 },
  { type: 'education', seed: 3456 },
  { type: 'star', seed: 7890 },
];

// Create output directory
const outputDir = join(__dirname, '..', 'public', 'textures');
mkdirSync(outputDir, { recursive: true });

console.log('Generating seamless tileable planet textures...');

textures.forEach(({ type, seed }) => {
  if (type !== 'testimonials') return;

  const canvas = generateTexture(type, seed);
  const seamlessCanvas = makeSeamless(canvas);
  const buffer = seamlessCanvas.toBuffer('image/png');
  const outputPath = join(outputDir, `planet-texture-${type}.png`);
  writeFileSync(outputPath, buffer);
  console.log(`✓ Saved ${outputPath}`);
});

console.log('\nAll textures generated successfully!');
