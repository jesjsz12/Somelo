

async function showLastGrades(){
    var gradeArray = await getGrades();
    var lastFive = [];

    for (let i = gradeArray.length - 1; lastFive.length < 5 && i < gradeArray.length; i--) {
        if(gradeArray[i].type == "Toetskolom"){
            lastFive.push(gradeArray[i])
        }
    }

    for (let i = 0; i < document.getElementsByClassName("grades").length; i++) {
        var weging = 0;
        if(lastFive[i].weging == 0 && lastFive[i].examenWeging == 0){
            weging = 0
        }else if(lastFive[i].weging > 0){
            weging = lastFive[i].weging
        }else if(lastFive[i].examenWeging > 0){
            weging = lastFive[i].examenWeging
        }
        document.getElementsByClassName("grades")[i].children[0].innerHTML = lastFive[i].vak.naam;
        document.getElementsByClassName("grades")[i].children[4].innerHTML = `${lastFive[i].omschrijving} (${weging}x)`;
        document.getElementsByClassName("grades")[i].children[5].children[0].innerHTML = lastFive[i].geldendResultaat
    }
    
}

showLastGrades()