class Graph<T>{
    vertices: Map<T, Vertex<T>>;
    isWeighted: boolean = false;

    constructor(vertici?: Map<T, Vertex<T>>) {
        this.vertices = vertici || new Map<T, Vertex<T>>();
    }

    /**
     * add a vertex to Map structure which represents vertices
     * @param {T} vertex 
     */
    addVertex(vertex: T): void {
        this.vertices.set(vertex, new Vertex<T>());
    }


    /**
     * add and edge to graph, returns true if edge is added (edge doesn't exist already or not a self loop), false otherwise
     * @see edgeExistsUtil(T,T) for edge existance checking
     * @param {T} a -Vertex info
     * @param {T} b -Vertex info
     * @returns {boolean} -return true if edge is added with success, false otherwise
     */
    addEdge(a: T, b: T): boolean {
        if(this.edgeExistsUtil(a,b))
            return false;
        let a1 = this.vertices.get(a);
        let adda = new Vertex<T>(b, a1);
        this.vertices.set(a, adda);

        let b1 = this.vertices.get(b);
        let addb = new Vertex<T>(a, b1);
        this.vertices.set(b, addb);
        return true;
    }

    
    /**
     * return wether the edges already exists or not
     * @param {T} a -Vertex info
     * @param {T} b -Vertex info
     */
    private edgeExistsUtil(a:T,b:T):boolean{
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

    /**
     * @param {T} v 
     * @returns {Array<Vertex<T>>}
     */
    private getAdjacentVerticesUtil(v: T): Array<Vertex<T>> {
        let vertice = this.vertices.get(v);
        let retList = new Array<Vertex<T>>();
        while (vertice.next != null) {
            retList.push(vertice);
            vertice = vertice.next;
        }
        return retList;

    }

    /**
     * removed edge from 2 vertices
     * @param {T} u 
     * @param {T} v 
     */
    removeEdge(u: T, v: T): void {
        /*remove edge from u adjacency list*/
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

        /*remove edge from v adjacency list*/
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

    /**
     * updates weight of a given edge
     * @param {T} u 
     * @param {T} v 
     * @param weight 
     */
    updateWeight(u:T,v:T,weight: number):void{
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


    /**
     * @param {T} start
     * @returns {Array<Edge<T>>}
     */
    BFS(start: T): Array<Edge<T>> {
        let edges = new Array<Edge<T>>();
        let visited = new Set<T>();
        visited.add(start);
        let frangia = []; 
        frangia.push(start);
        while (frangia.length != 0) {
            let u = frangia.shift();
            let adjacentVertices = this.getAdjacentVerticesUtil(u);
            for (var v of adjacentVertices) {
                if (!visited.has(v.info)) {
                    visited.add(v.info);
                    edges.push(new Edge(new Vertex(u),new Vertex(v.info)))
                    frangia.push(v.info);
                }
            }
        }
        return edges;
    }

    /**
     * @param {T} start
     * @returns {Array<Edge<T>>}
     */
    DFS(start: T): Array<Edge<T>> {
        let ret = new Array<Edge<T>>();
        let visited = new Set<T>();
        visited.add(start);
        this.DFSUtil(start, ret, visited);
        return ret;
    }

    private DFSUtil(u: T, ret: Array<Edge<T>>, visited: Set<T>) {
        let adjacentVertices = this.getAdjacentVerticesUtil(u);
        for (var v of adjacentVertices) {
            if (!visited.has(v.info)) {
                visited.add(v.info);
                ret.push(new Edge(new Vertex(u),new Vertex(v.info)));
                this.DFSUtil(v.info, ret, visited);
            }
        }
    }

    /**
     * @returns {Array<Edge<T>>}
     */
    private getEdges() :Array<Edge<T>>{
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
        let edges = this.getEdges();
        edges.sort((a, b) => a.weight - b.weight);
        let qu = new QuickUnionRankCompression(this.vertices.size);
        for (let a of edges) {
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
            for(let v of this.getAdjacentVerticesUtil(u)){
                let alt=dist.get(u) + v.weight;
                if(alt < dist.get(v.info)){
                    dist.set(v.info,alt);
                    previous.set(v.info,u);
                }
            }
        }
    }

    /**
     * @param {Array<T>} queue 
     * @param {Map<T,number>} dist 
     */
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

    /**
     * 
     * @param {Array<T>} from 
     * @param {any} dist 
     */
    private getMinDistanceVertex(from: Array<T>,dist:any){
        let min=0;
        for(let v of from){
            if(dist[v]<min){
                min=Number(v);
            }
        }
        return min;
    }


    /**
     * @returns {string} -the adjacency list representation
     */
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

/*let grafo = new Graph<number>();
grafo.addVertex(1);
grafo.addVertex(2);
grafo.addVertex(3);
grafo.addVertex(4);
grafo.addVertex(5);

grafo.addEdge(1, 2, false);
grafo.addEdge(1, 4, false);
grafo.addEdge(4,5, false);
grafo.addEdge(2,5, false);
grafo.addEdge(2,3, false);
grafo.addEdge(3,5, false);
grafo.addEdge(2,4, false);

grafo.updateWeight(1,2,6);
grafo.updateWeight(1,4,1);
grafo.updateWeight(4,5,1);
grafo.updateWeight(2,5,2);
grafo.updateWeight(2,3,5);
grafo.updateWeight(3,5,5);
grafo.updateWeight(2,4,2);

//grafo.removeEdge(7, 9);
//grafo.removeEdge(5, 6);

console.log(grafo.toString());

/*console.log(grafo.BFS(8));
console.log(grafo.DFS(8));
*/
//console.log(grafo.getVerticiAdiacenti(1));*/

/*console.log(grafo.BFS(1));

console.log("dijkstra");
let ret=grafo.dijkstra(1,3);
console.log(ret);
*/