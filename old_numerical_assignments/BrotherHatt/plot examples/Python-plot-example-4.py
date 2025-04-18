from matplotlib import pyplot as plt

plt.close('all')

x01,v1=1.0,2.2
x02,v2=4.0,-1.5

tmax=3.0
numpoints=60

dt=tmax/numpoints

t=[n*dt for n in range(numpoints)]
# here we have used what is known as a 'list comprehension' or an 'in-line
# for loop'.  This single line produces the same result as the three lines
# t=[]
# for n in range(numpoints):
#      t.append(n*dt)

x1=[x01+v1*T for T in t]
x2=[x02+v2*T for T in t]

plt.plot(t,x1,'-r',label='x0='+str(x01)+', v='+str(v1))
plt.plot(t,x2,'-b',label='x0='+str(x02)+', v='+str(v2))
plt.title('x vs t')
plt.xlabel('time, t (s)')
plt.ylabel('position, x (m)')
plt.legend()
plt.show()

