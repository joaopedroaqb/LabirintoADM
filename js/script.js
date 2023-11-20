(async function(){
	var cnv = document.querySelector("canvas");
	var ctx = cnv.getContext("2d");
	const res = await fetch("../package.json");
	const perguntas = await res.json();
	var WIDTH = cnv.width, HEIGHT = cnv.height;
	
	var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	var mvLeft = mvUp = mvRight = mvDown = false;
	
	var tileSize = 32;
	var tileSrcSize = 96;
	var vida = 10
	var armour = 10 
	var dano = 10
	var img = new Image();
		img.src = "img/img.png";
		img.addEventListener("load",function(){
			requestAnimationFrame(loop,cnv);
		},false);
	
	var walls = [];
	var heartHUD = new Image();
	heartHUD.src = "img/HeartFull.png";
	var shieldHUD = new Image();
	shieldHUD.src = "img/ShieldLargeT2.png";
	var swordHUD = new Image();
	swordHUD.src = "img/SwordT2.png";
	var player = {
		x: tileSize + 2,
		y: tileSize + 2,
		width: 24,
		height: 32,
		speed: 2,

		//atributos de animação
		srcX: 0,
		srcY: tileSrcSize,
		countAnim: 0
	};
	
	var maze = [
		//Mapa perguntas Faceis
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
		//Mapa perguntas media
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		//Mapa perguntas Dificil
		[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
		[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	];
	
	var T_WIDTH = maze[0].length * tileSize,
		T_HEIGHT = maze.length * tileSize;
	
	for(var row in maze){
		for(var column in maze[row]){
			var tile = maze[row][column];
			if(tile === 1){
				var wall = {
					x: tileSize*column,
					y: tileSize*row,
					width: tileSize,
					height: tileSize
				};
				walls.push(wall);
			}
		}
	}
	// Objetos
	var staticCharacters = [];
	var gladiador = new Image();
	gladiador.src = "img/enemy_glad.png";
	var chest = new Image();
	chest.src = "img/chest_closed.png";
	var elfo = new Image();
	elfo.src = "img/elfo.png";
	var mago = new Image();
	mago.src = "img/mago.png";
	var machadeiro = new Image();
	machadeiro.src = "img/machadeiro.png";
	var boss = new Image();
	boss.src = "img/boss.png";
	// Elfo - Planejamento - 1
	// Gladiador - Organização - 2
	// Mago - Controle - 3
	// Baú - Controle - 4
	// Machadeiro - Áreas Funcionais - 5
	criarObjeto(tileSize*18,tileSize*57,64,64,1,6,boss, false)
	criarObjeto(tileSize*5,tileSize*3,32,32,1,1,elfo, false)
	criarObjeto(tileSize*5,tileSize*25,32,32,1,1,elfo, false)
	criarObjeto(tileSize*5,tileSize*46,32,32,1,1,elfo, false)
	criarObjeto(tileSize*5,tileSize*52,32,32,1,1,elfo, false)
	criarObjeto(tileSize*14,tileSize*3,32,32,1,2,gladiador, false)
	criarObjeto(tileSize*15,tileSize*14,32,32,2,2,gladiador,false)
	criarObjeto(tileSize*9,tileSize*21,32,32,3,2,gladiador, false)
	criarObjeto(tileSize*3,tileSize*22,32,32,3,2,gladiador, false)
	criarObjeto(tileSize*15,tileSize*34,32,32,1,2,gladiador, false)
	criarObjeto(tileSize*1,tileSize*49,32,32,1,2,gladiador, false)
	criarObjeto(tileSize*14,tileSize*44,32,32,1,2,gladiador, false)
	criarObjeto(tileSize*15,tileSize*55,32,32,1,2,gladiador, false)
	criarObjeto(tileSize*7,tileSize*3,32,32,2,3,mago, false)
	criarObjeto(tileSize*14,tileSize*8,32,32,2,3,mago, false)
	criarObjeto(tileSize*6,tileSize*38,32,32,2,3,mago, false)
	criarObjeto(tileSize*10,tileSize*10,32,32,1,3,mago, false)
	criarObjeto(tileSize*14,tileSize*23,32,32,3,3,mago, false)
	criarObjeto(tileSize*1,tileSize*28,32,32,2,3,mago, false)
	criarObjeto(tileSize*14,tileSize*28,32,32,2,3,mago, false)
	criarObjeto(tileSize*7,tileSize*44,32,32,2,3,mago, false)
	criarObjeto(tileSize*14,tileSize*49,32,32,2,3,mago, false)
	criarObjeto(tileSize*10,tileSize*51,32,32,2,3,mago, false)
	criarObjeto(tileSize*18,tileSize,32,32,3,4,chest, false)
	criarObjeto(tileSize*18,tileSize*11,32,32,2,4,chest, false)
	criarObjeto(tileSize*10,tileSize*22,32,32,3,4,chest, false)
	criarObjeto(tileSize*5,tileSize*23,32,32,3,4,chest, false)
	criarObjeto(tileSize*18,tileSize*31,32,32,3,4,chest, false)
	criarObjeto(tileSize*18,tileSize*42,32,32,3,4,chest, false)
	criarObjeto(tileSize*5,tileSize*48,32,32,3,4,chest, false)
	criarObjeto(tileSize*15,tileSize*52,32,32,2,4,chest, false)
	criarObjeto(tileSize*5,tileSize*5,32,32,3,5,machadeiro,false)
	criarObjeto(tileSize,tileSize*18,32,32,3,5,machadeiro,false)
	criarObjeto(tileSize*13,tileSize*31,32,32,3,5,machadeiro,false)
	criarObjeto(tileSize*15,tileSize*42,32,32,3,5,machadeiro,false)
	criarObjeto(tileSize*1,tileSize*59,32,32,3,4,machadeiro, false)
	var cam = {
		x: 0,
		y: 0,
		width: WIDTH,
		height: HEIGHT,
		innerLeftBoundary: function(){
			return this.x + (this.width*0.25);
		},
		innerTopBoundary: function(){
			return this.y + (this.height*0.25);
		},
		innerRightBoundary: function(){
			return this.x + (this.width*0.75);
		},
		innerBottomBoundary: function(){
			return this.y + (this.height*0.75);
		}
	};
	
	
	function criarObjeto(xObject, yObject, widthObject, heightObject, nivelQuestaoObject, tipoQuestaoObject, imgObject, feitoObjeto) {
		objeto = {
			x: xObject,
			y: yObject,
			width: widthObject,
			height: heightObject,
			nivelQuestao: nivelQuestaoObject,
			tipoQuestao: tipoQuestaoObject,
			feito: feitoObjeto,
			img: imgObject
		}
		staticCharacters.push(objeto);
	}
	function removerObjeto(numeroObjeto) {
		staticCharacters.splice(numeroObjeto, 1)
	}

	function blockRectangle(objA, objB) {
		var distX = (objA.x + objA.width / 2) - (objB.x + objB.width / 2);
		var distY = (objA.y + objA.height / 2) - (objB.y + objB.height / 2);
	
		var sumWidth = (objA.width + objB.width) / 2;
		var sumHeight = (objA.height + objB.height) / 2;
	
		if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {
			var overlapX = sumWidth - Math.abs(distX);
			var overlapY = sumHeight - Math.abs(distY);
	
			if (overlapX > overlapY) {
				objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
			} else {
				objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
			}
	
			return true; // Colisão ocorreu
		}
	
		return false; // Sem colisão
	}
	
	
	window.addEventListener("keydown",keydownHandler,false);
	window.addEventListener("keyup",keyupHandler,false);
	
	function keydownHandler(e){
		var key = e.keyCode;
		switch(key){
			case LEFT:
				mvLeft = true;
				break;
			case UP:
				mvUp = true;
				break;
			case RIGHT:
				mvRight = true;
				break;
			case DOWN:
				mvDown = true;
				break;
		}
	}
	
	function keyupHandler(e){
		var key = e.keyCode;
		switch(key){
			case LEFT:
				mvLeft = false;
				break;
			case UP:
				mvUp = false;
				break;
			case RIGHT:
				mvRight = false;
				break;
			case DOWN:
				mvDown = false;
				break;
		}
	}
	function updateStaticCharacters() {
		for (var i = 0; i < staticCharacters.length; i++) {
			var staticChar = staticCharacters[i];
			var correto = false
			if (blockRectangle(player, staticChar)) {
				console.log(staticChar)
				numeroObjeto = staticCharacters.indexOf(staticChar)
				if (staticChar.nivelQuestao == 1 && staticChar.tipoQuestao == 1) {						
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasFaceisPlanejamento.length)
					document.querySelector(".pergunta").innerHTML = `
						<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasFaceisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 2 && staticChar.tipoQuestao == 1) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasMediasPlanejamento.length)
					document.querySelector(".pergunta").innerHTML = `
						<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasMediasPlanejamento[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasPlanejamento[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasPlanejamento[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasPlanejamento[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasPlanejamento[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasMediasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasMediasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasMediasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasMediasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 3 && staticChar.tipoQuestao == 1) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasDificeisPlanejamento.length)
					console.log(staticChar.nivelQuestao)
					document.querySelector(".pergunta").innerHTML = `
						<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasDificeisPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 1 && staticChar.tipoQuestao == 2) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasFaceisOrganizacao.length)
					document.querySelector(".pergunta").innerHTML = `
					<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasFaceisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 2 && staticChar.tipoQuestao == 2) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasMediasOrganizacao.length)
					document.querySelector(".pergunta").innerHTML = `
						<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasMediasOrganizacao[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasOrganizacao[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasOrganizacao[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasOrganizacao[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasOrganizacao[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasMediasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasMediasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasMediasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasMediasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 3 && staticChar.tipoQuestao == 2) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasDificeisOrganizacao.length)
					document.querySelector(".pergunta").innerHTML = `
						<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasDificeisOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 1 && staticChar.tipoQuestao == 3) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasFaceisLideranca.length)
					document.querySelector(".pergunta").innerHTML = `
						<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasFaceisLideranca[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisLideranca[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisLideranca[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisLideranca[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisLideranca[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasFaceisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasFaceisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasFaceisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasFaceisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 2 && staticChar.tipoQuestao == 3) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasMediaLideranca.length)
					document.querySelector(".pergunta").innerHTML = `
					<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasMediaLideranca[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediaLideranca[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediaLideranca[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediaLideranca[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediaLideranca[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasMediaLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasMediaLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasMediaLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasMediaLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 3 && staticChar.tipoQuestao == 3) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasDificeisLideranca.length)
					document.querySelector(".pergunta").innerHTML = `
					<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasDificeisLideranca[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisLideranca[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisLideranca[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisLideranca[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisLideranca[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasDificeisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasDificeisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasDificeisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasDificeisLideranca[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 1 && staticChar.tipoQuestao == 4) {
						numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasFaceisControle.length)
						document.querySelector(".pergunta").innerHTML = `
							<span class="enunciado">${perguntas.PerguntasFaceisControle[numeroQuestao]['Enunciado']}</span>
							<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisControle[numeroQuestao]['Opcoes']['A']}</span>
							<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisControle[numeroQuestao]['Opcoes']['B']}</span>
							<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisControle[numeroQuestao]['Opcoes']['C']}</span>
							<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisControle[numeroQuestao]['Opcoes']['D']}</span>
						`
						document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
						document.querySelector("#respostaA").addEventListener("click", () => {
							correto = "A" == perguntas.PerguntasFaceisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
						document.querySelector("#respostaB").addEventListener("click", () => {
							correto = "B" == perguntas.PerguntasFaceisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
						document.querySelector("#respostaC").addEventListener("click", () => {
							correto = "C" == perguntas.PerguntasFaceisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
						document.querySelector("#respostaD").addEventListener("click", () => {
							correto = "D" == perguntas.PerguntasFaceisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
				} else if (staticChar.nivelQuestao == 2 && staticChar.tipoQuestao == 4) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasMediasControle.length)
					document.querySelector(".pergunta").innerHTML = `
						<span class="enunciado">${perguntas.PerguntasMediasControle[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasControle[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasControle[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasControle[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasControle[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasMediasControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasMediasControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasMediasControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasMediasControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 3 && staticChar.tipoQuestao == 4) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasDificeisControle.length)
					document.querySelector(".pergunta").innerHTML = `
						<span class="enunciado">${perguntas.PerguntasDificeisControle[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisControle[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisControle[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisControle[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisControle[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasDificeisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasDificeisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasDificeisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasDificeisControle[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 1 && staticChar.tipoQuestao == 5) {
						numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasFaceisAreasFunc.length)
						document.querySelector(".pergunta").innerHTML = `
							<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
							<span class="enunciado">${perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['Enunciado']}</span>
							<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['Opcoes']['A']}</span>
							<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['Opcoes']['B']}</span>
							<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['Opcoes']['C']}</span>
							<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['Opcoes']['D']}</span>
						`
						document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
						document.querySelector("#respostaA").addEventListener("click", () => {
							correto = "A" == perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
						document.querySelector("#respostaB").addEventListener("click", () => {
							correto = "B" == perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
						document.querySelector("#respostaC").addEventListener("click", () => {
							correto = "C" == perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
						document.querySelector("#respostaD").addEventListener("click", () => {
							correto = "D" == perguntas.PerguntasFaceisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
						})
				} else if (staticChar.nivelQuestao == 2 && staticChar.tipoQuestao == 5) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasMediasAreasFunc.length)
					document.querySelector(".pergunta").innerHTML = `
					<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasMediasAreasFunc[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasAreasFunc[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasAreasFunc[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasAreasFunc[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasMediasAreasFunc[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasMediasAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasMediasAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasMediasAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasMediasAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.nivelQuestao == 3 && staticChar.tipoQuestao == 5) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasDificeisAreasFunc.length)
					document.querySelector(".pergunta").innerHTML = `
						<img src="${staticChar.img.currentSrc}" class="personagemPergunta"/>
						<span class="enunciado">${perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasDificeisAreasFunc[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticCharacters[numeroObjeto].tipoQuestao, staticCharacters[numeroObjeto].nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.tipoQuestao == 6) {
					if (vida >= 30 && armour >= 20 && dano >= 30) {
						document.querySelector("#winScreen").style.visibility = 'visible'
					} else {
						document.querySelector("#voltarDepois").style.visibility = 'visible'
					}
				}
			}
		}
	}
	
	function respostaErrada(tipoQuestao, nivelQuestao) {
		document.querySelector("#modalPopUpPergunta").style.visibility = 'hidden'
		document.querySelector("#modalErrou").style.visibility = 'visible'
		document.querySelector("#errosSpan").innerHTML = `1 de Vida`
		vida -= 1
		if (tipoQuestao === 1) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Vida`
			vida -= 1
		} else if (tipoQuestao === 2) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Dano`
			armour -= 1
		} else if (tipoQuestao === 3) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Armadura`
			armour -= 1
		} else if (tipoQuestao === 4) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Vida`
			vida -= 1
		} else if (tipoQuestao === 5) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Dano`
			armour -= 1
		}
		verificaVida()
	}

	function respostaCorreta(tipoQuestao, nivelQuestao, questao, numeroObjeto) {
		document.querySelector("#modalPopUpPergunta").style.visibility = 'hidden'
		document.querySelector("#modalAcertou").style.visibility = 'visible'
		if (tipoQuestao === 1) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Vida`
			vida += (nivelQuestao*3)
		} else if (tipoQuestao === 2) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Dano`
			dano += (nivelQuestao*3)
		} else if (tipoQuestao === 3) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Armadura`
			armour += (nivelQuestao*3)
		} else if (tipoQuestao === 4) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Vida`
			vida += (nivelQuestao*2)
		} else if (tipoQuestao === 5) {
			document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*3} de Dano`
			dano += (nivelQuestao*4)
		}
		removerObjeto(numeroObjeto)
		removerQuestao(questao)
	}

	function removerQuestao(numeroQuestao, tipoQuestao) {
		if (tipoQuestao == 1) {
			perguntas.PerguntasOrganizacao.splice(numeroQuestao, 1)
		}
	}

    //Ajuste de orientação
	function update(){
		if ((document.querySelector("#voltarDepois").style.visibility != 'visible') && (document.querySelector("#winScreen").style.opacity != 'visible') && (document.querySelector("#gameOver").style.visibility != 'visible') && (document.querySelector("#modalPopUpPergunta").style.visibility != 'visible') && (document.querySelector("#modalErrou").style.visibility != 'visible') && (document.querySelector("#modalAcertou").style.visibility != 'visible')) {
			if(mvLeft && !mvRight){
				player.x -= player.speed;
				player.srcY = tileSrcSize + player.height * 2;
			} else 
			if(mvRight && !mvLeft){
				player.x += player.speed;
				player.srcY = tileSrcSize + player.height * 3;
			}
			if(mvUp && !mvDown){
				player.y -= player.speed;
				player.srcY = tileSrcSize + player.height * 1;
			} else 
			if(mvDown && !mvUp){
				player.y += player.speed;
				player.srcY = tileSrcSize + player.height * 0;
			}
			
			//animação
			if(mvLeft || mvRight || mvUp || mvDown){
				player.countAnim++;
				
				if(player.countAnim >= 40){
					player.countAnim = 0;
				}
				
				player.srcX = Math.floor(player.countAnim/5) * player.width;
			} else {
				player.srcX = 0;
				player.countAnim = 0;
			}
			
			for(var i in walls){
				var wall = walls[i];
				blockRectangle(player,wall);
			}
			
			if(player.x < cam.innerLeftBoundary()){
				cam.x = player.x - (cam.width * 0.25);
			}
			if(player.y < cam.innerTopBoundary()){
				cam.y = player.y - (cam.height * 0.25);
			}
			if(player.x + player.width > cam.innerRightBoundary()){
				cam.x = player.x + player.width - (cam.width * 0.75);
			}
			if(player.y + player.height > cam.innerBottomBoundary()){
				cam.y = player.y + player.height - (cam.height * 0.75);
			}
			cam.x = Math.max(0,Math.min(T_WIDTH - cam.width,cam.x));
			cam.y = Math.max(0,Math.min(T_HEIGHT - cam.height,cam.y));
			updateStaticCharacters();
		}
	}

	function render() {
		// Limpa o canvas
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
		// Aplica a tradução para seguir o jogador
		ctx.translate(-cam.x, -cam.y);
	
		
	
		// Desenha o campo de visão circular ao redor do jogador
		ctx.save();
		ctx.beginPath();
		ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 50, 0, 2 * Math.PI);
		ctx.clip();
		ctx.closePath();
		// Desenha o labirinto
		for (var row in maze) {
			for (var column in maze[row]) {
				var tile = maze[row][column];
				var x = column * tileSize;
				var y = row * tileSize;

				ctx.drawImage(
					img,
					tile * tileSrcSize, 0, tileSrcSize, tileSrcSize,
					x, y, tileSize, tileSize
				);
			}
		}
		// Desenha os personagens apenas se estiverem dentro do campo de visão circular
		for (var i in staticCharacters) {
			var staticChar = staticCharacters[i];
			var centerX = player.x + player.width / 2;
			var centerY = player.y + player.height / 2;
			var distance = Math.sqrt(Math.pow(centerX - (staticChar.x + staticChar.width / 2), 2) + Math.pow(centerY - (staticChar.y + staticChar.height / 2), 2));
	
			if (distance < 50) { // Ajuste o raio conforme necessário
				ctx.drawImage(staticChar.img, staticChar.x, staticChar.y, staticChar.width, staticChar.height);
			}
		}
	
		ctx.restore();
	
		ctx.drawImage(
			img,
			player.srcX, player.srcY, player.width, player.height,
			player.x, player.y, player.width, player.height
		);
	
		// Reseta a tradução para evitar efeitos indesejados
		ctx.translate(cam.x, cam.y);
		
		// Desenha o HUD
		ctx.drawImage(heartHUD, 2, 5, 24, 24);
		ctx.font = "14px Ethno";
		ctx.fillStyle = "white";
		vidaHUD = ctx.fillText(vida, 25, 23);
		ctx.drawImage(shieldHUD, 2, 25, 24, 24);
		armaduraHUD = ctx.fillText(armour, 25, 43);
		ctx.drawImage(swordHUD, 2, 50, 24, 24);
		danoHUD = ctx.fillText(dano, 25, 66);
	}
	
	function verificaVida() {
		if(vida <= 0) {
			document.querySelector("#gameOver").style.visibility = 'visible'
		}
	}

	function loop(){
		update();
		render();
		requestAnimationFrame(loop,cnv);
	}
}());

function fecharModal() {
	document.querySelector("#modalPopUpPergunta").style.visibility = 'hidden'
}
function fecharModalErrou() {
	document.querySelector("#modalErrou").style.visibility = 'hidden'
}
function fecharModalAcertou() {
	document.querySelector("#modalAcertou").style.visibility = 'hidden'
}
function fecharModalVoltarDepois() {
	document.querySelector("#voltarDepois").style.visibility = 'hidden'
}
