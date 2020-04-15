library(plumber)
library(forecast)
library(jsonlite)

r = plumb("/root/alpha/git/mine/covid19india-react/src/components/Charts/predictFunctions.R")

r$run(port=8000)
