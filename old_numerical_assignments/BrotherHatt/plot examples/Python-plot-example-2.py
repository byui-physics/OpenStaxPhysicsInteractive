from matplotlib import pyplot as plt

plt.close('all')

# parameters for plot

x0=1.0
v=2.2
tmax=3.0

numpoints=60

t=[]
x=[]
for n in range(numpoints):
    t.append(n*tmax/numpoints)
    x.append(x0+v*t[n])

plt.plot(t,x)
plt.title('x vs t')
plt.xlabel('time, t (s)')
plt.ylabel('position, x (m)')
plt.show()
