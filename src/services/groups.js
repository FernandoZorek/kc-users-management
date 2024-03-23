import { api } from "boot/axios";
import { Notify, SessionStorage } from "quasar";
import { realm } from "../components/variables.js";
import { i18n } from "boot/i18n";

const staticRealm = SessionStorage.getItem("multiTenancyRealm") || realm;
const uri = `/admin/realms/${staticRealm}/groups`;
const Groups = {
  async query(data) {
    return api
      .get(uri, data)
      .then((response) => {
        return response.data.data || response.data;
      })
      .catch((e) => {
        Notify.create({
          color: "negative",
          position: "top-right",
          message: i18n.t("errorLoadingData"),
          icon: "report_problem",
          timeout: 2000,
        });
      });
  },
  async create(data) {
    return api
      .post(uri, data)
      .then(() => {
        Notify.create({
          color: "positive",
          position: "top-right",
          message: i18n.t("saveData"),
          icon: "check",
          timeout: 2000,
        });
      })
      .catch((e) => {
        Notify.create({
          color: "negative",
          position: "top-right",
          message: i18n.t("errorSaveData"),
          icon: "report_problem",
          timeout: 2000,
        });
      });
  },
  async edit(data, id) {
    return api
      .put(`${uri}/${id}`, data)
      .then(() => {
        Notify.create({
          color: "positive",
          position: "top-right",
          message: i18n.t("saveData"),
          icon: "check",
          timeout: 2000,
        });
      })
      .catch((e) => {
        Notify.create({
          color: "negative",
          position: "top-right",
          message: i18n.t("errorSaveData"),
          icon: "report_problem",
          timeout: 2000,
        });
      });
  },
  async move(data, id) {
    return api
      .post(`${uri}/${id}/children`, data)
      .then(() => {
        Notify.create({
          color: "positive",
          position: "top-right",
          message: i18n.t("saveData"),
          icon: "check",
          timeout: 2000,
        });
      })
      .catch((e) => {
        Notify.create({
          color: "negative",
          position: "top-right",
          message: i18n.t("errorSaveData"),
          icon: "report_problem",
          timeout: 2000,
        });
      });
  },
  async delete(id) {
    return api
      .delete(`${uri}/${id}`)
      .then(() => {
        Notify.create({
          color: "positive",
          position: "top-right",
          message: i18n.t("saveData"),
          icon: "check",
          timeout: 2000,
        });
      })
      .catch((e) => {
        Notify.create({
          color: "negative",
          position: "top-right",
          message: i18n.t("errorSaveData"),
          icon: "report_problem",
          timeout: 2000,
        });
      });
  },
  async extract(data) {
    const subGroups = [];
    function extractPaths(groups) {
      const paths = [];
      if (groups) {
        for (const group of groups) {
          const extract = group.subGroups ? group.subGroups.length : 0;
          if (extract) {
            paths.push(group.path);
          } else {
            paths.push(group.path);
          }
          if (group.subGroups) {
            group.subGroups = extract ? extractPaths(group.subGroups) : [];
            subGroups.push(group);
          }
        }
      }
      return paths;
    }
    const newSubGroups = data.map((el) => {
      return {
        ...el,
        subGroups: el.subGroups.length ? extractPaths(el.subGroups) : [],
      };
    });
    const removeRepeats = Object.values(
      newSubGroups.concat(subGroups).reduce((acc, cur) => {
        acc[cur.path] = cur;
        return acc;
      }, {})
    );

    return removeRepeats;
  },
};

export default Groups;
