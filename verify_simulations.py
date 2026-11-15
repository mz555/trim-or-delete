import numpy as np
from scipy.stats import t
rng=np.random.default_rng(20261115)
N=20000
rows=[]
for dist,n,gamma in [('normal',20,.1),('normal',20,.2),('normal',50,.2),('lognormal',20,.2),('lognormal',50,.2)]:
    if dist=='normal':
        A=rng.normal(size=(N,n));B=rng.normal(size=(N,n))
    else:
        A=rng.lognormal(size=(N,n));B=rng.lognormal(size=(N,n))
    g=int(np.floor(gamma*n));h=n-2*g
    sA=np.sort(A,axis=1);sB=np.sort(B,axis=1)
    cA=sA[:,g:n-g];cB=sB[:,g:n-g]
    wA=np.clip(sA,sA[:,g,None],sA[:,n-g-1,None]);wB=np.clip(sB,sB[:,g,None],sB[:,n-g-1,None]);
    d=cA.mean(axis=1)-cB.mean(axis=1)
    q1=(n-1)*wA.var(axis=1,ddof=1)/(h*(h-1));q2=(n-1)*wB.var(axis=1,ddof=1)/(h*(h-1));
    ydf=(q1+q2)**2/(q1*q1/(h-1)+q2*q2/(h-1))
    yp=2*t.sf(np.abs(d)/np.sqrt(q1+q2),ydf)
    v1=cA.var(axis=1,ddof=1)/h;v2=cB.var(axis=1,ddof=1)/h
    wdf=(v1+v2)**2/(v1*v1/(h-1)+v2*v2/(h-1))
    wp=2*t.sf(np.abs(d)/np.sqrt(v1+v2),wdf)
    rows.append((dist,n,gamma,round(np.mean(yp<.05),4),round(np.mean(wp<.05),4)))
print('distribution,n_per_group,trim_each_tail,Yuen_false_positive_rate,naive_Welch_false_positive_rate')
for row in rows: print(*row,sep=',')
