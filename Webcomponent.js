(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = 
    `<button type="button" id="myBtn">Scroll up</button>` ;   
   
    class Scrollup_btn extends HTMLElement {
        constructor() {
            super();
            this.init();           
        }

        init() {            
            let shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.addEventListener("click", event => {
              var event = new Event("onClick");
              this.fireChanged();           
              this.dispatchEvent(event);
            });
           
          }

        fireChanged() {
            console.log(scrollableElements);
            console.table(scrollableElements);
            console.log(elementScrolling);            
            elementScrolling.scrollTo(0,0);
           		        }        
        
    }

    customElements.define('com-button-scrollup', Scrollup_btn);

    const isScrollable = element => element.scrollHeight > element.clientHeight;
    const scrollableElements = Array.from(document.querySelectorAll('*[style*="overflow"]')).filter(isScrollable);
    const elementScrolling = scrollableElements[1];
})();
