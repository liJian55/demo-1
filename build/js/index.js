/**
 * Created by wenya on 2017/7/8.
 */
;(function (angular) {
    // 1.创建模块
    var app = angular.module('app',['ui.router']);

    // 2.创建控制器
    app.controller('AppController',['$scope','$window',function ($scope,$window) {
        $scope.appTitle = 'webApp';

        // 当前的标题
        $scope.title = '首页';
        // 记录当前的索引
        $scope.index = 0;

        // 监听tabbar发生改变
        $scope.$on('tab_notifice',function (e, regs) {
            var titleArray = ['首页','作者','栏目','我'];

            $scope.title = titleArray[regs.index];

            $scope.index = regs.index;
        });

        // 左侧返回按钮
        $scope.back = function () {
            // 返回上一级
            $window.history.back();
        }
    }]);

    // 3.自定义指令
    app.directive('navs',function () {
        return {
            restrict:'EA',
            templateUrl:'../views/nav_tpl.html',
            link:function ($scope,ele,attr) {
                // 控制首页返回按钮要不要显示
                if (attr.isBack != 'true'){
                    ele.find('span').css({
                        display:'none'
                    })
                }
            }
        }
    });

    // 4.tabbar
    app.directive('tabbar',function () {
        return {
            restrict:'EA',
            templateUrl:'../views/tabbar_tpl.html',
            link:function ($scope,ele,attr) {

            },
            controller:function ($scope) {
                $scope.tabChange = function (index) {
                    // 通知外界
                    $scope.$emit('tab_notifice',{index:index});
                }
            }
        }
    })

    // 5.配置路由
    app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
        $stateProvider.state('index',{
            url:'/index',
            views:{
                home:{
                    templateUrl:'../views/home_tpl.html',
                    controller:'HomeController'
                },
                author:{
                    template:'<h2>author</h2>'
                },
                content:{
                    template:'<h2>content</h2>'
                },
                my:{
                    template:'<h2>my</h2>'
                }
            }
        }).state('index.list',{
            url:'/list',
            templateUrl:'../views/list_tpl.html'
        }).state('index.detail',{
            url:'/detail/:id',
            template:'<detail></detail>',
            controller:'DetailController'
        });
        $urlRouterProvider.otherwise('index/list');
    }]);

    // 6.创建首页控制器
    app.controller('HomeController',['$scope','$http',function ($scope,$http) {
       $http({
           url:'http://localhost/api/home.php',
           method:'jsonp'
       }).then(function (regs) {

           console.log(regs);
            $scope.listData = regs.data;

       }).catch(function (err) {
            console.log(err);

       })
    }]);

    // 详情控制器
    app.controller('DetailController',['$scope','$stateParams',function ($scope,$stateParams) {
        // 1.获取索引
        var index = $stateParams.id;

        // 2.取出数据
        $scope.item = $scope.listData.posts[index];
    }]);

    // 自定义指令
    app.directive('detail',function () {
        return {
            restrict:'EA',
            // 如果模版设置样式一定要设置替换原标签
            replace:true,
            template:'<div class="list_detail"></div>',
            link:function ($scope,ele,attr) {
                // ele.html(attr.content);
                ele.html($scope.item.content);
            }
        }
    });

    // 配置白名单
    app.config(['$sceDelegateProvider',function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://localhost/api/**'
        ]);
    }])
})(angular);