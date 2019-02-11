$(function () {
    function wxinit() {
        wx.error(function (res) {
            alert("验证失败：" + JSON.stringify(res));
        });
        wx.ready(function () {
            wx.hideOptionMenu();
            wx.showMenuItems({
                menuList: [
                    'menuItem:share:timeline', // 分享到朋友圈
                    'menuItem:share:appMessage' // 分享给好友
                    // 'menuItem:copyUrl' // 复制链接
                ],
                fail: function (res) {
                    alert("showMenuItems" + JSON.stringify(res));
                }
            });
            wx.onMenuShareAppMessage({
                title: active_title, // 分享标题
                desc: desc, // 分享描述
                link: appUrl, // 分享链接
                imgUrl: logo, // 分享图标
                success: function () {
                    $.get(shareUrl);
                }
            });
            wx.onMenuShareTimeline({
                title: active_title, // 分享标题
                link: friendUrl, // 分享链接
                imgUrl: logo, // 分享图标
                success: function () {
                    $.get(shareUrl);
                }
            });
        });
    }
    new APP({
        data() {
            return {
                friendList: [],
                runner: {
                    top: 8.2,
                    left: 0.75,
                    totalScore: target_score,
                    score: 0
                },
                tool: [],
                slectedTool: ''
            }
        },
        dom: {
            mainContent: $('.main-content'), // 主界面
            listBtn: $('#list-btn'), // 榜单的按钮
            showListsTemp: $('#showListsTemp'), // 榜单的模板
            friendList: $('#friend-list'), // 榜单的目标容器
            list: $('#list'),
            listsMainContainer: $('.lists-main-container'),
            listsLoadmore: $('#list .loadmore'),
            closeList: $('#list>.lists-main-container #close-lists'),
            instructionBtn: $('#instructionBtn'),
            instruction: $('#instruction'),
            closeInstruction: $('#close-instruction'),
            toolBtn: $('#toolBtn'),
            tool: $('#tool'),
            runner: $('#runner'),
            toolListsMainContainer: $('.tool-main-container'),
            toolList: $('#toolList'),
            toolTemp: $('#toolTemp'),
            closeTool: $('#close-tool'),
            closeModal: $('.modal-close'),
            toolSelect: $('#toolSelect'),
            toolSelectCancel: $('#toolSelect a.cancel'),
            toolSelectCurrect: $('#toolSelect a.currect'),
            startHelp: $('.startHelp'),
            create_info: $('#create_info'),
            share: $('#share'),
            resultTemp: $('#resultTemp'),
            result: $('#result'),
            helpResult: $('#helpResult'),
            continue: $('.continue'),
            infoScore: $('#info-score'),
            ticket: $('#ticket')
        },
        eventInit() {
            var _this = this
            _this.dom.listBtn.click(function () {
                // 点击榜单后触发
                _this.methods().showLists()
            })
            _this.dom.listsLoadmore.click(function () {
                // 点击加载更多触发
                _this.methods().loadMoreLists()
            })
            _this.dom.closeList.click(function () {
                // 点击关闭按钮触发。关闭列表
                _this.dom.listsMainContainer.velocity({ bottom: "-500px" }, { duration: 450 });
                _this.dom.list.fadeOut()
            })
            _this.dom.toolBtn.click(function () {
                // 点击道具后触发
                _this.methods().getTools()
            })
            _this.dom.closeTool.click(function () {
                // 点击关闭按钮触发。关闭道具列表
                _this.dom.toolListsMainContainer.velocity({ bottom: "-500px" }, { duration: 450 });
                _this.dom.tool.fadeOut()
            })
            _this.dom.instructionBtn.click(function () {
                // 打开活动规则
                _this.dom.instruction.fadeIn()
            })
            _this.dom.closeInstruction.click(function () {
                // 关闭活动规则
                _this.dom.instruction.fadeOut()
            })
            _this.dom.toolListsMainContainer.on('click', '.li-1', function () {
                // 已获取的道具点击后
                console.log('去使用', $(this).data('id'))
                _this.methods().selectTool($(this).data('id'))
            })
            _this.dom.toolListsMainContainer.on('click', '.li-0', function () {
                // 未获取的道具点击后
                console.log('未获取', $(this).data('id'))
                window.location.href = $(this).data('url')
            })
            _this.dom.closeModal.click(function () {
                // 通用关闭模态框入口
                $('.modal').fadeOut()
            })
            _this.dom.toolSelectCancel.click(function () {
                // 取消选择道具
                $('.modal').fadeOut()
            })
            _this.dom.toolSelectCurrect.click(function () {
                // 确认选择道具
                _this.methods().useTools(_this.slectedTool)
                $('.modal').fadeOut()
            })
            _this.dom.startHelp.click(function () {
                _this.methods().startHelping()
            })
            _this.dom.create_info.click(function () {
                _this.dom.share.fadeIn()
            })
            _this.dom.continue.click(function () {
                _this.dom.share.fadeIn()
            })
            _this.dom.share.click(function () {
                _this.dom.share.fadeOut()
            })
        },
        methods() {
            var _this = this
            return {
                renderShowLists() {
                    var resource = _this.dom.showListsTemp.html()
                    var html = template.render(resource, { data: _this.friendList });
                    _this.dom.friendList.html(html)
                },
                renderToolLists() {
                    var resource = _this.dom.toolTemp.html()
                    var html = template.render(resource, { data: _this.tool });
                    _this.dom.toolList.html(html)
                },
                showLists() {
                    // 展示榜单
                    if (_this.dom.friendList.find('li').length < 1) {
                        $.ajax({
                            type: "post",
                            url: loadmoreUrl,
                            data: { bargain_log_id: bargain_log_id },
                            dataType: "json",
                            success: function (data) {
                                if (data.status != 2) {
                                    _this.friendList = data.data
                                    //更新闭包中的数据
                                    _this.methods().renderShowLists()
                                    // 渲染
                                    _this.dom.list.fadeIn()
                                    _this.dom.listsMainContainer.velocity({ bottom: "0px" }, { duration: 450 });
                                } else {
                                    _this.methods().renderShowLists()
                                    // 渲染
                                    _this.dom.list.fadeIn()
                                    _this.dom.listsMainContainer.velocity({ bottom: "0px" }, { duration: 450 });
                                }
                            }
                        });
                    } else {
                        _this.dom.list.fadeIn()
                        _this.dom.listsMainContainer.velocity({ bottom: "0px" }, { duration: 450 });
                    }
                },
                loadMoreLists() {
                    $.ajax({
                        type: "post",
                        url: loadmoreUrl,
                        data: { bargain_log_id: bargain_log_id, all: 1},
                        dataType: "json",
                        success: function (data) {
                            console.log(data)
                            if (data.status != 2) {
                                _this.friendList = data.data
                                _this.methods().renderShowLists()
                            } else {
                                _this.methods().renderShowLists()
                            }
                        }
                    });
                },
                turn(direction, displacement) {
                    // direction 'left' 'right' 'up'
                    switch (direction) {
                        case 'left':
                            var left = Subtr(_this.runner.left, displacement)
                            _this.dom.runner.velocity({ left: left + 'rem' }, { duration: 750 })
                            _this.runner.left = left
                            console.log(`左移${displacement}rem`)
                            break;

                        case 'right':
                            var left = accAdd(_this.runner.left, displacement)
                            _this.dom.runner.velocity({ left: left + 'rem' }, { duration: 750 })
                            _this.runner.left = left
                            console.log(`右移${displacement}rem`)
                            break;
                        case 'up':
                            var top = Subtr(_this.runner.top, displacement)
                            _this.dom.runner.velocity({ top: top + 'rem' }, { duration: 750 })
                            _this.runner.top = top
                            console.log(`上移${displacement}rem`)
                            break;
                        default:
                            break;
                    }
                },
                running(increment) {
                    // 传入积分增值，执行轨道运动
                    // 注意，为了避免精度丢失，所有的四则运算都要用封装好的免精度丢失方法做。
                    increment = Number(increment)
                    // 当前分数占比
                    var percent = Number(accDiv(_this.runner.score, _this.runner.totalScore))
                    // 增量分数占比
                    var increatePercent = accDiv(increment, _this.runner.totalScore)
                    if (percent >= 0 && percent < 0.25) {
                        // 判断当前区间是否在第一区间。
                        var after = accAdd(percent, increatePercent)
                        if (after <= 0.25) {
                            // 是否溢出
                            _this.methods().turn('right', accDiv(accMul(20, increment), _this.runner.totalScore))
                            // 未溢出，当前区间内移动
                            _this.runner.score = accAdd(_this.runner.score, increment)
                            // 持有分数增值
                        } else {
                            // 溢出，直接走完当前区间，溢出值递归到下一区间。
                            var over = Subtr(accAdd(_this.runner.score, increment), accMul(_this.runner.totalScore, 0.25))
                            // 计算溢出值
                            _this.methods().turn('right', accDiv(accMul(Subtr(increment, over), 20), _this.runner.totalScore))
                            _this.runner.score = accAdd(_this.runner.score, Subtr(increment, over))
                            _this.methods().running(over)
                            // 递归溢出值
                        }
                    } else if (percent >= 0.25 && percent < 0.33) {
                        // 判断当前区间是否在第二区间
                        var after = accAdd(percent, increatePercent)
                        if (after <= 0.33) {
                            // 是否溢出
                            _this.methods().turn('up', accDiv(accMul(20, increment), _this.runner.totalScore))
                            // 未溢出，当前区间内移动
                            _this.runner.score = accAdd(_this.runner.score, increment)
                            // 持有分数增值
                        } else {
                            // 溢出，直接走完当前区间，溢出值递归到下一区间。
                            var over = Subtr(accAdd(_this.runner.score, increment), accMul(_this.runner.totalScore, 0.33))
                            // 计算溢出值
                            _this.methods().turn('up', accDiv(accMul(Subtr(increment, over), 20), _this.runner.totalScore))
                            _this.runner.score = accAdd(_this.runner.score, Subtr(increment, over))
                            _this.methods().running(over)
                            // 递归溢出值
                        }
                    } else if (percent >= 0.33 && percent < 0.4425) {
                        // 判断当前区间是否在第三区间
                        var after = accAdd(percent, increatePercent)
                        if (after <= 0.4425) {
                            // 是否溢出
                            _this.methods().turn('left', accDiv(accMul(20, increment), _this.runner.totalScore))
                            // 未溢出，当前区间内移动
                            _this.runner.score = accAdd(_this.runner.score, increment)
                            // 持有分数增值
                        } else {
                            // 溢出，直接走完当前区间，溢出值递归到下一区间。
                            var over = Subtr(accAdd(_this.runner.score, increment), accMul(_this.runner.totalScore, 0.4425))
                            // 计算溢出值
                            _this.methods().turn('left', accDiv(accMul(Subtr(increment, over), 20), _this.runner.totalScore))
                            _this.runner.score = accAdd(_this.runner.score, Subtr(increment, over))
                            _this.methods().running(over)
                            // 递归溢出值
                        }
                    } else if (percent >= 0.4425 && percent < 0.4925) {
                        // 判断当前区间是否在第四区间
                        var after = accAdd(percent, increatePercent)
                        if (after <= 0.4925) {
                            // 是否溢出
                            _this.methods().turn('up', accDiv(accMul(20, increment), _this.runner.totalScore))
                            // 未溢出，当前区间内移动
                            _this.runner.score = accAdd(_this.runner.score, increment) // 持有分数增值
                        } else {
                            // 溢出，直接走完当前区间，溢出值递归到下一区间。
                            var over = Subtr(accAdd(_this.runner.score, increment), accMul(_this.runner.totalScore, 0.4925))
                            // 计算溢出值
                            _this.methods().turn('up', accDiv(accMul(Subtr(increment, over), 20), _this.runner.totalScore))
                            _this.runner.score = accAdd(_this.runner.score, Subtr(increment, over))
                            _this.methods().running(over)
                            // 递归溢出值
                        }
                    } else if (percent >= 0.4925 && percent < 0.6425) {
                        // 判断当前区间是否在第五区间
                        var after = accAdd(percent, increatePercent)
                        if (after <= 0.6425) { // 是否溢出
                            _this.methods().turn('left', accDiv(accMul(20, increment), _this.runner.totalScore))
                            // 未溢出，当前区间内移动
                            _this.runner.score = accAdd(_this.runner.score, increment) // 持有分数增值
                        } else {
                            // 溢出，直接走完当前区间，溢出值递归到下一区间。
                            var over = Subtr(accAdd(_this.runner.score, increment), accMul(_this.runner.totalScore, 0.6425))
                            // 计算溢出值
                            _this.methods().turn('left', accDiv(accMul(Subtr(increment, over), 20), _this.runner.totalScore))
                            _this.runner.score = accAdd(_this.runner.score, Subtr(increment, over))
                            _this.methods().running(over)
                            // 递归溢出值
                        }
                    } else if (percent >= 0.6425 && percent < 0.7325) {
                        // 判断当前区间是否在第六区间
                        var after = accAdd(percent, increatePercent)
                        if (after <= 0.7325) {
                            // 是否溢出
                            _this.methods().turn('up', accDiv(accMul(20, increment), _this.runner.totalScore))
                            // 未溢出，当前区间内移动
                            _this.runner.score = accAdd(_this.runner.score, increment) // 持有分数增值
                        } else {
                            // 溢出，直接走完当前区间，溢出值递归到下一区间。
                            var over = Subtr(accAdd(_this.runner.score, increment), accMul(_this.runner.totalScore, 0.7325))
                            // 计算溢出值
                            _this.methods().turn('up', accDiv(accMul(Subtr(increment, over), 20), _this.runner.totalScore))
                            _this.runner.score = accAdd(_this.runner.score, Subtr(increment, over))
                            _this.methods().running(over)
                            // 递归溢出值
                        }
                    } else if (percent >= 0.7325) {
                        // 判断当前区间是否在第七区间
                        var after = accAdd(percent, increatePercent)
                        if (after <= 1) { // 是否溢出
                            _this.methods().turn('right', accDiv(accMul(20, increment), _this.runner.totalScore))
                            // 未溢出，当前区间内移动
                            _this.runner.score = accAdd(_this.runner.score, increment)
                            // 持有分数增值
                        } else {
                            // 溢出，直接走到终点。
                            _this.methods().turn('right', accDiv(accMul(Subtr(_this.runner.totalScore, _this.runner.score), 20), _this.runner.totalScore))
                            _this.runner.score = _this.runner.totalScore
                            // 直接走向终点
                        }
                    } else {
                        // 什么都不做
                    }
                },
                startHelping() {
                    $.ajax({
                        type: "POST",
                        url: startHelpUrl,
                        data: { help_id: bargain_log_id },
                        dataType: "json",
                        success: function (data) {
                            data.status = data.result;
                            if (data.status == 0) {
                                m_alert("目前系统繁忙，请稍后再试");
                            } else if (data.status == 2) {
                                // 未关注
                                _this.dom.ticket.fadeIn()
                            } else if (data.status == 4 || data.status == 5 || data.status == -1) {
                                // 异常
                                m_alert(data.msg);
                            } else {
                                if (data.type < 2) {
                                    // 未到终点
                                    // 获取增值
                                    var increment = data.data.score;
                                    // 进行轨道运动
                                    _this.methods().running(Number(increment))
                                    // 弹窗提示
                                    _this.dom.startHelp.hide();
                                    _this.dom.create_info.show();
                                    _this.methods().renderResult(data.data.score)
                                    _this.dom.helpResult.fadeIn()
                                    _this.dom.infoScore.text(data.data.now_amount)
                                } else {
                                    // 已到终点
                                    m_alert("已经到终点了！");
                                }

                            }
                        },
                        error: function () {
                            m_alert("网络不佳，请稍后再试");
                        }
                    });
                },
                renderResult(score) {
                    var resource = _this.dom.resultTemp.html()
                    var html = template.render(resource, { score: score });
                    _this.dom.result.html(html)
                },
                getTools() {
                    $.ajax({
                        type: "get",
                        url: getTools,
                        data: { id: id },
                        dataType: "json",
                        success: function (data) {
                            if (data.errcode == 1) {
                                // 渲染道具列表
                                _this.tool = data.data
                                _this.methods().renderToolLists()
                                _this.dom.tool.fadeIn()
                                _this.dom.toolListsMainContainer.velocity({ bottom: "0px" }, { duration: 450 });
                            } else {
                                m_alert(data.msg);
                            }
                        }
                    });
                },
                selectTool(id) {
                    _this.slectedTool = id
                    _this.dom.toolSelect.fadeIn()
                },
                useTools(id) {
                    $.ajax({
                        type: "post",
                        url: useTools,
                        data: { id: id },
                        dataType: "json",
                        success: function (data) {
                            if (data.errcode == 1) {
                                // 成功后重新渲染道具列表
                                _this.methods().getTools()
                                _this.methods().running(data.score)
                                m_alert(`道具使用成功，提速${data.score}米`)
                                _this.dom.infoScore.text(data.now_amount)
                            } else {
                                m_alert(data.msg);
                            }
                        }
                    });
                }
            }
        },
        ready() {
            var _this = this
            wxinit()
            console.log('load')
            _this.methods().running(score)
        }
    })
})