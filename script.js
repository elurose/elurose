var canvas,ctx,img,scale,effect;


class Cell {
	constructor(effect,x,y){
		this.effect = effect;
		this.image = effect.image;
		this.scale = effect.scale;
		this.x = x;
		this.y = y;
		this.width = this.effect.cellWidth*this.scale;
		this.height = this.effect.cellHeight*this.scale;
		this.slideX = 0;
		this.slideY = 0;
		this.vx = 0;
		this.vy = 0;
		this.ease = 0.01;
		this.friction = 0.8;
	}
	draw(context){
		//context.drawImage(this.image, this.x,this.y, this.width,this.height, this.x,this.y, this.width,this.height);
		context.drawImage(this.image, this.x+this.slideX,this.y+this.slideY, this.width,this.height, this.x,this.y, this.width,this.height);
		//context.strokeRect(this.x,this.y,this.width,this.height);
		//console.log(this.x+","+this.y+","+this.width+","+this.height);
	}
	update(){
		const dx = this.effect.mouse.x - this.x;
		const dy = this.effect.mouse.y - this.y;
		const distance = Math.hypot(dx,dy);
		if (distance < this.effect.mouse.radius) {
			this.vx = dx/this.effect.mouse.radius;
			this.vy = dy/this.effect.mouse.radius;
		} else {
			this.vx=-this.slideX/this.effect.mouse.radius;
			this.vy=-this.slideY/this.effect.mouse.radius;
		}
		this.slideX += (this.vx *= this.friction) - this.slideX*this.ease;
		this.slideY += (this.vy *= this.friction) - this.slideX*this.ease;
		//console.log(force);
	}
}

class Effect {
	static image;
	scale;
	constructor(canvas,img,scale){
		this.canvas = canvas;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.cellSize = Math.max(this.width,this.height)/32
		//this.cellWidth = this.width / 31;
		//this.cellHeight = this.height / 71;
		this.cellWidth = this.cellSize;
		this.cellHeight = this.cellSize;
		console.log(this.imageGrid);
		this.image = img;
		this.scale = scale;
		//console.log(this.canvas.width);
		console.log("effect image: "+this.image);
		this.imageGrid = [];
		this.createGrid();
		this.mouse = {
			x: undefined,
			y: undefined,
			radius: this.cellWidth*2,
		};
		this.canvas.addEventListener('mousemove', e => {
			//console.log(e);
			var rect = canvas.getBoundingClientRect(),
				scaleX = canvas.width/rect.width,
				scaleY = canvas.height/rect.height;
			
			//this.mouse.x = (e.offsetX-rect.left)*scaleX;
			//this.mouse.y = (e.offsetY-rect.top)*scaleY;
			
			//this.mouse.x = (e.clientX-rect.left)*scaleX;
			//this.mouse.y = (e.clientY-rect.top)*scaleY;
			
			this.mouse.x = (e.clientX-rect.left-canvas.clientLeft)*scaleX;
			this.mouse.y = (e.clientY-rect.top-canvas.clientTop)*scaleY;
			
			//console.log(this.mouse.x, this.mouse.y);
		});
	}
	createGrid(){
		for (let y=0; y<this.height; y+=this.cellHeight){
			for (let x=0; x<this.width; x+=this.cellWidth){
				this.imageGrid.push(new Cell(this, x, y));
			}
		}
	}
	render(context){
		this.imageGrid.forEach((cell,i) => {
			cell.update();
			cell.draw(context);
		});
	}
}

window.onload = function () {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	img = new Image();
	index = Math.floor(Math.random()*ids.length);
	//index=38;
	console.log("img index:",index);
	img.src = ids[index];
	img.onload = function() {
		var vw = window.innerWidth;
		var vh = window.innerHeight;
		canvas.width=img.width;//Math.max(vw,img.width);
		canvas.height=img.height;//Math.max(vh,img.height);
		scale = Math.min(1,Math.min(canvas.width/img.width,canvas.height/img.height));
		//ctx.drawImage(img,0,0,scale*img.width,scale*img.height);
		effect = new Effect(canvas,img,scale);
		console.log(effect);
		ctx.strokeStyle="white";
		//effect.render(ctx);
		function animate(){
			effect.render(ctx);
			requestAnimationFrame(animate);
		}
		requestAnimationFrame(animate);
	};
}