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
		speed: 3,

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
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
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
	criarObjeto(tileSize*5,tileSize*5,32,30,3,3,gladiador,false)
	criarObjeto(tileSize*18,tileSize,32,30,1,2,chest, false)
	criarObjeto(tileSize*10,tileSize*20,32,30,1,2,chest, false)
	criarObjeto(tileSize*5,tileSize*3,32,30,1,2,chest, false)
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
			if (blockRectangle(player, staticChar)) {
				numeroObjeto = staticCharacters.indexOf(staticChar)
				if (staticChar.tipoQuestao == 2) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasOrganizacao.length)
					document.querySelector(".pergunta").innerHTML = `
						<span class="enunciado">${perguntas.PerguntasOrganizacao[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasOrganizacao[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasOrganizacao[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasOrganizacao[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasOrganizacao[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					correto = false
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasOrganizacao[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				} else if (staticChar.tipoQuestao == 3) {
					numeroQuestao = Math.floor(Math.random() * perguntas.PerguntasPlanejamento.length)
					document.querySelector(".pergunta").innerHTML = `
						<span class="enunciado">${perguntas.PerguntasPlanejamento[numeroQuestao]['Enunciado']}</span>
						<span class="respostas" id="respostaA"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasPlanejamento[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostas" id="respostaB"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasPlanejamento[numeroQuestao]['Opcoes']['B']}</span>
						<span class="respostas" id="respostaC"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasPlanejamento[numeroQuestao]['Opcoes']['C']}</span>
						<span class="respostas" id="respostaD"><img src="../img/arrows.png" class="setas_pergunta" />${perguntas.PerguntasPlanejamento[numeroQuestao]['Opcoes']['D']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
					correto = false
					document.querySelector("#respostaA").addEventListener("click", () => {
						correto = "A" == perguntas.PerguntasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaB").addEventListener("click", () => {
						correto = "B" == perguntas.PerguntasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaC").addEventListener("click", () => {
						correto = "C" == perguntas.PerguntasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
					document.querySelector("#respostaD").addEventListener("click", () => {
						correto = "D" == perguntas.PerguntasPlanejamento[numeroQuestao]['RespostaCorreta'] ? respostaCorreta(staticChar.tipoQuestao, staticChar.nivelQuestao, numeroQuestao, numeroObjeto) : respostaErrada(staticChar.tipoQuestao, staticChar.nivelQuestao)
					})
				}
			}
		}
	}
	
	function respostaErrada(tipoQuestao, nivelQuestao) {
		document.querySelector("#modalPopUpPergunta").style.visibility = 'hidden'
		document.querySelector("#modalErrou").style.visibility = 'visible'
		if (tipoQuestao == 2) {
			vida -= 1
			document.querySelector("#errosSpan").innerHTML = `1 de Vida`
		}
		verificaVida()
	}

	function respostaCorreta(tipoQuestao, nivelQuestao, questao, numeroObjeto) {
		document.querySelector("#modalPopUpPergunta").style.visibility = 'hidden'
		document.querySelector("#modalAcertou").style.visibility = 'visible'
		switch (tipoQuestao) {
			case 1:
				document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*5} de Vida`
				vida += (nivelQuestao*5)
			case 2:
				document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*5} de Dano`
				dano += (nivelQuestao*5)
			case 3:
				document.querySelector("#ganhosSpan").innerHTML = `${nivelQuestao*5} de Armadura`
				dano += (nivelQuestao*5)
		}  
		removerObjeto(numeroObjeto)
		removerQuestao(questao)
	}

	function removerQuestao(numeroQuestao) {
		perguntas.PerguntasOrganizacao.splice(numeroQuestao, 1)
	}

    //Ajuste de orientação
	function update(){
		if ((document.querySelector("#gameOver").style.visibility != 'visible') && (document.querySelector("#modalPopUpPergunta").style.visibility != 'visible') && (document.querySelector("#modalErrou").style.visibility != 'visible') && (document.querySelector("#modalAcertou").style.visibility != 'visible')) {
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
	
	function render(){
		ctx.clearRect(0,0,WIDTH,HEIGHT);
		ctx.save();
		ctx.translate(-cam.x,-cam.y);
		for(var row in maze){
			for(var column in maze[row]){
				var tile = maze[row][column];
				var x = column*tileSize;
				var y = row*tileSize;
				
				ctx.drawImage(
					img,
					tile * tileSrcSize,0,tileSrcSize,tileSrcSize,
					x,y,tileSize,tileSize
				);
				
			}
		}
		//desenho do personagem
		ctx.drawImage(
			img,
			player.srcX,player.srcY,player.width,player.height,
			player.x,player.y,player.width,player.height
		);
		for (var i in staticCharacters) {
			var staticChar = staticCharacters[i];
			ctx.drawImage(staticChar.img, staticChar.x, staticChar.y, staticChar.width, staticChar.height);
		}
		ctx.restore();
		ctx.drawImage(heartHUD, 2, 5, 24,24)
		ctx.font = "14px Ethno";
		ctx.fillStyle = "white";
		vidaHUD = ctx.fillText(vida, 25, 23)
		ctx.drawImage(shieldHUD, 2, 25, 24,24)
		armaduraHUD = ctx.fillText(armour, 25, 43)
		ctx.drawImage(swordHUD, 2, 50, 24,24)
		danoHUD = ctx.fillText(dano, 25, 66)
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
