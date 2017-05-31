'use strict';

let MultiBarScatter = function() {
  var titleRank = ['Newbie', 'Jr. Member', 'Full Member', 'Sr. Member', 'Hero Member', 'Administrator', 'Vendor']

  var margin = {
    left: 70,
    bottom: 100,
    top: 50,
    right: 50
  },
  width = (window.innerWidth || 900) - 240,
  height = 500,
  diameter = 500,
  drawWidth = width - margin.left - margin.right,
  drawHeight = height - margin.top - margin.bottom,
  date = '2014-12-16',
  metric1 = 'user_title',
  metric2 = 'pop_score',
  prevDate = '2014-12-16'

  let data, grpCts, bars

  let svg, g, xAxisG, yAxisG, xAxisText, yAxisText, userCount,
    xAxis, yAxis, yScale, xScale

  let colors

  let tip = d3.tip().attr('class', 'd3-tip')

  let mbs = function(selection) {
    selection.each(function(d) {
      data = d

      svg = d3.select(this)
        .attr('height', height)
        .attr('width', width)

      g = svg.append('g')
        .attr('height', drawHeight)
        .attr('width', drawWidth) 
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')

      xAxisG = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
        .attr('class', 'axis');

      yAxisG = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

      yAxisText = svg.append('text')
        // .text('User Popularity Score')
        .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
        .attr('class', 'title');

      xAxisText = svg.append('text')
        .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
        .attr('class', 'title');

      userCount = d3.select('.date-select')
        .append('text')
        .attr('class', 'count')

      xAxis = d3.axisBottom()
      yAxis = d3.axisLeft()

      yScale = d3.scaleLinear()

      grpCts = {}
      mbs.draw()
    })
  }

  mbs.data = function(d) {
    if (!d) return data
    data = d 
    return this 
  }

  mbs.date = function(d) {
    if (!d) return date
    date = d 
    return this
  }

  mbs.draw = function() {
    var key = metric1 + '|' + metric2
    // setUserCount(data[prevDate].profiles.length, data[date].profiles.length)
    userCount.text('Total Users: ' + data.profiles.length)
    mbs.visDraw[key]()
      .exit()
      .transition()
      .duration(500)
      .delay(function(d, i) {
        return i * 3
      })
      .attr('y', 0)
      .remove()
  }

  function get_titles() {
    var groups = _.groupBy(data.profiles, 'user_title')
    return _.sortBy(Object.keys(groups), function(title) {
      var index = _.indexOf(titleRank, title)
      grpCts[title] = groups[title].length
      return index
    })
  }

  function setUserCount(prevCt, currCt) {
    if (prevCt < currCt) {
      prevCt++
      userCount.text('Total Users: ' + prevCt)
      setTimeout(function() {
        setUserCount(prevCt, currCt)
      }, 0)
    } else if (prevCt > currCt) {
      prevCt--
      userCount.text('Total Users: ' + prevCt)
      setTimeout(function() {
        setUserCount(prevCt, currCt)
      }, 0)
    } else {
      userCount.text('Total Users: ' + prevCt)
    }
  }

  mbs.visDraw = {
    'user_title|pop_score': function () {
      var titles = get_titles()

      xAxisText.text('User Titles')
      yAxisText.text('User Popularity Score')

      xScale = d3.scaleBand()
        .range([0, drawWidth])
        .padding(0.5)
        .domain(titles)
      xAxis.tickFormat(null)

      yScale.range([drawHeight, 0])
        .domain([0, 2])

      setAxes()

      bars = g.selectAll('rect').data(data.profiles, function(d) {
        return d.username
      });

      bars.enter().append('rect')
        .attr('width', xScale.bandwidth())
        .attr('height', function(d) {
          return 3
        })
        .attr('x', function(d) {
          return xScale(d['user_title'])
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .merge(bars)
        .transition()
        .duration(500)
        .delay(function(d, i) {
          return i * 3
        })
        .attr('width', xScale.bandwidth())
        .attr('x', function(d) {
          return xScale(d['user_title'])
        })
        .attr('y', function(d) {
          return yScale(+d['score']) - 3
        })
        .attr('fill', function(d) {
          return colors(d['user_title'])
        })

      // Add tip
      tip.html(function(d) {
          return d.key;
      });
      g.call(tip);
      return bars
    }, 
    'registration_date|pop_score': function() {

      xAxisText.text('Registration Date')
      xScale = d3.scaleTime()
        .range([0, drawWidth])
        .domain([new Date(1416847056000), new Date(1436024401000)])
      xAxis.tickFormat(d3.timeFormat('%b %Y'))

      yAxisText.text('User Popularity Score')
      yScale.range([drawHeight, 0])
        .domain([0, 2])

      setAxes()

      bars = g.selectAll('rect').data(data.profiles, function(d) {
        return d.username
      });
      bars.enter().append('rect')
        .attr('width', 8)
        .attr('height', 6)
        .attr('x', function(d) {
          return xScale(new Date(+d['registration_date']))
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .merge(bars)
        .transition()
        .duration(500)
        .delay(function(d, i) {
          return i * 3
        })
        .attr('width', 8)
        .attr('x', function(d) {
          return xScale(new Date(+d['registration_date']))
        })
        .attr('y', function(d) {
          return yScale(+d['score'])
        })
        .attr('fill', function(d) {
          return colors(d['user_title'])
        })

      // Add tip
      tip.html(function(d) {
          return d.key;
      });
      g.call(tip);
      return bars
    },
    'user_title|total_users': function() {
      var titles = get_titles()

      xAxisText.text('User Titles')
      xScale = d3.scaleBand()
        .range([0, drawWidth])
        .padding(0.5)
        .domain(titles)
      xAxis.tickFormat(null)

      var yMax = d3.max(titles, function(title) {
        return grpCts[title]
      })

      yAxisText.text('Total Users')
      yScale.range([drawHeight, 0])
        .domain([0, data.profiles.length])

      setAxes()

      bars = g.selectAll('rect').data(titles, function(d, i) {
        return titles[i]
      });

      bars.enter().append('rect')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr('x', function(d, i) {
          return xScale(d)
        })
        .merge(bars)
        .transition()
        .duration(500)
        .delay(function(d, i) {
          return i * 3
        })
        .attr('width', xScale.bandwidth())
        .attr('x', function(d) {
          return xScale(d)
        })
        .attr('y', function(d) {
          return yScale(grpCts[d])
        })
        .attr('height', function(d) {
          return drawHeight - yScale(grpCts[d])
        })
        .attr('fill', function(d) {
          return colors(d)
        })
      // Add tip
      tip.html(function(d) {
          return grpCts[d];
      });
      g.call(tip);
      return bars
    },
    'registration_date|total_users': function() {
      xAxisText.text('Registration Date')
      xScale = d3.scaleTime()
        .range([0, drawWidth])
        .domain([new Date(1416847056000), new Date(1436024401000)])
      xAxis.tickFormat(d3.timeFormat('%b %Y'))

      yAxisText.text('Total Users')
      yScale.range([drawHeight, 0])
        .domain([0, 1000])

      setAxes()

      bars = g.selectAll('rect').data(data.profiles, function(d) {
        return d.username
      });
      bars.enter().append('rect')
        .attr('width', 8)
        .attr('height', 6)
        .attr('x', function(d) {
          return xScale(new Date(+d['registration_date']))
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .merge(bars)
        .transition()
        .duration(500)
        .delay(function(d, i) {
          return i * 3
        })
        .attr('width', 8)
        .attr('x', function(d) {
          return xScale(new Date(+d['registration_date']))
        })
        .attr('y', function(d,i) {
          return yScale(i)
        })
        .attr('fill', function(d) {
          return colors(d['user_title'])
        })

      // Add tip
      tip.html(function(d, i) {
          return d.key;
      });
      g.call(tip);
      return bars
    }
  }

  mbs.colors = function(c) {
    if (!c) return colors
    colors = c
    return this
  }

  function setAxes() {

    xAxis.scale(xScale)
    yAxis.scale(yScale)

    xAxisG
      .transition()
      .duration(500)
      .call(xAxis)

    yAxisG
      .transition()
      .duration(500)
      .call(yAxis)
  }

  mbs.metric1 = function(m) {
    if (!m) return metric1
    metric1 = m
    return this
  }

  mbs.metric2 = function(m) {
    if (!m) return metric2
    metric2 = m 
    return this
  }

  return mbs
}

