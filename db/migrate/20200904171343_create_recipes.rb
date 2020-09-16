class CreateRecipes < ActiveRecord::Migration[6.0]
  def change
    create_table :recipes do |t|
      t.references :cuisine
      t.string :title
      t.text :content
      t.integer :likes
      t.string :image 

      t.timestamps
    end
  end
end
