(function () {
var app = angular.module('app', ['ksSwiper']);

app.controller('HomeSliderCtrl', function ($scope) {
    $scope.sliders = [{
        url: 'slide1.jpg'
    }, {
        url: 'slide2.png'
    }];
});

app.controller('HomeRecommendCtrl', function ($scope) {
    $scope.sliders = [{
        url: 'game_slide1.png',
        title: '口袋妖怪H5'
    }, {
        url: 'game_slide2.png',
        title: '传奇世界'
    }];
});

app.directive('gcGamelist', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/gc-gamelist.html'
    };
});

app.controller('HomeHotCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.games = [];
    $http.get('hot_games.json').success(function (data) {
        $scope.games = data;
    });
}]);

})();
