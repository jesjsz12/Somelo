//SomtodayAPI Variables
var usrname;
var pwd;
var schoolCode = ""
var apiurl = '';
var somToken = '';
var leerlingID;
var validText = document.getElementById("validText");
var pwdText = document.getElementById("pwdText");
var LoggedIn = localStorage.getItem("loggedIn");



window.onload = function(){
    if(LoggedIn == 'true'){
        window.location.href = "home.html";
    }
};

$(document).ready(async function(){
    await $("#selSchool").select2();
});

const tokenHeader = {
    Accept: "application/json",
    'Content-Type': 'application/x-www-form-urlencoded'
};


//SomtodayAPI Login
function invalidGrant(invalidG){
    if(invalidG === true){
        pwdText.innerHTML = 'Check je Gebruikersnaam, <br> Wachtwoord en School naam.';
    } else{
        pwdText.innerHTML = '';
    }
    

};


function validateLogin(){
    usrname = document.getElementById("usrname").value;
    pwd = document.getElementById("password").value;
    schoolCode = document.getElementById("selSchool").value;
    submitForm();
}

function falseCred(error){
    if (error == 404){
        falseCred.innerHTML = "Check je Gebruikersnaam, <br> Wachtwoord en School naam."
    }else{
        falseCred.innerHTML = ""
    }
}

makeOptions();

async function makeOptions(){
    fetch('./organisaties.json')
    .then(data=>{return data.json()})
    .then(res=>{
        var tags = [];
        for(let i = 0; i < res[0].instellingen.length; i++){
            tags.push(document.createElement("option"));
    }
        for(let i = 0; i < res[0].instellingen.length; i++){
            var text = document.createTextNode(res[0].instellingen[i].naam);
            tags[i].appendChild(text);
            tags[i].setAttribute("value", res[0].instellingen[i].uuid);
            var element = document.getElementById("selSchool");
            element.appendChild(tags[i]);
    }
    })
}



async function getToken(){ 
    await fetch('https://somtoday.nl/oauth2/token', {
        headers: tokenHeader,
        body: (new URLSearchParams({
            grant_type: 'password',
            username: `${schoolCode}\\${usrname}`,
            password: `${pwd}`,
            scope: 'openid',
            client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2',
        }).toString()),
        method: 'POST',
    })
    .then(data=>{return data.json()})
    .then(res=>{
        if(res.error != "invalid_grant"){
            localStorage.setItem("somToken", res.access_token);
            localStorage.setItem("somRefresh", res.refresh_token);
            localStorage.setItem("somExpire", (Date.now() + res.expires_in));
            invalidGrant(false);
            getID();
        }else{
            invalidGrant(true);
        }
    })
    .catch(errors=>console.log(errors));
};

async function getID(){
    await fetch(`https://api.somtoday.nl/rest/v1/leerlingen`, {
            headers:{
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("somToken")}`,
                Range: "items=0-99"
            },
            method: 'GET',
        })
        .then(data=>{return data.json()})
        .then(res=>{
            var tokenid = res.items[0].links[0].id;
            var naam = res.items[0].roepnaam;
            localStorage.setItem("ID", tokenid);
            sessionStorage.setItem("Name", naam);
            window.location.href = "loginzer.html";
        })
        .catch(errors=>console.log(errors));
}


async function submitForm(){
    try{
        token = await getToken();
        accesstoken = await getToken();
    } catch (e) {
    };
};