/*
Code Chunk Resources
Written by Addison Ballif
April 2025

This file contains all the tools you need to add code chunks to the OpenStax textbook. 


*/

class PythonCodeCell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Set the shadow DOM content, including the button
    this.shadowRoot.innerHTML = `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css" /> 

      <style>
        textarea {
          font-family: Courier, monospace;
          font-size: 16px; 
          line-height: 1.1;
          color: #311b1d;
          background-color: #dbe4de5c;
        }
        .CodeMirror {
          font-size: 14px; 
        }
        button {
          margin: 0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }
      </style>
      <textarea id="codeInput" style="width: 100%;"></textarea>
      <button id="runButton">Run</button><button id="resetButton">Reset Code</button><button id="copyButton">Copy Code</button>
      <textarea id="output" style="width: 100%;" disabled></textarea>
      <div id="plot"></div>    
    `;
  }

  async connectedCallback() {
    // Load the default text
    this.codeEditor = CodeMirror.fromTextArea(this.shadowRoot.querySelector('#codeInput'), {
      mode: { 
        name: "python", 
        version: 3, 
        singleLineStringErrors: false
      }, 
      lineNumbers: true, 
      showInvisibles: true,
      lineWrapping: true,
      indentUnit: 4, 
      tabSize: 4,
      matchBrackets: true
    });
    this.codeEditor.setValue(this.innerHTML.trim());

    // pyodide gets assigned to this cell by the main page

    // Attach event listener to button
    this.shadowRoot.querySelector('#runButton').addEventListener('click', this.runCode.bind(this));
    this.shadowRoot.querySelector('#resetButton').addEventListener('click', this.resetCode.bind(this));
    this.shadowRoot.querySelector('#copyButton').addEventListener('click', this.copycode.bind(this));
  }
  

  // Run Python code using Pyodide
  async runCode() {
    
    if (!this.pyodide) {
      this.shadowRoot.querySelector('#output').value = 'Python is not available.';
      return;
    }

    try {

      // Clear the old graphing stuff
      const plotparent = this.shadowRoot.querySelector('#plot')
      while (plotparent.lastElementChild) {
        plotparent.removeChild(plotparent.lastChild);
      }

      // Run the python
      this.shadowRoot.querySelector('#output').value = await this.pyodide.runPython(this.codeEditor.getValue());
      
      // If it says undefined, then just make it blank because just saying undefined is weird. 
      if (this.shadowRoot.querySelector('#output').value == 'undefined') {
        this.shadowRoot.querySelector('#output').value = ""
      }

      // MOVE THE PLOTS TO WHERE THEY SHOULD BE
      const newMplObjects = document.querySelectorAll(`[id*="matplotlib_"]`)
      // I'm going to rename the new stuff so that these won't show up in the 
      // query in the future. This also means that this query includes only the stuff from this run. 
      
      newMplObjects.forEach(function(element) {
        var highestObject = element;
        while (highestObject.parentElement.id.startsWith("matplotlib_")) {
          highestObject = highestObject.parentElement;
        }
        // now we know we have the parent
        if (!plotparent.querySelector(highestObject.id)) {
          // If the parent isn't already in the plotparent object
          plotparent.appendChild(highestObject);
        }

        // change the id of the object
        element.id = "plotobject" + cellSuffix
      });


    } catch (error) {
      // Show errors in the output textarea
      this.shadowRoot.querySelector('#output').value = `Error: ${error.message}`;
    }
  }

  // This function resets the code
  async resetCode() {
    // set the editor back to the default value
    this.codeEditor.setValue(this.innerHTML.trim());
  }

  // This function copies the code to the clipboard
  async copycode() {
    navigator.clipboard.writeText(this.codeEditor.getValue())
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  }

}
customElements.define('python-code-cell', PythonCodeCell);
