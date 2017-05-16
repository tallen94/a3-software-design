let vis2 = function() {

  let svg = d3.select('#vis2')
    .append('svg')

  let mbs = MultiBarScatter()
  let date

  let vis = function(_d, call) {
    date = _d
    d3.csv('scrapes/profile/' + date + '.csv', (err, profiles) => {
      let data = {
        max: _.maxBy(profiles, function(d) {
          return +d.registration_date
        }).registration_date,
        min: _.minBy(profiles, function(d) {
          return +d.registration_date
        }).registration_date,
        profiles: _.sortBy(_.map(profiles, (profile, pi) => {
          profile.key = "User" +  pi
          return profile
        }), 'registration_date')
      }
      svg = svg.data([data])
      if (call) svg.call(mbs)
      else mbs.data(data).date(date).draw()
    })
  }

  $('input').on('change', function() {
    var value = $(this).val()
    if (value !== mbs.metric1() && value !== mbs.metric2()) {
      if ($(this).hasClass("metric1")) {
        mbs.metric1(value).draw()
      } else {
        mbs.metric2(value).draw()
      }
    }
  })

  return vis
}