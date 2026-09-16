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
  'chicken thigh': { calories: 209, protein: 26, carbs: 0, fat: 11, per: '100g', keywords: ['chicken thigh', 'chicken thighs'] },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, per: '100g', keywords: ['chicken breast', 'chicken breasts'] },
  'chicken': { calories: 190, protein: 27, carbs: 0, fat: 14, per: '100g', keywords: ['chicken'] },

  // Beef
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 17, per: '100g', keywords: ['beef', 'steak', 'ground beef', 'mince', 'sirloin', 'ribeye', 'chuck', 'flank', 'brisket'] },
  'beef mince': { calories: 250, protein: 26, carbs: 0, fat: 17, per: '100g', keywords: ['beef mince', 'ground beef'] },

  // Pork
  'pork': { calories: 242, protein: 27, carbs: 0, fat: 14, per: '100g', keywords: ['pork'] },
  'bacon': { calories: 541, protein: 37, carbs: 1.4, fat: 42, per: '100g', keywords: ['bacon'] },
  'sausage': { calories: 301, protein: 15, carbs: 5, fat: 25, per: '100g', keywords: ['sausage', 'sausages'] },
  'ribs': { calories: 277, protein: 20, carbs: 0, fat: 22, per: '100g', keywords: ['ribs', 'pork ribs'] },

  // Lamb
  'lamb': { calories: 294, protein: 25, carbs: 0, fat: 21, per: '100g', keywords: ['lamb'] },

  // Seafood
  'shrimp': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, per: '100g', keywords: ['shrimp', 'prawns', 'prawn'] },
  'tuna': { calories: 130, protein: 30, carbs: 0, fat: 1, per: '100g', keywords: ['tuna'] },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, per: '100g', keywords: ['salmon'] },
  'fish': { calories: 150, protein: 20, carbs: 0, fat: 5, per: '100g', keywords: ['fish', 'cod', 'tilapia', 'white fish'] },

  // Eggs
  'egg': { calories: 78, protein: 6, carbs: 0.5, fat: 5, per: 'item', keywords: ['egg', 'eggs'] },

  // ===== DAIRY =====
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, per: '100ml', keywords: ['milk'] },
  'cream': { calories: 292, protein: 2.2, carbs: 3.4, fat: 30, per: '100ml', keywords: ['cream', 'heavy cream', 'thickened cream', 'whipping cream'] },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, per: '100g', keywords: ['butter'] },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, per: '100g', keywords: ['cheese'] },
  'cheddar': { calories: 403, protein: 25, carbs: 1.3, fat: 33, per: '100g', keywords: ['cheddar'] },
  'mozzarella': { calories: 280, protein: 22, carbs: 2.2, fat: 17, per: '100g', keywords: ['mozzarella', 'mozzerella'] },
  'parmesan': { calories: 431, protein: 38, carbs: 3.2, fat: 29, per: '100g', keywords: ['parmesan', 'parmigiano'] },
  'cream cheese': { calories: 342, protein: 6, carbs: 4, fat: 34, per: '100g', keywords: ['cream cheese'] },
  'paneer': { calories: 265, protein: 18, carbs: 1.2, fat: 20, per: '100g', keywords: ['paneer'] },
  'yoghurt': { calories: 59, protein: 3.5, carbs: 4.7, fat: 1.5, per: '100g', keywords: ['yoghurt', 'yogurt'] },
  'sour cream': { calories: 193, protein: 2.5, carbs: 3.9, fat: 20, per: '100g', keywords: ['sour cream'] },
  'coconut milk': { calories: 230, protein: 2.3, carbs: 6, fat: 23, per: '100ml', keywords: ['coconut milk'] },
  'coconut cream': { calories: 330, protein: 3, carbs: 8, fat: 34, per: '100ml', keywords: ['coconut cream'] },

  // ===== GRAINS & CARBS =====
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1, per: '100g', keywords: ['pasta', 'spaghetti', 'penne', 'macaroni', 'cavatappi', 'noodles'] },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, per: '100g', keywords: ['rice'] },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, per: '100g', keywords: ['bread'] },
  'flour': { calories: 364, protein: 10, carbs: 76, fat: 1, per: '100g', keywords: ['flour', 'all-purpose flour', 'plain flour', 'self-raising flour'] },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, per: '100g', keywords: ['oats', 'oatmeal', 'rolled oats'] },
  'breadcrumbs': { calories: 395, protein: 13, carbs: 74, fat: 5, per: '100g', keywords: ['breadcrumbs', 'panko'] },
  'tortilla': { calories: 312, protein: 8, carbs: 51, fat: 7, per: '100g', keywords: ['tortilla', 'tortillas', 'wrap', 'wraps'] },

  // ===== LEGUMES =====
  'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, per: '100g', keywords: ['lentils', 'lentil', 'red lentils', 'red lentil'] },
  'chickpeas': { calories: 164, protein: 9, carbs: 27, fat: 2.6, per: '100g', keywords: ['chickpeas', 'chickpea', 'garbanzo'] },
  'black beans': { calories: 132, protein: 9, carbs: 24, fat: 0.5, per: '100g', keywords: ['black beans'] },
  'beans': { calories: 127, protein: 9, carbs: 23, fat: 0.5, per: '100g', keywords: ['beans', 'kidney beans', 'white beans', 'cannellini'] },

  // ===== VEGETABLES =====
  'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, per: '100g', keywords: ['onion', 'onions', 'brown onion', 'red onion', 'white onion'] },
  'garlic': { calories: 5, protein: 0.4, carbs: 1, fat: 0, per: 'clove', keywords: ['garlic', 'garlic clove', 'garlic cloves'] },
  'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, per: '100g', keywords: ['tomato', 'tomatoes', 'cherry tomato', 'cherry tomatoes'] },
  'tomato passata': { calories: 24, protein: 1.2, carbs: 5, fat: 0.2, per: '100ml', keywords: ['passata', 'tomato passata'] },
  'sun-dried tomatoes': { calories: 258, protein: 14, carbs: 56, fat: 3, per: '100g', keywords: ['sun-dried tomato', 'sun-dried tomatoes', 'sundried'] },
  'canned tomatoes': { calories: 20, protein: 1, carbs: 4, fat: 0.2, per: '100g', keywords: ['canned tomatoes', 'chopped tomatoes', 'diced tomatoes', 'tinned tomatoes'] },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, per: '100g', keywords: ['potato', 'potatoes'] },
  'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, per: '100g', keywords: ['sweet potato', 'sweet potatoes'] },
  'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, per: '100g', keywords: ['carrot', 'carrots'] },
  'celery': { calories: 14, protein: 0.7, carbs: 3, fat: 0.2, per: '100g', keywords: ['celery'] },
  'bell pepper': { calories: 31, protein: 1, carbs: 6, fat: 0.3, per: '100g', keywords: ['bell pepper', 'capsicum', 'peppers'] },
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, per: '100g', keywords: ['spinach'] },
  'chard': { calories: 19, protein: 1.8, carbs: 3.7, fat: 0.2, per: '100g', keywords: ['chard', 'swiss chard', 'silverbeet'] },
  'kale': { calories: 49, protein: 4.3, carbs: 9, fat: 0.9, per: '100g', keywords: ['kale'] },
  'lettuce': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, per: '100g', keywords: ['lettuce', 'romaine'] },
  'cabbage': { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, per: '100g', keywords: ['cabbage'] },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, per: '100g', keywords: ['broccoli'] },
  'cauliflower': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, per: '100g', keywords: ['cauliflower'] },
  'eggplant': { calories: 25, protein: 1, carbs: 6, fat: 0.2, per: '100g', keywords: ['eggplant', 'aubergine'] },
  'zucchini': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, per: '100g', keywords: ['zucchini', 'courgette'] },
  'mushroom': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, per: '100g', keywords: ['mushroom', 'mushrooms'] },
  'ginger': { calories: 8, protein: 0.2, carbs: 1.8, fat: 0.1, per: '10g', keywords: ['ginger'] },
  'pumpkin': { calories: 26, protein: 1, carbs: 6.5, fat: 0.1, per: '100g', keywords: ['pumpkin', 'squash', 'butternut'] },

  // ===== FRUITS =====
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, per: '100g', keywords: ['banana', 'bananas'] },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, per: '100g', keywords: ['apple', 'apples'] },
  'lemon': { calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, per: '100g', keywords: ['lemon', 'lemons', 'lemon juice'] },
  'lime': { calories: 30, protein: 0.7, carbs: 10.5, fat: 0.2, per: '100g', keywords: ['lime', 'limes', 'lime juice'] },
  'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, per: '100g', keywords: ['orange', 'oranges', 'orange juice'] },
  'berries': { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, per: '100g', keywords: ['berries', 'strawberries', 'blueberries', 'raspberries'] },
  'dates': { calories: 282, protein: 2.5, carbs: 75, fat: 0.4, per: '100g', keywords: ['dates', 'date'] },

  // ===== FATS & OILS =====
  'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, per: '100ml', keywords: ['olive oil'] },
  'vegetable oil': { calories: 884, protein: 0, carbs: 0, fat: 100, per: '100ml', keywords: ['vegetable oil', 'canola oil', 'oil'] },
  'sesame oil': { calories: 884, protein: 0, carbs: 0, fat: 100, per: '100ml', keywords: ['sesame oil'] },
  'ghee': { calories: 900, protein: 0, carbs: 0, fat: 99.5, per: '100g', keywords: ['ghee'] },

  // ===== SWEETENERS =====
  'sugar': { calories: 387, protein: 0, carbs: 100, fat: 0, per: '100g', keywords: ['sugar', 'white sugar', 'caster sugar', 'granulated sugar'] },
  'brown sugar': { calories: 380, protein: 0.1, carbs: 98, fat: 0, per: '100g', keywords: ['brown sugar'] },
  'honey': { calories: 304, protein: 0.3, carbs: 82, fat: 0, per: '100g', keywords: ['honey'] },
  'maple syrup': { calories: 260, protein: 0, carbs: 67, fat: 0.1, per: '100ml', keywords: ['maple syrup'] },
  'coconut sugar': { calories: 375, protein: 0, carbs: 100, fat: 0, per: '100g', keywords: ['coconut sugar'] },

  // ===== BAKING =====
  'chocolate chips': { calories: 535, protein: 5, carbs: 60, fat: 30, per: '100g', keywords: ['chocolate chips', 'chocolate chip'] },
  'chocolate': { calories: 546, protein: 5, carbs: 60, fat: 31, per: '100g', keywords: ['chocolate', 'cocoa'] },
  'cocoa powder': { calories: 228, protein: 20, carbs: 58, fat: 14, per: '100g', keywords: ['cocoa powder', 'cocoa'] },
  'baking powder': { calories: 5, protein: 0, carbs: 1, fat: 0, per: '5g', keywords: ['baking powder'] },
  'baking soda': { calories: 0, protein: 0, carbs: 0, fat: 0, per: '5g', keywords: ['baking soda', 'bicarbonate'] },
  'vanilla': { calories: 12, protein: 0, carbs: 0.5, fat: 0, per: '5ml', keywords: ['vanilla', 'vanilla extract', 'vanilla essence'] },
  'yeast': { calories: 10, protein: 1, carbs: 1, fat: 0, per: '7g', keywords: ['yeast', 'active dry yeast', 'instant yeast'] },

  // ===== NUTS & SEEDS =====
  'peanut butter': { calories: 588, protein: 25, carbs: 20, fat: 50, per: '100g', keywords: ['peanut butter'] },
  'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, per: '100g', keywords: ['almonds', 'almond'] },
  'peanuts': { calories: 567, protein: 26, carbs: 16, fat: 49, per: '100g', keywords: ['peanuts', 'peanut'] },
  'walnuts': { calories: 654, protein: 15, carbs: 14, fat: 65, per: '100g', keywords: ['walnuts', 'walnut'] },
  'cashews': { calories: 553, protein: 18, carbs: 30, fat: 44, per: '100g', keywords: ['cashews', 'cashew'] },
  'pistachios': { calories: 562, protein: 20, carbs: 28, fat: 45, per: '100g', keywords: ['pistachios', 'pistachio'] },
  'sesame seeds': { calories: 573, protein: 18, carbs: 23, fat: 50, per: '100g', keywords: ['sesame seeds', 'sesame'] },

  // ===== CONDIMENTS & SAUCES =====
  'soy sauce': { calories: 53, protein: 8, carbs: 8, fat: 0, per: '100ml', keywords: ['soy sauce', 'soya sauce'] },
  'fish sauce': { calories: 35, protein: 5, carbs: 4, fat: 0, per: '100ml', keywords: ['fish sauce'] },
  'mirin': { calories: 240, protein: 0.4, carbs: 54, fat: 0, per: '100ml', keywords: ['mirin'] },
  'sake': { calories: 134, protein: 0.5, carbs: 5, fat: 0, per: '100ml', keywords: ['sake'] },
  'vinegar': { calories: 21, protein: 0, carbs: 5, fat: 0, per: '100ml', keywords: ['vinegar', 'rice vinegar', 'white wine vinegar', 'balsamic'] },
  'mayonnaise': { calories: 680, protein: 1, carbs: 0.6, fat: 75, per: '100g', keywords: ['mayonnaise', 'mayo'] },
  'mustard': { calories: 66, protein: 4, carbs: 8, fat: 4, per: '100g', keywords: ['mustard', 'dijon'] },
  'ketchup': { calories: 112, protein: 1.5, carbs: 27, fat: 0.1, per: '100g', keywords: ['ketchup', 'tomato sauce'] },
  'hummus': { calories: 166, protein: 8, carbs: 14, fat: 10, per: '100g', keywords: ['hummus'] },

  // ===== BROTHS & STOCKS =====
  'broth': { calories: 7, protein: 0.5, carbs: 1, fat: 0.1, per: '100ml', keywords: ['broth', 'stock', 'vegetable broth', 'chicken broth', 'beef broth', 'stock powder', 'dashi', 'hondashi', 'kombu'] },

  // ===== SPICES (negligible calories) =====
  'spices': { calories: 5, protein: 0, carbs: 1, fat: 0.2, per: '5g', keywords: ['turmeric', 'cumin', 'paprika', 'garam masala', 'cinnamon', 'cardamom', 'thyme', 'oregano', 'rosemary', 'pepper', 'chili', 'curry powder', 'coriander', 'sage', 'fennel', 'nutmeg', 'allspice', 'clove', 'bay leaf', 'bay leaves', 'bay', 'chilli', 'chile', 'star anise', 'anise', 'harissa', 'sumac', 'mustard seeds', 'fenugreek', 'kasuri methi', 'nigella', 'dried herbs', 'dried sage', 'dried fennel', 'ground coriander', 'ground clove', 'ground nutmeg'] },

  // ===== CONDIMENTS & SAUCES (additional) =====
  'worcestershire sauce': { calories: 78, protein: 2.5, carbs: 18, fat: 0, per: '100ml', keywords: ['worcestershire'] },
  'hot sauce': { calories: 35, protein: 1, carbs: 8, fat: 0, per: '100ml', keywords: ['hot sauce', 'sriracha', 'franks', 'tabasco', 'chilli sauce', 'chile sauce'] },
  'oyster sauce': { calories: 100, protein: 1.5, carbs: 23, fat: 0, per: '100ml', keywords: ['oyster sauce'] },
  'tonkatsu sauce': { calories: 130, protein: 1, carbs: 30, fat: 0, per: '100ml', keywords: ['tonkatsu', 'tonkastu', 'tonkatsu sauce'] },
  'tomato paste': { calories: 82, protein: 3.8, carbs: 19, fat: 0.4, per: '100g', keywords: ['tomato paste', 'tomato puree'] },
  'pickles': { calories: 11, protein: 0.3, carbs: 2.3, fat: 0.2, per: '100g', keywords: ['pickle', 'pickles', 'gherkin', 'gherkins', 'dill pickles'] },

  // ===== PROTEINS (additional) =====
  'anchovy': { calories: 210, protein: 29, carbs: 0, fat: 10, per: '100g', keywords: ['anchovy', 'anchovies', 'anchovie'] },
  'pepperoni': { calories: 494, protein: 22, carbs: 1, fat: 41, per: '100g', keywords: ['pepperoni', 'salami', 'prosciutto', 'chorizo'] },

  // ===== VEGETABLES (additional) =====
  'avocado': { calories: 160, protein: 2, carbs: 9, fat: 15, per: '100g', keywords: ['avocado', 'avocados'] },
  'peas': { calories: 81, protein: 5, carbs: 14, fat: 0.4, per: '100g', keywords: ['peas', 'frozen peas', 'green peas'] },
  'cucumber': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, per: '100g', keywords: ['cucumber', 'cucumbers'] },
  'shallot': { calories: 72, protein: 2.5, carbs: 17, fat: 0.1, per: '100g', keywords: ['shallot', 'shallots'] },
  'scallions': { calories: 32, protein: 1.8, carbs: 7.3, fat: 0.2, per: '100g', keywords: ['scallion', 'scallions', 'spring onion', 'spring onions', 'green onion', 'green onions'] },

  // ===== FRESH HERBS =====
  'fresh herbs': { calories: 36, protein: 3, carbs: 6, fat: 0.8, per: '100g', keywords: ['parsley', 'cilantro', 'coriander leaves', 'coriander leaf', 'coriander/cilantro', 'fresh mint', 'mint leaves', 'mint', 'chives', 'dill', 'basil'] },

  // ===== GRAINS (additional) =====
  'cornmeal': { calories: 361, protein: 7, carbs: 74, fat: 3.6, per: '100g', keywords: ['cornmeal', 'polenta', 'cornstarch', 'corn starch'] },
  'biscuit': { calories: 480, protein: 7, carbs: 64, fat: 20, per: '100g', keywords: ['biscuit', 'biscuits', 'digestive', 'graham cracker', 'graham crackers'] },
  'pita': { calories: 275, protein: 9, carbs: 55, fat: 1.2, per: '100g', keywords: ['pita', 'pita bread', 'flatbread', 'wholemeal pita'] },

  // ===== NUTS & SEEDS (additional) =====
  'tahini': { calories: 595, protein: 17, carbs: 26, fat: 54, per: '100g', keywords: ['tahini'] },
  'shredded coconut': { calories: 592, protein: 6, carbs: 25, fat: 65, per: '100g', keywords: ['desiccated coconut', 'shredded coconut', 'coconut flakes'] },
  'capers': { calories: 23, protein: 2.3, carbs: 4.9, fat: 0.9, per: '100g', keywords: ['capers', 'caper'] },
  'dried fruit': { calories: 301, protein: 1, carbs: 79, fat: 0, per: '100g', keywords: ['dried fruit', 'raisins', 'sultanas', 'currants', 'cranberries'] },
  'nori': { calories: 35, protein: 5, carbs: 6, fat: 0.3, per: '100g', keywords: ['nori', 'seaweed'] },

  // ===== SWEETENERS (additional) =====
  'golden syrup': { calories: 327, protein: 0, carbs: 80, fat: 0, per: '100g', keywords: ['golden syrup', 'treacle'] },

  // ===== ALCOHOLIC BEVERAGES =====
  'wine': { calories: 83, protein: 0.1, carbs: 2.7, fat: 0, per: '100ml', keywords: ['white wine', 'red wine', 'cooking wine', 'chinese cooking wine', 'dry wine', 'dry white wine'] },
  'spirits': { calories: 220, protein: 0, carbs: 0, fat: 0, per: '100ml', keywords: ['whisky', 'whiskey', 'bourbon', 'rum', 'vodka', 'gin', 'brandy'] },

  // ===== BAKING (additional) =====
  'gelatin': { calories: 335, protein: 85, carbs: 0, fat: 0.1, per: '100g', keywords: ['gelatin', 'gelatine', 'unflavored gelatin'] },
  'tamarind': { calories: 239, protein: 2.8, carbs: 57, fat: 0.6, per: '100g', keywords: ['tamarind'] },

  // ===== ZERO OR NEAR-ZERO CALORIE ITEMS =====
  'salt': { calories: 0, protein: 0, carbs: 0, fat: 0, per: '5g', keywords: ['salt', 'kosher salt', 'sea salt', 'flaky salt', 'flaky sea salt'] },
  'water': { calories: 0, protein: 0, carbs: 0, fat: 0, per: '100ml', keywords: ['water'] },
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

  // Clean ingredient name - remove parenthetical notes, normalize spaces
  // Note: we intentionally don't strip after commas, as doing so can lose the
  // main ingredient when descriptions precede it (e.g. "skinless, boneless chicken breasts, cubed")
  ingredientName = ingredientName
    .replace(/\([^)]*\)/g, '')  // Remove parenthetical
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
 * Calculate calories and macros for an ingredient
 */
function calculateIngredientCalories(parsed) {
  // Filtered ingredients (e.g., "to serve", "to taste") - don't include in unmatched list
  if (!parsed) return { calories: 0, protein: 0, carbs: 0, fat: 0, matched: false, filtered: true, ingredient: '' };

  const { quantity, unit, ingredientName } = parsed;
  const foodMatch = findFoodMatch(ingredientName);

  if (!foodMatch) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, matched: false, ingredient: ingredientName };
  }

  const { calories, protein = 0, carbs = 0, fat = 0, per, key } = foodMatch;

  // Determine the amount in standard units (g or ml or items)
  let standardAmount = quantity;

  if (unit && UNIT_CONVERSIONS[unit]) {
    standardAmount = quantity * UNIT_CONVERSIONS[unit];
  }

  function scale(value) {
    if (per === '100g' || per === '100ml') {
      return (standardAmount / 100) * value;
    } else if (per === 'item' || per === 'clove') {
      return standardAmount * value;
    } else {
      const perMatch = per.match(/(\d+)(g|ml)/);
      if (perMatch) {
        return (standardAmount / parseInt(perMatch[1])) * value;
      }
      return standardAmount * value;
    }
  }

  return {
    calories: Math.round(scale(calories)),
    protein: Math.round(scale(protein) * 10) / 10,
    carbs: Math.round(scale(carbs) * 10) / 10,
    fat: Math.round(scale(fat) * 10) / 10,
    matched: true,
    ingredient: ingredientName,
    matchedTo: key,
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
 * Create a pure-SVG donut chart showing macro calorie split
 */
function createMacroChart(proteinG, carbsG, fatG) {
  const pc = proteinG * 4;
  const cc = carbsG * 4;
  const fc = fatG * 9;
  const total = pc + cc + fc;
  if (total === 0) return null;

  const S = 100, cx = 50, cy = 50, R = 42, ri = 25;
  const segs = [
    { cal: pc, color: '#4CAF50', label: 'Protein' },
    { cal: cc, color: '#2196F3', label: 'Carbs' },
    { cal: fc, color: '#FF9800', label: 'Fat' },
  ].filter(s => s.cal > 0);

  function pt(deg, r) {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function sectorPath(a0, a1, color) {
    const sweep = a1 - a0;
    if (sweep >= 359.9) {
      // Full circle — draw as two halves
      const [x1,y1] = pt(a0, R),     [x2,y2] = pt(a0+180, R);
      const [x3,y3] = pt(a0+180, ri),[x4,y4] = pt(a0, ri);
      return `<path d="M${x1},${y1} A${R},${R} 0 1 1 ${x2},${y2} A${R},${R} 0 1 1 ${x1},${y1} M${x3},${y3} A${ri},${ri} 0 1 0 ${x4},${y4} A${ri},${ri} 0 1 0 ${x3},${y3}" fill="${color}" fill-rule="evenodd"/>`;
    }
    const lg = sweep > 180 ? 1 : 0;
    const [x1,y1]=pt(a0,R),[x2,y2]=pt(a1,R);
    const [x3,y3]=pt(a1,ri),[x4,y4]=pt(a0,ri);
    return `<path d="M${x1},${y1} A${R},${R} 0 ${lg} 1 ${x2},${y2} L${x3},${y3} A${ri},${ri} 0 ${lg} 0 ${x4},${y4} Z" fill="${color}"/>`;
  }

  let angle = 0;
  const GAP = segs.length > 1 ? 3 : 0;
  const paths = segs.map(s => {
    const sweep = (s.cal / total) * 360;
    const path = sectorPath(angle + GAP/2, angle + sweep - GAP/2, s.color);
    angle += sweep;
    return path;
  }).join('');

  // Legend rows
  const legendItems = [
    { label: 'Protein', cal: pc, color: '#4CAF50' },
    { label: 'Carbs',   cal: cc, color: '#2196F3' },
    { label: 'Fat',     cal: fc, color: '#FF9800' },
  ].filter(s => s.cal > 0).map(s =>
    `<div style="display:flex;align-items:center;gap:4px;font-size:0.8em;line-height:1.4">` +
    `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color};flex-shrink:0"></span>` +
    `${s.label} ${Math.round(s.cal/total*100)}%` +
    `</div>`
  ).join('');

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'flex-shrink: 0; text-align: center;';
  wrapper.innerHTML =
    `<svg viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" aria-label="Macro calorie split">${paths}</svg>` +
    `<div style="margin-top:4px;color:var(--md-default-fg-color--light,#666)">${legendItems}</div>`;
  return wrapper;
}

/**
 * Create the collapsible nutrition info element
 * Styled to match the recipe bullet points (Serves, Time required, etc.)
 */
function createNutritionElement(totalCalories, caloriesPerServing, servings, ingredientResults, macros) {
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
    ${macros && macros.hasMacros ? 'display: flex; align-items: flex-start; gap: 1rem;' : ''}
  `;

  // Text column to hold all text content
  const textCol = document.createElement('div');

  // Build details content using DOM methods for safety
  const perServingLine = document.createElement('div');
  perServingLine.textContent = `Per serving: ~${caloriesPerServing} kcal (${kjPerServing} kJ)`;
  textCol.appendChild(perServingLine);

  // Macro line
  if (macros && macros.hasMacros) {
    const macroLine = document.createElement('div');
    macroLine.style.cssText = 'margin-top: 0.25rem;';
    macroLine.textContent = `Protein ${macros.proteinPerServing}g · Carbs ${macros.carbsPerServing}g · Fat ${macros.fatPerServing}g per serving`;
    textCol.appendChild(macroLine);
  }

  const totalLine = document.createElement('div');
  totalLine.style.cssText = 'margin-top: 0.25rem;';
  totalLine.textContent = `Total recipe: ~${totalCalories} kcal (${totalKJ} kJ)`;
  textCol.appendChild(totalLine);

  // Show unmatched ingredients if any (excluding filtered ingredients like "to serve")
  const unmatched = ingredientResults.filter(r => !r.matched && !r.filtered);
  if (unmatched.length > 0) {
    const unmatchedDiv = document.createElement('div');
    unmatchedDiv.style.cssText = 'margin-top: 0.25rem;';
    unmatchedDiv.textContent = `Not estimated: ${unmatched.map(u => u.ingredient).join(', ')}`;
    textCol.appendChild(unmatchedDiv);
  }

  // Disclaimer
  const disclaimer = document.createElement('div');
  disclaimer.style.cssText = 'margin-top: 0.25rem; font-style: italic; font-size: 0.9em;';
  disclaimer.textContent = `(${confidence}% of ingredients matched - rough estimate only)`;
  textCol.appendChild(disclaimer);

  details.appendChild(textCol);

  // Add donut chart if macros available
  if (macros && macros.hasMacros) {
    const chart = createMacroChart(macros.proteinPerServing, macros.carbsPerServing, macros.fatPerServing);
    if (chart) details.appendChild(chart);
  }

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

  // Sum up macros
  const totalProtein = Math.round(results.reduce((s, r) => s + (r.protein || 0), 0));
  const totalCarbs   = Math.round(results.reduce((s, r) => s + (r.carbs   || 0), 0));
  const totalFat     = Math.round(results.reduce((s, r) => s + (r.fat     || 0), 0));
  const proteinPerServing = Math.round(totalProtein / servings);
  const carbsPerServing   = Math.round(totalCarbs   / servings);
  const fatPerServing     = Math.round(totalFat     / servings);
  const hasMacros = (totalProtein + totalCarbs + totalFat) > 0;

  const macros = { proteinPerServing, carbsPerServing, fatPerServing, totalProtein, totalCarbs, totalFat, hasMacros };

  // Only show if we have some valid data
  const matchedCount = results.filter(r => r.matched).length;
  if (matchedCount === 0) return;

  // Create and insert the element
  const nutritionElement = createNutritionElement(
    totalCalories,
    caloriesPerServing,
    servings,
    results,
    macros
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
