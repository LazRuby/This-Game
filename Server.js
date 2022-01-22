const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const static = require('serve-static');
var async = require('async'); 
var money=2;

const PORT = process.env.PORT || 3000;

console.log(__dirname);

const server = express()
    .use(express.static(__dirname + "/"))
    .get("/", function(req, res){ res.sendFile("/login.html");} )
    .get("/thisgame", function(req, res){ res.sendFile(__dirname + "/thisgame.html"); } )
    .listen(PORT, () => console.log("Server On"));

const io = socketIO(server);

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

var ch_name="ch";
var ch_number=4;
var count=1;
var p_sum;
var ss;
var d_turn=0;
var lac = false;
var lst;
var joinid;

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

var mysql = require('mysql');
var connection;
var db_config = {
  host  : '깃 업로드용 삭제',
  user  : '깃 업로드용 삭제',
  password  : '깃 업로드용 삭제',
  port      : '깃 업로드용 삭제',
  database  : '깃 업로드용 삭제'
};

handleDisconnect();

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var r_count=0;
var r_name = new Array();
var f_name = new Array();


io.on('connection', (socket) => {
    var coin = money;
    var discid=joinid;
    var socket_i;
    var shujin;
 

    if(coin==1) {
        money = 2;
        socket_i = ""+socket.id;
        var s_s;
        shujin=discid;
        
        var card_db = new Array();
        var card_db_sql = "SELECT * FROM hero;";
        connection.query(card_db_sql, function(err, rows, fields) { if (!err) {
            card_db = rows;
            io.to(socket.id).emit('all_card_preload',rows);
        }}); 
        
        io.to(socket.id).emit('change name',discid,socket_i); 
        var sla = 1;
        endroll(shujin,socket.id);
        console.log('user connected coin 1 : ', socket.id);
        //console.log("dks");
        
        var bird = "UPDATE login2 SET S_id=? WHERE Id=?";
        var bpar = [socket.id,joinid];
        connection.query(bird, bpar, function(err, rows, fields) {
                    if (!err){
                            console.log("첫 인설트 성공!");
                    }
                    else{
                        console.log('첫 인설트 실패!');
                        //console.log('Error while performing Query.', err);
                    }
        });
        var hwaj = "select Rname,state from room";
        var rraray = new Array();
        var rsaray = new Array();
        connection.query(hwaj, function(err, rows, fields) {
                    if (!err){
                            for(var m in rows){
                                rraray[m] = rows[m].Rname;
                                rsaray[m] = rows[m].state;
                            }
                    }
                    else{
                        console.log('첫 인설트 실패!');
                    }
                    io.to(socket.id).emit('send list',rraray,rsaray);
                });
        io.to(socket.id).emit('all_card_preload', card_db);
        
        if(joinid==null){
            io.to(socket.id).emit('send logout',"로그아웃");
        }
        
        socket.on('disconnect', function(){
            d_turn=0;
            joinid=discid;
            console.log('user disconnected coin 1: ', socket.id);
            outofcurrlogin(shujin);
            if(s_s!=null){
                llogout(s_s,discid);
            }
        });
        socket.on('hazime game',function(pname,userid){
            var searches = 'SELECT Rcode from room where Rname = "'+pname+'"';
            //var searches = 'SELECT * from room';
            let st;
            //var insert_2=""; 
            async.waterfall([ 
                function(callback){
                    connection.query(searches, function(err, rows, fields) {
                    if (!err){
                        //console.log("궁금해 "+rows[1].Rname);
                        console.log('The solution is: ', rows);
                        st = rows[0].Rcode;
                        ss=st;
                        s_s=st;
                        console.log(st+"");
                        //insert_2= 'INSERT INTO '+st+' VALUES ("'+userid+'","'+pname+'","'+socket_i+'")';
                        callback(null,st);
                    }
                    else
                        console.log('Error while performing Query.', err);
                    });
                },
                function(st,callback){
                    var iori = st;
                    var iori2 = 'SELECT * from roompeople where rId = ?';
                    var iparam2 = [iori];
                    connection.query(iori2, iparam2,function(err, rows, fields) {
                        if (!err){
                            //console.log("궁금해 "+rows[1].Rname);
                            if(rows.length==2){
                                console.log("정말 귀찮다.");
                                //var enjoy="false";
                                callback(null,"open",iori);
                            }else{
                                callback(null,"close",iori);
                                    //console
                            }
                        }
                        else
                            console.log('Error while performing Query.', err);
                        });
                },
                function(dengon,data,callback){
                    if(dengon=="open"){
                        open_game(data,userid);
                        console.log("자 게임의 시작이다.");
                    }else{
                        console.log("아직이야.");
                    }
                    callback(null);
                }], 
                function (err) {
                    console.log("인룸 여기서 s_s : "+s_s); 
                    console.log("end");
                });
        });
        socket.on('In room',function(pname,userid,sr_id){
            var searches = 'SELECT Rcode from room where Rname = "'+pname+'"';
            //var searches = 'SELECT * from room';
            let st;
            var insert_2=""; 
            async.waterfall([ 
                function(callback){
                    connection.query(searches, function(err, rows, fields) {
                    if (!err){
                        //console.log("궁금해 "+rows[1].Rname);
                        console.log('The solution is: ', rows);
                        st = rows[0].Rcode;
                        ss=st;
                        s_s=st;
                        console.log(st+"");
                        //insert_2= 'INSERT INTO '+st+' VALUES ("'+userid+'","'+pname+'","'+socket_i+'")';
                        callback(null,st);
                    }
                    else
                        console.log('Error while performing Query.', err);
                    });
                },
                function(st,callback){
                    var iori = st;
                    var iori2 = "SELECT * from roompeople where rId=?";
                    var iparam = [st]
                    connection.query(iori2, iparam,function(err, rows, fields) {
                        if (!err){
                            //console.log("궁금해 "+rows[1].Rname);
                            if(rows.length>=2){
                                console.log("정말 귀찮다.");
                                var enjoy="false";
                                callback(null,"mada",enjoy,iori);
                            }else{
                                console.log("카운트 크기는?"+rows.length);
                                var enjoy="true";
                                if(rows.length==1){
                                    callback(null,"open",enjoy,iori);
                                    //console
                                }else{
                                    callback(null,"mada",enjoy,iori);
                                }
                            }
                        
                        }
                        else
                            console.log('Error while performing Query.', err);
                        });
                },
                function(dengon,enjoy,iori,callback){
                    var message = dengon;
                    if(enjoy=="false"){
                        console.log("인원 초과로 입장 못하십니다.");
                        io.to(socket_i).emit('comenot room',"stop");
                        s_s=null;
                        callback(null);
                    }
                    else if(enjoy=="true"){
                        in_room(sr_id,s_s,socket_i,userid,iori);
                        io.to(socket_i).emit('comein room',pname);
                        callback(null);
                    }
                    //callback(null,dengon,data);
                }], 
                function (err) {
                    console.log("인룸 여기서 s_s : "+s_s); 
                    console.log("end");
                });
        });
        socket.on('ready game', function(mesd,yousd){
            console.log("휴우 시작 됐나");
            console.log("me : "+mesd+" you: "+yousd);
            io.to(mesd).emit('play game',"게임이 시작 되었습니다.");
            io.to(yousd).emit('play game',"게임이 시작 되었습니다.");
        });
        socket.on('make room', function(name,userid){
            var rrname ='ch';
            var np=1;
            var cre;
            var crit_v;
            async.waterfall([ 
                function(callback){
                    connection.query('SELECT * from room', function(err, rows, fields) {
                    
                    if (!err){
                        console.log('The solution is: ', rows);
                        var nn = rows.length;
                        var m_ch=true;
                        rrname =rrname+nn;
                        console.log(rrname);
                        cre=rrname;
                        console.log('일좀 해라33 \n ');
                        for(var i in rows){
                            if(rows[i].Rname==name.trim()){
                                m_ch=false;
                            }
                        }
                        if(m_ch){
                            callback(null,true,rrname);
                        }else{
                            callback(null,false,"aa");
                        }
                        //console.log(typeof np);
                        }
                    else
                        console.log('Error while performing Query.', err);
                        //callback(null,"ch");
                    });
                    //callback(null,rrname);
                }, 
                function(m_check, data, callback){
                    if(m_check){
                        s_s = cr_room(data,socket_i,name,userid);
                        io.emit('append list',name,userid);
                        callback(null);
                    }else{
                        make_err(socket_i);
                    }
                }], 
                function (err) {
                console.log("여기서 s_s : "+s_s); 
                console.log("end"); 
            });


            //rcount(socket_i,name,userid);
        
        console.log("방만들기 심점에서 s_s : "+s_s)
        //io.emit('append list',name,userid);  
        });
        ///////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        
        socket.on('login_push', function(yousd, id){
            console.log("오냐?");
            sql = "SELECT * FROM playerinfo where plid=?";
            var sqparam = [id];
                        
            connection.query(sql, sqparam,function(err, rows, fields) { 
                    if (!err) { io.to(yousd).emit('login_push_result', rows); }
            });    
        });
        
        socket.on('gacha', function(msd, id, type, count){
            
            var sql = "select gold as gold from playerinfo where plid = ?";
            var sparam = [id];
            var gold = 0;

            async.waterfall([ 
                
                function(callback){
                    connection.query(sql, sparam,function(err, rows, fields) { 
                        if (!err){
                            gold = rows[0].gold;
                            callback(null); 
                        }
                    });            
                }, 
                
                function(data, callback){
                    if(gold < count * 100) { io.to(msd).emit('not_enough_money'); return; }
            
                    var gacha_result = new Array(); 
                    gold -= count * 100;
                    
                    sql = "UPDATE playerinfo SET gold= ? WHERE plid=?";
                    var gparam = [gold, id];
                    
                    connection.query(sql, gparam, function(err, rows, fields) {
                        if (!err){
                            if(type == "hero") {
                                for( var i=0 ; i<count ; i++) { 
                                    hero_gacha(msd, id, gacha_result, count, gold); 
                                } 
                            }else if(type == "skill") { 
                                for( var i=0 ; i<count ; i++) {
                                    skill_gacha(msd, id, gacha_result, count, gold); 
                                } 
                            }
                        } else{
                            console.log("가챠 돈 감소 실패"); 
                        }
                    });

                    
                }
            ])
        });
        socket.on('card_sell', function(yousd, playerid, mycard_num, type){
            
            async.waterfall([ 
                
                function(callback){
                    if(type=="skill"){
                        var sql = "DELETE FROM decky WHERE dno=" + mycard_num + ";";
                        console.log(sql);
                        console.log(mycard_num);
                        connection.query(sql, function(err, rows, fields) { 
                            if (!err){
                                callback(null); 
                            }
                        }); 
                    }else if(type=="hero"){
                        var sql = "DELETE FROM evilpiece WHERE eno=" + mycard_num + ";";
                        console.log(sql);
                        console.log(mycard_num);
                        connection.query(sql, function(err, rows, fields) { 
                            if (!err){
                                callback(null); 
                            }
                        });
                    }           
                }, 
                
                function(data, callback){
                    
                    var sql = "UPDATE playerinfo SET gold=gold+" + 10 + " WHERE plid='" + playerid + "';";
                    
                    connection.query(sql, function(err, rows, fields) { 
                        if (err){ console.log("판매 실패") }
                    });
                }
            ])
        });
        
        /////////////////////////////////////////////////////////////////////////////////////////////////
        socket.on('deck_load', function(yousd, id){
            
            var sql = "SELECT * FROM deck_load where owner = ? AND pos is not null;";
            var qparam = [id];
            connection.query(sql, qparam,function(err, rows, fields) { 
                if (!err) { 
                    //console.log(rows[0].eno);
                    io.to(yousd).emit('deck_load_result', rows);
                    /*io.to(yousd).emit('deck_load_result', rows);*/ 
                }
            });
        });
        
        socket.on('card_load', function(yousd, id){
            
            var sql = "SELECT * FROM deck_load where owner = ?;";
            var sqparam = [id];
            connection.query(sql, sqparam,function(err, rows, fields) { 
                if (!err) { 
                    //console.log(rows[0].ename);
                    io.to(yousd).emit('card_load_result', rows);
                    /*io.to(yousd).emit('card_load_result', rows);*/ 
                }
            });
        });
        
        socket.on('deck_update', function(yousd, id, mydeck){
            
            var complete_check = 0;
            
            sql = "UPDATE evilpiece SET pos = null, rpos = null, id=null WHERE eowner=? AND pos IS NOT NULL;";
            var sq_param = [id];
                        
            connection.query(sql, sq_param, function(err, rows, fields) { 
                    if (!err) { deck_update(mydeck, id, mydeck.length, yousd, complete_check); }
                    else { io.to(yousd).emit('deck_update_result', false); }
            });    
        });
        ////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        
        socket.on('skill_mycard_load', function(yousd, id){
            
            var sql = "SELECT * FROM skill_load  where owner=?;";
            var param = [id];

            connection.query(sql,param,function(err, rows, fields) { 
                if (!err) { 
                    io.to(yousd).emit('skill_mycard_result', rows);
                    /*io.to(yousd).emit('card_load_result', rows);*/ 
                }
            });
        });
        
        socket.on('skill_allcard_load', function(yousd, id){
            
            var sql = "SELECT * FROM deck;";
            var sqparam = [id];
            connection.query(sql,sqparam,function(err, rows, fields) { 
                if (!err) {
                    console.log(rows[0].src);
                    io.to(yousd).emit('skill_allcard_result', rows);
                    /*io.to(yousd).emit('card_load_result', rows);*/ 
                }else{
                    console.log("카드 배치 실패");
                }
            });
        });
        
        socket.on('deck_skill_update', function(yousd, id, mycard){
            
            var complete_check = 0;
            
            sql = "UPDATE decky SET occupied=? WHERE downer=? AND occupied is not ?;";
            var usql = [false,id,false];             
            connection.query(sql,usql,function(err, rows, fields) { 
                    if (!err) { deck_skill_update(mycard, id, mycard.length, yousd,complete_check); }
                    else { 
                        console.log("dd");
                        io.to(yousd).emit('deck_skill_update_result', false); 
                    }
            });    
        });
        
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        
        socket.on('move rival', function(yousd,nid,msn){
            console.log('드디어 움직이셨네 yousd : '+yousd+' cid:'+nid+" sn: "+msn);
            io.to(yousd).emit('set rival',nid,msn);
        });
        socket.on('all kill', function(yousd,yid,mid,msn){
            console.log('둘다 죽었네 yousd : '+yousd+' yid:'+yid+' mid: '+mid+" sn: "+msn);
            io.to(yousd).emit('kill all',yid,mid,msn);
        });
        socket.on('red kill', function(yousd,yid,mid,msn){
            console.log('누군가가 죽었네 yousd : '+yousd+' yid:'+yid+' mid: '+mid+" sn: "+msn);
            io.to(yousd).emit('kill red',yid,mid,msn);
        });
        socket.on('blue kill', function(yousd,yid,mid,msn){
            console.log('누군가가 죽었네 yousd : '+yousd+' yid:'+yid+' mid: '+mid+" sn: "+msn);
            io.to(yousd).emit('kill blue',yid,mid,msn);
        });
        socket.on('two attack', function(yousd,yid,mid,msn){
            console.log('누군가가 죽었네 yousd : '+yousd+' yid:'+yid+' mid: '+mid+" sn: "+msn);
            io.to(yousd).emit('attack two',yid,mid,msn);
        });
        socket.on('determine turn', function(yousd,mesd){
            console.log('턴을 결정해 보자. : '+mesd+":"+yousd);
            if(d_turn==0){
                console.log('여기까지 오나. : ');
                d_turn = Math.floor(Math.random() * 10) + 1;
                if(d_turn>5){
                    io.to(mesd).emit('set turn',"start");
                }else{
                    io.to(yousd).emit('set turn',"start");
                }
                io.to(mesd).emit('standby card',"start");
                io.to(yousd).emit('standby card',"start");
            }
        });
        socket.on('turn pass', function(yousd){
            console.log('턴이 넘어왓네. : ');
            io.to(yousd).emit('set turn',"start");
        });
        socket.on('give card', function(yousd,mesd){
            console.log('폐를 준비해. : ');
            io.to(yousd).emit('ready card',"start");
            io.to(mesd).emit('ready card',"start");
        });
        socket.on('give first', function(mename,mesd){
            console.log('폐를 준비시작. : ');
            var mydeck = 'SELECT deck from login2 where Id =?';
            var par = [mename];
            setting_card(mesd,mename);
            
        });
        socket.on('set rival_trap', function(strap,yousd,fsn){
            console.log('함정을 설치합니다.');
            io.to(yousd).emit('set trap_rival',strap,fsn);
        });
        socket.on('half hp', function(yousd,cid,sn){
            console.log('적의 hp를 반으로 깍는다.');
            io.to(yousd).emit('hp half',cid,sn);
        });
        socket.on('zero hp', function(yousd,sn){
            console.log('적의 hp를 0으로 만든다.');
            io.to(yousd).emit('hp zero',sn);
        });
        socket.on('debuff hp', function(yousd,sn,damage){
            console.log('적의 hp를 깍는다.');
            io.to(yousd).emit('hp debuff',sn,damage);
        });
        socket.on('half attack', function(yousd,sn){
            console.log('적의 attack를 반으로 깍는다.');
            io.to(yousd).emit('attack half',sn);
        });
        socket.on('zero attack', function(yousd,sn){
            console.log('적의 attack를 0으로 만든다.');
            io.to(yousd).emit('attack zero',sn);
        });
        socket.on('debuff attack', function(yousd,sn, damage){
            console.log('적의 attack를 깍는다.');
            io.to(yousd).emit('attack debuff',sn, damage);
        });
        socket.on('set rival_magichp', function(yousd,pos,yang){
            console.log('적이 hp up 마법사용');
            io.to(yousd).emit('magic hp',pos,yang);
        });
        socket.on('set rival_magicat', function(yousd,pos,yang){
            console.log('적이 hp up 마법사용');
            io.to(yousd).emit('magic attack',pos,yang);
        });
        socket.on('set rival_magicduo', function(yousd,pos,yang){
            console.log('적이 hp up 마법사용');
            io.to(yousd).emit('magic duo',pos,yang);
        });
        socket.on('you win', function(yousd){
            console.log('게임이 끝났습니다.');
            io.to(yousd).emit('win you');
            d_turn=0;
        });
        socket.on('you draw', function(yousd){
            console.log('게임이 끝났습니다.');
            io.to(yousd).emit('draw you');
            d_turn=0;
        });
        socket.on('you lose', function(yousd){
            console.log('게임이 끝났습니다.');
            io.to(yousd).emit('lose you');
            d_turn=0;
        });
        socket.on('out and list', function(oname){
            console.log('방에서 나갔네!');
            froomout(s_s,oname);
            s_s=null;
            //give_slist(socket_i);
        });
        socket.on('send rivalname', function(ori_name ,yid){
            io.to(yid).emit('set rival_name',ori_name,socket_i);
        });
        socket.on('send firstname', function(firstname, yrid){
            io.to(yrid).emit('set first_name',firstname);
        });
        socket.on('change room_master', function(yousd){
            io.to(yousd).emit('room_master change', "change");
            ch_currwait(shujin);
        });
        socket.on('out of room', function(yousd){
            io.to(yousd).emit('room out', "out");
            ch_currwait(shujin);
        });
        socket.on('send chat', function(myname, message){
            io.emit('chat send', myname,message);
        });
        socket.on('change ready_state', function(ysd){
            io.to(ysd).emit('ready_state change', "go game");
        });
        socket.on('change none_state', function(ysd){
            io.to(ysd).emit('none_state change', "wait game");
        });
        socket.on('invite you', function(ee,rname){
            maneku_invite(ee,rname);
        });
        socket.on('sturn hero', function(num, ysd){
            console.log('sturn hero');
            io.to(ysd).emit('hero sturn', num);
        });
        socket.on('release sturn', function(num, ysd){
            console.log('release sturn');
            io.to(ysd).emit('sturn release', num);
        });
        socket.on('mind control', function(num, ysd){
            console.log('mind control');
            io.to(ysd).emit('control mind', num);
        });
        socket.on('set rival_sikabane', function(ysd, dhd, sika_yeto){
            console.log('nekromence');
            io.to(ysd).emit('set sikabane', dhd, sika_yeto);
        });
        socket.on('inhence armor', function(ysd, pos, num){
            console.log('inhence armorment');
            io.to(ysd).emit('inhence armorment', pos, num);
        });
        socket.on('zero armor', function(ysd, pos){
            console.log('zero armorment');
            io.to(ysd).emit('zero armorment', pos);
        });
        socket.on('change hp_attack', function(ysd, pos){
            console.log('change hp_attack');
            io.to(ysd).emit('hp_attack change', pos);
        });
        socket.on('set obstacle', function(ysd, pos){
            console.log('set obstacle');
            io.to(ysd).emit('obstacle set', pos);
        });
        socket.on('delete obstacle', function(ysd, pos){
            console.log('delete obstacle');
            io.to(ysd).emit('obstacle delete', pos);
        });
        socket.on('ranged attack', function(ysd, pos, num){
            console.log('ranged attack');
            io.to(ysd).emit('attack ranged', pos, num);
        });
        socket.on('change trap_hp_attack', function(ysd, pos){
            console.log('change trap_hp_attack');
            io.to(ysd).emit('ch_trap_hp_attack', pos);
        });
        socket.on('part attack', function(ysd, pos, num, team){
            console.log('part attack');
            io.to(ysd).emit('attack part', team, pos, num);
        });
        socket.on('zero rival_hp', function(ysd, pos){
            console.log('zero blue_hp');
            io.to(ysd).emit('rival_hp zero', pos);
        });
        socket.on('part debuff', function(ysd, pos, num,team){
            console.log('part debuff');
            io.to(ysd).emit('debuff part', team, pos, num);
        });
        socket.on('debuff rival_hp', function(ysd, pos, damage){
            console.log('debuff rival_hp');
            io.to(ysd).emit('rival_hp debuff', pos, damage);
        });
        socket.on('trap_sturn hero', function(ysd, pos){
            console.log('trap_sturn hero');
            io.to(ysd).emit('hero trap_sturn', pos);
        });
    } else if(coin==2) {
        var socket2 = socket.id;
        console.log('user connected: ', socket.id);
        socket.on('send login',function(id,pw){
            var login = 'SELECT Id from login2 where Id = "'+id+'" and Pw = "'+pw+'"';
            var cur_D = "delete from currlogin where nid=?";
            var cur_P = [id];
            console.log('Id : '+id);
            console.log('Pw : '+pw);
            async.waterfall([ 
                function(callback){
                    connection.query(cur_D, cur_P, function(err, rows, fields) {
                            if (!err){
                                console.log('현재 로그인 지우기 성공!');
                            }
                            else
                                console.log('현재 로그인 지우기 실패!');
                                //console.log('Error while performing Query.', err);
                            });
                    callback(null,"next");
                }, function(data, callback){
                    connection.query(login, function(err, rows, fields) {
                            if (!err){
                                var i_ch = rows[0];
                                //console.log(typeof rows[0].Id);
                                //console.log(rows[0].Id);
                                if(!(i_ch)){
                                    console.log('로그인 실패!');
                                    console.log(rows);
                                    io.to(socket.id).emit('result message',"실패");
                                }
                                else{
                                    //console.log(i_ch.length);
                                    money=1;
                                    joinid=id;
                                    console.log('The solution is: ', rows);
                                    console.log('로그인 성공!');
                                    io.to(socket.id).emit('result message',"성공");
                                }
                            }
                            else
                                console.log('로그인 실패!');
                                //console.log('Error while performing Query.', err);
                            });
                }],function (err) {
                    console.log("로그인 과정"); 
                    console.log("end"); 
                });
            });
        socket.on('send join',function(id,pw){
            var login = 'insert into login2 (Id,Pw,S_id) values (?,?,?);';
            var confi = 'select count(*) as count from login2';
            var lparams = [id,pw,"","",""];
            var text = "";
            console.log('Id : '+id);
            console.log('Pw : '+pw);
            
            async.waterfall([ 
                function(callback){
                    connection.query(confi, function(err, rows, fields) {
                        if (!err){
                            var cou = rows[0].count; 
                            callback(null,cou);
                            }
                        else
                                console.log('Error while send Query.', err);
                            });
                    }, 
                function(data, callback){
                    
                    var params = [id,pw,socket.id]; 
                    connection.query(login, params, function(err, rows, fields) {
                        if (!err){
                            console.log("성공!");
                            text = "회원가입에 성공하셨습니다.";
                            io.to(socket.id).emit('result join message',text);
                            callback(null,"gogo!");
                            
                        }
                        else{
                            console.log('실패!');
                            //console.log('Error while performing Query.', err);
                            text = "이미 존재하는 아이디 입니다."
                            io.to(socket.id).emit('result join message',text);
                        }
                        });
                    },
                function(message, callback){
                    var set_member_sql = "insert into playerinfo(plid,gold,lv,exp,win,lose) values(?,?,?,?,?,?);";
                    var set_member_param = [id,30000,1,0,0,0];
                    var inc = "SET @@auto_increment_increment=1;";
                    connection.query(inc, function(err, rows, fields) {
                        if (err){ 
                            console.log('1plus');        
                        }
                    });  
                    connection.query(set_member_sql, set_member_param, function(err, rows, fields) {
                            if (!err){
                                console.log("player endroll success!");
                                //text = "회원가입에 성공하셨습니다.";
                                //io.to(socket.id).emit('result join message',text);
                                //callback(null,hudaname,organi,sub_h,sub_o);

                            }
                            else{
                                console.log('실패!');
                                //console.log('Error while performing Query.', err);
                                //text = "이미 존재하는 아이디 입니다."
                                //io.to(socket.id).emit('result join message',text);
                            }
                        }); 
                }], 
                function (err) {
                    console.log("send message 여기서 a : "+a); 
                    console.log("end"); 
                });
            
            
            
        });
        socket.on('disconnect', function(){
            console.log('user disconnected: ', socket.id);
        });
    }  
    
});

function setting_card(mesd,owner){
    var huda = {
    			setval:function(name,effect,pro,enumber){
    				this.name=name;
    				this.effect=effect;
    				this.pro=pro;
    				this.enumber=enumber;
    			},
    			setsrc:function(src){
    				this.src=src;
    			}
			};
			var Card= function(catachi){
				var yuu = function(){
					this.name;
    				this.effect;
    				this.pro;
    				this.enumber;
                    this.src;
                    this.target;
                    this.cost;
				}
				yuu.prototype=catachi;
				yuu.prototype.constructor=yuu;
				return new yuu;
			}
            
            var dcard = 'SELECT * from get_card where owner = ?;';
            var oparam = [owner];
            var mydeck = new Array();
            connection.query(dcard, oparam,function(err, rows, fields) {
                
                if (!err){
                    if(rows.length!=0){
                        for(i in rows){
                            mydeck[i]=Card(huda);
                            mydeck[i].setval(rows[i].name,rows[i].effect,rows[i].pro,rows[i].enum);
                            mydeck[i].src = rows[i].src;
                            mydeck[i].target=rows[i].target;
                            mydeck[i].cost=rows[i].cost;
                            mydeck[i].how = rows[i].how;
                        }
                        io.to(mesd).emit('set huda',JSON.stringify(mydeck[0]),JSON.stringify(mydeck[1]),JSON.stringify(mydeck[2]),JSON.stringify(mydeck[3]),JSON.stringify(mydeck[4]),JSON.stringify(mydeck[5]),JSON.stringify(mydeck[6]),JSON.stringify(mydeck[7]),JSON.stringify(mydeck[8]), JSON.stringify(mydeck[9]),JSON.stringify(mydeck[10]),JSON.stringify(mydeck[11]),
                        JSON.stringify(mydeck[12]),JSON.stringify(mydeck[13]),JSON.stringify(mydeck[14]),
                        JSON.stringify(mydeck[15]),JSON.stringify(mydeck[16]),JSON.stringify(mydeck[17]),
                        JSON.stringify(mydeck[18]),JSON.stringify(mydeck[19]),JSON.stringify(mydeck[20]),
                        JSON.stringify(mydeck[21]),JSON.stringify(mydeck[22]),JSON.stringify(mydeck[23]),
                        JSON.stringify(mydeck[24]),JSON.stringify(mydeck[25]),JSON.stringify(mydeck[26]),
                        JSON.stringify(mydeck[27]),JSON.stringify(mydeck[28]),JSON.stringify(mydeck[29]),
                        JSON.stringify(mydeck[30]),JSON.stringify(mydeck[31]),JSON.stringify(mydeck[32]),
                        JSON.stringify(mydeck[33]),JSON.stringify(mydeck[34]),JSON.stringify(mydeck[35]),
                        JSON.stringify(mydeck[36]),JSON.stringify(mydeck[37]),JSON.stringify(mydeck[38]),
                        JSON.stringify(mydeck[39]),JSON.stringify(mydeck[40]),JSON.stringify(mydeck[41]),
                        JSON.stringify(mydeck[42]),JSON.stringify(mydeck[43]),JSON.stringify(mydeck[44]),
                        JSON.stringify(mydeck[45]),JSON.stringify(mydeck[46]),JSON.stringify(mydeck[47])                 
                        );
                        
                    }
                }
                else{
                        console.log('Error while performing Query.', err);
                    }
                });
            
}

function open_game(data,userid){
    var siro = {
    			setval:function(name,hp,attack,pro,pos,rpos,id){
    				this.name=name;
    				this.hp=hp;
    				this.attack=attack;
    				this.pro=pro;
    				this.pos=pos;
    				this.rpos=rpos;
    				this.id=id;
    			},
    			setsrc:function(src){
    				this.src=src;
    			}
			};
			var Create= function(piece){
				var Sora = function(){
					this.name;
					this.hp;
					this.attack;
					this.pro;
					this.pos;
					this.rpos;
					this.id;
					this.src;
				}
				Sora.prototype=piece;
				Sora.prototype.constructor=Sora;
				return new Sora;
			}
    var med = new Array();
    med["king"]=null, med["queen"]=null, med["knight1"]=null, med["knight2"]=null,
    med["bishop1"]=null, med["bishop2"]=null, med["rook1"]=null, med["rook2"]=null;
    med["phone1"]=null, med["phone2"] =null, med["phone3"] =null, med["phone4"] =null,
    med["phone5"] =null, med["phone6"] =null, med["phone7"] =null, med["phone8"] =null; 
    var youd = new Array();
    youd["king"]=null, youd["queen"]=null, youd["knight1"]=null, youd["knight2"]=null,
    youd["bishop1"]=null, youd["bishop2"]=null, youd["rook1"]=null, youd["rook2"]=null;
    youd["phone1"]=null, youd["phone2"] =null, youd["phone3"] =null, youd["phone4"] =null,
    youd["phone5"] =null, youd["phone6"] =null, youd["phone7"] =null, youd["phone8"] =null;  
    var rmed = new Array();
    var ryoud = new Array();
    var me, you;
    var mes, yous;
    //var jumunn = "select Uid from "+data;
    var jumunn = "select pid, sid from roompeople where rId = ?";
    var jparam = [data];
    console.log("비가오는 지금 : "+userid);
    
    async.waterfall([ 
            function(callback){
                connection.query(jumunn, jparam,function(err, rows, fields) {
                
                if (!err){
                    if(rows[0].pid==userid){
                        me=rows[0].pid;
                        you=rows[1].pid;
                        mes=rows[0].sid;
                        yous=rows[1].sid;
                    }else if(rows[1].pid==userid){
                        me=rows[1].pid;
                        you=rows[0].pid;
                        mes=rows[0].sid;
                        yous=rows[1].sid;
                    }
                    callback(null,me,mes,you,yous);
                }
                else
                    console.log('Error while performing Query.', err);
                    //callback(null,"ch");
                });
                //callback(null,rrname);
            },
            function(me, mes, you, yous, callback){
                var jumunn4 = "select * from hero_load where eowner = ?;";
                
                var jumunn5 = "select * from hero_load where eowner = ?;";
                var jpa4=[me];
                var jpa5=[you];
                var mmes = mes;
                console.log("여기서 pro는 ");
                console.log("여기서 sid는 "+yous);
                connection.query(jumunn4, jpa4,function(err, rows, fields) {
                if (!err){
                    var hname;
                    var pcount=1;
                    var kcount=1;
                    var bcount=1;
                    var rcount=1;
                    var king;
                    var mes2 = mmes;
                    console.log("여기서 pro는 "+rows[i]);
                    for(var i=0;i<rows.length;i++){
                        console.log("여기서 pro는 "+rows[i].pro);
                        if(rows[i].pro=="king"){
                            med["king"] = Create(siro);
                            med["king"].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                            med["king"].src = rows[i].src;
                        
                        }else if(rows[i].pro=="queen"){
                            med["queen"] = Create(siro);
                            med["queen"].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                            med["queen"].src = rows[i].src;
                            //med["queen"] = mpiece;
                        }else if(rows[i].pro=="phone"){
                            if(rows[i].id=="p1" || rows[i].id=="p01"){
                                med["phone"+1] = Create(siro);
                                med["phone"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+1].src = rows[i].src;
                            }
                            else if(rows[i].id=="p2" || rows[i].id=="p02"){
                                med["phone"+2] = Create(siro);
                                med["phone"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+2].src = rows[i].src;
                            }else if(rows[i].id=="p3" || rows[i].id=="p03"){
                                med["phone"+3] = Create(siro);
                                med["phone"+3].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+3].src = rows[i].src;
                            }else if(rows[i].id=="p4" || rows[i].id=="p04"){
                                med["phone"+4] = Create(siro);
                                med["phone"+4].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+4].src = rows[i].src;
                            }else if(rows[i].id=="p5" || rows[i].id=="p05"){
                                med["phone"+5] = Create(siro);
                                med["phone"+5].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+5].src = rows[i].src;
                            }else if(rows[i].id=="p6" || rows[i].id=="p06"){
                                med["phone"+6] = Create(siro);
                                med["phone"+6].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+6].src = rows[i].src;
                            }else if(rows[i].id=="p7" || rows[i].id=="p07"){
                                med["phone"+7] = Create(siro);
                                med["phone"+7].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+7].src = rows[i].src;
                            }else if(rows[i].id=="p8" || rows[i].id=="p08"){
                                med["phone"+8] = Create(siro);
                                med["phone"+8].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["phone"+8].src = rows[i].src;
                            }
                            //med["phone"+pcount] = mpiece;
                            //pcount++;
                        }else if(rows[i].pro=="knight"){
                            if(rows[i].id=="ni03" || rows[i].id=="ni01"){
                                med["knight"+1] = Create(siro);
                                med["knight"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["knight"+1].src = rows[i].src;
                            }else if(rows[i].id=="ni04" || rows[i].id=="ni02"){
                                med["knight"+2] = Create(siro);
                                med["knight"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["knight"+2].src = rows[i].src;
                            }
                            //med["knight"+kcount] = mpiece;
                            //kcount++;
                        }else if(rows[i].pro=="bishop"){
                            if(rows[i].id=="bi03" || rows[i].id=="bi01"){
                                med["bishop"+1] = Create(siro);
                                med["bishop"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["bishop"+1].src = rows[i].src;
                            }else if(rows[i].id=="bi04" || rows[i].id=="bi02"){
                                med["bishop"+2] = Create(siro);
                                med["bishop"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["bishop"+2].src = rows[i].src;
                            }
                            //med["bishop"+bcount] = mpiece;
                            //bcount++;
                        }else if(rows[i].pro=="rook"){
                            if(rows[i].id=="lo03" || rows[i].id=="lo01"){
                                med["rook"+1] = Create(siro);
                                med["rook"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["rook"+1].src = rows[i].src;
                                //med["rook"+rcount] = mpiece;
                            }else if(rows[i].id=="lo04" || rows[i].id=="lo02"){
                                med["rook"+2] = Create(siro);
                                med["rook"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                med["rook"+2].src = rows[i].src;
                                //med["rook"+rcount] = mpiece;
                            }
                            //console.log("rook는"+med["rook"+rcount].name);
                            //rcount++;
                            
                        }
                    }
                    
                }
                else
                    console.log('Error while performing Query.', err);
                    //callback(null,"ch");
                });
                
                connection.query(jumunn5, jpa5,function(err, rows, fields) {
                if (!err){
                    //var hname;
                    var pcount2=1;
                    var kcount2=1;
                    var bcount2=1;
                    var rcount2=1;
                    for(var i=0;i<rows.length;i++){
                        if(rows[i].pro=="king"){
                            youd["king"] = Create(siro);
                            youd["king"].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                            youd["king"].src = rows[i].src;
                            //youd["king"] = ypiece;
                        }else if(rows[i].pro=="queen"){
                            youd["queen"] = Create(siro);
                            youd["queen"].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                            youd["queen"].src = rows[i].src;
                            //youd["queen"] = ypiece;
                        }else if(rows[i].pro=="phone"){
                            if(rows[i].id=="p01" || rows[i].id=="p1"){
                                youd["phone"+1] = Create(siro);
                                youd["phone"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+1].src = rows[i].src;
                            }else if(rows[i].id=="p02" || rows[i].id=="p2"){
                                youd["phone"+2] = Create(siro);
                                youd["phone"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+2].src = rows[i].src;
                            }else if(rows[i].id=="p03" || rows[i].id=="p3"){
                                youd["phone"+3] = Create(siro);
                                youd["phone"+3].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+3].src = rows[i].src;
                            }else if(rows[i].id=="p04" || rows[i].id=="p4"){
                                youd["phone"+4] = Create(siro);
                                youd["phone"+4].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+4].src = rows[i].src;
                            }else if(rows[i].id=="p05" || rows[i].id=="p5"){
                                youd["phone"+5] = Create(siro);
                                youd["phone"+5].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+5].src = rows[i].src;
                            }else if(rows[i].id=="p06" || rows[i].id=="p6"){
                                youd["phone"+6] = Create(siro);
                                youd["phone"+6].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+6].src = rows[i].src;
                            }else if(rows[i].id=="p07" || rows[i].id=="p7"){
                                youd["phone"+7] = Create(siro);
                                youd["phone"+7].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+7].src = rows[i].src;
                            }else if(rows[i].id=="p08" || rows[i].id=="p8"){
                                youd["phone"+8] = Create(siro);
                                youd["phone"+8].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["phone"+8].src = rows[i].src;
                            }
                            //youd["phone"+pcount2] = ypiece;
                            //pcount2++;
                        }else if(rows[i].pro=="knight"){
                            if(rows[i].id=="ni01" || rows[i].id=="ni03"){
                                youd["knight"+1] = Create(siro);
                                youd["knight"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["knight"+1].src = rows[i].src;
                            }else if(rows[i].id=="ni02" || rows[i].id=="ni04"){
                                youd["knight"+2] = Create(siro);
                                youd["knight"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["knight"+2].src = rows[i].src;
                            }
                            //youd["knight"+kcount2] = ypiece;
                            //kcount2++;
                        }else if(rows[i].pro=="bishop"){
                            if(rows[i].id=="bi01" || rows[i].id=="bi03"){
                                youd["bishop"+1] = Create(siro);
                                youd["bishop"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["bishop"+1].src = rows[i].src;
                            //youd["bishop"+bcount2] = ypiece;
                            }else if(rows[i].id=="bi02" || rows[i].id=="bi04"){
                                youd["bishop"+2] = Create(siro);
                                youd["bishop"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["bishop"+2].src = rows[i].src;
                            //youd["bishop"+bcount2] = ypiece;
                            }
                            //bcount2++;
                        }else if(rows[i].pro=="rook"){
                            if(rows[i].id=="lo01" || rows[i].id=="lo03"){
                                youd["rook"+1] = Create(siro);
                                youd["rook"+1].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["rook"+1].src = rows[i].src;
                            //youd["rook"+rcount2] = ypiece;
                            //rcount2++;
                            }else if(rows[i].id=="lo02" || rows[i].id=="lo04"){
                                youd["rook"+2] = Create(siro);
                                youd["rook"+2].setval(rows[i].name,rows[i].hp,rows[i].attack,rows[i].pro,rows[i].pos,rows[i].rpos,rows[i].id);
                                youd["rook"+2].src = rows[i].src;
                            //youd["rook"+rcount2] = ypiece;
                            //rcount2++;
                            }
                        }
                    } 
                    io.to(mes).emit('set gameid',mes,yous);
                    io.to(yous).emit('set gameid',yous,mes);
                    io.to(mes).emit('set king',JSON.stringify(med["king"]),JSON.stringify(youd["king"]));
                    io.to(mes).emit('set queen',JSON.stringify(med["queen"]),JSON.stringify(youd["queen"]));
                    io.to(mes).emit('set knight',JSON.stringify(med["knight1"]),JSON.stringify(med["knight2"]),JSON.stringify(youd["knight1"]),
                                   JSON.stringify(youd["knight2"]));
                    io.to(mes).emit('set bishop',JSON.stringify(med["bishop1"]),JSON.stringify(med["bishop2"]),JSON.stringify(youd["bishop1"]),
                                   JSON.stringify(youd["bishop2"]));
                    io.to(mes).emit('set rook',JSON.stringify(med["rook1"]),JSON.stringify(med["rook2"]),JSON.stringify(youd["rook1"]),
                                   JSON.stringify(youd["rook2"]));
                    io.to(mes).emit('set phone',JSON.stringify(med["phone1"]),JSON.stringify(med["phone2"]),JSON.stringify(med["phone3"]),JSON.stringify(med["phone4"]),JSON.stringify(med["phone5"]),JSON.stringify(med["phone6"]),JSON.stringify(med["phone7"]),JSON.stringify(med["phone8"]),JSON.stringify(youd["phone1"]),
                                   JSON.stringify(youd["phone2"]),JSON.stringify(youd["phone3"]),JSON.stringify(youd["phone4"]),JSON.stringify(youd["phone5"]),JSON.stringify(youd["phone6"]),JSON.stringify(youd["phone7"]),JSON.stringify(youd["phone8"]));
                    
                    io.to(yous).emit('set king',JSON.stringify(youd["king"]),JSON.stringify(med["king"]));
                    io.to(yous).emit('set queen',JSON.stringify(youd["queen"]),JSON.stringify(med["queen"]));
                    io.to(yous).emit('set knight',JSON.stringify(youd["knight1"]),JSON.stringify(youd["knight2"]),JSON.stringify(med["knight1"]),
                                   JSON.stringify(med["knight2"]));
                    io.to(yous).emit('set bishop',JSON.stringify(youd["bishop1"]),JSON.stringify(youd["bishop2"]),JSON.stringify(med["bishop1"]),
                                   JSON.stringify(med["bishop2"]));
                    io.to(yous).emit('set rook',JSON.stringify(youd["rook1"]),JSON.stringify(youd["rook2"]),JSON.stringify(med["rook1"]),
                                   JSON.stringify(med["rook2"]));
                    io.to(yous).emit('set phone',JSON.stringify(youd["phone1"]),JSON.stringify(youd["phone2"]),JSON.stringify(youd["phone3"]),JSON.stringify(youd["phone4"]),JSON.stringify(youd["phone5"]),JSON.stringify(youd["phone6"]),JSON.stringify(youd["phone7"]),JSON.stringify(youd["phone8"]),JSON.stringify(med["phone1"]),
                                   JSON.stringify(med["phone2"]),JSON.stringify(med["phone3"]),JSON.stringify(med["phone4"]),JSON.stringify(med["phone5"]),JSON.stringify(med["phone6"]),JSON.stringify(med["phone7"]),JSON.stringify(med["phone8"]));
                    
                    
                    console.log("자 이제 게임의 시작이닷. 즐겨 보아라 하하하핳.");
                    callback(null);
                    
                }
                else{
                    console.log('Error while performing Query.', err);
                }
                });
            }], 
            function(err) {
            console.log("end"); 
        });
    
}

function rcount(socket_i,name,userid){
    var rrname ='ch';
    var np=1;
    var cre;
    connection.query('SELECT * from room', function(err, rows, fields) {
    
    console.log("일좀 해라 \n");
    if (!err){
        console.log('The solution is: ', rows);
        var nn = rows.length;
        rrname =rrname+nn;
        console.log(rrname);
        cre=rrname;
        console.log('일좀 해라33 \n ');
        //console.log(typeof np);
        }
        else
        console.log('Error while performing Query.', err);
    });
    
    return rrname;
}

function cr_room(rrname,socket_i,name,userid){
    ss=rrname;
    var insert_3 = 'insert into roompeople(rId,pid,sid) values(?,?,?)'
    var iparam2 = [rrname,userid,socket_i];
    var insert_1= 'INSERT INTO '+rrname+' VALUES ("'+userid+'","'+name+'","'+socket_i+'")';
        
    var insert_2= 'INSERT INTO ROOM VALUES (?,?,?)';
    var iparam = [rrname,name,"mada"];
    connection.query(insert_2, iparam,function(err, rows, fields) {
            if (!err){
                console.log('Success insert');
                ch_currstate(userid);
                //io.to(socket_i).emit("add people",userid);
            }else{
                console.log('Error while insert Query2.', err);
            }
            });
    var sql3 = "SET @@auto_increment_increment=1;";
    connection.query(sql3, function(err, rows, fields) { if (err){ console.log('가챠 결과 1단위 내림차순 실패'); }});
    connection.query(insert_3, iparam2,function(err, rows, fields) {
            if (!err)
                console.log('Success insert');
            else{
                console.log("지금:");
                console.log('Error while insert Query1.', err);
                
            }
        });
    return ss;
}

function in_room(rname,s_s,s_id,name,iori){//pname,userid
         var insert_3 =  'SELECT pid, sid from roompeople where rId=?';
         var insert_4 = 'insert into roompeople(rId,pid,sid) values(?,?,?)'
         var iparam4 = [iori,name,s_id];
         var iparam3 = [iori]
         connection.query(insert_4, iparam4,function(err, rows, fields) {
            if (!err){
                console.log('Success insert');
                //io.emit('convert color',rname);
            }
            else{
                //console.log(st+"a");
                console.log("마우스 중복 오류 입니다. 무시");
                //console.log('Error while insert Query.', err);
                //console.log(st+"a");
            }
        });
        connection.query(insert_3, iparam3,function(err, rows, fields) {
            if (!err){
                console.log('Success insert');
                if(rows[0].pid==name){
                    io.to(rows[0].sid).emit('register id',rows[0].sid,rows[1].sid);
                }else if(rows[1].pid==name){
                    io.to(rows[1].sid).emit('register id',rows[1].sid,rows[0].sid);
                }
            }
            else{
                //console.log(st+"a");
                console.log("마우스 중복 오류 입니다. 무시");
                //console.log('Error while insert Query.', err);
                //console.log(st+"a");
            }
        });
        ch_currstate(name);
        ch_roomstate(iori);
}

function send_m(s_s,s_id,name,text){
    var a = 1;
    var msg = name + ' : ' + text;
    console.log(msg);
    var s_send = 'SELECT Sid from '+s_s;
    var s_list; 
    async.waterfall([ 
            function(callback){
                connection.query(s_send, function(err, rows, fields) {
                    if (!err){
                        console.log('The send is: ', rows);
                        for(var i in rows){
                            io.to(rows[i].Sid).emit('receive message',msg);
                            if(s_id==rows[i].Sid) a=a+1;
                            }
                        if(a==1){ 
                            io.to(s_id).emit('receive message',msg);
                            a=a+1;
                            }
                         callback(null,a)
                        }
                     else
                            console.log('Error while send Query.', err);
                        });
                }, 
             function(data, callback){
                if(data==1) io.to(s_id).emit('receive message',msg);
            }], 
            function (err) {
                console.log("send message 여기서 a : "+a); 
                console.log("end"); 
            });
    
}

function shout(s_s,s_id,name){
    var a=1;
    var msg = name+"님이 방에 입장했습니다."
    console.log(msg);
    var s_send = 'SELECT Uid, Sid from '+s_s;
    var s_list; 
    //console.log(socket.id);
    async.waterfall([ 
            function(callback){
                connection.query(s_send, function(err, rows, fields) {
                    if (!err){
                        console.log('The send is: ', rows);
                        for(var i in rows){
                            io.to(rows[i].Sid).emit('receive message',msg);
                            if(s_id==rows[i].Sid) a=a+1;
                            }
                        if(a==1){ 
                            io.to(s_id).emit('receive message',msg);
                            a=a+1;
                            }
                         shplist(rows);
                         callback(null,a)
                        }
                     else
                            console.log('Error while send Query.', err);
                        });
                }, 
             function(data, callback){
                if(data==1) io.to(s_id).emit('receive message',msg);
            }], 
            function (err) {
                console.log("shout 여기서 a : "+a); 
                console.log("end"); 
            });
    
}

function send_s(sid,name,toname,text){
    var secm = "select S_id from login2 where Id = ?";
    var s_param = [toname];
    var smsg = name+" : "+text;
    connection.query(secm, s_param, function(err, rows, fields) {
                if (!err){
                        console.log("첫 귓속말 조회 성공!");
                        var to_sid = rows[0].S_id;
                        io.to(sid).emit('receive secret message',smsg);
                        io.to(to_sid).emit('receive secret message',smsg);
                }
                else{
                    console.log('첫 귓속말 조회 실패!');
                    //console.log('Error while performing Query.', err);
                }
                });
}

function out_room(s_s,name,soi){
    var o_send = 'delete from '+s_s+' where Uid = "'+name+'"';
    var s_send = 'select Uid, Sid from '+s_s;
    //var spam = [s_s];
    connection.query(o_send, function(err, rows, fields) {
         if (!err){
            console.log('The out is: ', rows);
            ss="";
            console.log(ss+"a");
        }
         else
            console.log('Error while send Query.', err);
         }); 
    connection.query(s_send, function(err, rows, fields) {
         if (!err){
            console.log('The out is: ', rows);
            shplist(rows);
            out_shou(rows,name); 
        }
         else
            console.log('Error while send Query.', err);
            
         sdroomlist(soi);    
         }       
    );
    
}

function fd_room(hope){
        var sele = "select num from roompeople where rId = ?";
        var slparam = [hope];
        var dg_send = 'delete from room where Rcode = "'+hope+'"';
        
        async.waterfall([ 
            function(callback){
                connection.query(sele, slparam,function(err, rows, fields) {
                    if (!err){
                            console.log('The solution is: ', rows);
                            var snum = rows[0].num;
                            callback(null,snum);
                        }
                    else
                        console.log('Error while performing Query.', err);
                        //callback(null,"ch");
                    });
                //callback(null,rrname);
                }, 
                function(snum,callback){
                        var des = 'delete from roompeople where num = ?';
                        var dparam = [snum];
                        connection.query(des, dparam,function(err, rows, fields) {
                            if (!err){
                                    console.log('The solution is: ', rows);
                                    callback(null,"go");
                                }
                            else
                                console.log('Error while performing Query.', err);
                                //callback(null,"ch");
                        });
                    //callback(null,rrname);
                    
                },
                function(text,callback){
                    connection.query(dg_send, function(err, rows, fields) {
                        if (!err){
                                console.log('The out is: ', rows);
                                console.log("room table out of record");
                                droomlist();
                                callback(null);
                            }
                        else
                            console.log('Error while send Query1.', err);
                         });
                }], 
                function (err) {
                //console.log("여기서 s_s : "+s_s); 
                console.log("end"); 
            });
}

function shplist(rows){
    var ppa = new Array();
    for(var k in rows){
        ppa[k]=rows[k].Uid;
    }
    for(var q in rows){
        io.to(rows[q].Sid).emit('add peoplelist',ppa);
    }
    
}

function out_shou(rows,name){
    for(var q in rows){
        io.to(rows[q].Sid).emit('sout out',name);
    }
    
}

function droomlist(){
    var qu = "select Rname from room";
    var ddarray = new Array();
    connection.query(qu, function(err, rows, fields) {
                if (!err){
                        for(var m in rows){
                            ddarray[m] = rows[m].Rname;
                        }
                }
                else{
                    console.log('첫 인설트 실패!');
                }
                io.emit('send list',ddarray);
            });
}

function sdroomlist(sd){
    var qu = "select Rname from room";
    var ddarray = new Array();
    connection.query(qu, function(err, rows, fields) {
                if (!err){
                        for(var m in rows){
                            ddarray[m] = rows[m].Rname;
                        }
                }
                else{
                    console.log('첫 인설트 실패!');
                }
                io.to(sd).emit('send list',ddarray);
            });
}

function llogout(rid,user){
        var d_c;
        var sele = "select * from roompeople where rId = ?";
        var sparam = [rid];
        async.waterfall([ 
            function(callback){
                connection.query(sele, sparam,function(err, rows, fields) {
                if (!err){
                    console.log('The out is: ', rows[0].pid);
                    d_c = rows.length;
                    callback(null,d_c);
                    //console.log('The out is: '+nn);
                    //console.log('The out is: '+rows.length);
                }
                else
                    console.log('Error while counting Query.', err);
                });
                
            }, 
            function(data, callback){
                if(data==1){
                    fd_room(rid);
                    //set_txt(room);
                    console.log("방지우기 : "+data);
                    callback(null,"");
                }
                else{
                    rapid_out(rid,user);
                    //console.log("한개만 남은게 아니잖아 : "+data);
                    console.log("방떠나기 : "+data);
                    callback(null,"");
                }
            },
            function(data, callback){
                callback(null);
            }], 
            function (err) {
            console.log("방지우기 여기서 s_s : "+rid); 
            console.log("end");
        });
        
}

function rapid_out(m_s,name){
    var sele = "select num from roompeople where pid = ?";
    var rparam = [name];
    var s_send = 'select Uid, Sid from ?';
    var sparam = [m_s];
    async.waterfall([ 
            function(callback){
                connection.query(sele, rparam,function(err, rows, fields) {
                    if (!err){
                            console.log('The solution is: ', rows);
                            var snum = rows[0].num;
                            callback(null,snum);
                        }
                    else
                        console.log('Error while performing Query.', err);
                        //callback(null,"ch");
                    });
                //callback(null,rrname);
                }, 
                function(snum,callback){
                        var des = 'delete from roompeople where num = ?';
                        var dparam = [snum];
                        connection.query(des, dparam,function(err, rows, fields) {
                            if (!err){
                                    console.log('The solution is: ', rows);
                                    //var snum = rows[0].num;
                                    callback(null);
                                }
                            else
                                console.log('Error while performing Query.', err);
                                //callback(null,"ch");
                        });
                    //callback(null,rrname);
                    
                }], 
                function (err) {
                //console.log("여기서 s_s : "+s_s); 
                console.log("end"); 
            });
    
}

function make_err(socket_i){
    io.to(socket_i).emit("err make","false");
}

function froomout(rid,user){
        var jum = "select * from roompeople where rId = ?";
        var fparam = [rid];
        var d_c;
        async.waterfall([ 
            function(callback){
                connection.query(jum, fparam,function(err, rows, fields) {
                if (!err){
                    //console.log('The out is: ', rows[0].pid);
                    d_c = rows.length;
                    callback(null,d_c);
                    //console.log('The out is: '+nn);
                    //console.log('The out is: '+rows.length);
                }
                else
                    console.log('Error while counting Query.', err);
                });
                
            }, 
            function(data, callback){
                if(data==1){
                    ord_room(rid,user);
                    console.log("방지우기 : "+data);
                    callback(null,"");
                }
                else{
                    rapid_out(rid,user);
                    ch_roommada(rid);
                    //console.log("한개만 남은게 아니잖아 : "+data);
                    console.log("방떠나기 : "+data);
                    callback(null,"");
                }
            },
            function(data, callback){
                callback(null);
            }], 
            function (err) {
            console.log("방지우기 여기서 s_s : "+rid); 
            console.log("end");
        });
}

function ord_room(hope,user){
        var sele = "select * from roompeople where pid = ?";
        var separam = [user];
        var dg_send = 'delete from room where Rcode = "'+hope+'"';
        
        async.waterfall([ 
            function(callback){
                connection.query(sele, separam,function(err, rows, fields) {
                    if (!err){
                            console.log('The solution is: ', rows);
                            var snum = rows[0].num;
                            callback(null,snum);
                        }
                    else
                        console.log('Error while performing Query.', err);
                        //callback(null,"ch");
                    });
                //callback(null,rrname);
                }, 
                function(snum,callback){
                        var des = 'delete from roompeople where num = ?';
                        var desparam = [snum];
                        connection.query(des, desparam,function(err, rows, fields) {
                            if (!err){
                                    console.log('The solution is: ', rows);
                                    callback(null,"good");
                                }
                            else
                                console.log('Error while performing Query.', err);
                                //callback(null,"ch");
                        });
                    //callback(null,rrname);
                },
                function(text2,callback){
                    connection.query(dg_send, function(err, rows, fields) {
                        if (!err){
                                console.log('The out is: ', rows);
                                console.log("room table out of record");
                                droomlist();
                                callback(null);
                            }
                        else
                            console.log('Error while send Query1.', err);
                         });
                }], 
                function (err) {
                //console.log("여기서 s_s : "+s_s); 
                console.log("end"); 
            });
   
}

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'); 
    // '2016-05-01 20:14:28.500 +0900'
};

function endroll(shujin,sid){
    var jumon = "insert into currlogin values(?,?,?)";
    var jparam = [shujin,sid,"wait"];
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success endroll in table.");
                list_player();
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function outofcurrlogin(shujin){
    var jumon = 'delete from currlogin where nid=?';
    var jparam =[shujin];
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success out in table.");
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function ch_currstate(name){
    var jumon = 'update currlogin SET state=? WHERE nid=?';
    var jparam = ["play",name];
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success change state.");
                list_player();
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function list_player(){
    var jumon = 'select nid from currlogin where state<>?'
    var jparam = ["play"];
    var curlist = new Array();
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success print list.");
                for(var m in rows){
                            curlist[m] = rows[m].nid;
                        }
                io.emit('print currlist',curlist);
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function ch_currwait(name){
    var jumon = 'update currlogin SET state=? WHERE nid=?';
    var jparam = ["wait",name];
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success change wait.");
                list_player();
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function maneku_invite(ee,rname){
    var jumon = 'select sid from currlogin where nid=?';
    var jparam = [ee];
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success get cuusid. : "+ee);
                var sid = rows[0].sid;
                io.to(sid).emit('maneku invite',rname);
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function ch_roomstate(iori){
    var jumon = 'update room SET state=? WHERE Rcode=?';
    var jparam = ["full",iori];
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success change wait.");
                update_list();
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function ch_roommada(iori){
    var jumon = 'update room SET state=? WHERE Rcode=?';
    var jparam = ["mada",iori];
    connection.query(jumon, jparam, function(err, rows, fields) {
        if (!err){
                console.log("success change wait.");
                update_list();
            }
        else
            console.log('Error while send Query1.', err);
         });
}

function update_list(){
    var hwaj = 'select Rname, state from room';
    var rraray = new Array();
    var rsaray = new Array();
    connection.query(hwaj, function(err, rows, fields) {
                if (!err){
                        for(var m in rows){
                            rraray[m] = rows[m].Rname;
                            if(rows[m].state==null || rows[m].state==""){
                                rsaray[m] = "aa";
                            }else {
                                rsaray[m] = rows[m].state;
                            }
                            
                        }
                    io.emit('send list',rraray,rsaray);
                }
                else{
                    console.log('첫 인설트 실패!');
                }
                
        });
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function hero_gacha(yousd, id, gacha_result, count, gold){
    
    var Card_Info = {
        Card_Name:'',
        Card_ATK:'',
        Card_HP:'',
        Card_Grade:'',
        Card_Type:'',
        Card_CardImgSrc:''
    };
    
    var grade, rannum, sql;
    
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    
    async.waterfall([
        
        function(callback){
            
            rannum = create_rannum(1, 100);
            
            sql = "SELECT COUNT(*) as count FROM hero where grade = ?;";
            
            if(rannum <= 40) { grade = "Bronze"; } 
            else if(rannum <= 70) {  grade = "Silver"; }
            else if(rannum <= 90) {  grade = "Gold"; }
            else /* 10% */ {  grade = "Legend"; }
            
            //sql = sql + grade + ";";
            var gparam1 = [grade];
            connection.query(sql,gparam1,function(err, rows, fields) { 
                if (!err){
                    rannum = create_rannum(1, rows[0].count); 
                    callback(null, "");
                }
            });           
        }, 
    
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
        
        function(data, callback){
            var gnid = grade+rannum;
            sql = "SELECT * FROM hero where gid = ?;";
            
            var gparam2 = [gnid];
            connection.query(sql, gparam2,function(err, rows, fields) { 
                if (!err){ 
                    //console.log(rows[0].hname);
                    Card_Info.Card_Name = rows[0].hname;
                    Card_Info.Card_ATK = rows[0].attack;
                    Card_Info.Card_HP = rows[0].hp;
                    Card_Info.Card_CardImgSrc = rows[0].src;
                    Card_Info.Card_Grade = grade;
                    
                    callback(null, rows[0].hname);
                }
            });
        },
    
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
        
        function(name, callback){
            
            var type;
            
            rannum = create_rannum(1, 100);

            if(rannum <= 29) { type = "phone"; } 
            else if(rannum <= 46) { type = "bishop"; }
            else if(rannum <= 63) { type = "rook"; }
            else if(rannum <= 80) { type = "knight"; }
            else if(rannum <= 90) { type = "queen"; }
            else { type = "king"; }

            Card_Info.Card_Type = type;
            /*
            sql = "SET @@auto_increment_increment=1;";
            connection.query(sql, function(err, rows, fields) { if (err){ console.log('가챠 결과 1단위 내림차순 실패'); }});*/
            sql = "SET @@auto_increment_increment=1;";
            connection.query(sql, function(err, rows, fields) { if (err){ console.log('가챠 결과 1단위 내림차순 실패'); }});
            sql = "INSERT INTO evilpiece (eowner,ename,pro) values(?,?,?);";

            var param = [id,name,type];
            
            connection.query(sql, param, function(err, rows, fields) { 
                if (!err){  
                    console.log("가챠 성공");
                    console.log("뽑은 영웅 : "+Card_Info.Card_Name+","+Card_Info.Card_Name+","+Card_Info.Card_ATK+","+Card_Info.Card_HP+","+Card_Info.Card_Type+","+Card_Info.Card_CardImgSrc);
                    gacha_result[gacha_result.length] = {
                        Name:Card_Info.Card_Name,
                        ATK:Card_Info.Card_ATK,
                        HP:Card_Info.Card_HP,
                        Type:Card_Info.Card_Type,
                        Src:Card_Info.Card_CardImgSrc
                    }

                    if(gacha_result.length == count) { 
                        io.to(yousd).emit('gacha_result_hero', gacha_result, gold);
                    }
                    callback(null,"");
                }else{
                    console.log("가챠 실패");
                }
            });
        },function(data, callback){
            callback(null);
        }], 
        function (err) {
            console.log("end");
    }); 
}

function skill_gacha(yousd, id, gacha_result, count, gold) {

    var Card_Info = {
        Card_ID:'',
        Card_DB_ID:'',
        Card_Name:'',
        Card_ImgSrc:'',
        Card_Cost:'',
        Card_Occupied:''
    }
    
    var rannum, sql;    
    
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    
    async.waterfall([
        
        function(callback){
            
            sql = "SELECT COUNT(*) as count FROM deck;";
                    
            connection.query(sql, function(err, rows, fields) { 
                if (!err){
                    rannum = create_rannum(1, rows[0].count); 
                    callback(null, ""); 
                }
            });           
        }, 
    
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
        
        function(data, callback){
            
            sql = "SELECT * FROM deck where dnum = ?";
            var sqparam = [rannum];

            connection.query(sql, sqparam,function(err, rows, fields) { 
                if (!err){
                    
                    Card_Info.Card_DB_ID = rows[0].dnum;
                    Card_Info.Card_Name = rows[0].name;
                    Card_Info.Card_ImgSrc = rows[0].src;
                    Card_Info.Card_Cost = rows[0].cost;
                    
                    callback(null, ""); 
                }
            });
        },
    
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
    
        function(data, callback){
            /*
            sql = "SET @@auto_increment_increment=1;";
            connection.query(sql, function(err, rows, fields) { if (err){ console.log('가챠 결과 1단위 내림차순 실패'); }});
            */
            //console.log("스킬 이름 : "+Card_Info.Card_Name);
            sql = "SET @@auto_increment_increment=1;";
            connection.query(sql, function(err, rows, fields) { if (err){ console.log('가챠 결과 1단위 내림차순 실패'); }});
            sql = "INSERT INTO decky (downer,dnum,occupied) values (?,?,?);";
            var param = [id,Card_Info.Card_DB_ID,false];
            
            connection.query(sql, param, function(err, rows, fields) {
                
                if (!err){
                    //console.log("스킬가챠 성공");
                    gacha_result[gacha_result.length] = {
                        DB_ID:Card_Info.Card_DB_ID,
                        Name:Card_Info.Card_Name,
                        ImgSrc:Card_Info.Card_ImgSrc,
                        Cost:Card_Info.Card_Cost
                    }
                        
                    if(gacha_result.length == count) {
                        io.to(yousd).emit('gacha_result_skill', gacha_result, gold);
                        /*io.to(yousd).emit('gacha_result', gacha_result, gold);*/ 
                    }
                }else{
                    console.log("스킬가챠 실패");
                }
            });  
        }
    ]) 
}

function create_rannum(min, max){ 
    var temp_rannum = Math.floor(Math.random()*(max-min+1)) + min; 
    return temp_rannum; 
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function deck_update(mydeck, id, length, ysd, complete_check) {
    /*
    sql = "UPDATE heroku_9388b11db72bc54.playercardlist_" + id + "_hero SET Card_Occupied=" + mydeck[complete_check].Card_Occupied + " WHERE Card_ID='" + mydeck[complete_check].Card_ID + "';";
    */
    console.log(mydeck[complete_check].ename);
    sql = "update evilpiece set pos = ?, rpos=?, id = ? where eno=?;"
    var revers_p = 64-mydeck[complete_check].pos+1;
    var get_id = getpieceid(mydeck[complete_check].pos-48);
    var upparam = [mydeck[complete_check].pos, revers_p, get_id, mydeck[complete_check].eno];
    connection.query(sql, upparam,function(err, rows, fields) { 
                
        if(err) { io.to(ysd).emit('deck_update_result', false); }
        else if ((!err)&&(complete_check==length-1)) { io.to(ysd).emit('deck_update_result', true); }
        else { complete_check++; deck_update(mydeck, id, length, ysd, complete_check); }
    });
}

function deck_skill_update(mycard, id, length, yousd,complete_check) {
    
    if (complete_check==length) { io.to(yousd).emit('deck_skill_update_result', true); }
    else if(mycard[complete_check].occ == true) {
        //console.log("dno : "+mycard[complete_check].dno+" : "+mycard[complete_check].occ);
        sql = "UPDATE decky SET occupied=? WHERE dno=? AND downer=?;";
        var param = [mycard[complete_check].occ,mycard[complete_check].dno,id];
        connection.query(sql,param,function(err, rows, fields) { 
            
            if(err) { io.to(yousd).emit('deck_update_result', false); }
            else if ((!err)&&(complete_check==length)) { io.to(yousd).emit('deck_skill_update_result', true); }
            else { complete_check++; deck_skill_update(mycard, id, length, yousd,complete_check); }
        });
    }
    else { complete_check++; deck_skill_update(mycard, id, length, yousd,complete_check); }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function search_id(name) {
    
    for(var i=0; i<card_db.length; i++) {
        
        if(card_db[i].Card_Name == name) { return i; }
    }
}

function getpieceid(pos){
    var pieceid;
    if(pos<9){
        pieceid = "p"+pos; 
    }else if(pos==9){
        pieceid = "lo0"+1;
    }else if(pos==16){
        pieceid = "lo0"+2;
    }else if(pos==10){
        pieceid = "ni0"+1;
    }else if(pos==15){
        pieceid = "ni0"+2;
    }else if(pos==11){
        pieceid = "bi0"+1;
    }else if(pos==14){
        pieceid = "bi0"+2;
    }else if(pos==12){
        pieceid = "queen0"+1;
    }else if(pos==13){
        pieceid = "king0"+1;
    }
    return pieceid;
}

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}