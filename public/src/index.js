document.addEventListener("DOMContentLoaded", e => {
    
    const BASE_URL = window.location.href.includes("heroku") ? "https://flatiron-mod3.herokuapp.com/api/v1/" : "http://localhost:3000/api/v1/"
    
    const cuisineBtns = document.querySelectorAll(".cuisine")
    let filterKeywords = []
    let cuisineType = ""
    let ingredient = ""
    
    // Click Handler
    const clickHandler = e => {
        document.addEventListener("click", e => {
            switch (true) {
                case e.target.className === "cuisine":
                    cuisineType = e.target.id
                    highlightButton(e.target)
                    break
                case e.target.className === "filter-btn": 
                    filterRecipes(e.target)
                    break
                case e.target.classList.contains("recipe-detail-btn"):
                    showRecipeDetails(e.target)
                    break
                case e.target.classList.contains("home-btn"):
                    location.reload()
                    break
                case e.target.className === "like-btn" || e.target.className === "fas":
                    updateLikes(e.target)
                    break
                default:
                    break
            }
        })
    }

    // Submit Handler
    const submitHandler = e => {
        document.addEventListener("submit", e => {
            e.preventDefault()
            if (e.target.matches(".search")) {
                showRecipePage()
                fetchFilteredRecipes()
            } else if (e.target.matches(".comment-form")) {
                addNewComment(e.target)
            }
        })
    }

    // Highlight the clicked button and hide the others
    const highlightButton = target => {
        cuisineBtns.forEach( btn => btn.classList.remove("clicked"))
        target.classList.add("clicked")
        cuisineBtns.forEach( btn => {
            if (btn.classList.contains('clicked') === false) {
                btn.style.opacity = "0.5"
            } else {
                btn.style.opacity = ""
            }
        })
    }
    
    // Display recipe page when search button clicked
    const showRecipePage = () => {
        const cuisineCapitalized = cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)
        ingredient = document.querySelector(".form-control").value.toLowerCase()
            
        document.querySelector(".container").innerHTML = 
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
            </div>
            `
        
        // Stylize cuisine bar
        document.querySelector(".cuisine-bar").style.background = `url(./images/${cuisineType}.jpg) center center no-repeat`
        document.querySelector(".cuisine-bar").style.backgroundSize = "cover"
        
        // Home button
        const homeBtn = document.createElement("button")
        document.querySelector(".container").append(homeBtn)
        homeBtn.textContent = "Back"
        homeBtn.classList.add("home-btn", "btn", "btn-info")
    }

    // Get recipes
    const fetchFilteredRecipes = () => {
        const recipeContainer = document.querySelector(".recipe-container")
        const filterQuery = filterKeywords.length === 0 ? "" : filterKeywords.join('')
        const endPoint = ingredient + filterQuery
        fetch(`${BASE_URL}cuisines/${cuisineType}?${endPoint}`)
        .then(resp => resp.json())
        .then(data => {
            allRecipesArray = data 
            renderRecipes(recipeContainer, data)
        })  
    }
    
    // Render all recipes
    const renderRecipes = (container, recipesArray) => {
        document.querySelector('.recipe-container').innerHTML = ""
        recipesArray.forEach(recipe => {
            renderRecipe(container, recipe)
        })
    }
    
    // Render single recipe
    const renderRecipe = (container, recipe) => {
        const content = recipe.content === null ? "Sorry, this content is not available..." : recipe.content
        const commentCount = recipe.comments.length
        const recipeDiv = document.createElement("div")
        recipeDiv.dataset.id = recipe.id
        recipeDiv.className = "filtered-recipes"
        recipeDiv.innerHTML = 
            `
            <div class="recipe-info">
                <img src="${recipe.image}">
                <h3>${recipe.title}</h3>
                <button class="like-btn"><i class='fas'>&#xf004;</i></button>
                <span>${recipe.likes} Likes | ${commentCount} comments | </span>
                <button class="recipe-detail-btn btn btn-info btn-sm" data-id=${recipe.id}>See Detail</button> 
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
                </div>
                `
        container.append(recipeDiv)
        const ingredientsUl = recipeDiv.children[1].children[0].children[1]
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li')
            li.textContent = `${ingredient.name} ${ingredient.amount}`
            ingredientsUl.append(li)
        })
        const commentsUl = recipeDiv.querySelector(".comments")
        recipe.comments.forEach(comment => {
            addCommentToList(commentsUl, comment.content)
        })
    }
    
    // Display recipe details
    const showRecipeDetails = target => {
        const recipeDetails = target.parentElement.nextElementSibling
        if (recipeDetails.style.display === "none") {
            recipeDetails.style.display = "block"
            target.textContent = "See Less"
        } else if (recipeDetails.style.display === "block") {
            recipeDetails.style.display = "none"
            target.textContent = "See Details"
        }
    }

    // Rerender recipes when filter buttons clicked
    const filterRecipes = target => {
        if (target.dataset.status === "off") {
            target.dataset.status = "on"
            target.style.opacity = "0.5"
            filterKeywords.push(`&${target.id}_free=1`)
            fetchFilteredRecipes(target.parentElement.nextElementSibling)
        } else {
            target.dataset.status = "off"
            target.style.opacity = ""
            filterKeywords = filterKeywords.filter( word => word !== `&${target.id}_free=1`)
            fetchFilteredRecipes(target.parentElement.nextElementSibling)
        }
    }

    // Comment
    const addNewComment = target => {
        const recipeId = target.id
        const newComment = target.children[0].value
        const commentUl = target.previousElementSibling
        addCommentToList(commentUl, newComment)
        addCommentCount(target)
        target.reset()
        
        fetch(`${BASE_URL}comments`, {
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
    }

    const addCommentToList = (ul, comment) => {
        const newCommentLi = document.createElement("li")
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
    
    // Like
    const addLikeCount = (num, id) => {
        const span = document.querySelector(`[data-id="${id}"]`).firstElementChild.children[3]
        const currentText = span.textContent
        const array = currentText.split(" ")
        array[0] = num
        span.textContent = array.join(" ")
    }
    
    const updateLikes = target => {
        const recipeId = target.closest(".filtered-recipes").dataset.id
        fetch(`${BASE_URL}recipes/${recipeId}`)
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
        fetch(`${BASE_URL}recipes/${id}`, options)
        .then(res => res.json())
        .then(recipe => {
            addLikeCount(recipe.likes, id)
        })
    }
    
    clickHandler()
    submitHandler()
})
