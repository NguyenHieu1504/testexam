document.getElementById('drawButton').addEventListener('click', () => {
  const input = document.getElementById('input').value;
  const heights = input.split(',').map(Number);

  if (heights.some(isNaN)) {
    alert('Invalid input. Please enter numbers separated by commas.');
    return;
  }

  drawBlocks(heights);
  const water = calculateWater(heights);
  document.getElementById('waterVolume').textContent = `Water volume: ${water}`;
});

function drawBlocks(heights) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const blockWidth = width / heights.length - 2; // Chiều rộng mỗi block, trừ đi khoảng cách
  const blockHeight = 20; // Chiều cao mỗi block tính theo pixel

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw blocks
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  heights.forEach((h, i) => {
    for (let j = 0; j < h; j++) {
      ctx.fillRect(
        i * (blockWidth + 2),
        height - (j + 1) * blockHeight,
        blockWidth,
        blockHeight
      );
      ctx.strokeRect(
        i * (blockWidth + 2),
        height - (j + 1) * blockHeight,
        blockWidth,
        blockHeight
      );
    }
  });

  // Draw water
  const waterLevels = getWaterLevels(heights);
  ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
  waterLevels.forEach((wh, i) => {
    for (let j = 0; j < wh; j++) {
      ctx.fillRect(
        i * (blockWidth + 2),
        height - (heights[i] + j + 1) * blockHeight,
        blockWidth,
        blockHeight
      );
    }
  });
}

function calculateWater(heights) {
  const leftMax = [];
  const rightMax = [];
  let max = 0;
  let water = 0;

  for (let i = 0; i < heights.length; i++) {
    leftMax[i] = max = Math.max(max, heights[i]);
  }

  max = 0;
  for (let i = heights.length - 1; i >= 0; i--) {
    rightMax[i] = max = Math.max(max, heights[i]);
  }

  for (let i = 0; i < heights.length; i++) {
    water += Math.min(leftMax[i], rightMax[i]) - heights[i];
  }

  return water;
}

function getWaterLevels(heights) {
  const leftMax = [];
  const rightMax = [];
  let max = 0;
  const waterLevels = [];

  for (let i = 0; i < heights.length; i++) {
    leftMax[i] = max = Math.max(max, heights[i]);
  }

  max = 0;
  for (let i = heights.length - 1; i >= 0; i--) {
    rightMax[i] = max = Math.max(max, heights[i]);
  }

  for (let i = 0; i < heights.length; i++) {
    const waterLevel = Math.min(leftMax[i], rightMax[i]) - heights[i];
    waterLevels.push(waterLevel);
  }

  return waterLevels;
}
