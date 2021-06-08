import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import IDSResourcesPage from "@/pages/dataoffering/resources/IDSResourcesPage.vue";
import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";
import RoutesPage from "@/pages/dataoffering/routes/RoutesPage.vue";
import AddRoutePage from "@/pages/dataoffering/routes/addroute/AddRoutePage.vue";
import IDSResourcesPageConsumption from "@/pages/dataconsumption/resources/IDSResourcesPageConsumption.vue";
import AddResourcePageConsumption from "@/pages/dataconsumption/resources/addresource/AddResourcePageConsumption.vue";
import BrokersPage from "@/pages/brokers/BrokersPage.vue";
import AppsPage from "@/pages/apps/AppsPage.vue";
import SettingsPage from "@/pages/settings/SettingsPage.vue";
import BackendConnectionsPage from "@/pages/dataoffering/backendconnections/BackendConnectionsPage.vue";

let role_admin = "admin";
let role_consumer = "consumer";
let role_provider = "provider";

export default {
    getPageStructure() {
        this.getRoleNames();

        return [{
            path: "dashboard",
            name: "Dashboard",
            icon: "icon-dashboard",
            component: DashboardPage,
            subpages: []
        },
        {
            path: null,
            name: "Data Offering",
            icon: "icon-dataoffering",
            component: null,
            subpages: [{
                path: "idresourcesoffering",
                name: "IDS Resources (Offering)",
                component: IDSResourcesPage,
                subpages: [{
                    path: "addresource",
                    name: "Add Resource",
                    component: AddResourcePage,
                    subpages: []
                }, {
                    path: "editresource",
                    name: "Edit Resource",
                    component: AddResourcePage,
                    subpages: []
                }]
            }, {
                path: "backendconnectionsoffering",
                name: "Backend Connections (Offering)",
                component: BackendConnectionsPage
            }, {
                path: "routesoffering",
                name: "Routes (Offering)",
                component: RoutesPage,
                subpages: [{
                    path: "addroute",
                    name: "Add Route",
                    component: AddRoutePage,
                    subpages: []
                }, {
                    path: "editroute",
                    name: "Edit Route",
                    component: AddRoutePage,
                    subpages: []
                }]
            }],
            roles: [role_provider, role_admin]
        }, {
            path: null,
            name: "Data Consumption",
            icon: "icon-dataconsumption",
            component: null,
            subpages: [{
                path: "idresourcesconsumption",
                name: "IDS Resources (Consumption)",
                component: IDSResourcesPageConsumption,
                subpages: [{
                    path: "addresourceconsumption",
                    name: "Add Resource (Consumption)",
                    component: AddResourcePageConsumption,
                    subpages: []
                }, {
                    path: "editresource",
                    name: "Edit Resource",
                    component: AddResourcePageConsumption,
                    subpages: []
                }]
            }, {
                path: "backendconnectionsconsumption",
                name: "Backend Connections (Consumation)",
                component: null
            }, {
                path: "routesconsumption",
                name: "Routes (Consumation)",
                component: null
            }],
            roles: [role_consumer, role_admin]
        }, {
            path: "brokers",
            name: "Brokers",
            icon: "icon-brokers",
            component: BrokersPage,
            subpages: []
        }, {
            path: "apps",
            name: "Apps",
            icon: "icon-apps",
            component: AppsPage,
            subpages: []
        }, {
            path: "settings",
            name: "Settings",
            icon: "icon-settings",
            component: SettingsPage,
            subpages: [],
            roles: [role_admin]
        }
        ];
    },
    getDisplayName(name) {
        var displayName = name;
        if (displayName.indexOf('(') != -1) {
            displayName = displayName.substring(0, displayName.indexOf('('));
        }
        return displayName;
    },
    getRoleNames() {
        if (process.env.VUE_APP_ROLE_NAME_ADMIN !== undefined && process.env.VUE_APP_ROLE_NAME_ADMIN != "#ROLE_NAME_ADMIN#") {
            role_admin = process.env.VUE_APP_ROLE_NAME_ADMIN;
        }

        if (process.env.VUE_APP_ROLE_NAME_CONSUMER !== undefined && process.env.VUE_APP_ROLE_NAME_CONSUMER != "#ROLE_NAME_CONSUMER#") {
            role_admin = process.env.VUE_APP_ROLE_NAME_CONSUMER;
        }

        if (process.env.VUE_APP_ROLE_NAME_PROVIDER !== undefined && process.env.VUE_APP_ROLE_NAME_PROVIDER != "#ROLE_NAME_PROVIDER#") {
            role_admin = process.env.VUE_APP_ROLE_NAME_PROVIDER;
        }
    }
}
