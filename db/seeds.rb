# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'rest-client'

# Cuisine.destroy_all
# Recipe.destroy_all
# IngredientRecipe.destroy_all
# Ingredient.destroy_all

API_KEY = ""
cuisines = [
  # 'american', #0
  # 'british',
  # 'chinese', 
  # 'eastern-european', #0
  # 'european', #1
  # 'french', #9
  # 'german',
  # 'greek',
  # 'indian',
  # 'irish', #9
  # 'italian', #1
  # 'japanese',
  # 'korean',
  # 'latin-american',
  # 'mediterranean',
  # 'mexican',
  # 'middle%20eastern',
  # 'southern',
  # 'spanish',
  # 'thai'
]

cuisines.each do |cuisine_row|
  cuisine = Cuisine.find_or_create_by!(name: cuisine_row)
  cuisine_url = "https://api.spoonacular.com/recipes/complexSearch?cuisine=#{cuisine_row}&apiKey=#{API_KEY}"
  cuisine_response = RestClient.get(cuisine_url)
  cuisine_data = JSON.parse(cuisine_response)["results"]
  
  cuisine_data.each do |recipe_row|
    # get recipe content
    information_url = "https://api.spoonacular.com/recipes/#{recipe_row['id']}/information?apiKey=#{API_KEY}"
    information_response = RestClient.get(information_url)
    recipe_content_data = JSON.parse(information_response)["instructions"]
    
    recipe = Recipe.find_or_create_by(id: recipe_row['id'])
    
    recipe.title = recipe_row["title"]
    recipe.image = recipe_row["image"]
    recipe.content = recipe_content_data
    recipe.likes = 0
    recipe.cuisine = cuisine
    recipe.save

    # get ingredient to create Ingredient and IngredientRecipe
    ingredients_url = "https://api.spoonacular.com/recipes/#{recipe_row['id']}/ingredientWidget.json?apiKey=#{API_KEY}"
    ingredients_response = RestClient.get(ingredients_url)
    ingredients_data = JSON.parse(ingredients_response)["ingredients"]
    ingredients_data.each do |ingredient_row|
      ingredient = Ingredient.find_or_create_by(name: ingredient_row["name"])
      amount = "#{ingredient_row['amount']['us']['value']} #{ingredient_row['amount']['us']['unit']}"
      IngredientRecipe.create(recipe_id: recipe.id, ingredient_id: ingredient.id, amount: amount)
    end
  end
  puts "Cuisine #{cuisine_row} and #{Cuisine.find_by(name: cuisine_row).recipes.count} recipes created"
end

# Rename Middle Eastern cuisine
me = Cuisine.find_by(name: 'middle%20eastern')

if me
  me.name = 'middle-eastern'
  me.save
end
