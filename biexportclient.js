(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="export_div" name="export_div" class="openbihideonprint">
         <slot name="export_button"></slot>
      </div>
    `;

    class BiExportClient extends HTMLElement {

        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._export_settings = {};
            this._export_settings.record_delimiter = "\n";
            this._export_settings.field_delimiter = "\t";
            this._export_settings.include_header = true;
            this._export_settings.data_format = "raw";
            this._export_settings.export_mode = "CLIPBOARD";

            this._renderExportButton();
        }

        connectedCallback() {
        }

        disconnectedCallback() {
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            if (this._designMode) {
                this._exportButton.setEnabled(false);
            }
        }

        _renderExportButton() {
            let buttonSlot = document.createElement("div");
            buttonSlot.slot = "export_button";
            this.appendChild(buttonSlot);

            this._exportButton = new sap.m.Button({
                text: "Export",
                press: () => {
                    this.doExport(this.exportMode);
                }
            });
            this._exportButton.placeAt(buttonSlot);
        }

        get exportDataSource() {
            return this._export_settings.export_datasource;
        }
        set exportDataSource(value) {
            this._export_settings.export_datasource = value;
        }

        // SETTINGS

        getRecordDelimiter() {
            return this.recordDelimiter;
        }
        setRecordDelimiter(value) {
            this.recordDelimiter = value;
        }

        get recordDelimiter() {
            return this._export_settings.record_delimiter;
        }
        set recordDelimiter(value) {
            this._export_settings.record_delimiter = value;
        }


        getFieldDelimiter() {
            return this.fieldDelimiter;
        }
        setFieldDelimiter(value) {
            this.fieldDelimiter = value;
        }

        get fieldDelimiter() {
            return this._export_settings.field_delimiter;
        }
        set fieldDelimiter(value) {
            this._export_settings.field_delimiter = value;
        }


        getIncludeHeader() {
            return this.includeHeader;
        }
        setIncludeHeader(value) {
            this.includeHeader = value;
        }

        get includeHeader() {
            return this._export_settings.include_header;
        }
        set includeHeader(value) {
            this._export_settings.include_header = value;
        }


        getDataFormat() {
            return this.dataFormat;
        }
        setDataFormat(value) {
            this.dataFormat = value;
        }

        get dataFormat() {
            return this._export_settings.data_format;
        }
        set dataFormat(value) {
            this._export_settings.data_format = value;
        }


        getExportMode() {
            return this.exportMode;
        }
        setExportMode(value) {
            this.exportMode = value;
        }

        get exportMode() {
            return this._export_settings.export_mode;
        }
        set exportMode(value) {
            this._export_settings.export_mode = value;
        }

        // DATASOURCE

        getDataSource() {
            return this.dataBindings.getDataBinding().getDataSource();
        }

        setModel(modelId) {
            return this.dataBindings.getDataBinding().setModel(modelId);
        }
        openSelectModelDialog() {
            return this.dataBindings.getDataBinding().openSelectModelDialog();
        }

        getDimensions() {
            return this.dataBindings.getDataBinding().getDimensions("dimensions");
        }
        addDimension(dimensionId) {
            return this.dataBindings.getDataBinding().addDimensionToFeed("dimensions", dimensionId);
        }
        removeDimension(dimensionId) {
            return this.dataBindings.getDataBinding().removeDimension(dimensionId);
        }

        getMeasures() {
            return this.dataBindings.getDataBinding().getMembers("measures");
        }
        addMeasure(measureId) {
            return this.dataBindings.getDataBinding().addMemberToFeed("measures", measureId);
        }
        removeMeasure(measureId) {
            return this.dataBindings.getDataBinding().removeMember(measureId);
        }


        doExport(mode) {
            if (this._designMode) {
                return false;
            }

            let datasource = this._export_settings.export_datasource;

            let data = datasource.data;
            let metadata = datasource.metadata;

            if (!data || !data.length) {
                console.error("[biExportClient] No data:", datasource);
                return;
            }

            let dimensions = metadata.dimensions;
            let measures = metadata.mainStructureMembers;
            let feeds = metadata.feeds;

            let feedDimensions = feeds.dimensions.values;
            let feedMeasures = feeds.measures.values;

            let recordDelimiter = this.recordDelimiter;
            let fieldDelimiter = this.fieldDelimiter;
            let dataFormat = this.dataFormat;

            let rows = [];

            if (this.includeHeader) {
                let row = [];
                for (let j = 0; j < feedDimensions.length; j++) {
                    let id = feedDimensions[j];
                    row.push(dimensions[id].description);
                }
                for (let j = 0; j < feedMeasures.length; j++) {
                    let id = feedMeasures[j];
                    row.push(measures[id].label);
                }
                rows.push(row);
            }

            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                let row = [];
                for (let j = 0; j < feedDimensions.length; j++) {
                    let id = feedDimensions[j];
                    row.push(d[id].label);
                }
                for (let j = 0; j < feedMeasures.length; j++) {
                    let id = feedMeasures[j];
                    row.push(d[id][dataFormat]);
                }
                rows.push(row);
            }

            let text = rows.map(r => r.join(fieldDelimiter)).join(recordDelimiter);

            let textBlob = new Blob([text], {
                type: "text/plain"
            });

            switch (mode) {
                case "CLIPBOARD":
                    let table = document.createElement("table");
                    if (this.includeHeader) {
                        let headerRow = rows.shift();
                        let tr = document.createElement("tr");
                        for (let i = 0; i < headerRow.length; i++) {
                            let th = document.createElement("th");
                            th.textContent = headerRow[i];
                            tr.appendChild(th);
                        }
                        let thead = document.createElement("thead");
                        thead.appendChild(tr);
                        table.appendChild(thead);
                    }
                    let tbody = document.createElement("tbody");
                    for (let i = 0; i < rows.length; i++) {
                        let row = rows[i];
                        let tr = document.createElement("tr");
                        for (let j = 0; j < row.length; j++) {
                            let td = document.createElement("td");
                            td.textContent = row[j];
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                    }
                    table.appendChild(tbody);

                    let htmlBlob = new Blob([table.outerHTML], {
                        type: "text/html"
                    });

                    navigator.clipboard.write([
                        new ClipboardItem({
                            [textBlob.type]: textBlob,
                            [htmlBlob.type]: htmlBlob
                        })
                    ]);
                    break;
                case "FILE":
                    let downloadUrl = URL.createObjectURL(textBlob);
                    let a = document.createElement("a");
                    a.download = "export.csv";
                    a.href = downloadUrl;
                    document.body.appendChild(a);
                    a.click();

                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(downloadUrl);
                    }, 0);
                    break;
            }
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-exportclient", BiExportClient);
})();
