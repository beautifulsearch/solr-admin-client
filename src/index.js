const axios = require("axios");

class Solr {
  constructor(instance = "", core) {
    this.core = core;
    let url = instance;

    // validate url for http(s)
    var pattern = /^((http|https):\/\/)/;
    if (!pattern.test(url)) {
      throw new Error("URL should start with http:// or https://");
    }

    // create url object and extract the base url
    const urlComponent = new URL(url);
    url = urlComponent.origin;

    // setup simple auth if required
    if (urlComponent.username && urlComponent.password) {
      this.auth = {
        username: urlComponent.username,
        password: urlComponent.password
      };
    }

    const baseURL = `${url}/solr`;
    this.instance = axios.create({
      baseURL,
      auth: this.auth
    });
  }

  query(query, { }) {
    const params = {
      q: q || "*:*", // q is the query prameter, to select all use *:*
      qf: null, // what all fields to query on, + seperated
      fl: null, // what fields to return in the response, , seperated
    };

    return this.instance.get(`/${this.core}/select`, { params });
  }

  createCore(name, instance_dir = "", config_set = "_default") {
    const params = {
      action: "CREATE",
      name: name,
      instance_dir: instance_dir,
      configSet: config_set
    };

    return this.instance.get("/admin/cores", { params });
  }

  getStatus() {
    // return this.instance.get('/api/cores');
    const params = {
      action: "STATUS"
    };

    if (this.core) {
      params.core = this.core;
    }

    return this.instance.get("/admin/cores", { params });
  }

  getSchema() {
    // return this.instance.get(`/api/cores/${core}/schema`);
    return this.instance.get(`/${this.core}/schema/fields`);
  }

  getFields() {
    return this.instance.get(`/${this.core}/schema/fieldtypes`);
  }

  addField(defination) {
    const params = {
      "add-field": {
        ...defination,
        stored: true
      }
    };

    return this.instance.post(`/${this.core}/schema`, params);
  }

  uploadJson(fileName, fileContent) {
    const params = {
      action: "import-json",
      saveAs: fileName
    };

    return this.instance.post(`/${this.core}/beautifulsearch`, fileContent, {
      params
    });
  }

  completeImport(fileName, idField) {
    const params = {
      action: "import-json",
      file: fileName,
      idField
    };

    return this.instance.post(`/${this.core}/beautifulsearch`, null, {
      params
    });
  }

  deleteField(name) {
    const params = {
      "delete-field": {
        name
      }
    };

    return this.instance.post(`/${this.core}/schema`, params);
  }
}

module.exports = Solr;
