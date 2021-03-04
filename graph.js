export class digraph {
    constructor(numVertices, edges) {
        this.numVertices = numVertices;
        this.edges = edges;
    }

    draw() {
        this.rank();
        this.ordering();
        this.position();
        this.makeSplines();
    }

    rank() {
        var e, f;
        feasibleTree();
        while ((e = leaveEdge()) != null) {
            f = enterEdge(e);
            exchange(e,f);
        }
        normalise();
        balance();
    }

    feasibleTree() {
        var e, v;
        init_rank();
        while (tight_tree() < this.numVertices) {
            e = 
        }
    }

    connectedComponents() {
        let visited = [];
        function dfs(v) {
            if (visited.includes(v)) { 
                return;
            }
            visited.push(v);
            for (var i = 0; i < outNeighbours[v].length; i++) {
                dfs(outNeighbours[v][i]);
            }
        }
        let components = [];
        for (var i = 0; i < this.numVertices; i++) {
            dfs(i);
        }

    }

    removeCyles() {
        // depth first search for loops, remove edge when returning to start vertex
        // then continue searching with new edge set.
        let completed = Array(this.numVertices).fill(false);
        let globalVisited = Array(this.numVertices).fill(false);
        function dfs(source, target, visited) {
            if (complete[target]) { return; }

            if (visited[target]) {
                outNeighbours[source].splice(outNeighbours.indexOf(target), 1);
                globalVisited = [...new Set([...allVisited ,...visited])]; // union
                return visited;
            }

            let newVisited = Array.from(visited);
            newVisited[target] = true;
            for (var i = 0; i < outNeighbours[target].length; i++) {
                dfs(target, outNeighbours[target][i], newVisited);
            }
        }

        function dfsStart(v) {
            for (var i = 0; i < this.numVertices; i++) {
                dfs(i);
                // once dfs done for a vertex, all visited vertices have no loops
                // reachable from them. So if we reach these vertices again we can
                // stop searching early.
                complete = [...new Set([...complete ,...globalVisited])]; // union
            }
        }
    }

}