class VertexUI {
    constructor(label, x = null, y = null) {
        this.x = x == null ? random(30,width-30) : x; // height and width are variables set by createCanvas automatically by p5
        this.y = y == null ? random(30,height-30) : x;
        this.label = label;
        this.flags = {
            hover: false,
            dragging: false,
            clicked: false,
            invalid:false,
            highlighted: false
        };
        this.radius = 25;
    }

    render() {
        this.renderCircle();
        this.renderLabel();
    }

    renderCircle() {
        stroke(0);
        strokeWeight(4);
        fill(255);
        if (this.flags.hover) {
            strokeWeight(5);
        }
        if (this.flags.dragging) {
            fill(100, 255, 255);
        }
        if (this.flags.clicked) {
            fill(255, 255, 0);
        }
        if(this.flags.invalid){
            fill(255,0,0);
        }
        if(this.flags.highlighted){
            fill(102, 102, 255);
        }
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }

    renderLabel() {
        noStroke();
        fill(0);
        textSize(25);
        text(this.label, this.x - (textWidth(this.label) / 2), this.y + ((textAscent() + textDescent()) / 4));
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean} -true if given (x,y) coordinates are inside VertexUI,false otherwise
     */
    hasInside(x, y) {
        let distance = dist(this.x, this.y, x, y);
        return distance <= this.radius; 
    }
    
    /**
     * @param {number} repetitions 
     */
    blink(repetitions){
        repetitions=repetitions % 2 != 0 ? repetitions+1: repetitions;
        let referenceToThis=this;
        let blinkedTimes=0;
        this.flags.invalid=!ref.flags.invalid;
        let intervalID=window.setInterval(function(){
            if(blinkedTimes == repetitions){
                window.clearInterval(intervalID);
            }
            referenceToThis.flags.invalid=!ref.flags.invalid;
            t++;
        },400,repetitions);
    }
}