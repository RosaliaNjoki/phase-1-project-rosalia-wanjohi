document.addEventListener('DOMContentLoaded', ()=>{
    //post activation
    document.querySelector("#review-form").addEventListener("submit", handleSubmit);

    function handleSubmit(e){
        e.preventDefault()
            let commentsObj ={
                reviews: e.target.reviews.value
            }
            postReview(commentsObj);
        }
    let foodObj;
    let servingQty;
    const ApiUrl = 'https://trackapi.nutritionix.com/v2/search/instant/?query=hamburger';
    const ApiKey =  '1520077eb8d20fad210e515aaf40b538';
    const appId = '5ea05591';
    //restuarant title
    const title = document.createElement('h1');
    title.style.alignItems="center";
    title.textContent = "Welcome to Humburger Resturant";
    document.getElementById("restuarant-title").appendChild(title);
    //developing card to use to display Menu
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

function fetchOrderDetails(){
    //making a Get request to obtain first food details
    fetch('http://localhost:3000/food')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json(); 
  })
  .then(data => {
    foodObj = data;
    data.forEach(food => displayMenu(food))
  }) 


}

fetchOrderDetails();
//title to direct customers to order
    const subtitle = document.createElement('h3');
    subtitle.style.alignItems="center";
    subtitle.textContent = "Place Your Order";
    document.getElementById("order-title").appendChild(subtitle);
//developing and appending the order sectiion 
 function displayMenu(food){
    servingQty= food.serving_qty;
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
    
// integrating patch in serving quantity by reducing the value as more orders are placed
    orderCard.querySelector('#order').addEventListener("click", ()=> {
        food.serving_qty-=1;
        servingQty= food.serving_qty;
        if (food.serving_qty ===0){
                const button = document.getElementById("order")
                button.className = "button-sold-out";
                button.textContent = "Food Sold Out";
                button.setAttribute("disabled", "");
        }
    orderCard.querySelector("span").textContent = food.serving_qty;
        updateServingQuantity(food.id);
        alert('your order will be served in 5 minutes');
        
         });
    
    document.querySelector("#order-food").appendChild(orderCard);  
}



//patch method forserving quantity  
function updateServingQuantity(id){
   
  
 fetch(`http://localhost:3000/food/${id}`, {
    method: 'PATCH',
     headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({'serving_qty': servingQty})
     })
    
 }
// //reviews post method 
function postReview(commentsObj){
  
    fetch('http://localhost:3000/comments', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json'
    },
    body:JSON.stringify(commentsObj)

    })
    .then(res => res.json())
    .then(comments=> console.log(comments))
 }

});

