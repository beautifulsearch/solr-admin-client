// const axios = require('axios');

/**
 * Solr Core Admin API as per https://lucene.apache.org/solr/guide/8_1/coreadmin-api.html
 * @param url
 * @constructor
 */
function SolrCoreAdmin(url) {
  this.url = url;
}

SolrCoreAdmin.prototype.do_get = function (url, params, headers) {
  if (typeof (params) == 'undefined') params = {};
  if (typeof (headers) == 'undefined') headers = {};
  var url_params = Object.keys(params).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  }).join('&');
  console.log(url_params);
  const actual_url = url + "?" + url_params;
  return axios.get(actual_url, {headers: headers});
};

SolrCoreAdmin.prototype.status = function (name) {
  const params = {"action": "STATUS"};
  if (typeof (name) !== 'undefined') {
    params['core'] = name;
  }
  return this.do_get(this.url, params);
};

SolrCoreAdmin.prototype.create = function (name, instance_dir = "", config_set = "_default") {
  const params = {"action": "CREATE", "name": name, "instance_dir": instance_dir, "configSet": config_set};
  return this.do_get(this.url, params);
};

SolrCoreAdmin.prototype.delete = function (name, delete_index = false, delete_data_dir = false, delete_instance_dir = false) {
  const params = {
    "action": "UNLOAD",
    "core": name,
    "deleteInstanceDir": delete_instance_dir,
    "deleteDataDir": delete_data_dir,
    "deleteIndex": delete_index
  };
  return this.do_get(this.url, params);
};

SolrCoreAdmin.prototype.reload = function (name) {
  const params = {"action": "RELOAD", "core": name};
  return this.do_get(this.url, params);
};

SolrCoreAdmin.prototype.rename = function (name, other) {
  const params = {"action": "RENAME", "core": name, "other": other};
  return this.do_get(this.url, params);
};

SolrCoreAdmin.prototype.swap = function (name, other) {
  const params = {"action": "SWAP", "core": name, "other": other};
  return this.do_get(this.url, params);
};

/**
 * Schema API as per https://lucene.apache.org/solr/guide/8_1/schema-api.html
 * @param url
 * @constructor
 */
function SolrSchemaAdmin(url) {
  this.url = url;
}

SolrSchemaAdmin.prototype.do_get = function (url, params, headers) {
  if (typeof (params) == 'undefined') params = {};
  if (typeof (headers) == 'undefined') headers = {};
  var url_params = Object.keys(params).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  }).join('&');
  var actual_url = url;
  if (url_params.length > 0)  actual_url += "?" + url_params;
  return axios.get(actual_url, {headers: headers});
};

SolrSchemaAdmin.prototype.do_post = function (url, body, headers) {
  if (typeof (body) == 'undefined') body = {};
  if (typeof (headers) == 'undefined') headers = {};
  return axios.post(url, body, {headers: headers});
};

SolrSchemaAdmin.prototype.listFields = function (name) {
  const params = {};
  if (typeof (name) !== 'undefined') {
    params['fl'] = name;
  }
  return this.do_get(this.url + "/schema/fields", params);
};

SolrSchemaAdmin.prototype.listFieldTypes = function (name) {
  const params = {};
  if (typeof (name) !== 'undefined') {
    params['name'] = name;
  }
  return this.do_get(this.url + "/schema/fieldtypes", params);
};

SolrSchemaAdmin.prototype.listCopyFields = function (source_fl='',dest_fl='') {
  const params = {};
  if (source_fl.length > 0) params['source_fl'] = source_fl;
  if (dest_fl.length > 0) params['dest_fl'] = dest_fl;

  return this.do_get(this.url + "/schema/copyfields", params);
};

SolrSchemaAdmin.prototype.addFieldType = function (field_type_definition) {
  return this.do_post(this.url + "/schema", {"add-field-type": field_type_definition});
};

SolrSchemaAdmin.prototype.deleteFieldType = function (name) {
  return this.do_post(this.url + "/schema", {"delete-field-type": {name:name}});
};

SolrSchemaAdmin.prototype.addField= function (field_definition) {
  return this.do_post(this.url + "/schema", {"add-field": field_definition});
};

SolrSchemaAdmin.prototype.deleteField= function (name) {
  return this.do_post(this.url + "/schema", {"delete-field": {name:name}});
};

SolrSchemaAdmin.prototype.deleteCopyField= function (source_fl='',dest_fl='') {
  const params = {};
  if (source_fl.length > 0) params['source'] = source_fl;
  if (dest_fl.length > 0) params['dest'] = dest_fl;
  return this.do_post(this.url + "/schema", {"delete-copy-field": params});
};
