var ninjaPos=18;
var ninjaDir=1;
var ghostPos=[202,198,134,130]
var ghostDir=[1,1,1,1]
var ninja;
var score=0;
var timer;
var lives=3;
function playMusic(){
    var music=document.getElementById("nmm");
    music.loop=true;
    music.play();
}
function buildWorld(){
    const playPlace=document.getElementById("play-area")
    playPlace.innerHTML=""
    const wallChance=0.7
    var classForBlock;
    //First Loops to build the outer wall and columns
    for (var i=0;i<13;i++){
        for(var j=0;j<17;j++){
            if(i==0||j==0||i==12||j==16){
                classForBlock="wall"
            }
            else if(i % 2 == 0 && j % 2 == 0 && Math.random()<wallChance){
                classForBlock="wall"
            }
            else{
                classForBlock="path"
            }
            playPlace.innerHTML+="<div class='"+classForBlock+"' id='block-"+(i*17+j)+"'></div>"
        }
    }
    //second loop to add connecting walls
    for (var i=2;i<11;i+=2){
        for(var j=2;j<15;j+=2){
            var column=document.getElementById("block-"+(i*17+j));
            if(column.className=="wall"){
                //pick one of four directions to add an extra wall
                var nesw=Math.ceil(Math.random()*4);
                if(nesw==0||nesw==1){//North
                    document.getElementById("block-"+(i*17+j-17)).className="wall";
                }
                else if(nesw==2){//East
                    document.getElementById("block-"+(i*17+j+1)).className="wall";
                }
                else if(nesw==3){//South
                    document.getElementById("block-"+(i*17+j+17)).className="wall";
                }
                else if(nesw==4){//West
                    document.getElementById("block-"+(i*17+j-1)).className="wall";
                }
            }
            else if(Math.random()>wallChance){
                column.innerHTML="<div class='onigiri'><div>"
            }
        }
    }
    //final loop to add sushi
    for(var i=1;i<=11;i++){
        for(var j=1;j<=15;j++){
            var space = document.getElementById("block-"+(i*17+j));
            if(!(i==1&&j==1)){
                if(space.className=="path"&&space.innerHTML==""){
                    space.innerHTML="<div class='sushi'><div>"
                }
            }
        }
    }
    ninja=document.getElementById("ninja");
}
document.onkeydown = function(e){
    if(e.key=="ArrowUp"||e.key=="w"){
        ninjaDir=0;
    }
    if(e.key=="ArrowRight"||e.key=="d"){
        ninjaDir=1;
    }
    if(e.key=="ArrowDown"||e.key=="s"){
        ninjaDir=2;
    }
    if(e.key=="ArrowLeft"||e.key=="a"){
        ninjaDir=3;
    }
}
function ninjaMovement(){
    var targetBlock;
    switch(ninjaDir){
        case 0://North
            ninja.style.transform="rotate(-90deg)";
            targetBlock=document.getElementById("block-"+(ninjaPos-17))
            if(targetBlock.className=="path"){
                ninjaPos-=17;
            }
            break;
        case 1://East
            ninja.style.transform="rotate(0deg)";
            targetBlock=document.getElementById("block-"+(ninjaPos+1))
            if(targetBlock.className=="path"){
                ninjaPos+=1;
            }
            break;
        case 2://South
            ninja.style.transform="rotate(90deg)";
            targetBlock=document.getElementById("block-"+(ninjaPos+17))
            if(targetBlock.className=="path"){
                ninjaPos+=17;
            }
            break;
            case 3://West
            ninja.style.transform="rotate(180deg)";
            targetBlock=document.getElementById("block-"+(ninjaPos-1))
            if(targetBlock.className=="path"){
                ninjaPos-=1;
                break;
            }
        }
        if(targetBlock.innerHTML.indexOf("sushi")>-1){
        targetBlock.innerHTML="";
        collectSushi();
        }
        if(targetBlock.innerHTML.indexOf("onigiri")>-1){
        targetBlock.innerHTML="";
        collectOnigiri();
        }
        if(ghostPos.includes(ninjaPos)){
            if(scared){
                var chomp=document.getElementById("chomp");
                chomp.loop=false;
                chomp.play();
                score+=1000;
                updateScore();
                var ghost=ghostPos.indexOf(ninjaPos);
                document.getElementById("ghost"+ghost).className+=" hidden";
                ghostPos[ghost]=202
            }
            else{
                LoseLife();
            }
        }
    ninja.style.top=(Math.trunc(ninjaPos/17)*45+5)+"px";
    ninja.style.left=((ninjaPos%17)*45+5)+"px";
}
function LoseLife() {
    stopGame();
    var ohNo=document.getElementById("oh-no");
    ohNo.loop=false;
    ohNo.play();
    document.getElementById("lives" + lives).remove();
    lives -= 1;
    ninjaPos = 18;
    ghostPos = [202, 198, 134, 130];
    if(lives>0){
        setTimeout(startGame,3000);
    }
    else{
        document.getElementById("title").className="";
        buildWorld();
    }
    
}

function moveAllGhosts(){
    for(var i=0;i<4;i++){
        moveGhost(i);
    }
}
function moveGhost(ghostNum){
    var ghost=document.getElementById("ghost"+ghostNum);
    var targetBlock;
    console.log[ghostDir[ghostNum]];
    switch(ghostDir[ghostNum]){
        case 0://North
            targetBlock=document.getElementById("block-"+(ghostPos[ghostNum]-17))
            if(targetBlock.className=="path"){
                ghostPos[ghostNum]-=17;
            }else{
                ghostDir[ghostNum]=(ghostDir[ghostNum]+1)%4;
            }
            break;
        case 1://East
            targetBlock=document.getElementById("block-"+(ghostPos[ghostNum]+1))
            if(targetBlock.className=="path"){
                ghostPos[ghostNum]+=1;
            }else{
                ghostDir[ghostNum]=(ghostDir[ghostNum]+1)%4;
            }
            break;
        case 2://South
            targetBlock=document.getElementById("block-"+(ghostPos[ghostNum]+17))
            if(targetBlock.className=="path"){
                ghostPos[ghostNum]+=17;
            }else{
                ghostDir[ghostNum]=(ghostDir[ghostNum]+1)%4;
            }
            break;
        case 3://West
            targetBlock=document.getElementById("block-"+(ghostPos[ghostNum]-1))
            if(targetBlock.className=="path"){
                ghostPos[ghostNum]-=1;
            }else{
                ghostDir[ghostNum]=(ghostDir[ghostNum]+1)%4;
            }
            break;
        }
        
        if(ghostPos[ghostNum]==ninjaPos){
            if(scared){
                var chomp=document.getElementById("chomp");
                chomp.loop=false;
                chomp.play();
                score+=1000;
                updateScore();
                ghost.className+=" hidden";
                ghostPos[ghostNum]=202;
            }else{
                LoseLife();
            }
        }
        ghost.style.top=(Math.trunc(ghostPos[ghostNum]/17)*45+5)+"px";
        ghost.style.left=((ghostPos[ghostNum]%17)*45+5)+"px";
}

function collectSushi(){
    score+=10;
    var yum=document.getElementById("yum");
    yum.loop=false;
    yum.play();
    updateScore();
}
function collectOnigiri(){
    score+=100;
    var yum=document.getElementById("yum");
    yum.loop=false;
    yum.play();
    updateScore();
    makeScared();
}
function updateScore(){
document.getElementById("score").innerHTML="Score: "+score;
    if(document.querySelectorAll(".sushi").length+document.querySelectorAll(".onigiri").length==0){
        ninjaPos=18;
        ghostPos=[202,198,134,130]
        stopGame();
        buildWorld();
        startGame();
    }
}
function playButtonHit(){
    playMusic();
    score=0;
    lives=3;
    for(var i=1;i<=3;i++){
        document.getElementById("lives-div").innerHTML+="<div id='lives"+i+"'class='lives'></div>"
    }
    document.getElementById("title").className="hidden";
    startGame();
}
function startGame(){
    timer = setInterval(ninjaMovement,200);
    timer0=setInterval(moveAllGhosts,200);
}
function stopGame(){
    clearInterval(timer);
    clearInterval(timer0);
}
var resetTime;
var scared=false;
function makeScared(){
    scared=true;
    clearTimeout(resetTime);
    for(var i=0;i<4;i++){
        document.getElementById("ghost"+i).className="scared";
    }
    resetTime=setTimeout(makeUnScared,5000);
}
function makeUnScared(){
    scared=false;
    for(var i=0;i<4;i++){
        document.getElementById("ghost"+i).className="";
    }
}