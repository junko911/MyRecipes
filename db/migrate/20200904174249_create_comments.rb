class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.references :recipe
      t.string :user
      t.string :content

      t.timestamps
    end
  end
end
