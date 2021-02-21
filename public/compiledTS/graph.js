"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Graph = /** @class */ (function () {
    function Graph(vertici) {
        this.isWeighted = false;
        this.vertices = vertici || new Map();
    }
    Graph.prototype.addVertex = function (vertice) {
        this.vertices.set(vertice, new Vertex());
    };
    /*
    * add an ege, returns true if the edge is added (edge doesn't exists already or not a self loop), false otherwise
    */
    Graph.prototype.addEdge = function (a, b, directed) {
        if (this.edgeExists(a, b))
            return false;
        var a1 = this.vertices.get(a);
        var adda = new Vertex(b, a1);
        this.vertices.set(a, adda);
        if (directed)
            return true;
        var b1 = this.vertices.get(b);
        var addb = new Vertex(a, b1);
        this.vertices.set(b, addb);
        return true;
    };
    /*
    *   return true if edge already exists, or if it is a self loop.
    */
    Graph.prototype.edgeExists = function (a, b) {
        if (a == b) {
            return true;
        }
        var a1 = this.vertices.get(a);
        while (a1.next != null) {
            if (a1.info == b) {
                return true;
            }
            a1 = a1.next;
        }
        return false;
    };
    Graph.prototype.getAdjacentVertices = function (v) {
        var vertice = this.vertices.get(v);
        var retList = new Array();
        while (vertice.next != null) {
            retList.push(vertice);
            vertice = vertice.next;
        }
        return retList;
    };
    Graph.prototype.getVertexDegree = function (v) {
        return this.getAdjacentVertices(v).length;
    };
    Graph.prototype.removeEdge = function (u, v) {
        var verticeA = this.vertices.get(u);
        var previousA = verticeA;
        if (verticeA.info == v) {
            this.vertices.set(u, verticeA.next);
        }
        while (verticeA.next != null && verticeA.info != v) {
            previousA = verticeA;
            verticeA = verticeA.next;
        }
        previousA.next = verticeA.next;
        //lo rimuovo da entrambe le liste di adiacenza
        var verticeB = this.vertices.get(v);
        var previousB = verticeB;
        if (previousB.info == u) {
            this.vertices.set(v, verticeB.next);
        }
        while (verticeB.next != null && verticeB.info != u) {
            previousB = verticeB;
            verticeB = verticeB.next;
        }
        previousB.next = verticeB.next;
    };
    Graph.prototype.addWeight = function (u, v, weight) {
        var a1 = this.vertices.get(u);
        while (a1.next != null && a1.info != v) {
            a1 = a1.next;
        }
        a1.weight = weight;
        var b1 = this.vertices.get(v);
        while (b1.next != null && b1.info != u) {
            b1 = b1.next;
        }
        b1.weight = weight;
    };
    Graph.prototype.BFS = function (start) {
        var e_1, _a;
        var t = new Array();
        var visited = new Set();
        visited.add(start);
        var frangia = []; // per BFS frangia usata come coda;
        frangia.push(start);
        while (frangia.length != 0) {
            var u = frangia.shift();
            var verticiAdiacenti = this.getAdjacentVertices(u);
            try {
                for (var verticiAdiacenti_1 = (e_1 = void 0, __values(verticiAdiacenti)), verticiAdiacenti_1_1 = verticiAdiacenti_1.next(); !verticiAdiacenti_1_1.done; verticiAdiacenti_1_1 = verticiAdiacenti_1.next()) {
                    var v = verticiAdiacenti_1_1.value;
                    if (!visited.has(v.info)) {
                        visited.add(v.info);
                        t.push(new Edge(new Vertex(u), new Vertex(v.info)));
                        frangia.push(v.info);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (verticiAdiacenti_1_1 && !verticiAdiacenti_1_1.done && (_a = verticiAdiacenti_1.return)) _a.call(verticiAdiacenti_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return t;
    };
    Graph.prototype.DFS = function (start) {
        var ret = new Array();
        var visited = new Set();
        visited.add(start);
        this.DFSUtil(start, ret, visited);
        return ret;
    };
    Graph.prototype.DFSUtil = function (u, ret, visited) {
        var e_2, _a;
        var verticiAdiacenti = this.getAdjacentVertices(u);
        try {
            for (var verticiAdiacenti_2 = __values(verticiAdiacenti), verticiAdiacenti_2_1 = verticiAdiacenti_2.next(); !verticiAdiacenti_2_1.done; verticiAdiacenti_2_1 = verticiAdiacenti_2.next()) {
                var v = verticiAdiacenti_2_1.value;
                if (!visited.has(v.info)) {
                    visited.add(v.info);
                    ret.push(new Edge(new Vertex(u), new Vertex(v.info)));
                    this.DFSUtil(v.info, ret, visited);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (verticiAdiacenti_2_1 && !verticiAdiacenti_2_1.done && (_a = verticiAdiacenti_2.return)) _a.call(verticiAdiacenti_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Graph.prototype.getEdgesList = function () {
        var e_3, _a;
        var ret = new Array();
        try {
            for (var _b = __values(this.vertices.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                var vertex = this.vertices.get(v);
                var _loop_1 = function () {
                    var b = new Edge(new Vertex(v), new Vertex(vertex.info), vertex.weight);
                    var duplicated = false;
                    ret.forEach(function (e) {
                        if (e.v == b.u && e.u == b.v) {
                            duplicated = true;
                        }
                    });
                    if (!duplicated)
                        ret.push(b);
                    vertex = vertex.next;
                };
                while (vertex.next != null) {
                    _loop_1();
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return ret;
    };
    Graph.prototype.kruskal = function () {
        var e_4, _a;
        var ret = new Array();
        var listaArchi = this.getEdgesList();
        listaArchi.sort(function (a, b) { return a.weight - b.weight; });
        var qu = new QuickUnionRankCompression(this.vertices.size);
        try {
            for (var listaArchi_1 = __values(listaArchi), listaArchi_1_1 = listaArchi_1.next(); !listaArchi_1_1.done; listaArchi_1_1 = listaArchi_1.next()) {
                var a = listaArchi_1_1.value;
                if (qu.find(a.u.info) != qu.find(a.v.info)) {
                    qu.union(a.u.info, a.v.info);
                    ret.push(new Edge(new Vertex(a.u.info), new Vertex(a.v.info)));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (listaArchi_1_1 && !listaArchi_1_1.done && (_a = listaArchi_1.return)) _a.call(listaArchi_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return ret;
    };
    Graph.prototype.toString = function () {
        var e_5, _a;
        var t = "";
        try {
            for (var _b = __values(this.vertices.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                t += key;
                var vertex = this.vertices.get(key);
                while (vertex.next != null) {
                    t += "->" + vertex.info;
                    if (this.isWeighted)
                        t += "," + vertex.weight;
                    vertex = vertex.next;
                }
                t += "\n";
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return t;
    };
    return Graph;
}());
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
