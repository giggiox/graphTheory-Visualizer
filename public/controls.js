class Controls {
    static tx=0;
    static ty=0;
    static scaleFactor=1;
    static #prevX=null;
    static #prevY=null;
    static #isDragging=false;

    static getMouseX(){
        return (mouseX-Controls.tx)/Controls.scaleFactor;
    }

    static getMouseY(){
        return (mouseY-Controls.ty)/Controls.scaleFactor;
    }

    static mousePressed(e) {
        Controls.isDragging = true;
        Controls.prevX = e.clientX;
        Controls.prevY = e.clientY;
    }

    static mouseDragged(e) {
        if(!Controls.isDragging) return;
        const pos = {x: e.clientX, y: e.clientY};
        const dx = pos.x - Controls.prevX;
        const dy = pos.y - Controls.prevY;
        if(Controls.prevX || Controls.prevY) {
          Controls.tx += dx;
          Controls.ty += dy;
          Controls.prevX = pos.x;
          Controls.prevY = pos.y;
        }
    }

    static mouseReleased(e) {
        Controls.isDragging = false;
        Controls.prevX = null;
        Controls.prevY = null;
    }
    
    static zoom(e) {
        const {x, y, deltaY} = e;
        const direction = deltaY > 0 ? -1 : 1;
        const factor = 0.05;
        const zoom = 1 * direction * factor;    
        const wx = (x-Controls.tx)/(width*Controls.scaleFactor);
        const wy = (y-Controls.ty)/(height*Controls.scaleFactor);
        if(Controls.scaleFactor + zoom < 0.2 || Controls.scaleFactor+zoom > 9) return;
        Controls.tx -= wx*width*zoom;
        Controls.ty -= wy*height*zoom;
        Controls.scaleFactor += zoom;
    }
    
}