class Api::V1::CommentsController < ApplicationController
    def index
        comments = Comment.all
        render json: comments
      end

      def create
        comment = Comment.create!(comments_params)
        render json: comment
      end

      private
    
      def comments_params
        params.require(:comment).permit(:recipe_id, :user, :content)
      end 
end
