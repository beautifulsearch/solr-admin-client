var core_admin = new SolrCoreAdmin("http://localhost:8983/solr/admin/cores");
core_admin.delete("test", true, true, true).catch(function () {
});

QUnit.test("list fields", async function (assert) {
  var done = assert.async();
  await core_admin.create("test_list_fields").catch(function () {
  });
  var schema_admin = new SolrSchemaAdmin("http://localhost:8983/solr/test_list_fields");
  var response = await schema_admin.listFields();
  assert.ok(0 == response.data.responseHeader.status);
  assert.ok(response.data.fields.length > 0);
  done();
  core_admin.delete("test_list_fields", true, true, true).catch(function () {
  });
});

QUnit.test("list field types", function (assert) {
  var done = assert.async();
  core_admin.create("test_list_field_types").then(async function () {
    var schema_admin = new SolrSchemaAdmin("http://localhost:8983/solr/test_list_field_types");
    schema_admin.listFieldTypes().then(function (response) {
      console.log(response);
      assert.ok(0 == response.data.responseHeader.status);
      assert.ok(response.data.fieldTypes.length > 0);
    }).catch(function (error) {
      // handle error
      console.log('Error:' + error);
      assert.ok(false, error);
    }).finally(function () {
      core_admin.delete("test_list_field_types", true, true, true);
      done();
    });
  });
});

QUnit.test("list copy fields", function (assert) {
  var done = assert.async();
  core_admin.create("test_list_copy_fields").then(function () {
    var schema_admin = new SolrSchemaAdmin("http://localhost:8983/solr/test_list_copy_fields");
    schema_admin.listCopyFields().then(function (response) {
      console.log(response)
      assert.ok(0 == response.data.responseHeader.status);
      assert.ok(response.data.copyFields.length > 0);
    }).catch(function (error) {
      // handle error
      console.log('Error:' + error);
      assert.ok(false, error);
    }).finally(function () {
      core_admin.delete("test_list_copy_fields", true, true, true).catch(function () {
      });
      done();
    });

  });
});

QUnit.test("add field type", function (assert) {
  const field_type_name = "beautifulsearch_test_field_type";
  var done = assert.async();
  var before_field_types = 0;
  var after_field_types = 0;

  var schema_admin = new SolrSchemaAdmin("http://localhost:8983/solr/test");
  core_admin.create("test").then(async function () {
    await schema_admin.deleteFieldType(field_type_name).catch(function () {
    });
    await schema_admin.listFieldTypes().then((response)=>before_field_types = response.data.fieldTypes.length);

    var json_field_defn = {
      "name": field_type_name,
      "class": "solr.TextField",
      "positionIncrementGap": "100",
      "analyzer": {
        "charFilters": [{
          "class": "solr.PatternReplaceCharFilterFactory",
          "replacement": "$1$1",
          "pattern": "([a-zA-Z])"
        }],
        "tokenizer": {
          "class": "solr.WhitespaceTokenizerFactory"
        },
        "filters": [{
          "class": "solr.WordDelimiterFilterFactory",
          "preserveOriginal": "0"
        }]
      }
    };
    schema_admin.addFieldType(json_field_defn).then(async function (response) {
      assert.ok(0 == response.data.responseHeader.status);
      await schema_admin.listFieldTypes().then((response)=>after_field_types = response.data.fieldTypes.length);
      assert.ok(after_field_types == before_field_types + 1)
    }).catch(function (error) {
      console.log('Error:' + error);
      assert.ok(false, error);
    }).finally(function () {
      schema_admin.deleteFieldType(field_type_name).catch(function () {
      });
      core_admin.delete("test", true, true, true).catch(function () {
      });
      done();
    });
  });
});
QUnit.test("add field", async function (assert) {
  var done = assert.async();
  var before_fields = 0;
  var after_fields = 0;

  var schema_admin = new SolrSchemaAdmin("http://localhost:8983/solr/test");
  await core_admin.create("test");
  await schema_admin.deleteField("my_test_field").catch(()=>{});
  var response = await schema_admin.listFields();
  before_fields = response.data.fields.length;
  await schema_admin.addField({
            "name": "my_test_field",
            "type": "boolean",
            "stored": true})
  response = await schema_admin.listFields();
  after_fields = response.data.fields.length;
  assert.ok(after_fields == before_fields + 1);
  schema_admin.deleteField("my_test_field").catch();
  core_admin.delete("test", true, true, true).catch();
  done();
});
