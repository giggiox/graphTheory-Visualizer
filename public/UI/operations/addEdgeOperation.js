class AddEdgeOperation{
    constructor(){
        this.continuoslyRendered=false;
        this.consecutiveClicks = true;
        this.graphUI = null;
        this.startingVertex = null;
        this.done = false;
    }

    update(vertexUI){
        if(this.done) return;
        if(this.startingVertex == null){
            this.startingVertex = vertexUI;
            vertexUI.flags.clicked=true;
        }else{
            let edgeAdded = this.graphUI.graph.addEdge(this.startingVertex.label,vertexUI.label);
            if(!edgeAdded){
                vertexUI.blink();
                if(vertexUI != this.startingVertex){
                    vertexUI.flags.clicked= false;
                }
                return;
            }
            this.graphUI.edges.push(new EdgeUI(this.startingVertex, vertexUI,this.graphUI));
            vertexUI.flags.clicked=false;
            this.startingVertex.flags.clicked=false;
            this.done=true;
        }
    }
    end(){

    }
}