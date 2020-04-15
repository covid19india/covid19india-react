#* @get /getTodaysPrediction
#* @serializer unboxedJSON

getPrediction <- function(){
  ##library(plumber)
  library(jsonlite)
  library(forecast)
  
  
  data = fromJSON("https://api.covid19india.org/data.json")
  
  noOfPredictions = 5
  
  l = length(data$cases_time_series$totalconfirmed) 
  data$cases_time_series$date = as.Date(data$cases_time_series$date, format = "%d %B")
  start_date = data$cases_time_series$date[1]
  res = start_date + sort(sample(0:(l+4)))
  s = as.numeric(data$cases_time_series$date[1] - as.Date("2020-01-01"))
  t = as.numeric(tail(data$cases_time_series$date,1) - as.Date("2020-01-01"))
  inp = as.numeric(data$cases_time_series$totalconfirmed[0:l])
  daily_total = ts(inp,start = c(2020,s), end=c(2020,t), frequency=365)
  autoArima_total = auto.arima(daily_total)
  total_forecast = forecast(autoArima_total, h = noOfPredictions)
  pl = plot(total_forecast)
  n = c(daily_total,pl$mean)
  lower = c(pl$lower)
  upper = c(pl$upper)
  lower = tail(lower, noOfPredictions) # for 95%
  upper = tail(upper, noOfPredictions)
  lower = c(daily_total,lower)
  upper = c(daily_total,upper)
  n = data.frame(mean = n, date = res, lower = lower, upper = upper)
  #n = list(n)
  #n = serializeJSON(obj)
  list('response' = n)
  
}