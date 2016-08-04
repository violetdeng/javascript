var myMod = angular.module("myMod", []);

// 1
myMod.value("NotificationsArchive", new NotificationsArchive());

// 2
myMod.service("notificationsService", function (notificationsArchive) {
    this.notificationsArchive = notificationsArchive;
});

// 3
myMod.factory("notificationsService", function (notificationsArchive) {
    var MAX_LEN = 10;
    var notifications = {};
    return {
        push: function (notifiction) {
            var newLen, notificationToArchive;

            // closure
            newLen = notifications.unshift(notifiction);
            if (newLen > MAX_LEN) {
                notificationToArchive = notifications.pop();
                notificationsArchive.archive(notificationToArchive);
            }
        }
    };
});

// 4
myMod.constant("MAX_LEN", 10);
myMod.factory("notificationsService", function (notificationsArchive, MAX_LEN) {
    var notifications = {};
    return {
        push: function (notifiction) {
            var newLen, notificationToArchive;

            // closure
            newLen = notifications.unshift(notifiction);
            if (newLen > MAX_LEN) {
                notificationToArchive = notifications.pop();
                notificationsArchive.archive(notificationToArchive);
            }
        }
    };
});

// 5
myMod.provider("notificationsService", function () {
    var config = {
        maxLen: 10
    };
    var notifications = {};

    return {
        setMaxLen: function (maxLen) {
            config.maxLen = maxLen || config.maxLen;
        },
        $get: function (notificationsArchive) {
            return {
                push: function (notifiction) {
                    var newLen, notificationToArchive;

                    newLen = notifications.unshift(notifiction);
                    if (newLen > config.maxLen) {
                        notificationToArchive = notifications.pop();
                        notificationsArchive.archive(notificationToArchive);
                    }
                }
            };
        }
    };
});

// 配置阶段
myMod.config(function (notificationsServiceProvider) {
    notificationsServiceProvider.setMaxLen(5);
});

// 运行阶段
// $rootScope为全局变量
angular.module("upTimeApp", []).run(function ($rootScope) {
    $rootScope.appStarted = new Date();
});

// 服务的跨模块可见性
angular.module("app", ["engines", "cars"])
    .factory("car", function ($log, dieselEngine) {
        return {
            start: function () {
                $log.info("Starting" + dieselEngine.type);
            }
        };
    })
    .controller("AppCtrl", function ($scope, bus) {
        bus.start();
    });
angular.module("cars", [])
    .factory("bus", function ($log, dieselEngine) {
        return {
            start: function () {
                $log.info("Starting" + dieselEngine.type);
            }
        };
    })
    .factory("dieselEngine", functioin () {
        return {
            type: "custom diesel"
        };
    });
angular.module("engines", [])
    .factory("dieselEngine", function () {
        return {
            type: "diesel"
        };
    });

angular.module("resource", ["ngResource"])
    .factory("Users", function ($resource) {
        // :id 为占位符
        return $resource("http://users:id", {
            // 请求默认参数
            apiKey: "12312dfdfyi",
            // 动态参数，从资源对象中获取
            id: "@_id:$oid"
        }, {
            update: {method: "PUT"}
        });
    })
    .controller("ResourceCtrl", function ($scope, Users) {
        $scope.users = Users.query();
    });
