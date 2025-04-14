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

    // overwrite the print function so that it looks like it works. 
    pyodide.runPython(`
import builtins
import io

def custom_print(*args, **kwargs):
    buffer = io.StringIO()
    builtins.print(*args, file=buffer, **kwargs)  # Write to buffer
    output_str = buffer.getvalue()
    buffer.close()
    
    builtins.print(output_str, end="")  # Print to console
    return output_str

print = custom_print
    `)
  
    // Pass the shared pyodide instance to all custom elements
    document.querySelectorAll('python-code-cell').forEach(el => {
      el.pyodide = pyodide;
    });
  })();