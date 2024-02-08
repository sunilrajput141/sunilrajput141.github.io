(function() {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    </style>
    <div>
      <img id="qrCodeImage" alt="QR Code">
    </div>
  `;

  class Widget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({
        mode: "open"
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }

    async connectedCallback() {
      this.myfunction();
    }

    async myfunction() {
      const size= this._props.size|| 150;
      const data = this._props.data || 'Example';
      const bgcolor = this._props.bgcolor.replace("#","") || '000';
      const color = this._props.color.replace("#","") || 'FFF';
      const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}&bgcolor=${bgcolor}&color=${color}`;

      const qrCodeImage = this.shadowRoot.getElementById('qrCodeImage');
      qrCodeImage.src = imageUrl;
      qrCodeImage.width = size;
      qrCodeImage.height = size;
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties
      };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      this.myfunction();
    }
  }

  customElements.define("com-rohitchouhan-sap-qrcodewidget", Widget);
})();
