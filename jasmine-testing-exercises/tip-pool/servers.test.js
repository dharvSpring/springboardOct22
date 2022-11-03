describe("Servers test (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    serverNameInput.value = 'Alice';
  });

  // 
  // submitServerInfo
  // 
  it('should add a new server to allServers on submitServerInfo()', function () {
    submitServerInfo();

    expect(Object.keys(allServers).length).toEqual(1);
    expect(allServers['server' + serverId].serverName).toEqual('Alice');
  });

  it('empty server name is not added', function () {
    serverNameInput.value = '';
    submitServerInfo();

    expect(Object.keys(allServers).length).toEqual(0);
  });

  // 
  // updateServerTable
  // 
  function initAllServers(names) {
    serverId = 0;
    for (const serverName of names) {
      serverId++;
      allServers['server' + serverId] = { serverName };
    }
  }

  it ('updateServerTable with Array correctly updates DOM', function () {
    const testArr = ['Alice', 'Bob', 'Calvin', 'Dave'];
    initAllServers(testArr);
    updateServerTable();

    expect(Object.keys(allServers).length).toEqual(testArr.length);
    const serverDom = document.querySelectorAll("tr[id^='server']");
    let count = 0;
    for (server of serverDom) {
      expect(server.firstChild.innerText).toEqual(testArr[count]);
      count++;
    }
  });

  afterEach(function() {
    // teardown logic
    allServers = {};
    serverId = 0;
    serverNameInput.value = '';
    updateServerTable();
  });
});
