function formatGradient(type, angle, colors, format = "css") {
  const colorStops = colors.map((c) => `${c.color} ${c.position}%`).join(", ");
  let gradient = "";
  switch (type) {
    case "linear":
      gradient = `linear-gradient(${angle}deg, ${colorStops})`;
      break;
    case "radial":
      gradient = `radial-gradient(circle, ${colorStops})`;
      break;
    case "conic":
      gradient = `conic-gradient(from ${angle}deg, ${colorStops})`;
      break;
  }
  return formatCSSProperty("background", gradient, format);
}
function formatBoxShadow(shadows, format = "css") {
  const shadowValues = shadows.map((s) => {
    const inset = s.inset ? "inset " : "";
    const blur = typeof s.blur === "number" ? s.blur : 0;
    return `${inset}${s.x}px ${s.y}px ${blur}px ${s.spread}px ${s.color}`;
  }).join(", ");
  return formatCSSProperty("box-shadow", shadowValues, format);
}
function formatCSSProperty(property, value, format = "css") {
  switch (format) {
    case "css":
    case "scss":
      return `${property}: ${value};`;
    case "sass":
      return `${property}: ${value}`;
    case "stylus":
      return `${property} ${value}`;
    case "tailwind":
      return convertToTailwind(property, value);
    case "inline":
      return `${property}: ${value};`;
    default:
      return `${property}: ${value};`;
  }
}
function convertToTailwind(property, value) {
  return `/* Tailwind conversion for ${property}: ${value} */`;
}
export {
  formatBoxShadow as a,
  formatGradient as f
};
