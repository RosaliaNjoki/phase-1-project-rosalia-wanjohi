document.addEventListener('DOMContentLoaded', function(){
    const ApiUrl = 'https://trackapi.nutritionix.com/v2/search/instant/?query=hamburger';
    const ApiKey =  '1520077eb8d20fad210e515aaf40b538';
    const appId = '5ea05591';
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
            console.log(data);
        }
        catch(error){
            console.error(error);
        }
    }
    getMenuItems();
});

