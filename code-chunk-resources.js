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

    // Check if this is the first cell (for runPrevious logic)
    const allCells = document.querySelectorAll('python-code-cell');
    this.isFirst = allCells[0] === this;

    // Determine whether this cell is hideable
    this.isHideable = this.hasAttribute('hideable'); 

    // Hide the editor by default if hideable
    const isHidden = this.isHideable ? 'hidden' : '';

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
        .hidden {
          display: none;
        }
      </style>

      ${this.isHideable ? `<button id="toggleEditorButton" class="btn btn-secondary btn-sm mb-2">Show Python Editor</button>` : ''}

      <div id="editorContainer" class="${isHidden}">
        <textarea id="codeInput" style="width: 100%;"></textarea>
        <button id="runButton">Run</button>
        <button id="resetButton">Reset Code</button>
        <button id="copyButton">Copy Code</button>
        ${!this.isFirst ? '<button id="runPrevious">Run Previous</button>' : ''}
        <textarea id="output" style="width: 100%;" disabled rows='5'></textarea>
        <div id="plot"></div>
      </div>
    `;
  }

  async connectedCallback() {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.initializeCodeMirror();
      }, 0);
    });

    // Attach event listener to button
    this.shadowRoot.querySelector('#runButton').addEventListener('click', this.runCode.bind(this));
    this.shadowRoot.querySelector('#resetButton').addEventListener('click', this.resetCode.bind(this));
    this.shadowRoot.querySelector('#copyButton').addEventListener('click', this.copycode.bind(this));
    if (!this.isFirst) {
      this.shadowRoot.querySelector('#runPrevious').addEventListener('click', this.runPrevious.bind(this));
    }

    // Hook up toggle button if hideable
    if (this.isHideable) {
      const toggleButton = this.shadowRoot.querySelector('#toggleEditorButton');
      const editorContainer = this.shadowRoot.querySelector('#editorContainer');
      toggleButton.addEventListener('click', () => {
        editorContainer.classList.toggle('hidden');
        toggleButton.textContent = editorContainer.classList.contains('hidden') ? 'Show Python Editor' : 'Hide Python Editor';
        if (!editorContainer.classList.contains('hidden')) {
          this.codeEditor.refresh();
        }
      });
    }
  }

  initializeCodeMirror() {
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
      viewportMargin: 1,
      matchBrackets: true
    });
  
    this.codeEditor.setValue(this.innerHTML.trim());
  
    this.codeEditor.on("change", () => {
      this.codeEditor.setSize(null, (this.codeEditor.lineCount() * parseInt(getComputedStyle(this.codeEditor.getWrapperElement()).lineHeight, 10) + 30) + "px");
    });
  
    this.codeEditor.setSize(null, (this.codeEditor.lineCount() * parseInt(getComputedStyle(this.codeEditor.getWrapperElement()).lineHeight, 10) + 30) + "px");
  }

  // Run Python code using Pyodide
  async runCode() {
    
    if (!this.pyodide) {
      this.shadowRoot.querySelector('#output').value = 'Python Initializing. Try again in a moment.';
      return;
    }

    try {
      // Clear the old graphing stuff
      const plotparent = this.shadowRoot.querySelector('#plot')
      while (plotparent.lastElementChild) {
        plotparent.removeChild(plotparent.lastChild);
      }

      // Run the python
      let outputLines = []; // saves the printed lines as we go
      this.pyodide.setStdout({ batched: (msg) => outputLines.push(msg) });
      await this.pyodide.runPython(this.codeEditor.getValue());
      const result = outputLines.join("\n");
      this.shadowRoot.querySelector('#output').value = result;
      
      // If it says undefined, then just make it blank because just saying undefined is weird. 
      if (this.shadowRoot.querySelector('#output').value == '') {
        this.shadowRoot.querySelector('#output').value = `Python executed successfully at ${(new Date()).toLocaleTimeString()}`;
      }

      // MOVE THE PLOTS TO WHERE THEY SHOULD BE
      const newMplObjects = document.querySelectorAll(`[id*="matplotlib_"]`)
      if (newMplObjects.length > 0) {
        const Mplids = Array.from(newMplObjects).map(el => el.id);
        
        // I'm going to rename the new stuff so that these won't show up in the 
        // query in the future. This also means that this query includes only the stuff from this run. 
        
        // The parent's id is a substring of all the others, so find that one. 
        const parentid = Mplids.find(candidate =>
          Mplids.every(other => 
            candidate === other || other.includes(candidate)
          )
        );
        plotparent.appendChild(document.querySelector('#' + parentid)) // add the mpl parent to the plotparent object

        // Now rename all the mpl objects
        newMplObjects.forEach(function(element) {
          element.id = "plotobject";
        });
      }

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

  // This function runs all previous cells
  async runPrevious() {
    const allCells = Array.from(document.querySelectorAll('python-code-cell'));
    const index = allCells.indexOf(this);
    const previousCells = allCells.slice(0, index);

    for (const cell of previousCells) {
      // Wait for each cell to finish before moving on
      if (typeof cell.runCode === 'function') {
        await cell.runCode();
      }
    }

    this.shadowRoot.querySelector('#output').value = `Previous cells executed at ${(new Date()).toLocaleTimeString()}`;
  }
}

customElements.define('python-code-cell', PythonCodeCell);
