let vis1 = function(colors) {

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

    let userDict = {}
    Papa.parse('http://ec2-54-212-206-194.us-west-2.compute.amazonaws.com:5000/nodes/' + date, {
      download: true,
      skipEmptyLines: true,
      header: true,
      complete: function(r1) {
        nodes = _.map(r1.data, (node, i) => {
          userDict[node.username] = 'User' + i
          return {
            id: 'User' + i,
            group: node.user_title
          }
        })
        let nodeKeys = _.keyBy(nodes, 'id')
        Papa.parse('http://ec2-54-212-206-194.us-west-2.compute.amazonaws.com:5000/edges/' + date, {
          download: true,
          skipEmptyLines: true,
          header: true,
          complete: function(r2) {
            links = _.map(r2.data, (link, i) => {
              return {
                source: nodeKeys[userDict[link.username]],
                target: nodeKeys[userDict[link.username_t]]
              }
            })
            g.node.colors(colors)

            link.data([links]).call(g.link)
            node.data([nodes]).call(g.node)
          }
        })
      }
    })
  }

  return vis
}
