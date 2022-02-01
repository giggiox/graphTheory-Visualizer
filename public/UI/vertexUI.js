class VertexUI {
    constructor(label,graphUI, x = null, y = null) {
        this.label = label;
        this.graphUI=graphUI;
        this.x = x == null ? random(30,width-30) : x; // height and width are variables set by createCanvas automatically by p5
        this.y = y == null ? random(30,height-30) : y;
        
        this.flags = {
            hover: false,
            dragging: false,
            clicked: false,
            invalid:false,
            highlighted: false,
            released:false
        };
        this.radius = 25;
        this.isBlinking = false;        
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
        if(this.flags.released){
            this.flags.released=false;
        }
        if (this.flags.clicked) {
            fill(255, 255, 0);
        }
        if(this.flags.invalid){
            fill(255,0,0);
        }
        if(this.flags.highlighted){
            stroke(103, 43, 244);
            strokeWeight(5);
        }

        ellipse(this.x,this.y, this.radius * 2, this.radius * 2);
    }

    renderLabel() {
        noStroke();
        fill(0);
        textSize(25/Controls.scaleFactor);
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
        if(this.isBlinking) return;
        this.isBlinking = true;
        repetitions = repetitions % 2 != 0 ? repetitions+1: repetitions; //only even number of repetitions
        let referenceToThis = this;
        let blinkedTimes = 0;
        this.flags.invalid =! this.flags.invalid;
        let intervalID = window.setInterval(function(){
            if(blinkedTimes == repetitions){
                window.clearInterval(intervalID);
                referenceToThis.isBlinking=false;
            }
            referenceToThis.flags.invalid =! referenceToThis.flags.invalid;
            blinkedTimes++;
        },400,repetitions);
    }
}