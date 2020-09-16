class Ingredient < ApplicationRecord
    has_many :ingredient_recipes
    has_many :recipes, through: :ingredient_recipes

    def dairy_free?
        dairy_products = ['milk', 'yogurt', 'cream', 'butter', 'cheese', 'casein', 'custard', 'ice cream', 'feta']
        dairy_products.each do |dairy|
            return false if name.downcase.include?(dairy) 
        end
        true
    end
    
    def egg_free?
        if name.downcase.include?('eggplant')
            return true
        elsif name.downcase.include?('egg')
            return false
        end
        true
    end
    
    def nut_free?
        nuts = ['nut', 'almond', 'pecan', 'pistachio']
        nuts.each do |nut|
            return false if name.downcase.include?(nut) 
        end
        true
    end

    def shellfish_free?
        shellfish_ingredients = ['shrimp', 'crab', 'lobster', 'squid', 'oyster', 'scallops', 'mussels', 'prawn']
        shellfish_ingredients.each do |shellfish|
            return false if name.downcase.include?(shellfish) 
        end
        true
    end

    
    def wheat_free?
        wheat_products = ['flour', 'bread', 'cereal', 'pasta', 'spagetti', 'couscous', 'cracker', 'crouton', 'starch', 'wheat', 'bun', 'cake', 'pastry', 'dough']
        wheat_products.each do |product|
            return false if name.downcase.include?(product) 
        end
        true
    end
    
    def soy_free?
        soy_products = ['soy', 'tofu', 'miso', 'natto', 'shoyu', 'edamame', 'vegetable oil', 'teriyaki']
        soy_products.each do |product|
            return false if name.downcase.include?(product) 
        end
        true
    end

    
end
