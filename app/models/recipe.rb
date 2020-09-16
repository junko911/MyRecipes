class Recipe < ApplicationRecord
    has_many :ingredient_recipes
    has_many :ingredients, through: :ingredient_recipes
    has_many :comments
    belongs_to :cuisine

    def dairy_free?
        ingredients.each do |ingredient|
            return false if !ingredient.dairy_free?
        end
        true
    end

    def egg_free?
        ingredients.each do |ingredient|
            return false if !ingredient.egg_free?
        end
        true
    end
    
    def nut_free?
        ingredients.each do |ingredient|
            return false if !ingredient.nut_free?
        end
        true
    end

    def shellfish_free?
        ingredients.each do |ingredient|
            return false if !ingredient.shellfish_free?
        end
        true
    end

    def wheat_free?
        ingredients.each do |ingredient|
            return false if !ingredient.wheat_free?
        end
        true
    end

    def soy_free?
        ingredients.each do |ingredient|
            return false if !ingredient.soy_free?
        end
        true
    end

    def as_json(_options = nil)
       {
            id: id,
            title: title,
            content: content,
            likes: likes,
            image: image,
            comments: comments,
            ingredients: ingredient_recipes.map { |ingredient_recipe| 
                {
                    name: ingredient_recipe.ingredient.name,
                    amount: ingredient_recipe.amount
                }
            }
       }
    end
end
