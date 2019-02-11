// 深度克隆
function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}
var CMBLS = {};
/**
 * 调用招行的内部定位
 */
function cmblsJSExecutor(cmblsCommand) {
  if (window.cmblsExecutor) {
    // var cmblsExecutor = window.cmblsExecutor || {};
    window.cmblsExecutor.executeCmbls('1.0', cmblsCommand);
  } else {
    document.addEventListener(
      'CMBLSExecutorReady',
      function() {
        // var cmblsExecutor = window.cmblsExecutor || {};
        window.cmblsExecutor.executeCmbls('1.0', cmblsCommand);
      },
      false,
    );
  }
}
class APP {
  constructor(options) {
    if (!options)
      options = {
        data: function() {
          return {};
        },
        dom: {},
        eventInit: function() {},
        methods: {},
        ready: function() {},
      };
    this.initApp(options);
    this.initModel(options);
    this.initDom(options);
    this.initMethods(options);
    this.initEvent(options);
    this.ready();
  }
  initApp(options) {
    var o = deepClone(options);
    this.ready = o.ready;
    this.eventInit = o.eventInit;
  }
  initDom(options) {
    if (!options.dom) options.dom = {};
    var dom = options.dom;
    this.dom = dom;
  }
  initModel(options) {
    if (options.data && typeof options.data === 'function') {
      var data = options.data();
      for (let d in data) {
        this[d] = data[d];
      }
    }
  }
  initEvent() {
    this.eventInit();
  }
  initMethods(options) {
    if (!options.methods) options.methods = {};
    var methods = deepClone(options.methods);
    for (let m in methods) {
      this[m] = methods[m];
    }
  }
  compileTemplate(tempSelector, data) {
    var tempStr = $(tempSelector).html();
    return template.render(tempStr, data);
  }
  request(op) {
    var o = {
      data: Qs.stringify(op.data) || '',
      type: op.method || 'get',
      url: appConfig.baseUrl + (op.url || ''),
      headers: {
        'X-Requested-With': `XMLHttpRequest`,
      },
      success: function(res) {
        op.success && typeof op.success === 'function'
          ? op.success(res)
          : (function() {})();
      },
      error: function(err) {
        console.error(err);
        if (err.status === 401) {
          console.log('token 过期,重新进行oAuth');
          op.error && typeof op.error === 'function'
            ? op.error(err)
            : (function() {})();
          setTimeout(function() {
            var h = location.href.split('?')
            if (h.length >= 2) {
              var o = Qs.parse(h[1])
              if (o.channel) {
                location.href = appConfig.loginUrl + `?channel=${o.channel}`
              } else {
                location.href = appConfig.loginUrl;
              }
            } else {
              location.href = appConfig.loginUrl;
            }
          }, 1000);
        } else {
          op.error && typeof op.error === 'function'
            ? op.error(err)
            : (function() {})();
        }
      },
      dataType: 'json',
    };
    $.ajax(o);
  }
}
window.App = APP;
