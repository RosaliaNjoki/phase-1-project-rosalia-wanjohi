document.addEventListener('DOMContentLoaded', function(){
    let form = document.querySelector("#review-form")
    form.addEventListener("submit", (e)=> {
        e.preventDefault();
        handleReviews(e.target.reviews.value);
        form.reset();

    })
    const ApiUrl = 'https://trackapi.nutritionix.com/v2/search/instant/?query=hamburger';
    const ApiKey =  '1520077eb8d20fad210e515aaf40b538';
    const appId = '5ea05591';
    //restuarant title
    const title = document.createElement('h1');
    title.style.alignItems="center";
    title.textContent = "Welcome to Humberger Resturant";
    document.getElementById("restuarant-title").appendChild(title);
    
    const menuGrid = document.getElementById("food-menu-grid");

    const createMenuCard = (foodName, servingUnit, servingQuantity, photo ) => {
       
     
        // Creating the elements
        const gridItem = document.createElement('div');
        gridItem.className = 'menu-grid-item';

        const card = document.createElement('div');
        card.className = 'menu-card';

        const cardImg = document.createElement('img');
        cardImg.className = 'menu-card-img';
        cardImg.src = photo;
        cardImg.alt = foodName;

        const cardContent = document.createElement('div');
        cardContent.className = 'menu-card-content';

        const cardHeader = document.createElement('h2');
        cardHeader.className = 'menu-card-header';
        cardHeader.textContent = foodName;

        const cardText = document.createElement('p');
        cardText.className = 'menu-card-text';
        cardText.textContent = servingUnit;
        
        const cardInfo = document.createElement('p');
        cardText.className = 'menu-card-info';
        cardText.textContent = servingQuantity;

        const span = document.createElement('span');
        span.innerHTML = '&rarr;';

        // Appending the elements 
        cardContent.appendChild(cardHeader);
        cardContent.appendChild(cardText);
        cardContent.appendChild(cardInfo);
           
        card.appendChild(cardImg);
        card.appendChild(cardContent);

        gridItem.appendChild(card);

        return gridItem;
    }

    async function getMenuItems(){
        try{
            const response = await fetch (ApiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': appId,
                    'x-app-key': ApiKey,
            
                }
            })
            const data = await response.json();
            const menu = data["common"];

            for(let i = 0; i < menu.length; i++){

                const currentMenu = menu[i];
                
                const foodName = currentMenu["food_name"];
                const servingUnit =`Serving Unit: ${currentMenu["serving_unit"]}`;
                const servingQuantity = `Serving Quantity: ${currentMenu["serving_qty"]}`;
                const photo = currentMenu.photo.thumb;
                
             
                

                const menuCard = createMenuCard(
                    foodName, servingUnit, servingQuantity, photo
                )

                menuGrid.appendChild(menuCard);
        
        }  
    }  
       
        catch(error){
            console.error(error);
        }

    }
getMenuItems();

//append customers reviews 
function handleReviews(reviews){
    let p = document.createElement("p");
    p.textContent= reviews;
    document.querySelector("#reviews-container").appendChild(p);

}

});

