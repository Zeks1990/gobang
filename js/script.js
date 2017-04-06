//定义棋盘规格以及记录棋子类型
var chessBoard=[];
for(var i=0; i<15;i++){
	chessBoard[i]=[];
	for(var j=0; j<15; j++){
		chessBoard[i][j]=0;
	}
}
//获取convas元素，定义线条颜色宽度
var chess=document.getElementById('chess');
var context=chess.getContext('2d');
context.strokeStyle="#000";
context.lineWidth=2;//解决1px宽度颜色变浅问题
//绘制底盘线
var drawChessBoard=function(){
	for(var i=0; i<15; i++){
		//横线
		context.moveTo(15+i*30,15);
		context.lineTo(15+i*30,435);
		//竖线
		context.moveTo(15,15+i*30);
		context.lineTo(435,15+i*30);
		context.stroke();
	}
}

window.onload=function(){
	drawChessBoard();
}

//声明是否轮到自己下棋
var me=true;
//声明棋盘记录以及步数
var chessBoardRecord=[];
var chessStep=0;
//声明是否结束游戏
var over=false;

//赢法数组
var wins=[];
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}
//赢法种类索引
var count=0;
//填充赢法数组
//横线判定
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//竖线判定
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//正斜线判定
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//反斜线判定
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}

//赢法统计数组
var myWin=[];
var matchWin=[];
//初始化赢法统计数组
for(var i=0;i<count;i++){
	myWin[i]=0;
	matchWin[i]=0;
}


var oneStep=function(i,j,me){
	//画棋子
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	if(me){
		gradient.addColorStop(0,"#0a0a0a");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#d1d1d1");
		gradient.addColorStop(1,"#f9f9f9");
	}
	context.fillStyle=gradient;
	context.fill();
	chessStep++;
	console.log(chessStep);
}

chess.onclick=function(e){
	if(over){
		return;
	}
	var x=e.offsetX;
	var y=e.offsetY;
	console.log(x+","+y);
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		if(me){
			chessBoard[i][j]=1;
		}else{
			chessBoard[i][j]=2;
		}
		me=!me;
		//记录走过的棋子
		chessBoardRecord.push([i,j]);
		console.log(i+","+j);
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				matchWin[k]=9;
				if(myWin[k]==5){
					setTimeout(function(){
						window.alert("你赢了！");
					},0);
					over=true;
				}
			}
		}
	}
}


/*自创*/
//悔棋
var withdraw=document.getElementById('withdraw');
withdraw.onclick=function(){
	if(chessStep>=2){
		for(var i=0;i<2;i++){
			var record=chessBoardRecord.pop();
			var recordX=record[0]*30+15;
			var recordY=record[1]*30+15;
			context.clearRect(recordX-15,recordY-15,30,30);
			context.beginPath();
			context.closePath();
			//横线
			context.moveTo(record[0]==0?recordX:recordX-15,recordY);
			context.lineTo(record[0]==14?recordX:recordX+15,recordY);
			//竖线
			context.moveTo(recordX,record[1]==0?recordY:recordY-15);
			context.lineTo(recordX,record[1]==14?recordY:recordY+15);
			context.stroke();
			chessBoard[record[0]][record[1]]=0;
			chessStep--;
		}
	}else{
		alert('无法悔棋了~');
	}
}