class EdgeUI {
    constructor(vertexUI1, vertexUI2, graphUI) {
        this.vertexUI1 = vertexUI1;
        this.vertexUI2 = vertexUI2;
        this.graphUI = graphUI; /* graphUI reference is passed in order to automatcally obtain if graph is weighted or not */
        this.weight = null;
        this.flags = {
            hover: false,
            dragging: false,
            highlighted: false
        };

    }

    render() {
        stroke(0);
        strokeWeight(3);
        if (this.flags.hover) {
            stroke(200, 0, 0);
            strokeWeight(4);
        }
        if (this.flags.highlighted) {
            stroke(30, 144, 255);
            strokeWeight(4);
        }
        if (this.flags.dragging) {
            fill(100, 255, 255);
        }
        if (this.graphUI.isWeighted) {
            let d = int(dist(this.vertexUI1.x, this.vertexUI1.y, this.vertexUI2.x, this.vertexUI2.y)) /20;
            this.weight = d;
            push();
            translate((this.vertexUI1.x + this.vertexUI2.x) / 2, (this.vertexUI1.y + this.vertexUI2.y) / 2);
            //rotate(atan2(this.vertexUI2.y - this.vertexUI1.y, this.vertexUI2.x - this.vertexUI1.x)); //weight text rotated as edge
            textSize(17);
            strokeWeight(0.4);
            text(nfc(d, 0), +5, -5);
            fill(0, 102, 153, 51);
            pop();
        }
        if(this.graphUI.isDirected){
            push();
            var angle = atan2(this.vertexUI1.y - this.vertexUI2.y, this.vertexUI1.x - this.vertexUI2.x);            
            translate(this.vertexUI2.x+(this.vertexUI2.radius*cos(angle)),this.vertexUI2.y+(this.vertexUI2.radius*sin(angle)));
            rotate(angle-HALF_PI);
            fill(0);
            triangle(-12*0.5, 12, 12*0.5, 12, 0, 0);
            pop();
        }
        line(this.vertexUI1.x, this.vertexUI1.y, this.vertexUI2.x,this.vertexUI2.y);
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean} -true if given (x,y) coordinates are inside EdgeUI line,false otherwise
     */
    hasInside(x, y) {
        let distanceFromVertexUI1 = dist(this.vertexUI1.x, this.vertexUI1.y, x, y);
        let distanceFromVertexUI2 = dist(this.vertexUI2.x, this.vertexUI2.y, x, y);
        if (distanceFromVertexUI1 <= this.vertexUI1.radius || distanceFromVertexUI2 <= this.vertexUI2.radius)
            return false;
        let length = dist(this.vertexUI1.x, this.vertexUI1.y, this.vertexUI2.x, this.vertexUI2.y);
        let cond1 = (distanceFromVertexUI1 + distanceFromVertexUI2) - 0.5 <= length;
        let cond2 = (distanceFromVertexUI1 + distanceFromVertexUI2) + 0.5 >= length;
        return cond1 && cond2;
    }

}