import NavigationMenu from "@/components/navigationmenu/NavigationMenu.vue";
import InfoBox from "@/components/infobox/InfoBox.vue";
import dataUtils from "@/utils/dataUtils";
import Keycloak from "keycloak-js"

// import BrokersPage from "@/pages/brokers/BrokersPage.vue";

export default {
    components: {
        NavigationMenu,
        InfoBox
    },
    data: () => ({
        drawer: null,
        breadcrumbs: [],
        showBusyIndicator: false,
        uiTitle: "IDS Configuration Manager",
        errorSnackbar: false,
        errorText: ""
    }),
    watch: {
        $route() {
            this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        },
        uiTitle: function () {
            document.title = this.$data.uiTitle;
        }
    },
    mounted: function () {
        var keycloak = new Keycloak({
            url: 'http://localhost:9090/auth/',
            realm: 'myrealm',
            clientId: 'myclient'
        });
        keycloak.init({
            onLoad: 'login-required'
        }).then(function () {
            console.log(">>> INIT COMPLETE");
            keycloak.loadUserProfile().then(info => {
                console.log(">>> USER INFO: ", info);
            });
        });
        console.log(">>> KEYCLOAK: ", keycloak);
        if (process.env.VUE_APP_UI_TITLE !== undefined && process.env.VUE_APP_UI_TITLE != "#UI_TITLE#") {
            this.$data.uiTitle = process.env.VUE_APP_UI_TITLE;
        }
        this.setTitleFromConnector();
        this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        this.$root.$on('showBusyIndicator', (show) => {
            this.$data.showBusyIndicator = show;
        });
        this.$root.$on('error', (errorText) => {
            this.$data.errorText = errorText + " (See logs for details)";
            this.$data.errorSnackbar = true;
        });
    },
    methods: {
        async setTitleFromConnector() {
            let connectorData = (await dataUtils.getConnectorSettings());
            this.$data.uiTitle = connectorData.title;
        }
    }
};
