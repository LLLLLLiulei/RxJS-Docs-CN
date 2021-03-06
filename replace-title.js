var fs = require('fs');
var path = require('path');
var dir = './tmp/docs';
var titleMap = {'Home': '首页', 'Manual': '手册', 'Reference': '参考', 'Source': '源码', 'Test': '测试', 'Overview': '概览', 'Installation': '安装', 'Tutorial': '教程', 'Usage': '高级', 'Variable': '变量', 'Index': '索引', 'Typedef': '数据类型'};
var titleSuffix = 'RxJS 中文文档';
var descriptionMeta = '<meta name="description" content="RxJS 中文文档 - RxJS 5 官方文档中文版，此中文文档与官方文档保持同步更新!RxJS 中文社区致力于为广大国内 RxJS 爱好者提供更好的学习环境，其中包括无语言障碍的中文文档及其他中文学习资料!">';
var keywordsMeta = '<meta name="keywords" content="RxJS中文文档,RxJS5中文文档,RxJS,RxJS5,RxJS-CN,RxJS中文社区,Observable">';

readDirectory(dir);

function readDirectory(dir) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
    } else {
      loopFiles(files, dir);
    }
  });
}

function loopFiles(files, dir) {
  files.forEach(function (file) {
    var stat = fs.statSync(path.join(dir, file));
  
    if (stat.isDirectory()) {
      readDirectory(path.join(dir, file));
    } else {
      if (path.extname(file) === '.html') {
        replaceHtmlTitle(file, dir);
      }
    }
  });
}

function replaceHtmlTitle(file, dir) {
  var filePath = path.join(dir, file);
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var html = replaceTitle(data);
      fs.writeFile(filePath, html, function (err) {
        console.log(err ? err : `Title replaced completed: ${filePath}`);
      });
    }
  });
}

function replaceTitle(html) {
  return html.replace(/<title data-ice="title">(.*)<\/title>/, function(content, group) {
    var title = getTitle(group);
    return `<title data-ice="title">${title}</title>\r\n  ${descriptionMeta}\r\n  ${keywordsMeta}`;
  });
}

function getTitle(oldTitle) {
  var newTitle = titleSuffix;
  
  if (oldTitle.indexOf('|') > -1) {
    var titleArr = oldTitle.split(' | ');
    titleArr[0] = titleMap[titleArr[0]] || titleArr[0];
    titleArr[1] = titleSuffix;
    newTitle = titleArr.join(' | ');
  } else if (titleMap[oldTitle]) {
    newTitle = `${titleMap[oldTitle]} | ${titleSuffix}`;
  }

  return newTitle;
}

