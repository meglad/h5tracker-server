function logTime() {
  var now = new Date();
  return [String(100 + now.getHours()).slice(1),
    String(100 + now.getMinutes()).slice(1),
    String(100 + now.getSeconds()).slice(1)
  ].join(':');
}
exports.logTime = logTime;