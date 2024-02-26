(function () {
    class ExternalScript extends HTMLElement {
        constructor() {
            super();            
        }

        connectedCallback() {
                var script = document.createElement('script');
                script.defer = 1;
                script.src = 'https://url.to.the.script.js';
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        }     
    
    customElements.define("script-element", ExternalScript);
})();
