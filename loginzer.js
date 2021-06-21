

var authCode;
var school;

var zerToken;
var zerExpire


async function zerLogin(){
    school = document.getElementById("schoolCode").value;
    authCode = document.getElementById("authCode").value;


    for (var i = 0; i < 3; i++) {
        authCode = authCode.replace(" ", "")
    }
    

    await fetch(`https://${school}.zportal.nl/api/v2/oauth/token?grant_type=authorization_code&code=${authCode}`, {
        method: 'POST',
    })
    .then(data=>{return data.json()})
    .then(res=>{
        //console.log(res)
        zerToken = res.access_token;
        zerExpire = res.expires_in;
        localStorage.setItem("zerToken", res.access_token);
        localStorage.setItem("zerExpire", res.expires_in);
        localStorage.setItem("loggedIn", true);
        sessionStorage.setItem("firstLogin", true);
        window.location.href = "home.html";
    })
    

}

