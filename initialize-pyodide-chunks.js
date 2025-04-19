// This sets up the pyodide so all cells have the same "kernel"
// It also overrides the built in print so that it can display printed results in
// the HTML textarea. 

(async () => {
    const pyodide = await loadPyodide();
    // micropip allows installing packages
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");

    //install the packages we might use on this page
    await micropip.install('numpy');
    await micropip.install('matplotlib')

    // Define manipulate function for animations
    try {
    await pyodide.runPython(`from pyodide.ffi import create_proxy
from js import document

def Manipulate(func, xlim=(-10, 10), ylim=(-5, 5), tlim=(0, 10)):
    import js

    # Create the FunctionPlot element
    plot = document.createElement("manipulate-plot")
    plot.setAttribute("xlim", f"{xlim[0]},{xlim[1]}")
    plot.setAttribute("ylim", f"{ylim[0]},{ylim[1]}")
    plot.setAttribute("tlim", f"{tlim[0]},{tlim[1]}")   
    
    # Assign function directly
    plot.func = create_proxy(func)

    # Append to the page
    plot.id = "newest-manipulate"
    document.body.appendChild(plot)
    # It will get moved later. 
`)

    } catch (error) {
      console.log(error)
    } 

  
    // Pass the shared pyodide instance to all custom elements
    document.querySelectorAll('python-code-cell').forEach(el => {
      el.pyodide = pyodide;
    });
  })();