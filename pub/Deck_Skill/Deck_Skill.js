
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

$('#deck_skill_join').bind('click', function(){ $('#main_view').hide(); $('#deck_skill_main').show(); first_loading(); });
$('#deck_skill_exit').bind('click', function(){ skill_update_check(); });

$('#deck_skill_reset').bind('click', function(){ skill_deck_reset(); });

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var mycard_skill = new Array();
var skill_card_db = new Array();
var skill_count = 0;
var card_limit = {};

socket.on('skill_mycard_result', function(deck_result) { mycard_skill = deck_result; });
socket.on('skill_allcard_result', function(card_result) { skill_card_db = card_result; });

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function first_loading() {
    
    card_limit = {};
    
    $('#deck_skill_field').html('');
    $('#deck_skill_cardlist').html('');
    
    for(var i=0; i<mycard_skill.length; i++) {
           
        if(mycard_skill[i].occ) {
            
            $('#deck_skill_field').append('<div class="deck_skill_div" id="skill_' + mycard_skill[i].dno + '_div"> <img id="skill_' + mycard_skill[i].dno + '" class="deck_skill_img" src="' + skill_card_db[mycard_skill[i].dnum-1].src + '" draggable="true" ondragstart="drag(event)" ><span class="deck_skill_cost">' +skill_card_db[mycard_skill[i].dnum-1].cost + '</span> </div>'); 
            
            if( (eval("card_limit.N" + mycard_skill[i].dnum)!=1) && (eval("card_limit.N" + mycard_skill[i].dnum)!=2) ) {
                eval("card_limit.N" + mycard_skill[i].dnum + " = 1"); }
            else if( eval("card_limit.N" + mycard_skill[i].dnum)>=3 ) { 
                alert("같은 카드는 최대 2장까지만 가능합니다.\n\n" +  mycard_skill[i].name + " : " + eval("card_limit.N" + mycard_skill[i].dnum) + " 장"); return; }
            else { eval("card_limit.N" + mycard_skill[i].dnum + " += 1"); }
            
            skill_count++;
        }
        
        else { 
            $('#deck_skill_cardlist').append('<div class="deck_skill_div" id="skill_' + mycard_skill[i].dno + '_div"><img id="skill_' + mycard_skill[i].dno + '" class="deck_skill_img" src="' + skill_card_db[mycard_skill[i].dnum-1].src + '" draggable="true" ondragstart="drag(event)" ><span class="deck_skill_cost">' + skill_card_db[mycard_skill[i].dnum-1].cost + '</span> </div>');
        }
        
        $('#skill_'+ mycard_skill[i].dno).bind('mouseover', function(){
            
            var split_temp = this.id;
            var temp2 = split_temp.split('_');
            
            var myskill_id = temp2[1];
            var myskill_id2 = parseInt(myskill_id);
            
            var target_id = skill_search_array_num(myskill_id);
            var db_loc = mycard_skill[target_id].dnum-1;
            
            $('#deck_skill_cardlist_detail').html('<img class="detail_img" src="' +  skill_card_db[db_loc].src + '"><span class="deck_skill_cost2">' +  skill_card_db[db_loc].cost + '</span>');
        });
        
        $('#deck_skill_cardlist_detail').html('<img class="detail_img" src="pub/Deck_Skill/Blank.png"> <span class="deck_skill_cost2">0</span>');
        skill_count_update();
    }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function skill_search_id(name) {
    
    for(var i=0; i<skill_card_db.length; i++) {
        
        if(skill_card_db[i].name == name) { return i; }
    }
}

function skill_search_array_num(id) {
    
    for(var i=0; i<mycard_skill.length; i++) {
        if(mycard_skill[i].dno == id) { return i;}
    }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    
    var temp = data.split('_');
    var myskill_id = temp[1];
    var myskill_id2 = parseInt(myskill_id);
      
    var target_id = skill_search_array_num(myskill_id);
    //var db_loc = mycard_skill[target_id].dnum;
    
    if( ev.target.id=="deck_skill_field" ) {
        
        if ( (eval("card_limit.N" + mycard_skill[target_id].dnum)!=1) && (eval("card_limit.N" + mycard_skill[target_id].dnum)!=2) ) {                   
            eval("card_limit.N" + mycard_skill[target_id].dnum + " = 1"); 
        }
        else if ( eval("card_limit.N" + mycard_skill[target_id].dnum)>=2 ) { 
            alert("같은 카드는 최대 2장까지만 가능합니다.\n\n" +  mycard_skill[target_id].name + " : " + eval("card_limit.N" + mycard_skill[target_id].dnum) + " 장"); 
            return; 
        }
        else { 
            eval("card_limit.N" + mycard_skill[target_id].dnum + " += 1"); 
        }
        ev.target.appendChild(document.getElementById(data+"_div"));
        mycard_skill[target_id].occ = 1;    
        skill_count++;
        skill_count_update();
    }
    
    else if(ev.target.id=="deck_skill_cardlist") {
        
        ev.target.appendChild(document.getElementById(data+"_div"));
        
        eval("card_limit.N" + mycard_skill[target_id].dnum + " -= 1");
        mycard_skill[target_id].occ = false;
        
        skill_count--;
        skill_count_update();
    }
    
    else if( ev.target.id=="sell_field") {
        
        var type_temp;
        
        if(temp[0]=="gachahero") { type_temp="hero"; }
        else { type_temp="skill"; }
        
        $('#'+data).remove();
        
        socket.emit('card_sell', yousd, playerid, myskill_id, type_temp);
        
        player_info[0].gold += 10;
        
        player_info_update();
    }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function skill_update_check() {
    
    var card_max_check = 0;
    
    for(var i=0 in mycard_skill) { if( (mycard_skill[i].occ==true) || (mycard_skill[i].occ==1) ) { card_max_check++; } }
    if( eval("card_limit.N" + mycard_skill[i].dnum)>=2 ) { 
        alert("같은 카드는 최대 2장까지만 가능합니다.\n\n" +  mycard_skill[i].name + " : " + eval("card_limit.N" + mycard_skill[i].dnum) + " 장"); return; 
    }
    
    if(card_max_check==48) { socket.emit('deck_skill_update', mesd, ori_name, mycard_skill); }
    else { alert("카드의 수가 48장이 아닙니다!!"); }
}

socket.on('deck_skill_update_result', function(result){ 
    
    if(result) { 
        
        alert("저장에 성공하였습니다!!"); 
        
        $('#main_view').show();
        $('#deck_skill_main').hide();
        
        $('#deck_skill_field').empty();
        $('#deck_skill_cardlist').empty();
        
        socket.emit('skill_mycard_load', mesd, ori_name);
    }
    else { alert("저장에 실패하였습니다!!"); }
}); 

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function skill_deck_reset() {
    
    for(var i=0; i<mycard_skill.length; i++) { mycard_skill[i].occ = 0 }
    
    first_loading();
}

function skill_count_update() { $('#deck_skill_count').html(skill_count + " / 48 장"); }

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

