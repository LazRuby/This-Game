
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var gacha_target = "hero";
var playerid = ori_name;

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

$('#gacha_join').bind('click', function(){ $('#main_view').hide(); $('#gacha_main').show(); });
$('#gacha_exit').bind('click', function(){ 
    $('#main_view').show(); $('#gacha_main').hide();
    socket.emit('card_load', mesd, ori_name);

    socket.emit('skill_mycard_load', mesd, ori_name);
});

$('#gacha_left').bind('click', function(){ gacha_target_change(); });
$('#gacha_right').bind('click', function(){ gacha_target_change(); });

$('#gacha_1_img').bind('click', function(){ gacha_start(1); });
$('#gacha_10_img').bind('click', function(){ gacha_start(5); });

$('#gacha_result').bind('click', function(){ $('#gacha_result').html(''); $('#gacha_result').hide(); $('#gacha_result_back').hide(); });
$('#gacha_result_back').bind('click', function(){ $('#gacha_result').html(''); $('#gacha_result').hide(); $('#gacha_result_back').hide(); });

$('#sell_end').bind('click', function(){ 
    $('#gacha_mycardlist').hide(); 
    $('#gacha_mycardlist2').hide();
    $('#gacha_standing_chat').html('<b><br>다음에 또 들려주세요 ~ !!'); 
});

$('#hero_sell').bind('click', function(){ 
    $('#gacha_mycardlist').show(); 
    $('#gacha_mycardlist2').hide();
    $('#gacha_standing_chat').html('<b><br>판매를 원하는 카드는 이곳으로 옮겨주세요!!'); 
});
$('#skill_sell').bind('click', function(){ 
    $('#gacha_mycardlist').hide();
    $('#gacha_mycardlist2').show(); 
    $('#gacha_standing_chat').html('<b><br>판매를 원하는 카드는 이곳으로 옮겨주세요!!'); 
});


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function gacha_target_change() {
    if(gacha_target == "hero") {
        gacha_target = "skill";
        $('#gacha_type_img').attr('src', 'pub/Gacha/Skill.png');
    }
    else if(gacha_target == "skill") {
        gacha_target = "hero";
        $('#gacha_type_img').attr('src', 'pub/Gacha/Hero.png');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function gacha_start(count) {
    
    $('body').append('<video id="gacha_movie" src="pub/Gacha/Gacha_EFT.mp4" autoplay></video>');
    
    $("#gacha_movie").on("ended", function() {
        $('body').append('<audio id="gacha_sound" controls autoplay><source src="pub/Gacha/Gacha_Sound.mp3" type="audio/mp3"></audio>');
        setTimeout(function() { $('#gacha_sound').remove(); }, 8000);
        flash_eft();
    });
    setTimeout(function() {
        if(gacha_target == "hero") {
            socket.emit('gacha', mesd, ori_name, "hero", count);
        }
        else if(gacha_target == "skill") {
            socket.emit('gacha', mesd, ori_name, "skill", count);
        }
    }, 8000);
    
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function flash_eft() {
    
    $('#flash_eft').show();
    
    $("#flash_eft").animate({opacity:"1"},300, function(){
        setTimeout(function() {
             $('#gacha_movie').remove();
             $("#flash_eft").animate({opacity:"0"},600, function(){ $('#flash_eft').hide(); });
        }, 400);
    });
    
    return true;
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

socket.on('gacha_result_hero', function(gacha_result, gold) {
    
    $('#gacha_result').show();
    $('#gacha_result_back').show();
    
    for(var i =0; i<gacha_result.length; i++) {
        
        var type_src_img = "pub/Type_Img/";
        
        switch (gacha_result[i].Type) {
            case "phone"    : type_src_img += "Pawn"; break;
            case "knight"   : type_src_img += "Knight"; break;
            case "queen"  : type_src_img += "Queen"; break;
            case "king"  : type_src_img += "King"; break;
            case "rook"  : type_src_img += "Rook"; break;
            case "bishop"  : type_src_img += "Bishop"; break;
        }

        type_src_img += ".png";
        console.log("i:"+gacha_result[i].Src);
        $('#gacha_result').append(" <div class='gacha_result_box' style='background:url(" + gacha_result[i].Src + ") no-repeat; background-size : 100% 100%;'> <span class='gacha_result_atk'>" + gacha_result[i].ATK + "</span> <img class='gacha_result_type' src='" + type_src_img + "'> <span class='gacha_result_hp'>" + gacha_result[i].HP + "</span>");
    }
    socket.emit('deck_load', mesd, ori_name);
    socket.emit('card_load', mesd, ori_name);
});

socket.on('gacha_result_skill', function(gacha_result, gold) {
    
    $('#gacha_result').show();
    $('#gacha_result_back').show();
    
    console.log(gacha_result);
    
    for(var i =0; i<gacha_result.length; i++) {
        
        $('#gacha_result').append(" <div class='gacha_result_box'> <img class='skill_img' src='" + gacha_result[i].ImgSrc + "'> <span class='gacha_result_cost'>" + gacha_result[i].Cost + "</span>  </div>");
        
        //$('#gacha_result').append(" <img class='skill_class' src='" + gacha_result[i].ImgSrc + "'> <span class='gacha_result_cost'>" + //gacha_result[i].Cost + "</span>");
    }
    socket.emit('skill_mycard_load', mesd, ori_name);
    socket.emit('skill_allcard_load', mesd, ori_name);
});

socket.on('not_enough_money', function() {
        alert("money is not enough");
    
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function sell_fisrt_loading() {
    
    for(var i=0 in mycard_skill) {
        if((mycard_skill[i].occ!=0)) { continue; }
        
        console.log(mycard_skill[i].dnum);
        console.log(i);
        console.log(mycard_skill[i]);
        console.log(skill_card_db[ mycard_skill[i].dnum -1].src);
        console.log(skill_card_db[ mycard_skill[i].dnum -1]);
        
        $('#gacha_mycardlist').append('<div class="gacha_mycardlist_div" id="gachaskill_' + mycard_skill[i].dno + '_div"> <img id="gachaskill_' + mycard_skill[i].dno + '" class="gacha_mycardlist_img" src="' + skill_card_db[ mycard_skill[i].dnum-1 ].src + '" draggable="true" ondragstart="drag(event)">  <span class="gacha_skill_cost">' + skill_card_db[ mycard_skill[i].dnum-1 ].cost + '</span> </div>');
    }
    
    for(var i=0; i<mycard.length; i++) {
        if( mycard[i].pos!=null) { continue; }
        var id = search_id(mycard[i].ename);
        
        var type_src_img = "pub/Type_Img/";
        
        switch (mycard[i].pro) {
            case "phone"    : type_src_img += "Pawn"; break;
            case "knight"   : type_src_img += "Knight"; break;
            case "queen"  : type_src_img += "Queen"; break;
            case "king"  : type_src_img += "King"; break;
            case "rook"  : type_src_img += "Rook"; break;
            case "bishop"  : type_src_img += "Bishop"; break;
        }

        type_src_img += ".png";
        
        $('#gacha_mycardlist2').append('<div class="gacha_mycardlist_div" id="gachahero_' + Number(mycard[ i ].eno) + '_div"> <img id="gachahero_' + Number(mycard[ i ].eno) + '" class="gacha_mycardlist_img" src="' + card_db[ id ].src + '" draggable="true" ondragstart="drag(event)" > <span class="Gacha_Hero_atk">' + card_db[id].attack + '</span> <img src="' + type_src_img + '" class="Gacha_Hero_type"> <span class="Gacha_Hero_hp">' + card_db[id].hp + '</span> </div>');
    }
}
