export function capitalizeFirstLetter(input) {
  if (!input) return ''; // Handle empty or invalid input
  return input.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}
