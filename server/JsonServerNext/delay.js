import pause from "connect-pause"

export default (req, res, next) => {
  // NOTE: for some reason unknown to me, if the default is 0, the tests seems to add 2 seconds
  // NOTE: to each test, a default value of 1 does not seem to be effected by that issue
  let temp = parseFloat(req.query._delay)
  const _delay = !isNaN(temp) ? temp : 1
  delete req.query._delay
  pause(_delay)(req, res, next)
}
