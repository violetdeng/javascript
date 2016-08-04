var NotificationsService = function () {
    this.MAX_LEN = 10;
    this.notificationsArchive = new NotificationsArchive();
    this.notifications = {};
};

NotificationsService.prototype.push = function (notifiction) {
    var newLen, notificationToArchive;

    newLen = this.notifications.unshift(notifiction);
    if (newLen > this.MAX_LEN) {
        notificationToArchive = this.notifications.pop();
        this.notificationsArchive.archive(notificationToArchive);
    }
};

NotificationsService.prototype.getCurrent = function () {
    return this.notifications;
};
