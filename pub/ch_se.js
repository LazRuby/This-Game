var socket = io();
     var R_a = new Array();
     var c_c=0;
     var codeg = true;
     var rommname="";
     $('#room').on('submit', function(e){
       socket.emit('make room', $('#rname').val(),$('#name').val());
       $('#rname').val("");
       $("#rname").focus();
       e.preventDefault();
     });
     socket.on('send list', function(r_name){
         for(var i=0;i<r_name.length-1;i++){
             var a = r_name[i];
             
             var $p = document.createElement('p');
             var text = document.createTextNode(a);
             
             $p.className = 'tag';
             
             $p.appendChild(text);
             document.body.appendChild($p);
             document.getElementById('r_list').appendChild($p);
             
             $('.tag').on("click",function(e){
                 if(codeg==true){
                    codeg=false;
                    console.log("만세");
                    //$(e.target).css("color","red");
                    var event = $(e.target);
                    var e_text = event.text();
                    var ee = e_text.trim();
                    e.target.style.color = 'red';
                    //$('#chatLog').empty();
                    $('#chatLog').append
                    socket.emit('In room', ee, $("#name").val());
                    codeg=true;
                 }
             });
         }
     });
     socket.on('append list', function(name){
             //var a = r_name[i];
         var $p = document.createElement('p');
         var text = document.createTextNode(name);
         $p.className = 'tag';
         $p.appendChild(text);
         //c_c++;
         document.getElementById('r_list').appendChild($p);
         $('.tag').on("click",function(e){
                 e.target.style.color = 'red';
             });
     });  
     socket.on('change name', function(name){
       $('#name').val(name);
     });
     /*$('#pass').on('click', function(e){
       socket.emit('pass room',"야호");
     });*/
     $('#pass').on('click', function(e){
       location.href="/Client";
     });
       
     
    $('#chat').on('submit', function(e){
       socket.emit('send message', $('#name').val(), $('#message').val());
       $('#message').val("");
       $("#message").focus();
       e.preventDefault();
     });
       
    $('#out').on('submit', function(e){
       socket.emit('out of room',$('#name').val());
       $('#chatLog').empty();
       //$("#message").focus();
       e.preventDefault();
     });
       
     $('#dele').on('submit', function(e){
       socket.emit('delete room',$('#name').val());
       $('#chatLog').empty();
       //$("#message").focus();
       e.preventDefault();
     });   
       
     socket.on('receive message', function(msg){
       $('#chatLog').append(msg+'\n');
       //alert(msg);
       $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
     });
     socket.on('change name', function(name){
       $('#name').val(name);
     });