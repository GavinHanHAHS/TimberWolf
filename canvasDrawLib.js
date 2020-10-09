// Library for drawing on canvas

function fillCircle(x, y, r) {
  // Draw a filled circle w/ center (x, y) and radius (r)
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function strokeCircle(x, y, r) {
  // Draw a filled circle w/ center (x, y) and radius (r)
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.stroke();
}
