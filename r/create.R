require(RJSONIO);

dataMaker = function(x) {
  return(toJSON(rnorm(x)))
}