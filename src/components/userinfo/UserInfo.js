import Keycloak from "keycloak-js"

export default {
    props: [],
    data() {
        return {
            keycloak: null,
            username: "",
            fullname: "",
            email: ""
        }
    },
    mounted: function () {
        this.$data.keycloak = new Keycloak({
            url: 'http://localhost:9090/auth/',
            realm: 'ids',
            clientId: 'configmanager'
        });
        let that = this;
        this.$data.keycloak.init({
            onLoad: 'login-required'
        }).then(function () {
            console.log(">>> INIT COMPLETE");
            that.$data.keycloak.loadUserProfile().then(info => {
                console.log(">>> USER INFO: ", info);
                that.$data.username = info.username;
                that.$data.fullname = info.firstName + " " + info.lastName;
                that.$data.email = info.email;
            });
        });
        console.log(">>> KEYCLOAK: ", this.$data.keycloak);
    },
    methods: {
        logout() {
            this.$data.keycloak.logout();
        }
    }
}
