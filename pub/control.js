/**
 * 
 */

	var im = new Array("./gimal/01/rain.png","./gimal/01/huse.png","./gimal/01/hune.png","./gimal/01/saka.png","./gimal/01/setu.png");  //갤러리 1에 담을 사진
	var ka = new Array("./gimal/02/blan.png","./gimal/02/shabon.jpg","./gimal/02/tape.png","./gimal/02/usa.png","./gimal/02/yuu.png");	//갤러리 2에 담을 사진
	var shi = new Array("./gimal/03/big.png","./gimal/03/godo.png","./gimal/03/jump.jpg","./gimal/03/nemu.png","./gimal/03/yor.png");	//갤러리 3에 담을 사진	
	var pt = new Array("./gimal/04/hi.jpg","./gimal/04/michi.png","./gimal/04/siyo.png","./gimal/04/vene.jpg","./gimal/04/ziten.png");//갤러리 4에 담을 사진
	var music = new Array("./gimal/audio/shape.mp3","./gimal/audio/far.mp3","./gimal/audio/cstar.mp3","./gimal/audio/reason.mp3");//오디오에 담을 MP3들	
	var il=new Array("ll","dd");//월 페이퍼를 만들 때 사용하는 메인 버퍼.
	var index=0;//오디오 영역에서 사용하는 인덱스입니다.
	var count=0;
	var rem="da1";//현재 right영역에 나타나는 내용이 무엇인지를 저장하고 있습니다.
	var crem="g1";
	var cname="ska";
	var judge=1;//오디오의 플레이상태
	var sc;//right의 width값을 계산할 때 사용을 합니다.
	var v;//worker를 새롭게 탄생시킬때 탄생된 worker를 외부에서 사용하기위해 필요한 변수 입니다.
	var jh=1;
	var ind="indra01";//현재 불이 들어와진 책깔피가 무엇인지 저장을 하는 용도로 사용하는 변수.
	var i_p="ip01";//가족영역에서 turn on된 책깔피를 저장합니다.
	var i_f="if01";//친구 영역에서 turn on된 책깔피를 저장합니다.
	var i_c="ic01";//계획 영역에서 turn on된 책깔피를 저장합니다.
	
$(function(){
	sc=window.innerWidth-$("#left").width();//오른쪽영역의 width = 전체 width - 왼쪽의 width
	$("#right").css("width",sc);
	$("#right").css("margin-left",window.innerWidth * 0.2+ "px");//오른쪽 영역의 마진 레프트 값 설정
	$("#ff").css("margin-left",$("#right").width()-465+ "px"); // 오디오 영역의 margin-left값을 설정하는 변수 입니다.
	
	$(".logo").css("top",window.innerHeight/6); //현재 short버전의 메뉴에서 원안의 캐릭터의 height값을 위한 설정입니다.
	$(".logo").css("left",$("#left").width()/5.2);//현재 short버전의 메뉴에서 원안의 캐릭터의 위치 설정입니다.
	
	$(".sca").on("click",function(event){ //각 메뉴에서의 open버튼과 close버튼에 대한 설정을 담당합니다.
		if($("#left").width()<=window.innerWidth * 0.4){ //short버전 메뉴에서 long 버전 메누가 되겠끔 처리합니다.
			open_m(); //long버전을 열어줍니다.
		}
		else if($("#left").width()>=window.innerWidth * 0.4){//long버전 메뉴에서 short 버전 메누가 되겠끔 처리합니다.
			
			clo_m(); //short 버전 메뉴를 열어줍니다.
			 
		}
	});
    
	$(".sa").on({//오디오 영역에서 prev버튼에 대한 처리입니다.
		
		"click":function(event){
		prev();//index의 값을 조정합니다.
		$("#jk source").attr("src",music[index]);//현재 조정된 인덱스를 통해서 곡을 다시 설정합니다.
		$("#jk")[0].load();//다시 음악을 재생 시킵니다.
		$("#jk")[0].play();
		if(judge==0){//정지해 놓은 상태로 다음 곡으로 이동하려고 하면 다시 플레이 상태로 바꾼채로 다음 곡으로 이동하게 처리합니다.
			judge=1; //judge는 현재 해당 곡의 상태가 play인가 stop인가를 판가를 하는 변수입니다. 0이 정지 상태입니다.
			$(".sc").html("stop");
		}
		}
	});
	$(".sb").on({
		
		"click":function(event){//next버튼의 기능입니다.
		next();//index의 값을 조정합니다.
		$("#jk source").attr("src",music[index]);
		$("#jk")[0].load();
		$("#jk")[0].play();
		if(judge==0){
			judge=1;
			$(".sc").html("stop");
		}
		}
	
	});
	
	$(".sc").on({//stop과 play버튼에 대한 기능입니다.
		"click":function(event){
		if(judge==1){//play상태일때 이를 다시 stop상태로 만듭니다. 
			$("#jk")[0].pause();
			judge=0;//상태를 정지상태를 나타내겠끔 조정합니다.
			$(".sc").html("play");//다음에 행할일은 play이므로 버튼의 텍스트 값을 변경해줍니다.
		}
		else { //stop버튼의 기능입니다.
				$("#jk")[0].play();
				judge=1;
				$(".sc").html("stop");//다음에 행할일은 stop이므로 버튼의 텍스트 값을 변경해줍니다.
			}
		}
	});
	$("#kaori").on("click",function(event){//gallery 버튼을 클릭했을 때의 이벤트 처리입니다.
		stopWorker();//기존에 돌아가던 쓰레드를 정지 시켜 줍니다.그리고 그 쓰레드를 지웁니다.
		il=ka;//메인 이미지 배열에 새롭게 들어갈 이미지 배열을 메인 배열에 넣어줍니다.
		ch_im(jh);//새롭게 쓰레드를 만들어 줍니다.
		jh=jh+1+"";//jh라는 변수는 일을 하는 스크립트에게 전달하는 메시지 담당인데 쓰레드를 만들 때 메시지 내용이 같으면 안되기에 값을 이렇게 변경해줍니다.
		
	});
	$("#jaha").on("click",function(event){//gallery에 대한 부분은 여기서 마치겠습니다.
		stopWorker();
		il=im;
		ch_im(jh);
		jh=jh+1+"";
		
	});
	$("#pi03").on("click",function(event){
		stopWorker();
		il=shi;
		ch_im(jh);
		jh=jh+1+"";
		
	});
	$("#pi04").on("click",function(event){
		stopWorker();
		il=pt;
		ch_im(jh);
		jh=jh+1+"";
		
	});
    $("#toka").on("click",function(event){
		alert("gma");
	});
	
	/*
	$("#ip01").on("click",function(event){//책깔피에 클릭 이벤트가 일어났을 때의 이벤트 처리를 위한 부분입니다.
		if(i_p=="ip01") return; //이미 turn on된 책깔피를 한번더 클릭한 경우에는 그냥 리턴시켜줍니다.
		$("#"+i_p).attr("src",par[1]);//이전에 turn on된 책깔피를 turn off된 책깔피의 이미지로 바꾸어 줍니다.
		i_p="ip01";// turn on된 이미지가 가족영역에서 어느 책깔피인지 저장합니다.
		$("#"+i_p).attr("src",pao[0]);//새롭게 turn on 된 책깔피의 이미지를 off에서 on 된 이미지로 변경해 줍니다.
		$("#"+rem).css("display","none");//선택된 책깔피의 내용을 보이기 위해서 기존의 책깔피의 내용을 안보이게 해줍니다.
		rem="da2";//현재 right에서 보이는 내용이 무엇인지 새로 저장을 해줍니다.
		$("#da2").css("display","block");//새롭게 선택된 내용을 보여 줍니다.
	});
	$("#ip02").on("click",function(event){
		if(i_p=="ip02") return;
		$("#"+i_p).attr("src",par[0]);
		i_p="ip02";
		$("#"+i_p).attr("src",pao[1]);
		$("#"+rem).css("display","none");
		rem="da3"
		$("#da3").css("display","block");
	});
	$("#if01").on("click",function(event){
		if(i_f=="if01") return;
		$("#"+i_f).attr("src",fr[1]);
		i_f="if01";
		$("#"+i_f).attr("src",fro[0]);
		$("#"+rem).css("display","none");
		rem="da4"
		$("#da4").css("display","block");
	});
	$("#if02").on("click",function(event){
		if(i_f=="if02") return;
		$("#"+i_f).attr("src",fr[0]);
		i_f="if02";
		$("#"+i_f).attr("src",fro[1]);
		$("#"+rem).css("display","none");
		rem="da5"
		$("#da5").css("display","block");
		$('.bxslider').bxSlider(); 
	});
	
	$("#ic01").on("click",function(event){
		if(i_c=="ic01") return;//이미 turn on된 책깔피를 한번더 클릭한 경우에는 그냥 리턴시켜줍니다.
		if(i_c=="ic02"){//선택된 책깔피가 중기일 경우
			$("#"+i_c).attr("src",cal[1]);
			i_c="ic01";
			$("#"+i_c).attr("src",cao[0]);
		}else{//선택된 책깔피가 장기일 경우
			$("#"+i_c).attr("src",cal[2]);
			i_c="ic01";
			$("#"+i_c).attr("src",cao[0]);
		}//위에서 책깔피에 대한 처리를 해주고 아래의 부분은 right영역에서 보일 내용을 바꾸어 줍니다. 
		$("#"+rem).css("display","none");
		rem="da7"
		$("#da7").css("display","block");
	});
	$("#ic02").on("click",function(event){
		if(i_c=="ic02") return;
		if(i_c=="ic01"){
			$("#"+i_c).attr("src",cal[0]);
			i_c="ic02";
			$("#"+i_c).attr("src",cao[1]);
		}else{
			$("#"+i_c).attr("src",cal[2]);
			i_c="ic02";
			$("#"+i_c).attr("src",cao[1]);
		}
		$("#"+rem).css("display","none");
		rem="da8"
		$("#da8").css("display","block");
	});
	$("#ic03").on("click",function(event){
		if(i_c=="ic03") return;
		if(i_c=="ic01"){
			$("#"+i_c).attr("src",cal[0]);
			i_c="ic03";
			$("#"+i_c).attr("src",cao[2]);
		}else{
			$("#"+i_c).attr("src",cal[1]);
			i_c="ic03";
			$("#"+i_c).attr("src",cao[2]);
		}
		$("#"+rem).css("display","none");
		rem="da9"
		$("#da9").css("display","block");
	});
	
	$(".rao").on({//책깔피에 마우스가 오버되었을 때와 아웃되었을 때에 대한 이벤트 처리입니다.
		"mouseenter":function(event){$(event.target).css("height","70%");},
		"mouseleave":function(event){$(event.target).css("height","54%");}
	});*/
	$("#current").html("Currnet : "+"<span style='padding:2px; color:#fafad2; font-size:95%; font-weight:bold;'>"+"<"+"메인"+">"+"</span>");
	//처음에 홈페이지를 방문했을 때는 보이는 항목이 main이기에 current에  main을 써줍니다.
	il=im;//이미지 메인 배열에 처음을 gallery1으로 지정해줍니다.
	ch_im("aa");//처음의 쓰레드가 돌아가도록 시작합니다.
	
});
function ch_im(hg){//쓰레드를 만드는 함수입니다.
	var w=new Worker("./change.js");//일을 해양할 스크립트와 연동해서 worker를 만들어 줍니다.
	v=w;//만든 쓰레드를 v에 넘겨줍니다.
	w.postMessage(hg);//매개변수로 받은 문자열을 worker에 전달 합니다.
	
	w.onmessage=function(event){//일을 하는 쓰레드로부터 20초마다 메인 이미지 배열에서 보여 줘야할 인덱스를 받아옵니다.
		$(".ska").attr("src",il[event.data]);//받은 인덱스를 통해서 20초마다 이미지를 바꾸어 줍니다.
	}
}

function stopWorker() {//쓰레드가 하는 일을 그만두게 하고 그 쓰레드를 제거 합니다.
    v.terminate();
    v = undefined;
}

function prev(){ //오디오 영역의 prev버튼에 대한 처리 입니다.
	if(index==0) index=music.length-1; //인덱스가 0인데도 앞으로 가려고 하면 그 값을 제일 끝에 위치하는 음악의 인덱스로 바꾸어 줍니다.
	else index--;//위의 조건문에 걸리지 않으면 그저 인덱스를 감소시켜 줍니다.
	}
function next(){ 
	if(index==(music.length-1)) index=0;//인덱스가 최대인데도 뒤로 가려고 하면 그 값을 0에 위치하는 음악의 인덱스로 바꾸어 줍니다.
	else index++;//위의 조건문에 걸리지 않으면 그저 인덱스를 증가시켜 줍니다.
	}
function get_time(){
	
	var clock = document.getElementById("time");            // 출력할 장소 선택
    var currentDate = new Date();                                     // 현재시간
    var calendar = currentDate.getFullYear() + "-" + addZeros((currentDate.getMonth()+1),2) + "-" + addZeros(currentDate.getDate(),2);//몇년, 몇월, 몇일 인지를 나타 내겠끔 작업합니다.
    var amPm = 'AM'; // 초기값 AM
    var currentHours = addZeros(currentDate.getHours(),2);//값을 2자리로 마추어 주는 일을 하는 것입니다. 
    var currentMinute = addZeros(currentDate.getMinutes() ,2);
    var currentSeconds =  addZeros(currentDate.getSeconds(),2);
    if(currentHours >= 12){ // 시간이 12보다 클 때 PM으로 세팅, 12를 빼줌
    	amPm = 'PM';
    	currentHours = addZeros(currentHours - 12,2);//pm, am을 맞추는 작업을 합니다.
    }

    if(currentSeconds >= 50){// 50초 이상일 때 색을 변환해 준다.
       currentSeconds = '<span style="color:#de1951;">'+currentSeconds+'</span>'
    }
    clock.innerHTML = calendar+"&nbsp"+"&nbsp"+currentHours+":"+currentMinute+":"+currentSeconds +" <span style='font-size:0.8em;'>"+ amPm+"</span>"; //날짜를 출력해 줌
    //이를 long버전 메뉴의 clo라는 아이디를 가진 태그에 써줍니다.
	setTimeout("get_time()", 1000);//1초에 한번 갱신 해 줍니다.
}


function addZeros(num, digit) { // 자릿수 맞춰주기
	  var zero = '';
	  num = num.toString();
	  if (num.length < digit) {
	    for (i = 0; i < digit - num.length; i++) {
	      zero += '0';
	    }
	  }
	  return zero + num;
}

function open_m(){//short버전 메뉴를 닫고, long버전 메뉴를 열어 줍니다.
	$("#left").css("width","62%");//left의 width를 62%로 증가 시켜 줍니다.
	$("#clo").css("margin-left",$("#left").width()-$(".sca").width()*1.20);//long에서의 시간이 보이는 태그의 마진 값을 조정해 줍니다.
	$(".mm").css("margin-left",$("#left").width()*0.05);//각 항목의 마진 값을 조정해 줍니다.
	$("#short").css("display","none");//short버전이 안보이게 하고,
	$("#long").css("display","block");	//long버전의 내용을 보이게 해줍니다.
}

function clo_m(){//long 버전 메뉴를 닫고, short버전 메뉴를 열어줍니다.
	$("#left").css("width","21.5%");//left의 width를 21.5%로 감소 시켜 줍니다.
	$("#long").css("display","none");//long버전의 내용을 안 보이게 해줍니다.
	$("#short").css("display","block");//short버전이 보이게 해줍니다.
}
