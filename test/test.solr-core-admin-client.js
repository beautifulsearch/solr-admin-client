var core_admin = new SolrCoreAdmin("http://localhost:8983/solr/admin/cores");
core_admin.delete("test", true, true, true).catch(function(){});

QUnit.test("core status", function (assert) {
  var done = assert.async();
  core_admin.status().then(function (response) {
    assert.ok(0 == response.data.responseHeader.status);
  }).catch(function (error) {
    // handle error
    console.log('Error:' + error);
    assert.ok(false, error);
  }).finally(function () {
    done();
  });
});

QUnit.test("core create delete", function (assert) {
  var done = assert.async();
  core_admin.create('test').then(function (response) {
    assert.ok(0 == response.data.responseHeader.status);

    core_admin.delete("test", true, true, true).then(function (response) {
      console.log(response);
    });

  }).catch(function (error) {
    // handle error
    console.log('Error:' + error);
    assert.ok(false, error);
  }).finally(function () {
    done();
  });
});

QUnit.test("core rename", function (assert) {
  var done = assert.async();
  core_admin.create('test4').then(async function (response) {
    assert.ok(0 == response.data.responseHeader.status);
    await sleep(1000);
    core_admin.rename("test4", "test5").then(async function (response) {
      assert.ok(0 == response.data.responseHeader.status);
      await sleep(1000);
      core_admin.delete("test5", true, true, true).then(function (response) {
        console.log(response);
      }).finally(function () {
        done();
      });
    });

  }).catch(function (error) {
    // handle error
    console.log('Error:' + error);
    assert.ok(false, error);
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}