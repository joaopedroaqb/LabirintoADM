(async function(){
	var cnv = document.querySelector("canvas");
	var ctx = cnv.getContext("2d");
	const res = await fetch("../package.json");
	const perguntas = await res.json();
	console.log(perguntas)
	var WIDTH = cnv.width, HEIGHT = cnv.height;
	
	var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	var mvLeft = mvUp = mvRight = mvDown = false;
	
	var tileSize = 32;
	var tileSrcSize = 96;
	var vida = 10
	var armour = 10 
	var dano = 2
	var img = new Image();
		img.src = "img/img.png";
		img.addEventListener("load",function(){
			requestAnimationFrame(loop,cnv);
		},false);
	
	var walls = [];
	var heartHUD = new Image();
	heartHUD.src = "img/heart.png";
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
	criarObjeto(tileSize*5,tileSize*5,32,30,3,3,gladiador)
	criarObjeto(tileSize*18,tileSize,32,30,1,1,chest)
	criarObjeto(tileSize*10,tileSize*20,32,30,1,2,chest)
	criarObjeto(tileSize*5,tileSize*3,32,30,1,2,chest)
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
	
	
	function criarObjeto(xObject, yObject, widthObject, heightObject, nivelQuestaoObject, tipoQuestaoObject, imgObject) {
		objeto = {
			x: xObject,
			y: yObject,
			width: widthObject,
			height: heightObject,
			nivelQuestao: nivelQuestaoObject,
			tipoQuestao: tipoQuestaoObject,
			img: imgObject
		}
		staticCharacters.push(objeto);
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
		for (var i in staticCharacters) {
			var staticChar = staticCharacters[i];
	
			if (blockRectangle(player, staticChar)) {
				if (staticChar.tipoQuestao == 2) {	
					numeroQuestao = Math.floor(Math.random() * 9)
					document.querySelector(".pergunta").innerHTML = `
						<span class="respostaA">${perguntas.PerguntasOrganizacao[numeroQuestao]['Enunciado']}</span>
						<span class="respostaB">${perguntas.PerguntasOrganizacao[numeroQuestao]['Opcoes']['A']}</span>
						<span class="respostaC">${perguntas.PerguntasOrganizacao[numeroQuestao]['Opcoes']['B']}</span>
					`
					document.querySelector("#modalPopUpPergunta").style.visibility = 'visible'
				}
			}
		}
	}
	
    //Ajuste de orientação
	function update(){
		if (document.querySelector("#modalPopUpPergunta").style.visibility != 'visible') {
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
		ctx.drawImage(heartHUD, 5, 5, 12, 12)
		ctx.font = "16px serif";
		ctx.fillStyle = "white";
		vidaHUD = ctx.fillText(vida, 20, 16)
		ctx.drawImage(heartHUD, 5, 20, 12, 12)
		ctx.font = "16px serif";
		ctx.fillStyle = "white";
		vidaHUD = ctx.fillText(armour, 20, 32)
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