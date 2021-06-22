import Axios from "axios";

let backendUrl = "http://localhost:8083";

console.log("VUE_APP_UI_BACKEND_URL: ", process.env.VUE_APP_UI_BACKEND_URL);

if (process.env.VUE_APP_UI_BACKEND_URL !== undefined && process.env.VUE_APP_UI_BACKEND_URL != "#UI_BACKEND_URL#") {
    backendUrl = process.env.VUE_APP_UI_BACKEND_URL;
}

export default {
    post(url, data) {
        return Axios.post(url, data);
    },

    call(type, url, params, body) {
        return this.post(backendUrl + "/", {
            "toConnector": false,
            "type": type,
            "url": url,
            "params": params,
            "body": body
        })
    },

    callConnector(type, url, params, body) {
        return this.post(backendUrl + "/", {
            "toConnector": true,
            "type": type,
            "url": url,
            "params": params,
            "body": body
        })
    }
}
