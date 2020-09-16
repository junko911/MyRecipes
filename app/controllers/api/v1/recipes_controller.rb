class Api::V1::RecipesController < ApplicationController


    def show
        recipe = Recipe.find(params[:id])
        render json: recipe
      end
      def update
        recipe = Recipe.find(params[:id])
        recipe.update(recipe_params)
        render json: recipe
      end
      private
      def recipe_params
        params.require(:recipe).permit(:likes)
      end

end
