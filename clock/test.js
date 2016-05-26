(function () {
    var date = new Date();
    var second = ("" + date.getSeconds()).split(""),
        minute = ("" + date.getMinutes()).split(""),
        hour = ("" + date.getHours()).split("");
    var secondBit = new TurningCounting($(".second-bit"), {
            number: second[1] || second[0],
            trigger: function () {
                secondTen.start();
            }
        }),
        secondTen = new TurningCounting($(".second-ten"), {
            number: second[1] ? second[0] : 0,
            maxNumber: 6,
            loop: false,
            trigger: function () {
                minuteBit.start();
            }
        }),
        minuteBit = new TurningCounting($(".minute-bit"), {
            number: minute[1] || minute[0],
            loop: false,
            trigger: function () {
                minuteTen.start();
            }
        }),
        minuteTen = new TurningCounting($(".minute-ten"), {
            number: minute[1] ? minute[0] : 0,
            maxNumber: 6,
            loop: false,
            trigger: function () {
                hourBit.start();
            }
        }),
        hourBit = new TurningCounting($(".hour-bit"), {
            number: hour[1] || hour[0],
            loop: false,
            trigger: function () {
                hourTen.start();
            }
        }),
        hourTen = new TurningCounting($(".hour-ten"), {
            number: hour[1] ? hour[0] : 0,
            maxNumber: 2,
            loop: false
        });
    
    secondBit.start();
})();
