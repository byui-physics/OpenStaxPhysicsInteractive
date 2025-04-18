# In order to make plots, we need to tell Python how to make plots.
# The instructions Python needs are in a separate module, and we need 
# to tell Python where it is.  We do this by using an import statement.

from matplotlib import pyplot as plt

# Now we can access any commends in pyplot by using a prefix plt. followed
# by the command.

# When Python draws a plot, it will draw it in a plot window if one is
# already open -- even if something else has already been plotted in that
# window.  To avoid this, a close statment can be included.

plt.close('all')

# Now we can specify the values of parameters x0 and v and tmax (which is
# how far along t we want to plot).

x0 = 1.0
v = 2.2
tmax=3.0

# Python makes a plot by creating a dot to dot, and then connecting the dots.
# So, we need to determine where the dots are.  That is, we need the t and x
# values for the dots (for this case, t goes on the horizontal axis, and x
# goes on the vertical axis).  We can do this by picking an interval dt that
# is how far apart the points are along the t axis (horizontal). To make 
# smoother looking curves, make dx smaller.  To make everything run faster,
# make dx larger. Overall, make dx small enough but not too small.

dt=0.01

# Now for each t value we can calculate an x value.  We need to store each of
# these values in lists (which # in Python we enclose in square brackets [ ] ).
# We can do all of this using either a for loop or a while loop.  A while loop
# is a bit easier in many cases.  Begin by defining a list for t (that has the
# value 0 in it) and a list for x (that has the value x0 in it).

t=[0.0]
x=[x0]
 
# Now use a while loop to determine values for x and y, and add them to the
# lists using append commands.  Here we note that x[0] refers to the first 
# element of a list, x[1] is the second element, and so on.  The last element
# can be accessed as x[-1]

while t[-1]<tmax:
    t.append(t[-1]+dt)
    x.append(x0+v*t[-1])

# now we can make a plot, and show it

plt.plot(t,x)
plt.show()
