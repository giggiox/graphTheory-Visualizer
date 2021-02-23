class EdgeUI {

    constructor(vertexUI1, vertexUI2, graphUI) {
        this.vertexUI1 = vertexUI1;
        this.vertexUI2 = vertexUI2;
        this.graphUI = graphUI; /* have to pass graphUI in order to automatcally obtain if graph is weighted or not */
        this.weight = null;

        this.flags = {
            hover: false,
            dragging: false,
            highlighted: false
        };
    }

    render() {
        this.render_line();
    }

    render_line() {
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

        line(this.vertexUI1.x, this.vertexUI1.y, this.vertexUI2.x, this.vertexUI2.y);
    }

    isInside(x, y) {
        const d1 = dist(this.vertexUI1.x, this.vertexUI1.y, x, y);
        const d2 = dist(this.vertexUI2.x, this.vertexUI2.y, x, y);
        if (d1 <= this.vertexUI1.radius || d2 <= this.vertexUI2.radius) return false;
        const length = dist(this.vertexUI1.x, this.vertexUI1.y, this.vertexUI2.x, this.vertexUI2.y);
        const cond1 = (d1 + d2) - 0.5 <= length;
        const cond2 = (d1 + d2) + 0.5 >= length;
        return cond1 && cond2;
    }

}