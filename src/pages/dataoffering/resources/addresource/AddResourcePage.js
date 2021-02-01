import Axios from "axios";
import ResourceMetaDataPage from "./metadata/ResourceMetaDataPage.vue";
import ResourcePolicyPage from "./policy/ResourcePolicyPage.vue";
import ResourceRepresentationPage from "./representation/ResourceRepresentationPage.vue";

export default {
    components: {
        ResourceMetaDataPage,
        ResourcePolicyPage,
        ResourceRepresentationPage
    },
    data() {
        return {
            currentResource: null,
            active_tab: 0,
            resourceAttributes: null,
            resourceRequiredAttributes: null,
            representationAttributes: null,
            representationRequiredAttributes: null,
            fileAttributes: null,
            fileRequiredAttributes: null
        };
    },
    mounted: function () {
        if (this.$route.query.id === undefined) {
            this.$data.currentResource = null;
        } else {
            this.loadResource(this.$route.query.id);
        }
    },
    methods: {
        previousPage() {
            this.$data.active_tab--;
        },

        nextPage() {
            this.$data.active_tab++;
        },
        loadResource(id) {
            this.$root.$emit('showBusyIndicator', true);
            Axios.get("http://localhost:80/resource?resourceId=" + id).then(response => {
                this.$data.currentResource = response.data;
                this.$refs.metaDataPage.loadResource(this.$data.currentResource);
                this.$root.$emit('showBusyIndicator', false);
                this.$forceUpdate();
            }).catch(error => {
                console.log("Error in loadResource(): ", error);
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        save() {
            this.$root.$emit('showBusyIndicator', true);
            console.log(">>> SAVE: ", this.$refs.representationPage.selected[0]);
            var endpointId = this.$refs.representationPage.selected[0].id;
            var title = this.$refs.metaDataPage.title;
            var description = this.$refs.metaDataPage.description;
            var language = this.$refs.metaDataPage.language;
            var keyword = this.$refs.metaDataPage.keywords;
            var version = this.$refs.metaDataPage.version;
            var standardlicense = this.$refs.metaDataPage.standardlicense;
            var publisher = this.$refs.metaDataPage.publisher;
            var contractJson = "";
            if (this.$refs.policyPage !== undefined) {
                contractJson = this.$refs.policyPage.contractJson;
            } else if (this.$data.currentResource != null) {
                contractJson = this.$data.currentResource["ids:contractOffer"][0];
            }
            var sourceType = this.$refs.representationPage.sourceType;
            // TODO user should select brokers
            var brokerList = [];
            Axios.get("http://localhost:80/brokers").then(response => {
                let brokers = response.data;
                for (let broker of brokers) {
                    brokerList.push(broker[1]["brokerUri"]);
                }
                this.saveResource(title, description, language, keyword, version, standardlicense, publisher, contractJson, sourceType, brokerList, endpointId);
            }).catch(error => {
                console.log("Error in save(): ", error);
            });



        },
        saveResource(title, description, language, keyword, version, standardlicense, publisher, contractJson, sourceType, brokerList, endpointId) {

            if (this.$data.currentResource == null) {
                let params = "?title=" + title + "&description=" + description + "&language=" +
                    language + "&keyword=" + keyword + "&version=" + version + "&standardlicense=" + standardlicense +
                    "&publisher=" + publisher + "&brokerList=" + brokerList;
                Axios.post("http://localhost:80/resource" + params).then((response) => {
                    let resourceId = response.data.resourceID;
                    params = "?resourceId=" + resourceId;
                    Axios.put("http://localhost:80/contract" + params, contractJson).then(() => {
                        params = "?resourceId=" + resourceId + "&endpointId=" + endpointId + "&language=" + language + "&sourceType=" + sourceType;
                        Axios.post("http://localhost:80/representation" + params).then(() => {
                            this.$router.push('idresourcesoffering');
                            this.$root.$emit('showBusyIndicator', false);
                        }).catch(error => {
                            console.log("Error in saveResource(): ", error);
                            this.$root.$emit('showBusyIndicator', false);
                        });
                    }).catch(error => {
                        console.log("Error in saveResource(): ", error);
                        this.$root.$emit('showBusyIndicator', false);
                    });

                }).catch(error => {
                    console.log("Error in saveResource(): ", error);
                    this.$root.$emit('showBusyIndicator', false);
                });
            } else {
                let params = "?resourceId=" + this.$data.currentResource["@id"] + "&title=" + title +
                    "&description=" + description + "&language=" + language + "&keyword=" + keyword + "&version=" + version +
                    "&standardlicense=" + standardlicense + "&publisher=" + publisher;
                Axios.put("http://localhost:80/resource" + params, contractJson).then(() => {
                    this.$router.push('idresourcesoffering');
                    this.$root.$emit('showBusyIndicator', false);
                }).catch(error => {
                    console.log("Error in saveResource(): ", error);
                    this.$root.$emit('showBusyIndicator', false);
                });
            }
        },
        async getResourceAttributes() {
            this.$data.resourceAttributes = (
                await Axios.get("http://localhost:80/attributes?type=resource")
            ).data;
            for (let att of this.$data.resourceAttributes) {
                if (att[2] == "true") {
                    this.$data.resourceRequiredAttributes[
                        this.$data.resourceRequiredAttributes.length
                    ] = att;
                }
            }
            this.attributesReceived();
        },
        async getRepresentationAttributes() {
            this.$data.representationAttributes = (
                await Axios.get("http://localhost:80/attributes?type=representation")
            ).data;
            for (let att of this.$data.representationAttributes) {
                if (att[2]) {
                    this.$data.representationRequiredAttributes[
                        this.$data.representationRequiredAttributes.length
                    ] = att;
                }
            }
            this.attributesReceived();
        },
        async getFileAttributes() {
            this.$data.fileAttributes = (
                await Axios.get("http://localhost:80/attributes?type=file")
            ).data;
            for (let att of this.$data.fileAttributes) {
                if (att[2]) {
                    this.$data.fileRequiredAttributes[
                        this.$data.fileRequiredAttributes.length
                    ] = att;
                }
            }
            this.attributesReceived();
        },
        attributesReceived() {
            if (
                this.$data.resourceAttributes != null &&
                this.$data.representationAttributes != null &&
                this.$data.fileAttributes != null
            ) {
                this.$forceUpdate();
            }
        },
        async postResource(resource) {
            this.$data.alldata = [];
            const response = (
                await Axios.post("http://localhost:80/resource", resource)
            ).data;
            console.log("RESPONSE: ", response);
        },
    },
};
