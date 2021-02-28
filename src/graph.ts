class Graph<T>{

    vertices: Map<T, Vertex<T>>;
    isWeighted: boolean = false;
    isDirected: boolean = false;

    constructor(vertici?: Map<T, Vertex<T>>) {
        this.vertices = vertici || new Map<T, Vertex<T>>();
    }


    addVertex(vertice: T): void {
        this.vertices.set(vertice, new Vertex<T>());
    }

    /*
    * add an ege, returns true if the edge is added (edge doesn't exists already or not a self loop), false otherwise
    */
    addEdge(a: T, b: T): boolean {
        if(this.edgeExists(a,b))
            return false;
        let a1 = this.vertices.get(a);
        let adda = new Vertex<T>(b, a1);
        this.vertices.set(a, adda);

        if (this.isDirected) return true;
        let b1 = this.vertices.get(b);
        let addb = new Vertex<T>(a, b1);
        this.vertices.set(b, addb);
        return true;
    }

    /*
    *   return true if edge already exists, or if it is a self loop. 
    */
    private edgeExists(a:T,b:T):boolean{
        if(a==b){
            return true;
        } 
        let a1 = this.vertices.get(a);
        while(a1.next != null){
            if(a1.info == b){
                return true;
            }    
            a1=a1.next;
        }
        return false;
    }

    private getAdjacentVertices(v: T): Array<Vertex<T>> {
        let vertice = this.vertices.get(v);
        let retList = new Array<Vertex<T>>();
        while (vertice.next != null) {
            retList.push(vertice);
            vertice = vertice.next;
        }
        return retList;

    }

    removeEdge(u: T, v: T): void {
        let verticeA = this.vertices.get(u);
        let previousA = verticeA;
        if (verticeA.info == v) {
            this.vertices.set(u, verticeA.next);
        }
        while (verticeA.next != null && verticeA.info != v) {
            previousA = verticeA;
            verticeA = verticeA.next;
        }
        previousA.next = verticeA.next;

        if(this.isDirected) return;
        let verticeB = this.vertices.get(v);
        let previousB = verticeB;
        if (previousB.info == u) {
            this.vertices.set(v, verticeB.next);
        }
        while (verticeB.next != null && verticeB.info != u) {
            previousB = verticeB;
            verticeB = verticeB.next;
        }
        previousB.next = verticeB.next;
    }

    updateWeight(u:T,v:T,weight: number){
        let a1=this.vertices.get(u);
        while (a1.next != null && a1.info != v) {
            a1 = a1.next;
        }
        a1.weight = weight;
        let b1 = this.vertices.get(v);
        while (b1.next != null && b1.info != u) {
            b1 = b1.next;
        }
        b1.weight = weight;
    }


    BFS(start: T): Array<Edge<T>> {
        let t = new Array<Edge<T>>();
        let visited = new Set<T>();
        visited.add(start);
        let frangia = []; // per BFS frangia usata come coda;
        frangia.push(start);
        while (frangia.length != 0) {
            let u = frangia.shift();
            let verticiAdiacenti = this.getAdjacentVertices(u);
            for (var v of verticiAdiacenti) {
                if (!visited.has(v.info)) {
                    visited.add(v.info);
                    t.push(new Edge(new Vertex(u),new Vertex(v.info)))
                    frangia.push(v.info);
                }
            }
        }
        return t;
    }


    DFS(start: T): Array<Edge<T>> {
        let ret = new Array<Edge<T>>();
        let visited = new Set<T>();
        visited.add(start);
        this.DFSUtil(start, ret, visited);
        return ret;
    }

    DFSUtil(u: T, ret: Array<Edge<T>>, visited: Set<T>) {
        let verticiAdiacenti = this.getAdjacentVertices(u);
        for (var v of verticiAdiacenti) {
            if (!visited.has(v.info)) {
                visited.add(v.info);
                ret.push(new Edge(new Vertex(u),new Vertex(v.info)));
                this.DFSUtil(v.info, ret, visited);
            }
        }
    }

    private getEdgesList() :Array<Edge<T>>{
        let ret = new Array<Edge<T>>();
        for (let v of this.vertices.keys()) {
            let vertex = this.vertices.get(v);
            while (vertex.next != null) {
                let b = new Edge(new Vertex(v), new Vertex(vertex.info), vertex.weight);
                let duplicated = false;
                ret.forEach(e => {
                    if (e.v == b.u && e.u == b.v) {
                        duplicated = true;
                    }
                });
                if (!duplicated)
                    ret.push(b);
                vertex = vertex.next;
            }
        }
        return ret;
    }

    kruskal() : Array<Edge<T>>{
        let ret=new Array<Edge<T>>();
        let listaArchi = this.getEdgesList();
        listaArchi.sort((a, b) => a.weight - b.weight);
        let qu = new QuickUnionRankCompression(this.vertices.size);
        for (let a of listaArchi) {
            if (qu.find(a.u.info) != qu.find(a.v.info)) {   
                qu.union(a.u.info, a.v.info);
                ret.push(new Edge(new Vertex(a.u.info),new Vertex(a.v.info)));
            }
        }
        return ret;
    }

    dijkstra(start:T,end:T):Array<Edge<T>>{
        let dist = new Map<T,number>();
        let previous = new Map<T,T>();
        let Q=new Array<T>();
        for(let v of this.vertices.keys()){
            dist.set(v,Infinity);
            previous.set(v,undefined);
            Q.push(v);
        }
        dist.set(start,0);

        while(Q.length!= 0){
            let u: T= this.queueVertexWithMinDistance(Q,dist);
            Q.splice(Q.indexOf(u,0),1);
            if(dist.get(u) == Infinity){
                break;
            }

            if(u == end){
                let s=new  Array<Edge<T>>();
                let u = end;
                while(previous.get(u) != undefined){
                    s.push(new Edge(new Vertex(u),new Vertex(previous.get(u))));
                    u=previous.get(u);
                }
                return s;
            }
            for(let v of this.getAdjacentVertices(u)){
                let alt=dist.get(u) + v.weight;
                if(alt < dist.get(v.info)){
                    dist.set(v.info,alt);
                    previous.set(v.info,u);
                }
            }
        }
    }

    private queueVertexWithMinDistance(queue: Array<T>,dist: Map<T,number>):T{
        let minDistance=dist.get(queue[0]);
        let minVertex: T=queue[0];
        for(let i=1;i<queue.length;i++){
            let distanceValue=dist.get(queue[i]);
            if(distanceValue < minDistance){
                minDistance=distanceValue;
                minVertex=queue[i];
            }
        }
        return minVertex;
    }

    private getMinDistanceVertex(from: Array<T>,dist:any){
        let min=0;
        for(let v of from){
            if(dist[v]<min){
                min=Number(v);
            }
        }
        return min;
    }



    adjacencyListRepresentation(): string {
        let t = "";
        for (var key of this.vertices.keys()) {
            t += key;
            let vertex = this.vertices.get(key);
            while (vertex.next != null) {
                t += "->" + vertex.info;
                if(this.isWeighted)
                    t+=","+Math.round(vertex.weight);
                vertex = vertex.next;
            }
            t += "<br>";
        }

        return t;
    }

}

/*
let grafo = new Graph<number>();
grafo.addVertex(5);
grafo.addVertex(6);
grafo.addVertex(7);
grafo.addVertex(8);
grafo.addVertex(9);

grafo.addEdge(5, 6, false);
grafo.addEdge(6, 7, false);
grafo.addEdge(6, 8, false);
grafo.addEdge(7, 9, false);


//grafo.removeEdge(7, 9);
//grafo.removeEdge(5, 6);

console.log(grafo.toString());

console.log(grafo.BFS(8));
console.log(grafo.DFS(8));

//console.log(grafo.getVerticiAdiacenti(1));*/
