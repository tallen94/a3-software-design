let Graph = function(id, width, height) {
  let g = {}
  let nodes = []
  let links = []
  
  let colors = d3.scaleOrdinal(d3.schemeCategory20)

  let svg = d3.select(id)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  let node, link

  let simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(function(d) { return d.id }).distance(100))
      .force('charge', d3.forceManyBody().strength(-5))
      .force('center', d3.forceCenter(width / 2, height / 2)) 

  g.setColors = function(c) {
    colors = c
    return this
  }

  g.height = function(h) {
    if (!h) return height
    height = h
    return this
  }

  g.width = function(w) {
    if (!w) return width
    width = w
    return this
  }

  g.nodes = function(n) {
    if (!n) return nodes
    nodes = n
    return this
  }

  g.links = function(l) {
    if (!l) return links
    links = l
    return this
  }

  g.data = function(n, l) {
    this.nodes(n)
    this.links(l)
    return this
  }

  function map(list, fn) {
    for (let i = 0; i < list.length; i++) {
      list[i] = fn(list[i])
    }
    return list
  }

  g.mapNodes = function(id, group) {
    nodes = map(nodes, (node) => {
      return {
        id: node[id],
        group: node[group]
      }
    })
    return this
  }

  g.mapLinks = function(source, target, value) {
    links = map(links, (link) => {
      return {
        source: link[source],
        target: link[target],
        value: link[value] 
      }
    })
    return this
  }

  g.addNodes = function() {
    node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes, function(d) { return d.id })
      .enter()
      .append('circle')
    return this
  }

  g.addLinks = function() {
    link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links, function(d) { return d.source.id + '-' + d.target.id})
      .enter()
      .append('line')
    return this
  }

  g.updateNodes = function() {
    node.merge(node)
    return this
  }

  g.updateLinks = function() {
    link.merge(link)
    return this
  }

  g.removeNodes = function() {
    node.exit().remove()
    return this
  }

  g.removeLinks = function() {
    link.exit().remove()
    return this
  }

  g.nodeRadius = function(r) {
    node = node.attr('r', r)
    return this
  }

  g.nodeFill = function() {
    node = node.attr('fill', function(d) {
      return colors(d.group)
    })
    return this
  }

  g.linkWidth = function(w) {
    link = link.attr('stroke-width', w)
    return this
  }

  g.drag = function() {

    node = node.call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return this
  }

  function ticked() {
    node
      .attr("cx", function(d) {
        return Math.max(25, Math.min(width - 25, d.x))
      })
      .attr("cy", function(d) {
        return Math.max(25, Math.min(height - 25, d.y)) 
      });

    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    return this
  }

  g.start = function() {

    simulation
      .nodes(nodes)
      .on('tick', ticked)

    simulation
      .force('link')
      .links(links)

    simulation.alpha(1).restart()
  }

  return g
}