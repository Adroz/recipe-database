/**
 * Regression tests for the estimated macros feature (protein/carbs/fat).
 *
 * calorie-estimator.js is a plain browser script with no module exports, so
 * it's loaded here via `new Function(...)` with minimal document/window/
 * MutationObserver stubs standing in for the DOM it expects at load time.
 * Run with: node --test tests/
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SCRIPT_PATH = path.join(__dirname, '..', 'docs', 'javascripts', 'calorie-estimator.js');
const SOURCE = fs.readFileSync(SCRIPT_PATH, 'utf8');

function createFakeElement(tag) {
  const el = {
    tagName: String(tag).toUpperCase(),
    style: {},
    children: [],
    _text: '',
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };
  Object.defineProperty(el, 'textContent', {
    get() {
      return this._text + this.children.map((c) => c.textContent || '').join('');
    },
    set(v) {
      this._text = v;
    },
  });
  return el;
}

function loadScript() {
  const documentStub = {
    createElement: (tag) => createFakeElement(tag),
    querySelector: () => null,
    addEventListener: () => {},
    body: {},
  };
  const windowStub = { location: { pathname: '/some-recipe/' } };

  const factory = new Function(
    'document',
    'window',
    'MutationObserver',
    `${SOURCE}
    return {
      parseQuantity,
      parseIngredient,
      findFoodMatch,
      calculateIngredientCalories,
      createMacroChart,
      createNutritionElement,
    };`
  );

  return factory(documentStub, windowStub, class { observe() {} });
}

test('calculateIngredientCalories reports protein/carbs/fat alongside calories (data model)', () => {
  const { parseIngredient, calculateIngredientCalories } = loadScript();

  const parsed = parseIngredient('100g chicken breast');
  const result = calculateIngredientCalories(parsed);

  assert.equal(result.matched, true);
  assert.equal(result.calories, 165);
  assert.equal(result.protein, 31);
  assert.equal(result.carbs, 0);
  assert.equal(result.fat, 3.6);
});

test('createNutritionElement shows a protein/carbs/fat line next to the nutrition summary', () => {
  const { createNutritionElement } = loadScript();

  const macros = {
    proteinPerServing: 30,
    carbsPerServing: 40,
    fatPerServing: 10,
    hasMacros: true,
  };
  const listItem = createNutritionElement(1600, 400, 4, [], macros);

  const container = listItem.children[0];
  const summary = container.children[0];
  const details = container.children[1];
  const textCol = details.children[0];

  assert.match(summary.textContent, /Est\. Nutrition: ~400 kcal/);
  const macroLine = textCol.children.find((c) => /Protein/.test(c.textContent));
  assert.ok(macroLine, 'expected a macro line in the nutrition details');
  assert.equal(macroLine.textContent, 'Protein 30g · Carbs 40g · Fat 10g per serving');
});

test('createNutritionElement places the macro chart to the right of the text column', () => {
  const { createNutritionElement } = loadScript();

  const macros = { proteinPerServing: 30, carbsPerServing: 40, fatPerServing: 10, hasMacros: true };
  const listItem = createNutritionElement(1600, 400, 4, [], macros);

  const details = listItem.children[0].children[1];
  assert.equal(details.children.length, 2, 'expected text column followed by chart');
  assert.match(details.style.cssText, /display: flex/);
  const chart = details.children[1];
  assert.match(chart.innerHTML, /<svg/);
});

test('createNutritionElement shows nothing extra when a recipe has no estimated macros', () => {
  const { createNutritionElement } = loadScript();

  const macros = { proteinPerServing: 0, carbsPerServing: 0, fatPerServing: 0, hasMacros: false };
  const listItem = createNutritionElement(1600, 400, 4, [], macros);

  const details = listItem.children[0].children[1];
  assert.equal(details.children.length, 1, 'expected only the text column, no macro line or chart');
  assert.doesNotMatch(details.style.cssText, /display: flex/);
});

test('createMacroChart splits the donut by calorie contribution (protein/carbs 4 kcal/g, fat 9 kcal/g)', () => {
  const { createMacroChart } = loadScript();

  const chart = createMacroChart(30, 40, 10);
  assert.ok(chart);
  const pathCount = (chart.innerHTML.match(/<path /g) || []).length;
  assert.equal(pathCount, 3, 'expected one donut segment per macro');

  // protein 30*4=120, carbs 40*4=160, fat 10*9=90, total=370 -> fat ~24%
  assert.match(chart.innerHTML, /Fat 24%/);
});

test('createMacroChart returns nothing when there is no macro data to chart', () => {
  const { createMacroChart } = loadScript();
  assert.equal(createMacroChart(0, 0, 0), null);
});
