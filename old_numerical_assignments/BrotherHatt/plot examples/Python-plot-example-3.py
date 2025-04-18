from matplotlib import pyplot as plt

plt.close('all')

# parameters for case 1

x01=1.0
v1=2.2

# parameters for case 2

x02=-1.0
v2=3.4

tmax=3.0

numpoints=60

t=[]
x1=[]
x2=[]

for n in range(numpoints):
    t.append(n*tmax/numpoints)
    x1.append(x01+v1*t[n])
    x2.append(x02+v2*t[n])

plt.plot(t,x1,label='case 1')
plt.plot(t,x2,label='case 2')
plt.title('x vs t')
plt.xlabel('time, t (s)')
plt.ylabel('position, x (m)')
plt.legend()
plt.show()

