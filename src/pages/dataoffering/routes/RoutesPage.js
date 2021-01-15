import * as d3 from "d3";
import NodeDialog from "@/pages/dataoffering/routes/dialog/NodeDialog.vue";
import AddBackendDialog from "@/pages/dataoffering/routes/dialog/AddBackendDialog.vue";
import AddAppDialog from "@/pages/dataoffering/routes/dialog/AddAppDialog.vue";
import dataUtils from "../../../utils/dataUtils";

export default {
    components: {
        NodeDialog,
        AddBackendDialog,
        AddAppDialog
    },
    data() {
        return {
            nodes: [],
            connections: [],
            backendConnections: [],
            apps: []
        };
    },
    mounted: function () {
        this.getBackendConnections();
        this.getApps();
    },
    methods: {
        getBackendConnections() {
            dataUtils.getBackendConnections(backendConnections => {
                this.$data.backendConnections = backendConnections;
            });
        },
        getApps() {
            dataUtils.getApps(apps => {
                this.$data.apps = apps;
            });
        },
        handleEditNode(node) {
            this.$refs.nodeDialog.title = "Edit " + node.name;
            this.$refs.nodeDialog.dialog = true;
        },
        handleEditConnection(connection) {
            console.log(">>> handleEditConnection: ", connection);
        },
        showAddBackendDialog() {
            this.$refs.addBackendDialog.show(this.$data.backendConnections);
        },
        showAddAppDialog() {
            this.$refs.addAppDialog.show(this.$data.apps);
        },
        getBackendConnection(id) {
            var result = null;
            for (var backendConnection of this.$data.backendConnections) {
                if (id == backendConnection.routeId) {
                    result = backendConnection;
                    break;
                }
            }
            return result;
        },
        getApp(id) {
            var result = null;
            for (var app of this.$data.apps) {
                if (id == app.id) {
                    result = app;
                    break;
                }
            }
            return result;
        },
        addBackend(backendId) {
            var backend = this.getBackendConnection(backendId);
            this.$refs.chart.add({
                id: +new Date(),
                x: 20,
                y: 150,
                name: 'Backend',
                type: 'backendnode',
                text: backend.url,
                approvers: [],
            });
        },
        addApp(appId) {
            var app = this.getApp(appId);
            this.$refs.chart.add({
                id: +new Date(),
                x: 300,
                y: 150,
                name: 'App',
                type: 'appnode',
                text: app.title,
                approvers: [],
            });
        },
        saveRoute() {
            this.$refs.chart.save();
        },
        handleChartSave(nodes, connections) {
            console.log(">>> handleChartSave: ", nodes);
            console.log(">>> CONN: ", connections);
        },
        render: function (g, node, isSelected) {
            node.width = node.width || 120;
            node.height = node.height || 180;
            let borderColor = isSelected ? "#666666" : "#bbbbbb";
            let resourceNode = g.append("rect").attr("class", "resourcenode");
            resourceNode
                .style("width", "100px");
            resourceNode.style("height", "50px");
            resourceNode
                .attr("x", node.x + 10)
                .attr("y", node.y);
            resourceNode.attr("stroke", borderColor);

            g.append("text")
                .attr("x", node.x + node.width / 2)
                .attr("y", node.y + 30)
                .attr("text-anchor", "middle")
                .attr("class", "unselectable")
                .text(() => "Resource");

            g.append("line").attr("class", "resourceline").attr("x1", node.x + 60)
                .attr("y1", node.y + 60)
                .attr("x2", node.x + 60)
                .attr("y2", node.y + 50);

            let nodeRect = g.append("rect").classed(node.type, true);
            nodeRect
                .style("width", "120px");
            nodeRect.style("height", "120px");
            nodeRect.attr("stroke", borderColor);
            nodeRect
                .attr("x", node.x)
                .attr("y", node.y + 60);
            if (isSelected) {
                nodeRect.classed("selectedNode", true);
            }

            g.append("text")
                .attr("x", node.x + node.width / 2)
                .attr("y", node.y + 80)
                .attr("text-anchor", "middle")
                .attr("class", "unselectable")
                .text(() => node.name)
                .each(function wrap() {
                    let self = d3.select(this),
                        textLength = self.node().getComputedTextLength(),
                        text = self.text();
                    while (textLength > node.width - 2 * 4 && text.length > 0) {
                        text = text.slice(0, -1);
                        self.text(text + "...");
                        textLength = self.node().getComputedTextLength();
                    }
                });

            // < defs >
            //     <
            //     !--define lines
            // for text lies on-- >
            // <
            // path id = "path1"
            // d = "M10,30 H100 M10,60 H100 M10,90 H100 M10,120 H100" > < /path> <
            //     /defs>  <
            //     text transform = "translate(80,255)"
            // fill = "red"
            // font - size = "20" >
            //     <
            //     textPath xlink: href = "#path1" > This is a long long long text...... < /textPath> <
            //     /text>

            g.append("defs").append("path").attr("id", "path1").attr("d", "M10,20 H100 M10,40 H100 M10,60 H100 M10,80 H100");
            g.append("text")
                .attr("style", "font-size: 11px")
                .attr("transform", "translate(" + (node.x) + ", " + (node.y + 100) + ")")
                .attr("class", "unselectable").append("textPath").attr("xlink:href", "#path1").text(node.text);

        }
    }
};
