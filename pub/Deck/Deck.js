
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

$('#deck_join').bind('click', function(){ $('#main_view').hide(); $('#deck_main').show(); field_update(); });
$('#deck_exit').bind('click', function(){ update_check() });

$('#deck_reset').bind('click', function(){ for(var i=0; i<16; i++) { card_delete(i); }});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var total_cost = 0;
var total_atk = 0;
var total_hp = 0;

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var mydeck = new Array();
var mycard = new Array();
var card_db = new Array();

socket.on('deck_load_result', function(deck_result) { mydeck = deck_result; });
socket.on('card_load_result', function(card_result) { mycard = card_result; });
socket.on('all_card_preload', function(db) { card_db = db; });

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function create_table() {
    
    var temp = 0;
    var temp_url = '<img class="Battle_Hero_Img" src="pub/Deck/';

    $("#deck_field").html('<table>');

    for(var i=0; i<2; i++)
    {	
        $("#deck_field").append('<tr>');

        for(var j=0; j<8; j++)
        {
            $("#deck_field").append('<td class="field_slot" id='+ temp +'></td>');
            
            if( (0<=temp) && (temp<8) ) { $("#"+temp).html( temp_url + 'Pawn_Blank.png">'); }
            else if( (temp==8) || (temp==15) ) { $("#"+temp).html( temp_url + 'Rook_Blank.png">'); }
            else if( (temp==9) || (temp==14) ) { $("#"+temp).html( temp_url + 'Knight_Blank.png">'); }
            else if( (temp==10) || (temp==13) ) { $("#"+temp).html( temp_url + 'Bishop_Blank.png">'); }
            else if(temp==11) { $("#"+temp).html( temp_url + 'Queen_Blank.png">'); }
            else if(temp==12) { $("#"+temp).html( temp_url + 'King_Blank.png">'); }
            
            $('#'+temp).bind('click', function(){ card_list_view(this.id) });
            
            temp++;
        }	

        $("#deck_field").append('</tr>');
    }

    $("#deck_field").append('</table>');
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function field_update() {
    
    total_cost = 0;
    total_atk = 0;
    total_hp = 0;
    
    for(var i=0; i<mydeck.length; i++) {

        var id = search_id(mydeck[i].ename);
        var Occup = mydeck[i].pos-48-1;
        
        $('#'+ Occup).html( "<img class='Battle_Hero_Img' src='" + card_db[id].battle_src + "'><span class='Battle_Hero_atk'>" + card_db[id].attack + "</span><span class='Battle_Hero_Cost'>" + card_db[id].cost + "</span>  <span class='Battle_Hero_hp'>" + card_db[id].hp + "</span>");

        total_cost += card_db[id].cost;
        total_atk += card_db[id].attack;
        total_hp += card_db[id].hp;

    }
    
    $("#deck_spec").html('현재 코스트 : ' + total_cost + '<br>최대 코스트 : 80<br>종합 공격력 : ' + total_atk + '<br>종합 체력 : ' + total_hp);
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function search_id(name) {
    
    for(var i=0; i<card_db.length; i++) {
        
        if(card_db[i].hname == name) { return i; }
    }
}

function search_array_num(id) {
    
    for(var i=0; i<mycard.length; i++) {
        if(mycard[i].eno == id) { return i;}
    }
}

function get_mycardindex(enom){
    
    var count;
    var readeno;
    
    for(var i in mycard){
        
        readeno = mycard[i].eno;
        
        if(readeno == enom){ count=i; }
    }
    
    return count;
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function card_list_view (slot) {
   
    $('#deck_cardlist').show();
    $('#deck_cardlist_back').show();
    
    $('#deck_cardlist_back').html('<input type="button" id="deck_cardlist_exit">');
    $('#deck_cardlist_exit').bind('click', function(){ 
        $('#deck_cardlist').hide();
        $('#deck_cardlist_back').hide();
        $('#deck_cardlist').html('');
    });
    
    $('#deck_cardlist').append('<img id="blank_card" class="Cardlist_Img" src="pub/Deck/Blank_Card.png">');
    $('#blank_card').bind('click', function(){ card_delete(slot); });
    
    var type;
    
    if( (0<=slot) && (slot<8) ) { type="phone"; }
    else if( (slot==8) || (slot==15) ) { type="rook"; }
    else if( (slot==9) || (slot==14) ) { type="knight"; }
    else if( (slot==10) || (slot==13) ) { type="bishop"; }
    else if(slot==11) { type="queen"; }
    else if(slot==12) { type="king"; }
    
    for(var i=0; i<mycard.length; i++) {
        
        var id = search_id(mycard[i].ename);
        
        if(card_view_check(id, i)) { continue; }
            
        if(mycard[i].pro==type) {
                       
            $('#deck_cardlist').append('<img id="card_' + slot + '_' + mycard[i].eno + '" class="Cardlist_Img" src="' + card_db[id].src + '"><span class="Card_Hero_atk">' + card_db[id].attack + '</span><span class="Card_Hero_Cost">' + card_db[id].cost + '</span><span class="Card_Hero_hp">' + card_db[id].hp + '</span>');
            
            $('#card_'+ slot + '_' + mycard[i].eno).bind('click', function(){ card_change(this.id); });
        }
    }
}

function card_view_check (id, target_i) {
    
    var return_temp = false;
    
    for(var i=0; i<mydeck.length; i++) {
        
        if(mycard[target_i].ename == mydeck[i].ename) { return_temp = true; }
    }
    
    return return_temp;
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function card_change(slot_id) {
    
    var split_temp = slot_id.split('_');
    
    var target_slot = split_temp[1];//슬롯번호 0~15
    var target_id = split_temp[2];//mycard내에서 현재 바꾼 카드의 eno
    
    var target_slot2 = parseInt(target_slot);
    var target_id2 = parseInt(target_id);
    
    var check_temp = true;
    var target_pos = search_array_num(target_id); 
    
    for(var i=0; i<mydeck.length; i++) {
        
        var couc = mydeck[i].pos-48-1;
        
        if(couc == target_slot) {
            
            var genum = get_mycardindex(mydeck[i].eno);
            
            mycard[ genum ].pos = null;
                   
            mydeck[i].eno = mycard[target_pos].eno;
            mydeck[i].ename = mycard[target_pos].ename;
            mydeck[i].grade = mycard[target_pos].grade;
            mydeck[i].pro = mycard[target_pos].pro;
            mydeck[i].pos = target_slot2+48+1;
            
            mycard[target_pos].pos = target_slot2+48+1;
            
            check_temp = false;
                       
            break; 
        }
    }
    
    if(check_temp) {
        
        mydeck[mydeck.length] = {
            eno : mycard[target_pos].eno,
            ename : mycard[target_pos].ename,
            grade : mycard[target_pos].grade,
            pro : mycard[target_pos].pro,
            pos : target_slot2+48+1
        }; 
    }
    
    $('#deck_cardlist').hide();
    $('#deck_cardlist_back').hide();
    $('#deck_cardlist').html('');
    
    field_update();
}

function card_delete(target_slot) {
    
    for(var i=0; i<mydeck.length; i++) {
        
        var cocupi = mydeck[i].pos-48-1;
        
        if(cocupi == target_slot) { 
            
            var mindex = get_mycardindex(mydeck[i].eno);
            
            mycard[ mindex ].pos = null;
                   
            mydeck.splice(i,1);
            
            break; 
        }
    }
    
    field_update();
    
    var temp_url = '<img class="Battle_Hero_Img" src="pub/Deck/';

    if( (0<=target_slot) && (target_slot<8) ) { $("#"+target_slot).html( temp_url + 'Pawn_Blank.png">'); }
    else if( (target_slot==8) || (target_slot==15) ) { $("#"+target_slot).html( temp_url + 'Rook_Blank.png">'); }
    else if( (target_slot==9) || (target_slot==14) ) { $("#"+target_slot).html( temp_url + 'Knight_Blank.png">'); }
    else if( (target_slot==10) || (target_slot==13) ) { $("#"+target_slot).html( temp_url + 'Bishop_Blank.png">'); }
    else if(target_slot==11) { $("#"+target_slot).html( temp_url + 'Queen_Blank.png">'); }
    else if(target_slot==12) { $("#"+target_slot).html( temp_url + 'King_Blank.png">'); }
            
    $('#deck_cardlist').hide();
    $('#deck_cardlist_back').hide();
    $('#deck_cardlist').html('');
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function update_check() {
    
    var king_check = true;
    
    for(var i=0; i<mydeck.length; i++) {
        var mpos = mydeck[i].pos-48-1;
        if(mpos==12) { king_check = false; break; }
    }
    
    if( king_check ) { alert("킹은 반드시 배치되어야 합니다."); return false; }
    else if( total_cost <= 80 ) { socket.emit('deck_update', mesd, ori_name, mydeck); }
    else { alert("총 코스트를 초과하였습니다. \n현재 코스트 = " + total_cost); return false;}
    
    return true;
}

socket.on('deck_update_result', function(result){ 
    
    if(result) { 
        alert("저장에 성공하였습니다!!"); 
        $('#main_view').show(); $('#deck_main').hide();
    }
    else { alert("저장에 실패하였습니다!!"); }
}); 

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

