// directive 名字规范：驼峰，模板中：蛇行（用冒号或下划线分割），并且每个引用都能以x或data为前缀

// 插值指令
// <span>{{expression}}</span>
myModule.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol("[[");
    $interpolateProvider.endSymbol("]]");
});
// <span>[[expression]]</span>
// <span ng-bind="expression"></span>

// 关闭HTML转义
// <p ng-bind-html-unsafe="msg"></p>

// ngRepeat特殊变量
// $index：索引数字
// $first/$middle/$last：布尔值
// <li ng-repeat="breadcrumb in breadcrumbs.getAll()">
//     <span class="divider"></span>
//     <ng-switch on="$last">
//         <span ng-switch-when="true">{{breadcrumb.name}}</span>
//         <span ng-switch-default>
//             <a href="{{breadcrumb.path}}">{{breadcrumb.name}}</a>
//         </span>
//     </ng-switch>
// </li>

// ngRepeat迭代对象属性
// <li ng-repeat="(name, value) in user">
//     Property {{$index}} with {{name}} has value {{value}}
// </li>

// 不能在运行时修改的元素和属性
// 动态指定input元素的type属性
// <input type="{{myinput.type}}" ng-model="myobject[myinput.model]"> IE有问题
// 1.自定义指令
// 2.<ng-include src="'input'+myinput.type+'.html'></ng-include>

// 过滤
// <div class="well">
//     <label>Search for: <input type="text" ng-model="criteria"></label>
// </div>
// <table class="table table-bordered">
//     <thead>
//         <th ng-click="sort('name')"><i ng-class="{icon-chevron-up': isSortUp('name'), 'icon-chevron-down': isSortDown('name')}"></i>Name</th>
//         <th ng-click="sort('desc')"><i ng-class="{icon-chevron-up': isSortUp('desc'), 'icon-chevron-down': isSortDown('desc')}"></i>Description</th>
//     </thead>
//     <tbody>
//         <tr ng-repeat="backlogItem in backlog | filter:criteria | orderBy:sortField:reverse">
//         <tr ng-repeat="backlogItem in backlog | filter:{name: criteria, done: false}"> 对应字段过滤
//         <tr ng-repeat="backlogItem in backlog | filter:{$: criteria, done: false}"> $：全部属性
//         <tr ng-repeat="backlogItem in backlog | filter:doneAndBigEffort"> 自定义过滤函数
//             <td>{{backlogItem.name}}</td>
//             <td>{{backlogItem.desc}}</td>
//         </tr>
//     </tbody>
// </table>
// $scope.sortField = undefined;
// $scope.reverse = false;
// $scope.sort = function (fieldName) {
//     if ($scope.sortField === fieldName) {
//         $scope.reverse = !$scope.reverse;
//     } else {
//         $scope.sortField = fieldName;
//         $scope.reverse = false;
//     }
// };
// $scope.isSortUp = function (fieldName) {
//     return $scope.sortField === fieldName && !scope.reverse;
// };
// $scope.isSortDown = function (fieldName) {
//     return $scope.sortField === fieldName && scope.reverse;
// };
