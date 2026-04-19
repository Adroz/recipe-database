/**
 * Calorie/kJ Estimator for Recipe Pages
 * 
 * This script parses ingredients from recipe pages and estimates
 * total and per-serving calorie/kJ information using a local database.
 * No external API is required.
 */

// Calorie database: calories per standard unit (per 100g unless otherwise noted)
// Sources: USDA FoodData Central, general nutrition references
const CALORIE_DATABASE = {
  // Proteins
  'chicken': { calories: 239, unit: '100g', kj: 1000 },
  'chicken thigh': { calories: 239, unit: '100g', kj: 1000 },
  'chicken thighs': { calories: 239, unit: '100g', kj: 1000 },
  'chicken breast': { calories: 165, unit: '100g', kj: 690 },
  'chicken fillet': { calories: 165, unit: '100g', kj: 690 },
  'beef': { calories: 250, unit: '100g', kj: 1046 },
  'beef mince': { calories: 250, unit: '100g', kj: 1046 },
  'ground beef': { calories: 250, unit: '100g', kj: 1046 },
  'lamb': { calories: 294, unit: '100g', kj: 1230 },
  'pork': { calories: 242, unit: '100g', kj: 1012 },
  'pulled pork': { calories: 242, unit: '100g', kj: 1012 },
  'bacon': { calories: 541, unit: '100g', kj: 2264 },
  'sausage': { calories: 301, unit: '100g', kj: 1259 },
  'shrimp': { calories: 99, unit: '100g', kj: 414 },
  'prawns': { calories: 99, unit: '100g', kj: 414 },
  'tuna': { calories: 132, unit: '100g', kj: 552 },
  'salmon': { calories: 208, unit: '100g', kj: 870 },
  'fish': { calories: 150, unit: '100g', kj: 627 },
  'egg': { calories: 78, unit: '1', kj: 326 },
  'eggs': { calories: 78, unit: '1', kj: 326 },
  'tofu': { calories: 76, unit: '100g', kj: 318 },
  'paneer': { calories: 265, unit: '100g', kj: 1109 },
  
  // Dairy
  'milk': { calories: 42, unit: '100ml', kj: 176 },
  'cream': { calories: 340, unit: '100ml', kj: 1422 },
  'thickened cream': { calories: 340, unit: '100ml', kj: 1422 },
  'heavy cream': { calories: 340, unit: '100ml', kj: 1422 },
  'coconut milk': { calories: 230, unit: '100ml', kj: 962 },
  'coconut cream': { calories: 330, unit: '100ml', kj: 1381 },
  'butter': { calories: 717, unit: '100g', kj: 3000 },
  'cheese': { calories: 402, unit: '100g', kj: 1682 },
  'parmesan': { calories: 431, unit: '100g', kj: 1803 },
  'cheddar': { calories: 403, unit: '100g', kj: 1686 },
  'mozzarella': { calories: 280, unit: '100g', kj: 1172 },
  'yoghurt': { calories: 59, unit: '100g', kj: 247 },
  'yogurt': { calories: 59, unit: '100g', kj: 247 },
  'sour cream': { calories: 193, unit: '100g', kj: 807 },
  
  // Grains and Starches
  'flour': { calories: 364, unit: '100g', kj: 1523 },
  'plain flour': { calories: 364, unit: '100g', kj: 1523 },
  'self-raising flour': { calories: 355, unit: '100g', kj: 1485 },
  'bread flour': { calories: 361, unit: '100g', kj: 1510 },
  'rice': { calories: 130, unit: '100g', kj: 544 },
  'pasta': { calories: 131, unit: '100g', kj: 548 },
  'spaghetti': { calories: 131, unit: '100g', kj: 548 },
  'noodles': { calories: 138, unit: '100g', kj: 577 },
  'ramen': { calories: 138, unit: '100g', kj: 577 },
  'bread': { calories: 265, unit: '100g', kj: 1109 },
  'oats': { calories: 389, unit: '100g', kj: 1628 },
  'oatmeal': { calories: 389, unit: '100g', kj: 1628 },
  'cornmeal': { calories: 370, unit: '100g', kj: 1548 },
  'cornflour': { calories: 381, unit: '100g', kj: 1594 },
  'breadcrumbs': { calories: 395, unit: '100g', kj: 1653 },
  'tortilla': { calories: 237, unit: '100g', kj: 991 },
  
  // Legumes
  'lentils': { calories: 116, unit: '100g', kj: 485 },
  'red lentils': { calories: 116, unit: '100g', kj: 485 },
  'chickpeas': { calories: 164, unit: '100g', kj: 686 },
  'beans': { calories: 127, unit: '100g', kj: 531 },
  'black beans': { calories: 132, unit: '100g', kj: 552 },
  'kidney beans': { calories: 127, unit: '100g', kj: 531 },
  'white beans': { calories: 139, unit: '100g', kj: 582 },
  
  // Vegetables
  'onion': { calories: 40, unit: '100g', kj: 167 },
  'onions': { calories: 40, unit: '100g', kj: 167 },
  'brown onion': { calories: 40, unit: '100g', kj: 167 },
  'red onion': { calories: 40, unit: '100g', kj: 167 },
  'garlic': { calories: 4, unit: 'clove', kj: 17 },
  'garlic cloves': { calories: 4, unit: 'clove', kj: 17 },
  'tomato': { calories: 18, unit: '100g', kj: 75 },
  'tomatoes': { calories: 18, unit: '100g', kj: 75 },
  'crushed tomatoes': { calories: 32, unit: '100g', kj: 134 },
  'chopped tomatoes': { calories: 32, unit: '100g', kj: 134 },
  'canned tomatoes': { calories: 32, unit: '100g', kj: 134 },
  'tomato paste': { calories: 82, unit: '100g', kj: 343 },
  'tomato passata': { calories: 24, unit: '100g', kj: 100 },
  'passata': { calories: 24, unit: '100g', kj: 100 },
  'sun-dried tomatoes': { calories: 258, unit: '100g', kj: 1079 },
  'potato': { calories: 77, unit: '100g', kj: 322 },
  'potatoes': { calories: 77, unit: '100g', kj: 322 },
  'sweet potato': { calories: 86, unit: '100g', kj: 360 },
  'carrot': { calories: 41, unit: '100g', kj: 172 },
  'carrots': { calories: 41, unit: '100g', kj: 172 },
  'celery': { calories: 14, unit: '100g', kj: 59 },
  'capsicum': { calories: 31, unit: '100g', kj: 130 },
  'bell pepper': { calories: 31, unit: '100g', kj: 130 },
  'bell peppers': { calories: 31, unit: '100g', kj: 130 },
  'spinach': { calories: 23, unit: '100g', kj: 96 },
  'kale': { calories: 35, unit: '100g', kj: 146 },
  'lettuce': { calories: 15, unit: '100g', kj: 63 },
  'cabbage': { calories: 25, unit: '100g', kj: 105 },
  'broccoli': { calories: 34, unit: '100g', kj: 142 },
  'cauliflower': { calories: 25, unit: '100g', kj: 105 },
  'zucchini': { calories: 17, unit: '100g', kj: 71 },
  'eggplant': { calories: 25, unit: '100g', kj: 105 },
  'aubergine': { calories: 25, unit: '100g', kj: 105 },
  'mushroom': { calories: 22, unit: '100g', kj: 92 },
  'mushrooms': { calories: 22, unit: '100g', kj: 92 },
  'corn': { calories: 86, unit: '100g', kj: 360 },
  'peas': { calories: 81, unit: '100g', kj: 339 },
  'green beans': { calories: 31, unit: '100g', kj: 130 },
  'asparagus': { calories: 20, unit: '100g', kj: 84 },
  'pumpkin': { calories: 26, unit: '100g', kj: 109 },
  'cucumber': { calories: 16, unit: '100g', kj: 67 },
  'chard': { calories: 19, unit: '100g', kj: 79 },
  'ginger': { calories: 80, unit: '100g', kj: 335 },
  
  // Fruits
  'banana': { calories: 89, unit: '100g', kj: 372 },
  'bananas': { calories: 89, unit: '100g', kj: 372 },
  'apple': { calories: 52, unit: '100g', kj: 218 },
  'orange': { calories: 47, unit: '100g', kj: 197 },
  'lemon': { calories: 29, unit: '100g', kj: 121 },
  'lime': { calories: 30, unit: '100g', kj: 126 },
  'berries': { calories: 57, unit: '100g', kj: 238 },
  'strawberries': { calories: 32, unit: '100g', kj: 134 },
  'blueberries': { calories: 57, unit: '100g', kj: 238 },
  'raspberries': { calories: 52, unit: '100g', kj: 218 },
  'avocado': { calories: 160, unit: '100g', kj: 669 },
  
  // Nuts and Seeds
  'almonds': { calories: 579, unit: '100g', kj: 2423 },
  'walnuts': { calories: 654, unit: '100g', kj: 2736 },
  'peanuts': { calories: 567, unit: '100g', kj: 2372 },
  'peanut butter': { calories: 588, unit: '100g', kj: 2460 },
  'cashews': { calories: 553, unit: '100g', kj: 2314 },
  'pistachios': { calories: 562, unit: '100g', kj: 2351 },
  'sesame seeds': { calories: 573, unit: '100g', kj: 2397 },
  'sunflower seeds': { calories: 584, unit: '100g', kj: 2443 },
  'tahini': { calories: 595, unit: '100g', kj: 2489 },
  
  // Oils and Fats
  'oil': { calories: 884, unit: '100ml', kj: 3698 },
  'olive oil': { calories: 884, unit: '100ml', kj: 3698 },
  'vegetable oil': { calories: 884, unit: '100ml', kj: 3698 },
  'coconut oil': { calories: 862, unit: '100ml', kj: 3606 },
  'ghee': { calories: 900, unit: '100ml', kj: 3765 },
  
  // Sugars and Sweeteners
  'sugar': { calories: 387, unit: '100g', kj: 1619 },
  'white sugar': { calories: 387, unit: '100g', kj: 1619 },
  'brown sugar': { calories: 380, unit: '100g', kj: 1590 },
  'caster sugar': { calories: 387, unit: '100g', kj: 1619 },
  'honey': { calories: 304, unit: '100g', kj: 1272 },
  'maple syrup': { calories: 260, unit: '100ml', kj: 1088 },
  'coconut sugar': { calories: 375, unit: '100g', kj: 1569 },
  
  // Baking
  'chocolate': { calories: 546, unit: '100g', kj: 2284 },
  'chocolate chips': { calories: 535, unit: '100g', kj: 2238 },
  'cocoa': { calories: 228, unit: '100g', kj: 954 },
  'cocoa powder': { calories: 228, unit: '100g', kj: 954 },
  'baking powder': { calories: 53, unit: '100g', kj: 222 },
  'baking soda': { calories: 0, unit: '100g', kj: 0 },
  'vanilla': { calories: 288, unit: '100ml', kj: 1205 },
  'vanilla extract': { calories: 288, unit: '100ml', kj: 1205 },
  'vanilla essence': { calories: 288, unit: '100ml', kj: 1205 },
  'yeast': { calories: 325, unit: '100g', kj: 1360 },
  
  // Condiments and Sauces
  'soy sauce': { calories: 53, unit: '100ml', kj: 222 },
  'fish sauce': { calories: 35, unit: '100ml', kj: 146 },
  'vinegar': { calories: 21, unit: '100ml', kj: 88 },
  'mustard': { calories: 66, unit: '100g', kj: 276 },
  'mayonnaise': { calories: 680, unit: '100g', kj: 2845 },
  'ketchup': { calories: 112, unit: '100g', kj: 469 },
  'hot sauce': { calories: 11, unit: '100ml', kj: 46 },
  'sriracha': { calories: 93, unit: '100ml', kj: 389 },
  'worcestershire sauce': { calories: 78, unit: '100ml', kj: 326 },
  
  // Stock and Broth
  'stock': { calories: 10, unit: '100ml', kj: 42 },
  'beef stock': { calories: 10, unit: '100ml', kj: 42 },
  'chicken stock': { calories: 10, unit: '100ml', kj: 42 },
  'vegetable stock': { calories: 5, unit: '100ml', kj: 21 },
  'vegetable broth': { calories: 5, unit: '100ml', kj: 21 },
  'broth': { calories: 10, unit: '100ml', kj: 42 },
  
  // Alcohol (for cooking)
  'wine': { calories: 83, unit: '100ml', kj: 347 },
  'red wine': { calories: 85, unit: '100ml', kj: 356 },
  'white wine': { calories: 82, unit: '100ml', kj: 343 },
  'beer': { calories: 43, unit: '100ml', kj: 180 },
  'sake': { calories: 134, unit: '100ml', kj: 561 },
  'mirin': { calories: 241, unit: '100ml', kj: 1008 },
  
  // Spices (minimal calories, but included for completeness)
  'salt': { calories: 0, unit: '100g', kj: 0 },
  'pepper': { calories: 251, unit: '100g', kj: 1050 },
  'black pepper': { calories: 251, unit: '100g', kj: 1050 },
  'cumin': { calories: 375, unit: '100g', kj: 1569 },
  'paprika': { calories: 282, unit: '100g', kj: 1180 },
  'turmeric': { calories: 354, unit: '100g', kj: 1481 },
  'cinnamon': { calories: 247, unit: '100g', kj: 1033 },
  'oregano': { calories: 265, unit: '100g', kj: 1109 },
  'thyme': { calories: 101, unit: '100g', kj: 423 },
  'basil': { calories: 23, unit: '100g', kj: 96 },
  'cilantro': { calories: 23, unit: '100g', kj: 96 },
  'parsley': { calories: 36, unit: '100g', kj: 151 },
  'rosemary': { calories: 131, unit: '100g', kj: 548 },
  'bay leaves': { calories: 313, unit: '100g', kj: 1309 },
  'garam masala': { calories: 379, unit: '100g', kj: 1586 },
  'curry powder': { calories: 325, unit: '100g', kj: 1360 },
  'chili powder': { calories: 282, unit: '100g', kj: 1180 },
  'cardamom': { calories: 311, unit: '100g', kj: 1301 },
  
  // Misc
  'hummus': { calories: 166, unit: '100g', kj: 694 },
  'date': { calories: 282, unit: '100g', kj: 1180 },
  'dates': { calories: 282, unit: '100g', kj: 1180 },
};

// Unit conversion factors to grams or ml
const UNIT_CONVERSIONS = {
  // Weight
  'g': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'oz': 28.35,
  'ounce': 28.35,
  'ounces': 28.35,
  'lb': 453.6,
  'lbs': 453.6,
  'pound': 453.6,
  'pounds': 453.6,
  
  // Volume (converted to ml)
  'ml': 1,
  'milliliter': 1,
  'millilitre': 1,
  'l': 1000,
  'liter': 1000,
  'litre': 1000,
  'cup': 240,
  'cups': 240,
  'tbsp': 15,
  'tablespoon': 15,
  'tablespoons': 15,
  'tsp': 5,
  'teaspoon': 5,
  'teaspoons': 5,
  'fl oz': 30,
  'fluid ounce': 30,
  
  // Count-based (approximate weights)
  'piece': 100,
  'pieces': 100,
  'slice': 30,
  'slices': 30,
  'clove': 1, // special handling for garlic
  'cloves': 1,
  'inch': 15, // for ginger
  'handful': 30,
  'pinch': 0.5,
  'dash': 1,
  'to taste': 0,
  'serve': 100,
  'fillet': 150,
  'fillets': 150,
  'thigh': 150,
  'thighs': 150,
  'breast': 175,
  'breasts': 175,
  'stalk': 40,
  'stalks': 40,
  'can': 400, // standard can size
  'small': 50,
  'medium': 100,
  'large': 150,
  'big': 150,
};

// Count-based units that represent approximate weights per item
// These units multiply the quantity by their gram equivalent (e.g., "6 fillets" = 6 * 150g)
const COUNT_BASED_UNITS = [
  'piece', 'pieces', 'slice', 'slices', 'fillet', 'fillets',
  'thigh', 'thighs', 'breast', 'breasts', 'stalk', 'stalks',
  'can', 'small', 'medium', 'large', 'big', 'handful', 'inch'
];

// Parse quantity from ingredient text
function parseQuantity(text) {
  // Handle fractions
  const fractionMap = {
    '¼': 0.25, '½': 0.5, '¾': 0.75,
    '⅓': 0.33, '⅔': 0.67,
    '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875
  };
  
  let cleanText = text.toLowerCase().trim();
  
  // Replace unicode fractions
  for (const [frac, val] of Object.entries(fractionMap)) {
    cleanText = cleanText.replace(frac, val.toString());
  }
  
  // Handle "1/2", "1/4" style fractions
  cleanText = cleanText.replace(/(\d+)\s*\/\s*(\d+)/g, (match, num, den) => {
    return (parseInt(num) / parseInt(den)).toString();
  });
  
  // Handle "1 1/2" mixed fractions
  cleanText = cleanText.replace(/(\d+)\s+(\d+)\s*\/\s*(\d+)/g, (match, whole, num, den) => {
    return (parseInt(whole) + parseInt(num) / parseInt(den)).toString();
  });
  
  // Extract number at the start
  const match = cleanText.match(/^([\d.]+(?:\s*-\s*[\d.]+)?)/);
  if (match) {
    // Handle ranges like "4-5" by taking the average
    if (match[1].includes('-')) {
      const parts = match[1].split('-').map(p => parseFloat(p.trim()));
      return (parts[0] + parts[1]) / 2;
    }
    return parseFloat(match[1]);
  }
  
  return 1; // Default to 1 if no quantity found
}

// Parse unit from ingredient text
function parseUnit(text) {
  const cleanText = text.toLowerCase();
  
  // Check for explicit units
  for (const unit of Object.keys(UNIT_CONVERSIONS).sort((a, b) => b.length - a.length)) {
    const regex = new RegExp(`\\b${unit}\\b`, 'i');
    if (regex.test(cleanText)) {
      return unit;
    }
  }
  
  return null;
}

// Find matching ingredient in database
function findIngredient(text) {
  const cleanText = text.toLowerCase()
    .replace(/[,()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Try to find exact matches first (longer phrases)
  const sortedKeys = Object.keys(CALORIE_DATABASE).sort((a, b) => b.length - a.length);
  
  for (const ingredient of sortedKeys) {
    if (cleanText.includes(ingredient)) {
      return { name: ingredient, data: CALORIE_DATABASE[ingredient] };
    }
  }
  
  return null;
}

// Calculate calories for a single ingredient line
function calculateIngredientCalories(ingredientText) {
  const quantity = parseQuantity(ingredientText);
  const unit = parseUnit(ingredientText);
  const ingredient = findIngredient(ingredientText);
  
  if (!ingredient) {
    return { calories: 0, kj: 0, matched: false, text: ingredientText };
  }
  
  const caloriesPer100 = ingredient.data.calories;
  const kjPer100 = ingredient.data.kj;
  const dbUnit = ingredient.data.unit;
  
  // If the database unit is per individual item (egg, clove), just multiply by quantity
  if (dbUnit === '1' || dbUnit === 'clove') {
    const calories = quantity * caloriesPer100;
    const kj = quantity * kjPer100;
    return { calories, kj, matched: true, text: ingredientText, ingredient: ingredient.name };
  }
  
  // For weight/volume-based database entries (per 100g or 100ml)
  // We need to convert the recipe's quantity+unit to grams/ml
  let amountInGramsOrMl = 0;
  
  if (unit && UNIT_CONVERSIONS[unit]) {
    // We have an explicit unit - use its conversion factor
    const conversionFactor = UNIT_CONVERSIONS[unit];
    
    // Special handling for count-based units (fillets, thighs, etc.)
    // These represent approximate weights per item, so multiply by quantity
    if (COUNT_BASED_UNITS.includes(unit)) {
      // For "6 chicken thigh fillets", quantity=6, conversionFactor=150g per fillet
      amountInGramsOrMl = quantity * conversionFactor;
    } else {
      // For "2 tbsp olive oil", quantity=2, conversionFactor=15ml per tbsp
      amountInGramsOrMl = quantity * conversionFactor;
    }
  } else {
    // No unit found - check if there's a weight/volume in the text (e.g., "200g sun-dried tomatoes")
    const weightMatch = ingredientText.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\b/i);
    if (weightMatch) {
      const value = parseFloat(weightMatch[1]);
      const weightUnit = weightMatch[2].toLowerCase();
      if (weightUnit === 'kg' || weightUnit === 'l') {
        amountInGramsOrMl = value * 1000;
      } else {
        amountInGramsOrMl = value;
      }
    } else {
      // Default weight estimate per item when no unit is specified (e.g., "2 onions", "3 carrots")
      // 150g is a reasonable average for medium-sized whole vegetables/fruits
      // This provides a sensible estimate without being overly conservative or generous
      amountInGramsOrMl = quantity * 150;
    }
  }
  
  // Calculate calories based on amount (database is per 100g/100ml)
  const calories = (amountInGramsOrMl / 100) * caloriesPer100;
  const kj = (amountInGramsOrMl / 100) * kjPer100;
  
  return { calories, kj, matched: true, text: ingredientText, ingredient: ingredient.name };
}

// Parse servings from page content
function parseServings() {
  const content = document.body.textContent;
  
  // Look for "Serves: X" pattern
  const patterns = [
    /serves?:\s*(\d+)/i,
    /(\d+)\s*servings?/i,
    /makes?\s*(\d+)/i,
    /yields?\s*(\d+)/i
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return 4; // Default to 4 servings
}

// Get all ingredient list items from the page
function getIngredients() {
  // Look for the Ingredients section
  const headings = document.querySelectorAll('h2');
  let ingredientsSection = null;
  
  for (const heading of headings) {
    if (heading.textContent.toLowerCase().includes('ingredient')) {
      ingredientsSection = heading;
      break;
    }
  }
  
  if (!ingredientsSection) {
    return [];
  }
  
  // Get the list after the ingredients heading
  let nextElement = ingredientsSection.nextElementSibling;
  while (nextElement && nextElement.tagName !== 'UL' && nextElement.tagName !== 'H2') {
    nextElement = nextElement.nextElementSibling;
  }
  
  if (nextElement && nextElement.tagName === 'UL') {
    const items = nextElement.querySelectorAll('li');
    return Array.from(items).map(li => li.textContent);
  }
  
  return [];
}

// Check if current page is a recipe page (not index or home)
function isRecipePage() {
  // Check for Ingredients and Method sections
  const headings = Array.from(document.querySelectorAll('h2'));
  const hasIngredients = headings.some(h => h.textContent.toLowerCase().includes('ingredient'));
  const hasMethod = headings.some(h => h.textContent.toLowerCase().includes('method'));
  
  return hasIngredients && hasMethod;
}

// Create and inject the calorie display
function createCalorieDisplay(totalCalories, totalKj, servings, matchedCount, totalCount) {
  const perServingCalories = Math.round(totalCalories / servings);
  const perServingKj = Math.round(totalKj / servings);
  
  const container = document.createElement('details');
  container.className = 'calorie-estimate';
  container.style.cssText = `
    margin: 1em 0;
    padding: 0.75em 1em;
    background: var(--md-code-bg-color, #f5f5f5);
    border-radius: 8px;
    border-left: 4px solid var(--md-primary-fg-color, #ffa000);
  `;
  
  const summary = document.createElement('summary');
  summary.style.cssText = `
    cursor: pointer;
    font-weight: 600;
    color: var(--md-primary-fg-color, #ffa000);
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5em;
  `;
  summary.innerHTML = `
    <span style="font-size: 1.2em;">🔥</span>
    <span>Estimated Nutrition: ~${perServingCalories} kcal / ~${perServingKj} kJ per serving</span>
    <span style="margin-left: auto; font-size: 0.8em; opacity: 0.7;">▼</span>
  `;
  
  const details = document.createElement('div');
  details.style.cssText = `
    margin-top: 0.75em;
    padding-top: 0.75em;
    border-top: 1px solid var(--md-default-fg-color--lighter, #ddd);
  `;
  
  const accuracy = Math.round((matchedCount / totalCount) * 100);
  
  details.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1em; margin-bottom: 0.75em;">
      <div>
        <div style="font-size: 0.85em; opacity: 0.7;">Per Serving</div>
        <div style="font-size: 1.1em; font-weight: 600;">~${perServingCalories} kcal</div>
        <div style="font-size: 0.9em; opacity: 0.8;">~${perServingKj} kJ</div>
      </div>
      <div>
        <div style="font-size: 0.85em; opacity: 0.7;">Total Recipe</div>
        <div style="font-size: 1.1em; font-weight: 600;">~${Math.round(totalCalories)} kcal</div>
        <div style="font-size: 0.9em; opacity: 0.8;">~${Math.round(totalKj)} kJ</div>
      </div>
      <div>
        <div style="font-size: 0.85em; opacity: 0.7;">Servings</div>
        <div style="font-size: 1.1em; font-weight: 600;">${servings}</div>
      </div>
    </div>
    <div style="font-size: 0.75em; opacity: 0.6; font-style: italic;">
      ⚠️ Estimate based on ${matchedCount}/${totalCount} recognized ingredients (~${accuracy}% coverage). 
      Actual values may vary based on specific brands and preparation methods.
    </div>
  `;
  
  container.appendChild(summary);
  container.appendChild(details);
  
  return container;
}

// Insert the calorie display near the top of the recipe
function insertCalorieDisplay(element) {
  // Find the first h1 (recipe title)
  const title = document.querySelector('h1');
  if (title) {
    // Insert after the metadata list (Serves, Time, Origin)
    let insertPoint = title.nextElementSibling;
    
    // Skip past the metadata list if present
    while (insertPoint && insertPoint.tagName === 'UL') {
      const text = insertPoint.textContent.toLowerCase();
      if (text.includes('serves') || text.includes('time') || text.includes('origin')) {
        insertPoint = insertPoint.nextElementSibling;
        break;
      }
      insertPoint = insertPoint.nextElementSibling;
    }
    
    if (insertPoint) {
      insertPoint.parentNode.insertBefore(element, insertPoint);
    } else {
      title.parentNode.insertBefore(element, title.nextSibling);
    }
  }
}

// Main initialization
function initCalorieEstimator() {
  // Only run on recipe pages
  if (!isRecipePage()) {
    return;
  }
  
  const ingredients = getIngredients();
  if (ingredients.length === 0) {
    return;
  }
  
  let totalCalories = 0;
  let totalKj = 0;
  let matchedCount = 0;
  
  for (const ingredient of ingredients) {
    const result = calculateIngredientCalories(ingredient);
    totalCalories += result.calories;
    totalKj += result.kj;
    if (result.matched) {
      matchedCount++;
    }
  }
  
  // Only display if we matched at least some ingredients
  if (matchedCount > 0) {
    const servings = parseServings();
    const display = createCalorieDisplay(totalCalories, totalKj, servings, matchedCount, ingredients.length);
    insertCalorieDisplay(display);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalorieEstimator);
} else {
  initCalorieEstimator();
}
