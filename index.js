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

    const createMenuCard = (foodName, servingUnit, servingQuantity, photo, idTag ) => {
     
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
        cardInfo.className = 'menu-card-info';
        cardInfo.textContent = servingQuantity;

        const cardId= document.createElement('p');
        cardId.className= "menu-card-Id";
        cardId.textContent = idTag;

        
        const span = document.createElement('span');
        span.innerHTML = '&rarr;';

        // Appending the elements 
        cardContent.appendChild(cardHeader);
        cardContent.appendChild(cardText);
        cardContent.appendChild(cardInfo);
        cardContent.appendChild(cardId);
        
        

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
                const idTag = `Food Id: ${currentMenu["tag_id"]}`;
                
             
                

                const menuCard = createMenuCard(
                    foodName, servingUnit, servingQuantity, photo, idTag
                );

                menuGrid.appendChild(menuCard);
        
        }  
    }  
       
        catch(error){
            console.error(error);
        }

    }
getMenuItems();

function fetchNavDetails(){
    //making a Get request to obtain first film details
    fetch('http://localhost:3000/food')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json(); 
  })
  .then(data => data.forEach(food => displayMenu(food))) 

}

fetchNavDetails();

 function displayMenu(food){
    
    let orderCard = document.createElement("li");
    orderCard.class = "ordercard";
    orderCard.id = "food-id";
    orderCard.innerHTML = `
    <div class="food-detail">
    <h4>${food.food_name}</h4>
    <p>Food id: ${food.tag_id}<p>
    <p> 
    Serving Quantity:<span class ="quantity-count"> ${food.serving_qty}</span>
    <p>
    </div>
    <div class="button">
    <button id="order">Order Now</>
    </div>

    `

    orderCard.querySelector('#order').addEventListener("click", ()=> {
        food.serving_qty-=1;
    orderCard.querySelector("span").textContent = food.serving_qty;
        updateServingQuantity(id);
        alert('your order will be served in 5 minutes');
         });
    
    document.querySelector("#order-food").appendChild(orderCard);  
}

displayMenu();
//append customers reviews 
function handleReviews(reviews){
    let p = document.createElement("p");
    p.textContent= reviews;
    document.querySelector("#reviews-container").appendChild(p);
}

function updateServingQuantity(id){
    fetch(`http://localhost:3000/food/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(dataObj)
    })
    .then(res=>res.json())
    .then(data => console.log(data))


}

});

