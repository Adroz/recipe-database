# Recipe Database
The recipe library of Jess, Nik, and friends

## PR Previews

Pull requests are automatically deployed to a preview URL using [Surge.sh](https://surge.sh/). When a PR is opened or updated, a preview site is deployed and a comment with the preview URL is posted on the PR. When the PR is closed or merged, the preview site is automatically cleaned up.

### Setup (Required)

To enable PR previews, you need to add a `SURGE_TOKEN` secret to your repository:

1. Install Surge CLI: `npm install -g surge`
2. Create a Surge account: `surge login`
3. Generate a token: `surge token`
4. Add the token to your repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SURGE_TOKEN`
   - Value: (paste your token)

# Template
```
# [Recipe Name]
* Serves: x
* Time required: XXmins
* Origin: [A link](https://github.com/Adroz/recipe-database)

## Ingredients
* [amount] [object], [preparation]
* e.g. 4 garlic cloves, minced

## Method
1. [Regular instructions, but use (`amounts`) whenever referring to ingredients]
1. e.g. Add in carrots (`4-5`) and celery (`5 stalks`) and soften.
```
