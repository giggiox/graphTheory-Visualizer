class Edge<T>{
    u:Vertex<T>;
    v:Vertex<T>;
    weight:number;
    
    constructor(u:Vertex<T>,v:Vertex<T>,weight?: number){
        this.u=u;
        this.v=v;
        this.weight= weight || null;
    }

}