import Axios from "axios";
import dataUtils from "../../../../utils/dataUtils";
import ResourceMetaDataPage from "./metadata/ResourceMetaDataPage.vue";
import ResourcePolicyPage from "./policy/ResourcePolicyPage.vue";
import ResourceRepresentationPage from "./representation/ResourceRepresentationPage.vue";
import ResourceBrokersPage from "./brokers/ResourceBrokersPage.vue";

export default {
    components: {
        ResourceMetaDataPage,
        ResourcePolicyPage,
        ResourceRepresentationPage,
        ResourceBrokersPage
    },
    props: ['fromRoutePage'],
    data() {
        return {
            currentResource: null,
            isNewResource: false,
            active_tab: 0,
            resourceAttributes: null,
            resourceRequiredAttributes: null,
            representationAttributes: null,
            representationRequiredAttributes: null,
            fileAttributes: null,
            fileRequiredAttributes: null,
            readonly: false
        };
    },
    mounted: function () {
        if (this.$route.query.id === undefined) {
            this.$data.currentResource = null;
            this.$data.isNewResource = true;
        } else {
            this.loadResource(this.$route.query.id);
        }
    },
    methods: {
        previousPage() {
            this.$data.active_tab--;
            this.tabChanged();
        },

        nextPage() {
            this.$data.active_tab++;
            this.tabChanged();
        },
        tabChanged() {
            console.log(this.$refs.pagestab, this.$data.active_tab);
            if (this.$data.active_tab == 1) {
                if (this.$refs.policyPage !== undefined) {
                    this.$refs.policyPage.gotVisible();
                }
            } else if (this.$data.active_tab == 2) {
                if (this.$refs.representationPage !== undefined) {
                    this.$refs.representationPage.gotVisible();
                }
            } else if (this.$data.active_tab == 3) {
                if (this.$refs.brokersPage !== undefined) {
                    this.$refs.brokersPage.gotVisible();
                }
            }
        },
        loadResource(id) {
            this.$root.$emit('showBusyIndicator', true);
            dataUtils.getResource(id, resource => {
                this.$data.currentResource = resource;
                this.$data.isNewResource = false;
                this.$refs.metaDataPage.loadResource(this.$data.currentResource);
                this.$refs.policyPage.loadResource(this.$data.currentResource);
                this.$refs.representationPage.loadResource(this.$data.currentResource);
                this.$refs.brokersPage.loadResource(this.$data.currentResource);
                this.$root.$emit('showBusyIndicator', false);
                this.$forceUpdate();
            });
        },
        set(resource) {
            this.$data.currentResource = resource;
            this.$data.isNewResource = false;
            this.$refs.metaDataPage.loadResource(this.$data.currentResource);
            this.$refs.policyPage.loadResource(this.$data.currentResource);
            this.$refs.representationPage.loadResource(this.$data.currentResource);
            this.$refs.brokersPage.loadResource(this.$data.currentResource);
            this.$data.active_tab = 0;
        },
        setReadOnly(readonly) {
            this.$data.readonly = readonly;
            this.$refs.metaDataPage.readonly = readonly;
        },
        save() {
            var genericEndpointId = null;
            if (this.$refs.representationPage.selected.length > 0) {
                genericEndpointId = this.$refs.representationPage.selected[0].id;
            }
            var title = this.$refs.metaDataPage.title;
            var description = this.$refs.metaDataPage.description;
            var language = this.$refs.metaDataPage.language;
            var keywords = this.$refs.metaDataPage.keywords;
            var version = this.$refs.metaDataPage.version;
            var standardlicense = this.$refs.metaDataPage.standardlicense;
            var publisher = this.$refs.metaDataPage.publisher;
            var contractJson = this.$refs.policyPage.getContractJson();
            var sourceType = this.$refs.representationPage.sourceType;
            var brokerList = this.$refs.brokersPage.getBrokerNewList()
            let brokerDeleteList = this.$refs.brokersPage.getBrokerDeleteList();

            if (this.fromRoutePage == 'true') {
                // On route page this data is initially stored only in the node and will be saved with the route.
                this.$emit("saved", title, description, language, keywords, version, standardlicense, publisher,
                    contractJson, sourceType, brokerList);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                if (this.$data.currentResource == null) {
                    dataUtils.createResource(title, description, language, keywords, version, standardlicense, publisher,
                        contractJson, sourceType, brokerList, genericEndpointId, () => {
                            this.$router.push('idresourcesoffering');
                            this.$root.$emit('showBusyIndicator', false);
                        });
                } else {
                    dataUtils.editResource(this.$data.currentResource.id, this.$data.currentResource.representationId,
                        title, description, language, keywords, version, standardlicense, publisher, contractJson,
                        sourceType, brokerList, brokerDeleteList, genericEndpointId, () => {
                            this.$router.push('idresourcesoffering');
                            this.$root.$emit('showBusyIndicator', false);
                        });
                }
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
