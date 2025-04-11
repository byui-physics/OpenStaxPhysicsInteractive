// This sets up the pyodide so all cells have the same "kernel"
  
(async () => {
    const pyodide = await loadPyodide();
    // micropip allows installing packages
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");

    //install the packages we might use on this page
    await micropip.install('numpy');
    await micropip.install('matplotlib')

    // overwrite the print function so that it looks like it works. 
    pyodide.runPython(`
def print(*args):
    return args
    `)
  
    // Pass the shared pyodide instance to all custom elements
    document.querySelectorAll('python-code-cell').forEach(el => {
      el.pyodide = pyodide;
    });
  })();