document.addEventListener("DOMContentLoaded", function(e){

    const cuisineContainer = document.querySelector(".container")
    const ingredientsForm = document.querySelector(".form-inline")
    const ingredientsFormInput = document.querySelector(".form-control")
    const apiUrl = "http://localhost:3000/api/v1/cuisines"
    const commentsUrl = "http://localhost:3000/api/v1/comments"
    let filterKeywords = []
    let cuisineType = ""
    let ingredient = ""

    let addCommentToList = (ul, comment) => {
        let newCommentLi = document.createElement("li")
        newCommentLi.textContent = comment
        ul.append(newCommentLi)
    }
    
    const addCommentCount = target => {
        const span = target.parentElement.parentElement.firstElementChild.children[3]
        const currentText = span.textContent
        const array = currentText.split(" ")
        const currentNum = parseInt(array[3])
        const newNum = currentNum + 1
        array[3] = newNum
        span.textContent = array.join(" ")
    }

    const addLikeCount = (num, id) => {
        const span = document.querySelector(`[data-id="${id}"]`).firstElementChild.children[3]
        const currentText = span.textContent
        const array = currentText.split(" ")
        array[0] = num
        span.textContent = array.join(" ")
    }

    const updateLikes = target => {
        const recipeId = target.closest(".filtered-recipes").dataset.id
        fetch(`http://localhost:3000/api/v1/recipes/${recipeId}`)
        .then(res => res.json())
        .then(recipe => addLike(recipe.likes, recipeId))
    }

    const addLike = (currentLike, id) => {
        options = {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              likes: currentLike + 1
            })
        }
        fetch(`http://localhost:3000/api/v1/recipes/${id}`, options)
        .then(res => res.json())
        .then(recipe => {
            addLikeCount(recipe.likes, id)
        })
    }

    cuisineContainer.addEventListener("click", function(e){
        if(e.target.className === "cuisine"){
            cuisineType = e.target.id
            let cuisineCapitalized = e.target.textContent

            // Highlight the clicked button and hide the others
            document.querySelectorAll(".cuisine").forEach(e => e.classList.remove("clicked"))
            e.target.classList.add("clicked")
            document.querySelectorAll(".cuisine").forEach(e => {
                if (e.classList.contains('clicked') === false) {
                    e.style.opacity = "0.5"
                } else {
                    e.style.opacity = ""
                }
            })

            ingredientsForm.addEventListener("submit", function(e){
                e.preventDefault()

                ingredient = ingredientsFormInput.value.toLowerCase()
                
                cuisineContainer.innerHTML = 
                `
                <div id="second-page">
                    <div class="cuisine-nav">
                        <div class="cuisine-bar"><h2>${cuisineCapitalized}</h2></div>
                        <button class="filter-btn" id="dairy" data-status="off">Dairy Free🥛</button>
                        <button class="filter-btn" id="egg"  data-status="off">Egg Free🥚</button>
                        <button class="filter-btn" id="nut"  data-status="off">Nut Free🥜</button>
                        <button class="filter-btn" id="shellfish"  data-status="off">Shellfish Free🦐</button>
                        <button class="filter-btn" id="wheat"  data-status="off">Wheat Free🌾</button>
                        <button class="filter-btn" id="soy"  data-status="off">Soy Free🌱</button>
                    </div>
                    <div class="recipe-container"></div>
                </div><br>
                `

                document.querySelector(".cuisine-bar").style.background = `url(./images/${cuisineType}.jpg) center center no-repeat`
                document.querySelector(".cuisine-bar").style.backgroundSize = "cover"

                // Home button
                const homeBtn = document.createElement("button")
                document.querySelector(".container").append(homeBtn)
                homeBtn.textContent = "Back"
                homeBtn.classList.add("home-btn", "btn", "btn-info")

                const recipeContainer = document.querySelector(".recipe-container")
                
                let fetchFilteredRecipes = () => {
                    fetch(`${apiUrl}/${cuisineType}/?ingredient=${ingredient}`)
                    .then(resp => resp.json())
                    .then(data => {
                        allRecipesArray = data 
                        renderRecipes(recipeContainer, data)})  
                }
                fetchFilteredRecipes()

                // const secondPageContainer = document.querySelector("#second-page")                
                document.addEventListener("click", function(e){
                    if(e.target.classList.contains("recipe-detail-btn")){
                        const recipeDetails = e.target.parentElement.nextElementSibling
                            console.log("button click working")
                        if(recipeDetails.style.display === "none"){
                            recipeDetails.style.display = "block"
                            e.target.textContent = "See Less"
                        } else if(recipeDetails.style.display === "block"){
                            recipeDetails.style.display = "none"
                            e.target.textContent = "See Detail"
                        }
                
                    } else if (e.target.classList.contains("home-btn")) {
                        location.reload()
                    } else if (e.target.className === "like-btn" || e.target.className === "fas") {
                        updateLikes(e.target)
                    }
                })


    //add comments to database 
                const recipesContainer = cuisineContainer.children[0].children[1]
                
                recipesContainer.addEventListener("submit", function(e){
                    e.preventDefault()
                    console.log(e.target.id)
                    let recipeId = e.target.id
                    let newComment = e.target.children[0].value
                    let comments = e.target.previousElementSibling
                    addCommentToList(comments, newComment)
                    addCommentCount(e.target)
                    e.target.reset()


                    fetch(commentsUrl, {
                        method: "POST",
                        headers:{
                            "Content-Type": "application/json",
                            "Accepts": "application/json"
                        },
                        body: JSON.stringify({
                            "content": newComment,
                            "recipe_id": recipeId
                        })
                    })
                })
            })
        } else if (e.target.className === "filter-btn") {
            if (e.target.dataset.status === "off") {
                e.target.dataset.status = "on"
                e.target.style.opacity = "0.5"
                filterKeywords.push(`&${e.target.id}_free=1`)
                fetchRecipes(e.target.parentElement.nextElementSibling)
            } else {
                e.target.dataset.status = "off"
                e.target.style.opacity = ""
                filterKeywords = filterKeywords.filter( word => word !== `&${e.target.id}_free=1`)
                fetchRecipes(e.target.parentElement.nextElementSibling)
            }
        }        
    })
    
              //render all recipes
    const renderRecipes = (container, recipesArray) => {
        document.querySelector('.recipe-container').innerHTML = ""
        recipesArray.forEach(recipe => {
            renderRecipe(container, recipe)
        })
    }
                //render single recipe
    const renderRecipe = (container, recipe) => {
       
        let recipeId = recipe.id
        const content = recipe.content === null ? "Sorry, this content is not available..." : recipe.content
        const commentCount = recipe.comments.length
        
        let recipeDiv = document.createElement("div")
        recipeDiv.dataset.id = recipe.id
        recipeDiv.className = "filtered-recipes"
        recipeDiv.innerHTML = 
        `

        <div class="recipe-info">
            <img src="${recipe.image}">
            <h3>${recipe.title}</h3>
            <button class="like-btn"><i class='fas'>&#xf004;</i></button>
            <span>${recipe.likes} Likes | ${commentCount} comments | </span>
            <button class="recipe-detail-btn btn btn-info btn-sm" data-id=${recipeId}>See Detail</button> 
        </div>
        <div class="recipe-detail" style="display: none;">
            <div class="ingredient">
                <h5>📝 Ingredients</h5>
                <ul>
                </ul>
            </div>
            <h5>📋 Instruction</h5>
            <span>${content}</span>
            <h5>💬 Comments</h5>
            <ul class="comments">
            </ul>
            <form class="comment-form" id=${recipe.id}>
                <input class="comment-input" type="text" name="comment" placeholder="Add a comment..."/>
                <button class="comment-button btn btn-secondary btn-sm" type="submit">Add Comment</button>
            </form>
            <br>
        </div>
        `

        container.append(recipeDiv)

        const ingredientsUl = recipeDiv.children[1].children[0].children[1]
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li')
            li.textContent = `${ingredient.name} ${ingredient.amount}`
            ingredientsUl.append(li)
        })

        let commentsUl = recipeDiv.querySelector(".comments")
        recipe.comments.forEach(comment => {
            addCommentToList(commentsUl, comment.content)
        })

    }

    // Rerender recipe when filter buttons are clicked
    const fetchRecipes = container => {
        const filterKeyword = filterKeywords.join('')
        if (ingredient === "") {
            fetch(`${apiUrl}/${cuisineType}?${filterKeyword}`)
            .then(resp => resp.json())
            .then(data => renderRecipes(container, data))   
        } else {
            fetch(`${apiUrl}/${cuisineType}?ingredient=${ingredient}&${filterKeyword}`)
            .then(resp => resp.json())
            .then(data => renderRecipes(container, data))  
        }
    }
})
