/*
Code Chunk Resources
Written by Addison Ballif
April 2025

This file contains all the tools you need to add code chunks to the OpenStax textbook. 


*/

class MyComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      // Bind the method to the class instance
      this.handleClick = this.handleClick.bind(this);
  
      // Set the shadow DOM content, including the button
      this.shadowRoot.innerHTML = `
        <style>
          p {
            color: blue;
            font-weight: bold;
          }
          button {
            margin-top: 10px;
          }
        </style>
        <p>${this.innerHTML.trim() || 'Default text if none provided'}</p>
        <button id="myButton">Click me!</button>
      `;
    }
  
    // Define the function that will be called when the button is clicked
    handleClick() {
      alert('Button inside MyComponent was clicked!');
    }
  
    // Lifecycle method when the component is added to the DOM
    connectedCallback() {
      // Add event listener to the button
      this.shadowRoot.querySelector('#myButton').addEventListener('click', this.handleClick);
    }
  
    // Lifecycle method when the component is removed from the DOM
    disconnectedCallback() {
      // Remove event listener to avoid memory leaks
      this.shadowRoot.querySelector('#myButton').removeEventListener('click', this.handleClick);
    }
  }
  
  // Register the custom element
  customElements.define('my-component', MyComponent);
  