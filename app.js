// 处理精度问题的方法集合
// 除法
function accDiv(arg1, arg2) {
    arg1 = Number(arg1)
    arg2 = Number(arg2)
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return accMul((r1 / r2), pow(10, t2 - t1));
    }
}  /* 何问起 hovertree.com */
//乘法 
function accMul(arg1, arg2) {
    arg1 = Number(arg1)
    arg2 = Number(arg2)
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//加法  
function accAdd(arg1, arg2) {
    arg1 = Number(arg1)
    arg2 = Number(arg2)
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
//减法  
function Subtr(arg1, arg2) {
    arg1 = Number(arg1)
    arg2 = Number(arg2)
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}
function m_alert(text){
    $.Dialog.alert('提示', text);
}

var APP = function (option) {
    var o = {
        data: function () {
            var d = option.data() || {}
            return d
        },
        dom: option.dom || {},
        eventInit: option.eventInit || function () { console.log('there are no events here') },
        methods: option.methods || function () {
            console.log('there are no methods here')
            return {}
        },
        ready: option.ready || function () { }
    }
    var model = function () {
        var data = o.data()
        var keys = Object.keys(data)
        var i = keys.length
        while (i--) {
            o[keys[i]] = data[keys[i]]
        }
        return o
    }()
    var dom = o.dom
    var eventInit = function () {
        o.eventInit()
    }()
    var methods = function () {
        var controller = o.methods()
        var keys = Object.keys(controller)
        var i = keys.length
        while (i--) {
            o[keys[i]] = controller[keys[i]]
        }
        console.log(o)
        return o
    }()
    var init = function () {
        o.ready()
    }()
    var config = function () {
        return {
            getVersion: function () {
                console.log('当前版本是:0.0.1')
            }
        }
    }
    return config()
}
