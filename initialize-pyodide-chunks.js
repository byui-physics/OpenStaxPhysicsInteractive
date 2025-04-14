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

  
    // Pass the shared pyodide instance to all custom elements
    document.querySelectorAll('python-code-cell').forEach(el => {
      el.pyodide = pyodide;
    });
  })();