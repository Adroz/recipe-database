/**
 * Calorie/kJ Estimator for Recipe Pages
 * 
 * This script estimates nutritional information based on ingredients
 * using a hardcoded calorie lookup table (no API required).
 * 
 * Note: These are estimates only and may not be accurate for all recipes.
 */

// Calorie database: calories per standard unit (typically per 100g or per item)
// Values are approximate and sourced from common nutrition databases
const CALORIE_DATABASE = {
  // ===== PROTEINS =====
  // Chicken
  'chicken thigh': { calories: 209, per: '100g', keywords: ['chicken thigh', 'chicken thighs'] },
  'chicken breast': { calories: 165, per: '100g', keywords: ['chicken breast', 'chicken breasts'] },
  'chicken': { calories: 190, per: '100g', keywords: ['chicken'] },
  
  // Beef
  'beef': { calories: 250, per: '100g', keywords: ['beef', 'steak', 'ground beef', 'mince'] },
  'beef mince': { calories: 250, per: '100g', keywords: ['beef mince', 'ground beef'] },
  
  // Pork
  'pork': { calories: 242, per: '100g', keywords: ['pork'] },
  'bacon': { calories: 541, per: '100g', keywords: ['bacon'] },
  'sausage': { calories: 301, per: '100g', keywords: ['sausage', 'sausages'] },
  'ribs': { calories: 277, per: '100g', keywords: ['ribs', 'pork ribs'] },
  
  // Lamb
  'lamb': { calories: 294, per: '100g', keywords: ['lamb'] },
  
  // Seafood
  'shrimp': { calories: 99, per: '100g', keywords: ['shrimp', 'prawns', 'prawn'] },
  'tuna': { calories: 130, per: '100g', keywords: ['tuna'] },
  'salmon': { calories: 208, per: '100g', keywords: ['salmon'] },
  'fish': { calories: 150, per: '100g', keywords: ['fish', 'cod', 'tilapia', 'white fish'] },
  
  // Eggs
  'egg': { calories: 78, per: 'item', keywords: ['egg', 'eggs'] },
  
  // ===== DAIRY =====
  'milk': { calories: 42, per: '100ml', keywords: ['milk'] },
  'cream': { calories: 292, per: '100ml', keywords: ['cream', 'heavy cream', 'thickened cream', 'whipping cream'] },
  'butter': { calories: 717, per: '100g', keywords: ['butter'] },
  'cheese': { calories: 402, per: '100g', keywords: ['cheese'] },
  'cheddar': { calories: 403, per: '100g', keywords: ['cheddar'] },
  'mozzarella': { calories: 280, per: '100g', keywords: ['mozzarella'] },
  'parmesan': { calories: 431, per: '100g', keywords: ['parmesan', 'parmigiano'] },
  'cream cheese': { calories: 342, per: '100g', keywords: ['cream cheese'] },
  'paneer': { calories: 265, per: '100g', keywords: ['paneer'] },
  'yoghurt': { calories: 59, per: '100g', keywords: ['yoghurt', 'yogurt'] },
  'sour cream': { calories: 193, per: '100g', keywords: ['sour cream'] },
  'coconut milk': { calories: 230, per: '100ml', keywords: ['coconut milk'] },
  'coconut cream': { calories: 330, per: '100ml', keywords: ['coconut cream'] },
  
  // ===== GRAINS & CARBS =====
  'pasta': { calories: 131, per: '100g', keywords: ['pasta', 'spaghetti', 'penne', 'macaroni', 'cavatappi', 'noodles'] },
  'rice': { calories: 130, per: '100g', keywords: ['rice'] },
  'bread': { calories: 265, per: '100g', keywords: ['bread'] },
  'flour': { calories: 364, per: '100g', keywords: ['flour', 'all-purpose flour', 'plain flour', 'self-raising flour'] },
  'oats': { calories: 389, per: '100g', keywords: ['oats', 'oatmeal', 'rolled oats'] },
  'breadcrumbs': { calories: 395, per: '100g', keywords: ['breadcrumbs', 'panko'] },
  'tortilla': { calories: 312, per: '100g', keywords: ['tortilla', 'tortillas', 'wrap', 'wraps'] },
  
  // ===== LEGUMES =====
  'lentils': { calories: 116, per: '100g', keywords: ['lentils', 'lentil', 'red lentils', 'red lentil'] },
  'chickpeas': { calories: 164, per: '100g', keywords: ['chickpeas', 'chickpea', 'garbanzo'] },
  'black beans': { calories: 132, per: '100g', keywords: ['black beans'] },
  'beans': { calories: 127, per: '100g', keywords: ['beans', 'kidney beans', 'white beans', 'cannellini'] },
  
  // ===== VEGETABLES =====
  'onion': { calories: 40, per: '100g', keywords: ['onion', 'onions', 'brown onion', 'red onion', 'white onion'] },
  'garlic': { calories: 5, per: 'clove', keywords: ['garlic', 'garlic clove', 'garlic cloves'] },
  'tomato': { calories: 18, per: '100g', keywords: ['tomato', 'tomatoes', 'cherry tomato', 'cherry tomatoes'] },
  'tomato passata': { calories: 24, per: '100ml', keywords: ['passata', 'tomato passata'] },
  'sun-dried tomatoes': { calories: 258, per: '100g', keywords: ['sun-dried tomato', 'sun-dried tomatoes', 'sundried'] },
  'canned tomatoes': { calories: 20, per: '100g', keywords: ['canned tomatoes', 'chopped tomatoes', 'diced tomatoes', 'tinned tomatoes'] },
  'potato': { calories: 77, per: '100g', keywords: ['potato', 'potatoes'] },
  'sweet potato': { calories: 86, per: '100g', keywords: ['sweet potato', 'sweet potatoes'] },
  'carrot': { calories: 41, per: '100g', keywords: ['carrot', 'carrots'] },
  'celery': { calories: 14, per: '100g', keywords: ['celery'] },
  'bell pepper': { calories: 31, per: '100g', keywords: ['bell pepper', 'capsicum', 'peppers'] },
  'spinach': { calories: 23, per: '100g', keywords: ['spinach'] },
  'chard': { calories: 19, per: '100g', keywords: ['chard', 'swiss chard', 'silverbeet'] },
  'kale': { calories: 49, per: '100g', keywords: ['kale'] },
  'lettuce': { calories: 15, per: '100g', keywords: ['lettuce', 'romaine'] },
  'cabbage': { calories: 25, per: '100g', keywords: ['cabbage'] },
  'broccoli': { calories: 34, per: '100g', keywords: ['broccoli'] },
  'cauliflower': { calories: 25, per: '100g', keywords: ['cauliflower'] },
  'eggplant': { calories: 25, per: '100g', keywords: ['eggplant', 'aubergine'] },
  'zucchini': { calories: 17, per: '100g', keywords: ['zucchini', 'courgette'] },
  'mushroom': { calories: 22, per: '100g', keywords: ['mushroom', 'mushrooms'] },
  'ginger': { calories: 8, per: '10g', keywords: ['ginger'] },
  'pumpkin': { calories: 26, per: '100g', keywords: ['pumpkin', 'squash', 'butternut'] },
  
  // ===== FRUITS =====
  'banana': { calories: 89, per: '100g', keywords: ['banana', 'bananas'] },
  'apple': { calories: 52, per: '100g', keywords: ['apple', 'apples'] },
  'lemon': { calories: 29, per: '100g', keywords: ['lemon', 'lemons', 'lemon juice'] },
  'lime': { calories: 30, per: '100g', keywords: ['lime', 'limes', 'lime juice'] },
  'orange': { calories: 47, per: '100g', keywords: ['orange', 'oranges', 'orange juice'] },
  'berries': { calories: 57, per: '100g', keywords: ['berries', 'strawberries', 'blueberries', 'raspberries'] },
  'dates': { calories: 282, per: '100g', keywords: ['dates', 'date'] },
  
  // ===== FATS & OILS =====
  'olive oil': { calories: 884, per: '100ml', keywords: ['olive oil'] },
  'vegetable oil': { calories: 884, per: '100ml', keywords: ['vegetable oil', 'canola oil', 'oil'] },
  'sesame oil': { calories: 884, per: '100ml', keywords: ['sesame oil'] },
  'ghee': { calories: 900, per: '100g', keywords: ['ghee'] },
  
  // ===== SWEETENERS =====
  'sugar': { calories: 387, per: '100g', keywords: ['sugar', 'white sugar', 'caster sugar', 'granulated sugar'] },
  'brown sugar': { calories: 380, per: '100g', keywords: ['brown sugar'] },
  'honey': { calories: 304, per: '100g', keywords: ['honey'] },
  'maple syrup': { calories: 260, per: '100ml', keywords: ['maple syrup'] },
  'coconut sugar': { calories: 375, per: '100g', keywords: ['coconut sugar'] },
  
  // ===== BAKING =====
  'chocolate chips': { calories: 535, per: '100g', keywords: ['chocolate chips', 'chocolate chip'] },
  'chocolate': { calories: 546, per: '100g', keywords: ['chocolate', 'cocoa'] },
  'cocoa powder': { calories: 228, per: '100g', keywords: ['cocoa powder', 'cocoa'] },
  'baking powder': { calories: 5, per: '5g', keywords: ['baking powder'] },
  'baking soda': { calories: 0, per: '5g', keywords: ['baking soda', 'bicarbonate'] },
  'vanilla': { calories: 12, per: '5ml', keywords: ['vanilla', 'vanilla extract', 'vanilla essence'] },
  'yeast': { calories: 10, per: '7g', keywords: ['yeast', 'active dry yeast', 'instant yeast'] },
  
  // ===== NUTS & SEEDS =====
  'peanut butter': { calories: 588, per: '100g', keywords: ['peanut butter'] },
  'almonds': { calories: 579, per: '100g', keywords: ['almonds', 'almond'] },
  'peanuts': { calories: 567, per: '100g', keywords: ['peanuts', 'peanut'] },
  'walnuts': { calories: 654, per: '100g', keywords: ['walnuts', 'walnut'] },
  'cashews': { calories: 553, per: '100g', keywords: ['cashews', 'cashew'] },
  'pistachios': { calories: 562, per: '100g', keywords: ['pistachios', 'pistachio'] },
  'sesame seeds': { calories: 573, per: '100g', keywords: ['sesame seeds', 'sesame'] },
  
  // ===== CONDIMENTS & SAUCES =====
  'soy sauce': { calories: 53, per: '100ml', keywords: ['soy sauce', 'soya sauce'] },
  'fish sauce': { calories: 35, per: '100ml', keywords: ['fish sauce'] },
  'mirin': { calories: 240, per: '100ml', keywords: ['mirin'] },
  'sake': { calories: 134, per: '100ml', keywords: ['sake'] },
  'vinegar': { calories: 21, per: '100ml', keywords: ['vinegar', 'rice vinegar', 'white wine vinegar', 'balsamic'] },
  'mayonnaise': { calories: 680, per: '100g', keywords: ['mayonnaise', 'mayo'] },
  'mustard': { calories: 66, per: '100g', keywords: ['mustard', 'dijon'] },
  'ketchup': { calories: 112, per: '100g', keywords: ['ketchup', 'tomato sauce'] },
  'hummus': { calories: 166, per: '100g', keywords: ['hummus'] },
  
  // ===== BROTHS & STOCKS =====
  'broth': { calories: 7, per: '100ml', keywords: ['broth', 'stock', 'vegetable broth', 'chicken broth', 'beef broth', 'stock powder'] },
  
  // ===== SPICES (negligible calories) =====
  'spices': { calories: 5, per: '5g', keywords: ['turmeric', 'cumin', 'paprika', 'garam masala', 'cinnamon', 'cardamom', 'thyme', 'oregano', 'basil', 'rosemary', 'pepper', 'chili', 'curry powder'] },
};

// Unit conversions to a standard measurement
const UNIT_CONVERSIONS = {
  // Volume to ml
  'cup': 240,
  'cups': 240,
  'tbsp': 15,
  'tablespoon': 15,
  'tablespoons': 15,
  'tsp': 5,
  'teaspoon': 5,
  'teaspoons': 5,
  'ml': 1,
  'l': 1000,
  'litre': 1000,
  'liter': 1000,
  
  // Weight to g
  'g': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'oz': 28.35,
  'oz.': 28.35,
  'ounce': 28.35,
  'ounces': 28.35,
  'lb': 453.6,
  'lbs': 453.6,
  'pound': 453.6,
  'pounds': 453.6,
  
  // Count items
  'item': 1,
  'items': 1,
  'piece': 1,
  'pieces': 1,
  'clove': 1,
  'cloves': 1,
  // Note: 'inch' is primarily used for ginger in recipes (approximately 10g per inch)
  // This may not be accurate for other ingredients measured in inches
  'inch': 10,
};

/**
 * Parse a quantity string like "1 1/2", "1/2", "2", "3-4"
 */
function parseQuantity(str) {
  if (!str) return 1;
  
  str = str.trim();
  
  // Handle ranges like "3-4" - take the average
  if (str.includes('-')) {
    const parts = str.split('-');
    const low = parseQuantity(parts[0]);
    const high = parseQuantity(parts[1]);
    return (low + high) / 2;
  }
  
  // Handle mixed fractions like "1 1/2"
  const mixedMatch = str.match(/(\d+)\s+(\d+)\/(\d+)/);
  if (mixedMatch) {
    return parseInt(mixedMatch[1]) + parseInt(mixedMatch[2]) / parseInt(mixedMatch[3]);
  }
  
  // Handle simple fractions like "1/2"
  const fractionMatch = str.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
  }
  
  // Handle decimals and integers
  const num = parseFloat(str);
  return isNaN(num) ? 1 : num;
}

/**
 * Parse an ingredient line and extract quantity, unit, and ingredient name
 */
function parseIngredient(line) {
  // Clean up the line
  line = line.toLowerCase().trim();
  
  // Remove leading bullet points or dashes
  line = line.replace(/^[\*\-•]\s*/, '');
  
  // Skip "to serve", "to taste", "for cooking" lines
  if (line.includes('to serve') || line.includes('to taste') || line.includes('for cooking') || line.includes('optional')) {
    return null;
  }
  
  // Try to match: quantity unit ingredient
  // Pattern: optional quantity, optional unit, then the rest is ingredient
  const patterns = [
    // "500g pasta" or "500 g pasta"
    /^([\d\s\/\-\.]+)\s*(g|gram|grams|kg|kilogram|oz|oz\.|ounce|ounces|lb|lbs|pound|pounds|ml|l|litre|liter|cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons)\s+(.+)/i,
    // "2 eggs" or "4 garlic cloves"
    /^([\d\s\/\-\.]+)\s+(.+)/i,
    // Just ingredient name
    /^(.+)$/i,
  ];
  
  let quantity = 1;
  let unit = null;
  let ingredientName = line;
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      if (match.length === 4) {
        // quantity unit ingredient
        quantity = parseQuantity(match[1]);
        unit = match[2].toLowerCase();
        ingredientName = match[3];
      } else if (match.length === 3) {
        // quantity ingredient
        quantity = parseQuantity(match[1]);
        ingredientName = match[2];
        
        // Check if first word of ingredient is actually a unit
        const words = ingredientName.split(/\s+/);
        if (words.length > 1 && UNIT_CONVERSIONS[words[0].toLowerCase()]) {
          unit = words[0].toLowerCase();
          ingredientName = words.slice(1).join(' ');
        }
      }
      break;
    }
  }
  
  // Clean ingredient name - remove parenthetical notes and commas
  ingredientName = ingredientName
    .replace(/\([^)]*\)/g, '')  // Remove parenthetical
    .replace(/,.*$/, '')        // Remove everything after comma
    .replace(/\s+/g, ' ')       // Normalize spaces
    .trim();
  
  return { quantity, unit, ingredientName };
}

/**
 * Find the best matching food item from our database
 * Sorts keywords by length (longest first) to prioritize specific matches
 * e.g., 'chicken breast' matches before 'chicken'
 */
function findFoodMatch(ingredientName) {
  const lowerName = ingredientName.toLowerCase();
  
  // Build a list of all keyword matches with their specificity (keyword length)
  const matches = [];
  
  for (const [key, data] of Object.entries(CALORIE_DATABASE)) {
    for (const keyword of data.keywords) {
      if (lowerName.includes(keyword)) {
        matches.push({ key, data, keyword, specificity: keyword.length });
        break; // Only need one match per database entry
      }
    }
  }
  
  // Sort by specificity (longest keyword first) and return the most specific match
  if (matches.length > 0) {
    matches.sort((a, b) => b.specificity - a.specificity);
    const best = matches[0];
    return { key: best.key, ...best.data };
  }
  
  return null;
}

/**
 * Calculate calories for an ingredient
 */
function calculateIngredientCalories(parsed) {
  // Filtered ingredients (e.g., "to serve", "to taste") - don't include in unmatched list
  if (!parsed) return { calories: 0, matched: false, filtered: true, ingredient: '' };
  
  const { quantity, unit, ingredientName } = parsed;
  const foodMatch = findFoodMatch(ingredientName);
  
  if (!foodMatch) {
    return { calories: 0, matched: false, ingredient: ingredientName };
  }
  
  const { calories, per, key } = foodMatch;
  
  // Determine the amount in standard units (g or ml or items)
  let standardAmount = quantity;
  
  if (unit && UNIT_CONVERSIONS[unit]) {
    standardAmount = quantity * UNIT_CONVERSIONS[unit];
  }
  
  // Calculate calories based on the "per" unit
  let totalCalories;
  
  if (per === '100g' || per === '100ml') {
    totalCalories = (standardAmount / 100) * calories;
  } else if (per === 'item' || per === 'clove') {
    totalCalories = standardAmount * calories;
  } else {
    // Handle special per values like '5g', '10g', '5ml'
    const perMatch = per.match(/(\d+)(g|ml)/);
    if (perMatch) {
      const perAmount = parseInt(perMatch[1]);
      totalCalories = (standardAmount / perAmount) * calories;
    } else {
      totalCalories = standardAmount * calories;
    }
  }
  
  return { 
    calories: Math.round(totalCalories), 
    matched: true, 
    ingredient: ingredientName,
    matchedTo: key
  };
}

/**
 * Extract servings from the page
 */
function getServings() {
  const content = document.querySelector('.md-content');
  if (!content) return null;
  
  const text = content.textContent;
  
  // Look for "Serves: X" or "Serves: X-Y" pattern
  // Ranges like "3-4" will be averaged by parseQuantity()
  const servesMatch = text.match(/serves?:\s*([\d\-]+)/i);
  if (servesMatch) {
    return parseQuantity(servesMatch[1]);
  }
  
  return null;
}

/**
 * Extract ingredients from the page
 */
function getIngredients() {
  const content = document.querySelector('.md-content');
  if (!content) return [];
  
  // Find the Ingredients section
  const headings = content.querySelectorAll('h2');
  let ingredientsSection = null;
  
  for (const h of headings) {
    if (h.textContent.toLowerCase().includes('ingredient')) {
      ingredientsSection = h;
      break;
    }
  }
  
  if (!ingredientsSection) return [];
  
  // Get the list after the ingredients heading
  let nextElement = ingredientsSection.nextElementSibling;
  while (nextElement && nextElement.tagName !== 'UL' && nextElement.tagName !== 'H2') {
    nextElement = nextElement.nextElementSibling;
  }
  
  if (!nextElement || nextElement.tagName !== 'UL') return [];
  
  const listItems = nextElement.querySelectorAll('li');
  return Array.from(listItems).map(li => li.textContent);
}

/**
 * Check if current page is a recipe page (not index)
 */
function isRecipePage() {
  // Check if we're on an index page
  const path = window.location.pathname;
  if (path.endsWith('/') || path.endsWith('/index.html')) {
    // Check if it's the home page (not a recipe)
    const content = document.querySelector('.md-content');
    if (content) {
      const h1 = content.querySelector('h1');
      if (h1 && h1.textContent.toLowerCase() === 'home') {
        return false;
      }
    }
    // Could still be a recipe at a root category
  }
  
  // Check for recipe structure: must have Serves and Ingredients
  const content = document.querySelector('.md-content');
  if (!content) return false;
  
  const hasServes = /serves?:/i.test(content.textContent);
  const hasIngredients = content.querySelector('h2') && 
    Array.from(content.querySelectorAll('h2')).some(h => 
      h.textContent.toLowerCase().includes('ingredient'));
  
  return hasServes && hasIngredients;
}

/**
 * Create the collapsible nutrition info element
 * Styled to match the recipe bullet points (Serves, Time required, etc.)
 */
function createNutritionElement(totalCalories, caloriesPerServing, servings, ingredientResults) {
  // Convert to kJ
  const totalKJ = Math.round(totalCalories * 4.184);
  const kjPerServing = Math.round(caloriesPerServing * 4.184);
  
  // Count matched vs unmatched ingredients (excluding filtered like "to serve")
  const matched = ingredientResults.filter(r => r.matched).length;
  const total = ingredientResults.filter(r => !r.filtered).length;
  const confidence = total > 0 ? Math.round((matched / total) * 100) : 0;
  
  // Create a list item to match the existing bullet point style
  const listItem = document.createElement('li');
  listItem.className = 'nutrition-estimate';
  
  // Create the details/summary for expandable content (native arrow/chevron marker)
  const container = document.createElement('details');
  
  const summary = document.createElement('summary');
  summary.style.cssText = 'cursor: pointer;';
  summary.textContent = `Est. Nutrition: ~${caloriesPerServing} kcal / ${kjPerServing} kJ per serving`;
  
  // Expanded details content
  const details = document.createElement('div');
  details.style.cssText = `
    margin-top: 0.5rem;
    margin-left: 0;
    padding: 0.5rem 0;
    font-size: 0.9em;
    color: var(--md-default-fg-color--light, #666);
  `;
  
  // Build details content using DOM methods for safety
  const totalLine = document.createElement('div');
  totalLine.textContent = `Total recipe: ~${totalCalories} kcal (${totalKJ} kJ)`;
  details.appendChild(totalLine);
  
  // Show unmatched ingredients if any (excluding filtered ingredients like "to serve")
  const unmatched = ingredientResults.filter(r => !r.matched && !r.filtered);
  if (unmatched.length > 0) {
    const unmatchedDiv = document.createElement('div');
    unmatchedDiv.style.cssText = 'margin-top: 0.25rem;';
    unmatchedDiv.textContent = `Not estimated: ${unmatched.map(u => u.ingredient).join(', ')}`;
    details.appendChild(unmatchedDiv);
  }
  
  // Disclaimer
  const disclaimer = document.createElement('div');
  disclaimer.style.cssText = 'margin-top: 0.25rem; font-style: italic; font-size: 0.9em;';
  disclaimer.textContent = `(${confidence}% of ingredients matched - rough estimate only)`;
  details.appendChild(disclaimer);
  
  container.appendChild(summary);
  container.appendChild(details);
  listItem.appendChild(container);
  
  return listItem;
}

/**
 * Insert the nutrition element as a bullet point in the meta info list
 */
function insertNutritionElement(element) {
  const content = document.querySelector('.md-content article');
  if (!content) return false;
  
  // Check if already inserted (prevent duplicates)
  if (content.querySelector('.nutrition-estimate')) {
    return false;
  }
  
  // Find the first ul (the recipe meta info list with Serves, Time, etc.)
  const firstUL = content.querySelector('ul');
  if (firstUL) {
    // Add as the last item in the meta info list
    firstUL.appendChild(element);
    return true;
  }
  
  return false;
}

/**
 * Main function to calculate and display nutrition info
 */
function calculateAndDisplayNutrition() {
  // Only run on recipe pages
  if (!isRecipePage()) {
    return;
  }
  
  // Check if already inserted (prevent duplicates from multiple event triggers)
  const content = document.querySelector('.md-content article');
  if (content && content.querySelector('.nutrition-estimate')) {
    return;
  }
  
  const servings = getServings();
  if (!servings) return;
  
  const ingredients = getIngredients();
  if (ingredients.length === 0) return;
  
  // Parse and calculate calories for each ingredient
  const results = ingredients.map(ing => {
    const parsed = parseIngredient(ing);
    return calculateIngredientCalories(parsed);
  });
  
  // Sum up total calories
  const totalCalories = results.reduce((sum, r) => sum + r.calories, 0);
  const caloriesPerServing = Math.round(totalCalories / servings);
  
  // Only show if we have some valid data
  const matchedCount = results.filter(r => r.matched).length;
  if (matchedCount === 0) return;
  
  // Create and insert the element
  const nutritionElement = createNutritionElement(
    totalCalories, 
    caloriesPerServing, 
    servings, 
    results
  );
  
  insertNutritionElement(nutritionElement);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', calculateAndDisplayNutrition);

// Also handle MkDocs instant loading (for SPA-like navigation)
if (typeof document$ !== 'undefined') {
  document$.subscribe(() => {
    calculateAndDisplayNutrition();
  });
} else {
  // Fallback: also run on location changes for MkDocs Material instant loading
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      // Small delay to ensure content is loaded
      setTimeout(calculateAndDisplayNutrition, 100);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}
