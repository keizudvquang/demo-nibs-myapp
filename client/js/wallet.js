angular.module('nibs.wallet', [])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.wallet', {
                url: "/wallet",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/wallet.html",
                        controller: "WalletCtrl"
                    }
                }
            })

    })

    // Services
    .factory('WalletItem', function ($http, $rootScope) {
        return {
            all: function(offset, limit, contactId) {
                return $http.post($rootScope.server.url + '/wallet/' + offset + '/' + limit, {
                    contactId: contactId
                });
            },
            create: function(walletItem) {
                return $http.post($rootScope.server.url + '/wallet', walletItem);
            },
            del: function(offerId) {
                return $http.delete($rootScope.server.url + '/wallet/' + offerId);
            }
        };
    })

    //Controllers
    .controller('WalletCtrl', function ($window, $scope, WalletItem) {
        const firstLoadOffset = 0
        const firstLoadLimit  = 10

        $scope.deleteItem = function(offer) {
            WalletItem.del(offer.id).success(function() {
                all();
            });
        };

        $scope.walletItems = []
        $scope.noMoreItems = false;
        $scope.loadItem = function() {
            var offset = $scope.walletItems.length == 0 ? firstLoadOffset : $scope.walletItems.length
            var limit  = $scope.walletItems.length == 0 ? firstLoadLimit : 5
            WalletItem.all(offset, limit, JSON.parse($window.localStorage.user).sfid).success(function(walletItems) {
                if (walletItems.length != 0) {
                    $scope.walletItems = $scope.walletItems.concat(walletItems)
                } else {
                    $scope.noMoreItems = true;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete')
            });
        }
    });
