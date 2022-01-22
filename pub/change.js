/**
 * 
 */

var cnn = new Array("./gimal/01/rain.png","./gimal/01/huse.png","./gimal/01/hune.png","./gimal/01/saka.png","./gimal/01/setu.png");//카운트를 셀 배열을 기존의 gallery1과 똑같이 세팅해줍니다.
var count=0;//리턴으로 전달할 count입니다.
var c;


onmessage=function get_id(event) {
	timedCount01();//쓰레드가 생성되면 처음에 여기서 부터 시작을 하는데요. timedCount01 함수를 실행시켜 줍니다.
}

function timedCount01() {
	roll_s();//count를 증가 시켜줍니다.
	postMessage(count);//메인 스크립트에 count를 반환합니다.
    setTimeout("timedCount01()", 20000);//20초 뒤에 다시 이 timedCount01를 실행시킵니다. 이로써 20초에 한번씩 이미지가 바뀌게 됩니다.
}
 
function roll_s(){//카운트를 증가 시켜 줍니다.
	if(count==cnn.length-1) count=0; //카운트를 늘리려는데 이미 최대 길이라면 0으로 만들어 줍니다.
	else count++;//카운트를 늘려 줍니다.
		
}


