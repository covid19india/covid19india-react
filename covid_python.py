import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import style
#style.use('ggplot')
%matplotlib inline

import plotly
import plotly.express as px
import plotly.graph_objects as go
plt.rcParams['figure.figsize']=20,12
import cufflinks as cf
import plotly.offline as pyo
from plotly.offline import init_notebook_mode,plot,iplot

import folium

pyo.init_notebook_mode(connected=True)
cf.go_offline()
df=pd.read_excel(r"E:\Project\jupyter project\COVID-19-Data-Analyisis-master\Covid cases in India.xlsx")
df

df.drop(['S. No.'],axis=1)
df

df.drop(['S. No.'],axis=1,inplace=True)
df

df['Total Cases']=df['Total Confirmed cases (Indian National)']+df['Total Confirmed cases ( Foreign National )']
df

total_cases_overall=df['Total Cases'].sum()
print('The Total number of cases till now im India is ',total_cases_overall)


df['Active Cases']=df['Total Cases']-(df['Death']+df['Cured'])
df


df.style.background_gradient(cmap='Reds')

df.style.background_gradient(cmap='Blues')


Total_Active_Cases=df.groupby('Name of State / UT')['Active Cases']

#pandas vis
df.plot(kind='bar',x='Name of State / UT',y='Total Cases')
plt.show()
#plotly
df.iplot(kind='bar',x='Name of State / UT',y='Total Cases')


#matplotlib  vis
plt.bar(df['Name of State / UT'],df['Total Cases'])


px.bar(df,x='Name of State / UT',y='Total Cases')
df.iplot(kind='scatter',x='Name of State / UT',y='Total Cases',mode='markers+lines',title='My Graph',xTitle='Name of State / UT',yTitle='Total Cases',colors='Cyan',size=20)
px.scatter(df,x='Name of State / UT',y='Total Cases')
