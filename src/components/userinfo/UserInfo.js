import authenticationUtils from "../../utils/authenticationUtils";

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
        let that = this;
        authenticationUtils.loadUserProfile().then(info => {
            console.log(">>> USER PROFILE: ", info);
            that.$data.username = info.username;
            that.$data.fullname = info.firstName + " " + info.lastName;
            that.$data.email = info.email;
        });
    },
    methods: {
        logout() {
            authenticationUtils.logout();
        }
    }
}
