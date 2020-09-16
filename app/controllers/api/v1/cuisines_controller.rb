class Api::V1::CuisinesController < ApplicationController
  def index
    cusines = Cuisine.all
    render json: cusines
  end
  
  def show
    recipe_ids = Ingredient.where('name LIKE ?', "%#{params[:ingredient]}%").map(&:recipe_ids).flatten if params[:ingredient].present?
    recipes = Cuisine.find_by(name: params[:id]).recipes
    recipes = recipes.where(id: recipe_ids) if recipe_ids.present?
    recipes = recipes.select(&:dairy_free?) if params[:dairy_free].present?
    recipes = recipes.select(&:egg_free?) if params[:egg_free].present?
    recipes = recipes.select(&:nut_free?) if params[:nut_free].present?
    recipes = recipes.select(&:shellfish_free?) if params[:shellfish_free].present?
    recipes = recipes.select(&:wheat_free?) if params[:wheat_free].present?
    recipes = recipes.select(&:soy_free?) if params[:soy_free].present?
    render json: recipes
  end

  def update
    cuisine = Cuisine.find_by(name: params[:id])
    cuisine.update(cuisines_params)
    render json: recipes.to_json(include: [:ingredients, :likes])
  end

  private
    
      def cuisines_params
        params.require(:cuisine).permit(:name, :likes)
      end 
  
end
