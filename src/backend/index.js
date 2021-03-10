import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 80;
let configModelHost = "localhost";
let configModelPort = 8081;

console.log("CONFIGMANAGER_HOST", process.env.CONFIGMANAGER_HOST);
if (process.env.CONFIGMANAGER_HOST !== undefined) {
    configModelHost = process.env.CONFIGMANAGER_HOST;
}

if (process.env.CONFIGMANAGER_PORT !== undefined) {
    configModelPort = process.env.CONFIGMANAGER_PORT;
}

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function post(url, data) {
    console.log(">>> POST " + url);
    return axios.post(url, data);
}

function put(url, data) {
    console.log(">>> PUT " + url);
    return axios.put(url, data);
}

function get(url) {
    console.log(">>> GET " + url);
    return axios.get(url);
}

function del(url) {
    console.log(">>> DELETE " + url);
    return axios.delete(url);
}

app.get('/connector', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/connector").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /connector", error.response.status);
        res.send(error);
    });
});

app.get('/attributes', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/attributes/properties/" + req.query.type).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /attributes", error.response.status);
        res.send(error);
    });
});

app.post('/connector/endpoint', (req, res) => {
    var params = "?accessUrl=" + req.query.accessUrl;
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/connector/endpoint" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /connector/endpoint", error.response.status);
        res.send(error);
    });
});

app.get('/resources', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/resources").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /resources", error);
        res.send(error);
    });
});

app.get('/resource', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/resource?resourceId=" + req.query.resourceId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /resource", error.response.status);
        res.send(error);
    });
});

app.post('/resource', (req, res) => {
    var params = "?title=" + req.query.title + "&description=" + req.query.description +
        "&language=" + req.query.language + "&keyword=" + req.query.keyword + "&version=" + req.query.version + "&standardlicense=" +
        req.query.standardlicense + "&publisher=" + req.query.publisher;
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.put('/resource', (req, res) => {
    var params = "?resourceId=" + req.query.resourceId + "&title=" + req.query.title +
        "&description=" + req.query.description + "&language=" + req.query.language + "&keyword=" + req.query.keyword +
        "&version=" + req.query.version + "&standardlicense=" + req.query.standardlicense + "&publisher=" +
        req.query.publisher;
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/resource" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /resource", error.response.status);
        res.send(error);
    });
});

app.delete('/resource', (req, res) => {
    del("http://" + configModelHost + ":" + configModelPort + "/api/ui/resource?resourceId=" + req.query.resourceId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /resource", error.response.status);
        res.send(error);
    });
});

app.put('/contract', (req, res) => {
    var params = "?resourceId=" + req.query.resourceId;
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/resource/contract" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /contract", error.response.status);
        res.send(error);
    });
});

app.post('/representation', (req, res) => {
    // TODO filename extension and byte size should not be set in UI.
    var params = "?resourceId=" + req.query.resourceId + "&endpointId=" + req.query.endpointId + "&language=" + req.query.language + "&filenameExtension=json" +
        "&bytesize=1234&sourceType=" + req.query.sourceType;
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/resource/representation" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /representation", error.response.status);
        res.send(error);
    });
});

app.put('/representation', (req, res) => {
    // TODO filename extension and byte size should not be set in UI.
    var params = "?resourceId=" + req.query.resourceId + "&representationId=" + req.query.representationId +
        "&endpointId=" + req.query.endpointId + "&language=" + req.query.language + "&filenameExtension=json" +
        "&bytesize=1234&sourceType=" + req.query.sourceType;
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/resource/representation" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /representation", error.response.status);
        res.send(error);
    });
});

app.get('/approutes', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel").then(response => {
        res.send(response.data["ids:appRoute"]);
    }).catch(error => {
        console.log("Error on GET /approutes", error.response.status);
        res.send(error);
    });
});

app.get('/approute', (req, res) => {
    var params = "?routeId=" + req.query.routeId;
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/approute" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /approute", error.response.status);
        res.send(error);
    });
});

app.get('/approute/step/endpoint/info', (req, res) => {
    var params = "?routeId=" + req.query.routeId + "&endpointId=" + req.query.endpointId;
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/approute/step/endpoint/info" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /approute/step/endpoint/info", error.response.status);
        res.send(error);
    });
});

app.get('/generic/endpoints', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/generic/endpoints").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /generic/endpoints", error.response.status);
        res.send(error);
    });
});

app.post('/generic/endpoint', (req, res) => {
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/generic/endpoint?accessURL=" + encodeURIComponent(req.query.accessUrl) + "&username=" +
        encodeURIComponent(req.query.username) + "&password=" + encodeURIComponent(req.query.password)).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on POST /generic/endpoint", error.response.status);
            res.send(error);
        });
});

app.put('/generic/endpoint', (req, res) => {
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/generic/endpoint?id=" + encodeURIComponent(req.query.id) + "&accessURL=" +
        encodeURIComponent(req.query.accessUrl) + "&username=" + encodeURIComponent(req.query.username) + "&password=" +
        encodeURIComponent(req.query.password)).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on PUT /generic/endpoint", error.response.status);
            res.send(error);
        });
});

app.delete('/generic/endpoint', (req, res) => {
    del("http://" + configModelHost + ":" + configModelPort + "/api/ui/generic/endpoint?endpointId=" +
        encodeURIComponent(req.query.endpointId)).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on DELETE /generic/endpoint", error.response.status);
            res.send(error);
        });
});

app.put('/approute', (req, res) => {
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/approute/endpoint?routeId=" + req.query.routeId + "&endpointId=" +
        req.query.endpointId + "&accessUrl=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on POST /resource", error.response.status);
            res.send(error);
        });
});

app.delete('/approute', (req, res) => {
    del("http://" + configModelHost + ":" + configModelPort + "/api/ui/approute?routeId=" + req.query.routeId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /approute", error.response.status);
        res.send(error);
    });
});

app.get('/apps', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/apps").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /apps", error.response.status);
        res.send(error);
    });
});

app.get('/test', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel").then(response => {
        let output = "";
        let configmodel = response.data;
        if (configmodel["ids:appRoute"] !== undefined) {
            output += "App Routes: " + configmodel["ids:appRoute"].length + "<br>";
            for (let route of configmodel["ids:appRoute"]) {
                output += "&emsp;Route Starts: " + route["ids:appRouteStart"].length + "<br>";
                for (let start of route["ids:appRouteStart"]) {
                    output += "&emsp;&emsp;Endpoint URL: " + start["ids:accessURL"]["@id"] + "<br>";
                }
            }
        }
        res.send(output);
    }).catch(error => {
        console.log("Error on GET /test", error);
        res.send(error);
    });
});

app.get('/brokers', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/brokers").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /brokers", error.response.status);
        res.send(error);
    });
});

app.post('/broker', (req, res) => {
    let params = "?brokerUri=" + encodeURIComponent(req.query.brokerUri) + "&title=" + encodeURIComponent(req.query.title);
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker", error.response.status);
        res.send(error);
    });
});

app.post('/broker/register', (req, res) => {
    let params = "?brokerUri=" + encodeURIComponent(req.query.brokerUri);
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker/register" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/register", error.response.status);
        res.send(error);
    });
});

app.post('/broker/unregister', (req, res) => {
    let params = "?brokerUri=" + encodeURIComponent(req.query.brokerUri);
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker/unregister" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/unregister", error.response.status);
        res.send(error);
    });
});

app.post('/broker/update/resource', (req, res) => {
    let params = "?brokerUri=" + req.query.brokerUri + "&resourceId=" + req.query.resourceId;
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker/update/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/update/resource", error.response.status);
        res.send(error);
    });
});

app.get('/broker/resource/information', (req, res) => {
    let params = "?resourceId=" + req.query.resourceId;
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker/resource/information" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /broker/resource/information", error.response.status);
        res.send(error);
    });
});

app.post('/broker/delete/resource', (req, res) => {
    let params = "?brokerUri=" + encodeURIComponent(req.query.brokerUri) + "&resourceId=" + encodeURIComponent(req.query.resourceId);
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker/delete/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/delete/resource", error.response.status);
        res.send(error);
    });
});

app.put('/broker', (req, res) => {
    let params = "?brokerUri=" + encodeURIComponent(req.query.brokerUri) + "&title=" + encodeURIComponent(req.query.title);
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /broker", error.response.status);
        res.send(error);
    });
});

app.delete('/broker', (req, res) => {
    del("http://" + configModelHost + ":" + configModelPort + "/api/ui/broker?brokerUri=" + encodeURIComponent(req.query.brokerId)).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /broker", error.response.status);
        res.send(error);
    });
});

app.get('/offeredresourcesstats', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let totalSize = 0;
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:instance"] !== undefined) {
                    totalSize += resource["ids:representation"][0]["ids:instance"][0]["ids:byteSize"];
                }
            }
        }
        res.send({
            totalNumber: resources.length,
            totalSize: totalSize
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/sourcetypesstats', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let sourceTypes = [];
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:sourceType"] !== undefined) {
                    let type = resource["ids:representation"][0]["ids:sourceType"];
                    if (sourceTypes[type] === undefined) {
                        sourceTypes[type] = 1;
                    } else {
                        sourceTypes[type] = sourceTypes[type] + 1;
                    }
                }
            }
        }
        let labels = [];
        let series = [];
        for (let sourceType in sourceTypes) {
            labels.push(sourceType);
            series.push(sourceTypes[sourceType]);
        }
        res.send({
            labels: labels,
            series: series
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/filetypesstats', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let filetypes = [];
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:sourceType"] !== undefined) {
                    let type = resource["ids:representation"][0]["ids:mediaType"]["ids:filenameExtension"];
                    if (filetypes[type] === undefined) {
                        filetypes[type] = 1;
                    } else {
                        filetypes[type] = filetypes[type] + 1;
                    }
                }
            }
        }
        let labels = [];
        let series = [];
        for (let filetype in filetypes) {
            labels.push(filetype);
            series.push(filetypes[filetype]);
        }
        res.send({
            labels: labels,
            series: series
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/proxy', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel/proxy").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /configmodel/proxy", error.response.status);
        res.send(error);
    });
});

app.put('/proxy', (req, res) => {
    let params = "?proxyUri=" + req.query.proxyUri + "&noProxyUri=" + req.query.noProxyUri + "&username=" +
        req.query.username + "&password=" + req.query.password;
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel/proxy" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /configmodel/proxy", error.response.status);
        res.send(error);
    });
});

app.get('/configmodel', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /configmodel", error.response.status);
        res.send(error);
    });
});

app.put('/configmodel', (req, res) => {
    let params = "?loglevel=" + req.query.logLevel + "&connectorDeployMode=" + req.query.connectorDeployMode + "&trustStore=" +
        req.query.trustStoreUrl + "&trustStorePassword=" + req.query.trustStorePassword + "&keyStore=" + req.query.keyStoreUrl +
        "&keyStorePassword=" + req.query.keyStorePassword;
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /configmodel", error.response.status);
        res.send(error);
    });
});

app.get('/connector', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/connector").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /connector", error.response.status);
        res.send(error);
    });
});

app.put('/connector', (req, res) => {
    let params = "?title=" + req.query.connectorTitle + "&description=" + req.query.connectorDescription +
        "&endpoint=" + req.query.connectorEndpoint + "&version=" + req.query.connectorVersion +
        "&curator=" + req.query.connectorCurator + "&maintainer=" + req.query.connectorMaintainer +
        "&inboundModelVersion=" + req.query.connectorInboundModelVersion + "&outboundModelVersion=" +
        req.query.connectorOutboundModelVersion;
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/connector" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /connector", error.response.status);
        res.send(error);
    });
});

app.get('/configmodel', (req, res) => {
    console.log("GET http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel");
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /configmodel", error.response.status);
        res.send(error);
    });
});

app.get('/route/deploymethod', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/route/deploymethod").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /route/deploymethod", error.response.status);
        res.send(error);
    });
});

app.post('/route/deploymethod', (req, res) => {
    let params = "?deployMethod=" + req.query.deployMethod;
    put("http://" + configModelHost + ":" + configModelPort + "/api/ui/route/deploymethod" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /route/deploymethod", error.response.status);
        res.send(error);
    });
});

app.get('/enum', (req, res) => {
    get("http://" + configModelHost + ":" + configModelPort + "/api/ui/enum/" + req.query.enumName).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /enum", error.response.status);
        res.send(error);
    });
});

app.post('/approute', (req, res) => {
    let params = "?description=" + req.query.description;
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/approute" + params).then(response => {
        console.log(">>> new route response: ", response.data);
        res.send(response.data.id);
    }).catch(error => {
        console.log("Error on POST /approute", error.response.status);
        res.send(error);
    });
});

app.post('/approute/step', (req, res) => {
    let params;
    if (req.query.resourceId == null) {
        params = "?routeId=" + req.query.routeId + "&startId=" + req.query.startId + "&startCoordinateX=" + req.query.startCoordinateX +
            "&startCoordinateY=" + req.query.startCoordinateY + "&endId=" + req.query.endId + "&endCoordinateX=" + req.query.endCoordinateX +
            "&endCoordinateY=" + req.query.endCoordinateY;
    } else {
        params = "?routeId=" + req.query.routeId + "&startId=" + req.query.startId + "&startCoordinateX=" + req.query.startCoordinateX +
            "&startCoordinateY=" + req.query.startCoordinateY + "&endId=" + req.query.endId + "&endCoordinateX=" + req.query.endCoordinateX +
            "&endCoordinateY=" + req.query.endCoordinateY + "&resourceId=" + req.query.resourceId;
    }
    post("http://" + configModelHost + ":" + configModelPort + "/api/ui/approute/step" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /approute/step", error.response.status);
        res.send(error);
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
