Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :cuisines
    end
  end
  namespace :api do
    namespace :v1 do
      resources :comments
    end
  end
  namespace :api do
    namespace :v1 do
      resources :ingredient_recipes
    end
  end
  namespace :api do
    namespace :v1 do
      resources :ingredients
    end
  end
  namespace :api do
    namespace :v1 do
      resources :recipes
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
