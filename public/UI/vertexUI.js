class VertexUI {
    constructor(label, x = null, y = null) {
        this.x = x == null ? random(30,width-30) : x; /* height and width are variables set by createCanvas automatically by p5 */
        this.y = y == null ? random(30,height-30) : x;
        this.label = label;

        this.flags = {
            hover: false,
            dragging: false,
            clicked: false,
            invalid:false
        };

        this.radius = 25;
    }

    render() {
        this.render_circle();
        this.render_text();
    }

    render_text() {
        noStroke();
        fill(0);
        textSize(25);
        text(this.label, this.x - (textWidth(this.label) / 2), this.y + ((textAscent() + textDescent()) / 4));
    }

    render_circle() {
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

        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }

    
    isInside(x, y) {
        const d = dist(this.x, this.y, x, y);
        return d <= this.radius;
    }
    
    blink(){
        let t=0;
        let ref=this;
        let repetitions=4;
        ref.flags.invalid=!ref.flags.invalid;
        let intervalID=window.setInterval(function(){
            if(t==repetitions){
                window.clearInterval(intervalID);
            }
            ref.flags.invalid=!ref.flags.invalid;
            t++;
        },400,repetitions);
    }
}