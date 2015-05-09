require(RJSONIO)

calcData = function(x) {
  x <- fromJSON(x);
  y <- x^2 - 0.5* mean(x);
  
  return(toJSON(y));
}
