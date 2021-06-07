import PageStructure from "@/pages/PageStructure";
import authenticationUtils from "../../utils/authenticationUtils";

export default {
  props: [],
  name: "navigation-menu",
  data() {
    return {
      items: null,
      activeRoute: null
    }
  },
  mounted: function () {
    this.$data.activeRoute = this.$route;
    this.loadMenuItems();
  },
  watch: {
    $route() {
      this.$data.activeRoute = this.$route;
    },
  },
  methods: {
    loadMenuItems() {
      var items = [];
      for (let page of PageStructure.getPageStructure()) {
        let subitems = undefined;
        if (page.subpages !== undefined && page.subpages.length > 0) {
          subitems = [];
          for (let subpage of page.subpages) {
            subitems.push({
              icon: subpage.icon,
              title: PageStructure.getDisplayName(subpage.name),
              to: subpage.path
            });
          }
        }
        if (page.roles !== undefined) {
          console.log(">>> authenticationUtils.hasRole(page.roles[0]): ", authenticationUtils.hasRole(page.roles[0]));
        }
        if (page.roles === undefined || authenticationUtils.hasRole(page.roles[0])) {
          items.push({
            icon: page.icon,
            title: page.name,
            to: page.path,
            subitems: subitems
          });
        }
      }
      this.$data.items = items;
    },
    isActive(item) {

      let active = false;
      if (this.$data.activeRoute != null) {
        if (item.to != null && item.to.replace("/", "") == this.$data.activeRoute.path.replace("/", "")) {
          active = true;
        } else if (this.$data.activeRoute.meta.parent != null && item.to != null && this.$data.activeRoute.meta.parent.path != null && item.to.replace("/", "") == this.$data.activeRoute.meta.parent.path.replace("/", "")) {
          active = true;
        }
      }
      return active;
    }
  }
}
