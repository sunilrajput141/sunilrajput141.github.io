(function () {
    class ExternalScript extends HTMLElement {
        constructor() {
            super();            
        }

        connectedCallback() {
                var script = document.createElement('script');
                script.defer = 1;
                script.src = 'https://github.airbus.corp/pages/Airbus/Test_CutomWidget_SP000DCF/Webcomponent.js';
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        }     
    
    customElements.define("script-element", ExternalScript);
})();
