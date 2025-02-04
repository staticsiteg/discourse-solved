import I18n from "I18n";
import { getOwner } from "discourse-common/lib/get-owner";

export default {
  shouldRender(args, component) {
    const router = getOwner(this).lookup("router:main");

    if (
      !component.siteSettings.show_filter_by_solved_status ||
      router.currentPath === "discovery.categories"
    ) {
      return false;
    } else if (component.siteSettings.allow_solved_on_all_topics) {
      return true;
    } else {
      const controller = getOwner(this).lookup(
        "controller:navigation/category"
      );
      return controller && controller.get("category.enable_accepted_answers");
    }
  },

  setupComponent(args, component) {
    const statuses = ["all", "solved", "unsolved"].map((status) => {
      return {
        name: I18n.t(`solved.topic_status_filter.${status}`),
        value: status,
      };
    });
    component.set("statuses", statuses);

    const queryStrings = window.location.search;
    if (queryStrings.match(/solved=yes/)) {
      component.set("status", "solved");
    } else if (queryStrings.match(/solved=no/)) {
      component.set("status", "unsolved");
    } else {
      component.set("status", "all");
    }
  },

  actions: {
    changeStatus(newStatus) {
      const router = getOwner(this).lookup("router:main");
      if (newStatus && newStatus !== "all") {
        newStatus = newStatus === "solved" ? "yes" : "no";
      }
      router.transitionTo({ queryParams: { solved: newStatus } });
    },
  },
};
