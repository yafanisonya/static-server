var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号!Example:\nnode server.js 8888 ");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  console.log("有人发请求过来！路径为：" + pathWithQuery);

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  const filePath = path === '/' ? '/index.html' : path
  const index = filePath.lastIndexOf('.')   //查找后缀.最后出现索引
  const suffix = filePath.substring(index)  //  .后缀名
  const fileTypes = {       //哈希表存储对应类型
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg'
  }
  response.setHeader("Content-Type", `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
  let content
  try {
    content = fs.readFileSync(`./public${filePath}`)
  } catch (error) {
    content = '文件不存在'
    response.statusCode = 404
  }
  response.write(content);
  response.end();

});

server.listen(port);
console.log(
  "开启" + port + "端口监听成功，请用浏览器打开 http://localhost:" + port
);
