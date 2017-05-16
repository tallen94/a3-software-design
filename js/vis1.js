let vis1 = function() {

  let svg = d3.select('#vis1')
    .append('svg')
    .attr('height', 600)
    .attr('width', 900)

  let link = svg.append("g")
    .attr('height', 600)
    .attr('width', 900)
    .attr('class', 'links')
  let node = svg.append("g")
    .attr('height', 600)
    .attr('width', 900)
    .attr('class', 'nodes')

  let g = Graph()

  let vis = function(date) {
    console.log(date)
    Papa.parse('http://localhost:5000/nodes/' + date, {
      download: true,
      skipEmptyLines: true,
      header: true,
      complete: function(r1) {
        nodes = _.map(r1.data, (node) => {
          return {
            id: node.username,
            group: node.user_title
          }
        })
        let nodeKeys = _.keyBy(nodes, 'id')
        Papa.parse('http://localhost:5000/edges/' + date, {
          download: true,
          skipEmptyLines: true,
          header: true,
          complete: function(r2) {
            links = _.map(r2.data, (link) => {
              return {
                source: nodeKeys[link.username],
                target: nodeKeys[link.username_t]
              }
            })
            console.log(links)
            link.data([links]).call(g.link)
            node.data([nodes]).call(g.node)
          }
        })
      }
    })
  }

  return vis
}
