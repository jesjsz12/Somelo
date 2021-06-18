
//SomtodayAPI Variables
var tResponse = [];
var vResponse = [];

//ZermeloAPI Variables

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// Defining function to get unique values from an array
function getUnique(array){
    var uniqueArray = [];
    
    // Loop through array values
    for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}


//Somtoday API Section

async function getGrades(){
    tResponse = [];

    await gradeAPI('0-99')
    await gradeAPI('99-199')
    await gradeAPI('199-299')
    await gradeAPI('299-399')

    return tResponse
}


async function refreshToken(){
    await fetch('https://somtoday.nl/oauth2/token', {
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: (new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: localStorage.getItem("refreshtoken"),
            scope: 'openid',
            client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2'
        }).toString()),
        method: 'POST',
    })
    .then(data=>{return data.json()})
        .then(res=>{
            console.log(res)
            accesstoken = res.access_token;
            sessionStorage.setItem("token", res.access_token);
            localStorage.setItem("refreshtoken", res.refresh_token);
        })
    .catch(error=>console.log(error));

    await fetch(`https://api.somtoday.nl/rest/v1/leerlingen`, {
            headers:{
                Accept: "application/json",
                Authorization: `Bearer ${accesstoken}`,
                Range: "items=0-99"
            },
            method: 'GET',
        })
        .then(data=>{return data.json()})
        .then(res=>{
            localStorage.setItem("ID", res.items[0].links[0].id);
            inputID = res.items[0].links[0].id;
            sessionStorage.setItem("Name", res.items[0].roepnaam);
            namen = res.items[0].roepnaam;
            sessionStorage.setItem("firstLogin", true);
            window.location.href = "graphs.html";
        })
        .catch(errors=>console.log(errors));
};

async function getVakken(){
    await fetch(`https://api.somtoday.nl/rest/v1/vakkeuzes`, {
            headers:{
                Accept: "application/json",
                Authorization: `Bearer ${accesstoken}`,
                Range:  `items=0-99`
            },
            method: 'GET',
        })
        .then(data=>{return data.json()})
        .then(res=>{
            vResponse = [];
            for(let i = 0; i < res.items.length; i++){
                vResponse.push(res.items[i].vak.naam)
        }
        vResponse.sort(function(a,b){
            return a.toLowerCase().localeCompare(b.toLowerCase())
        });


            //for(let i = 0; i < res.items.length; i++){
          //      vResponse.push(res.items[i])
        //}

        
    })
    .catch(error=>console.log(error));


    return vResponse
}

async function gradeAPI(itemCount){
    await fetch(`https://api.somtoday.nl/rest/v1/resultaten/huidigVoorLeerling/${inputID}`, {
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${accesstoken}`,
            Range:  `items=${itemCount}`
        },
        method: 'GET',
    })
    .then(data=>{return data.json()})
    .then(res=>{
        for(let i = 0; i < res.items.length; i++){
            tResponse.push(res.items[i])
    }
    
})
.catch(error=>console.log(error));
}



//Zermelo API Section
