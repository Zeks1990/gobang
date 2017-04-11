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
//声明游戏状态
const MATCH=1;
const AI=2;
var status=MATCH;

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
//声明赢法记录
var winsRecord=[];


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
	//console.log(chessStep);
}
//封装赢法统计数据算法
var winFun=function(i,j){
	//记录走过的棋子
	chessBoardRecord.push([i,j]);
	var arr=[];
	for(var k=0;k<count;k++){
		if(wins[i][j][k]){
			if(me){
				myWin[k]++;
				matchWin[k]+=9;
			}else{
				myWin[k]+=9;
				matchWin[k]++;
			}
			if(myWin[k]==5){
				setTimeout(function(){
					window.alert("黑棋胜！");
				},0);
				over=true;
				return;
			}else if(matchWin[k]==5){
				setTimeout(function(){
					window.alert("白棋胜！");
				},0);
				over=true;
				return;
			}
			arr.push(k);
		}
	}
	//console.log(arr);
	winsRecord.push(arr);
	//console.log(winsRecord);
}

chess.onclick=function(e){
	if(over){
		return;
	}
	var x=e.offsetX;
	var y=e.offsetY;
	//console.log(x+","+y);
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		if(me){
			chessBoard[i][j]=1;
		}else if(status==1){
			chessBoard[i][j]=2;
		}
		winFun(i,j);
		me=!me;
		if(!over&&status==2){
			computerAI();
		}
	}
}

var computerAI=function(){
	var myScore=[];
	var computerScore=[];
	var max=0;
	var u=0,v=0;
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=100;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=22000;
						}
						if( matchWin[k]==1){
							computerScore[i][j]+=110;
						}else if(matchWin[k]==2){
							computerScore[i][j]+=440;
						}else if(matchWin[k]==3){
							computerScore[i][j]+=2200;
						}else if(matchWin[k]==4){
							computerScore[i][j]+=23200;
						}
					}
				}
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				if(computerScore[i][j]>max){
					max=computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,me);
	chessBoard[u][v]=2;
	winFun(u,v);
	me=!me;
}

/***********自创*************/
//悔棋
var withdraw=document.getElementById('withdraw');
var withdrawFun=function(){
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
	me=!me;
	var withdrawWinsRecord=winsRecord.pop();
	console.log(withdrawWinsRecord);
	if(me){
		for(var i=0;i<withdrawWinsRecord.length;i++){
			myWin[withdrawWinsRecord[i]]--;
			matchWin[withdrawWinsRecord[i]]-=9;
		}
	}else{
		for(var i=0;i<withdrawWinsRecord.length;i++){
			myWin[withdrawWinsRecord[i]]-=9;
			matchWin[withdrawWinsRecord[i]]--;
		}
	}
}
withdraw.onclick=function(){
	if(chessStep>=1&&over==false){
		withdrawFun();
		if(status==2){
			withdrawFun();
		}
	}else{
		alert('无法悔棋了~');
	}
}
//模式切换
var changeMode=document.getElementById('changeMode');
changeMode.onclick=function(){
	if(chessStep==0){
		if(status==1){
			status=AI;
			document.getElementById('mode').innerHTML='人机对战';
		}else{
			status=1;
			document.getElementById('mode').innerHTML='玩家对战';
		}
	}else{
		alert('请重新开局或悔棋到最后再选择模式~');
	}
}
//重新开局
var restart=document.getElementById('restart');
restart.onclick=function(){
	//location.reload();

	for(var i=0; i<15;i++){
		chessBoard[i]=[];
		for(var j=0; j<15; j++){
			chessBoard[i][j]=0;
		}
	}
	context.clearRect(0,0,450,450);
	context.beginPath();
	context.closePath();
	drawChessBoard();
	me=true;
	chessBoardRecord=[];
	chessStep=0;
	over=false;
	for(var i=0;i<count;i++){
		myWin[i]=0;
		matchWin[i]=0;
	}
	winsRecord=[];
}
//电脑先下
var AIStart=document.getElementById('AIStart');
AIStart.onclick=function(){
	if(status==2){
		me=!me;
		oneStep(7,7,me);
		chessBoard[7][7]=2;
		winFun(7,7);
		me=!me;
	}else{
		alert('请重新开局或选择人机模式再点击~');
	}
}