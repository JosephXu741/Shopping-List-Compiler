from recipe_scrapers import scrape_me

write_label = open("new_data.txt", "a");

demo_websites = [
   "https://www.food.com/recipe/crock-pot-chocolate-mud-cake-50331#activity-feed",
    "https://www.allrecipes.com/recipe/268990/matcha-green-tea-pancake/",
    "https://www.jamieoliver.com/recipes/chocolate-recipes/sehrish-s-old-school-chocolate-cake/",
    "https://www.kingarthurbaking.com/recipes/ultra-vanilla-cupcakes-with-easy-vanilla-frosting-recipe",
    "https://www.kingarthurbaking.com/recipes/classic-chocolate-whoopie-pies-recipe",
    "https://www.kingarthurbaking.com/recipes/crisp-pizza-crust-recipe"
]

for i in demo_websites:
    ingredient = scrape_me(i)
    write_label.writelines(ingredient.ingredients())