angular.module('nibs.preview', ['nibs.profile', 'nibs.gallery'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.preview', {
                url: "/preview/:img/:isUpdateAvatar",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/preview.html",
                        controller: "PreviewCtrl"
                    }
                }
            })

    })

    //Controllers
    .controller('PreviewCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPopup, $ionicViewService, Picture, User) {
        document.getElementById('preview_img').src = $stateParams.img
        var isProfile = $stateParams.isUpdateAvatar;
        $ionicViewService.nextViewOptions({
           disableBack: true
        });
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;

        function detectImageSize(){
            var img = document.getElementById('preview_img');
            var foot = document.getElementById('footer');
            if (windowWidth < windowHeight){
                img.width = windowWidth
            }else{
                img.height = windowHeight - 105;
            }
        }
        detectImageSize();

        $scope.back = function() {
            if (isProfile == 'true'){
                $state.go("app.edit-profile");
            }else{
                $state.go("app.gallery");
            }
        }

        $scope.upload = function() {
            Picture.upload($stateParams.img)
                .success(function(data) {
                    var public_id = data.public_id
                    var url = data.url
                    var secure_url = data.secure_url
                    var userId = JSON.parse($window.localStorage.user).sfid

                    if ($stateParams.isUpdateAvatar == 'true') {
                        User.get()
                        .success(function(data) {
                            var strOldUrl = data.pictureurl;
                            if (strOldUrl != ''){
                                // Delete old avatar picture
                                var startIdIndex = strOldUrl.lastIndexOf('/') + 1;
                                var endIdIndex = strOldUrl.lastIndexOf('.');
                                public_id = strOldUrl.substring(startIdIndex, endIdIndex);
                                if (public_id != ''){
                                    Picture.delete(public_id);
                                }
                            }
                            data.pictureurl = secure_url
                            User.update(data)
                            .success(function(data) {
                                console.log(data)
                                $state.go('app.edit-profile')
                            })
                            .error(function(err) {
                                $ionicPopup.alert({title: 'Success', content: 'Update avatar failed!'});
                            })
                        })
                        .error(function(err) {
                            $ionicPopup.alert({title: 'Sorry', content: 'Update avatar failed!'});
                        })
                    } else {
                        Picture.create(public_id, url, userId)
                        .success(function(data) {
                            console.log(data)
                            $state.go('app.gallery')
                        })
                        .error(function(err) {
                            $ionicPopup.alert({title: 'Sorry', content: 'Insert failed!'});
                        })
                    }
                })
                .error(function(err) {
                    $ionicPopup.alert({title: 'Sorry', content: 'Upload failed!'});
                })
        }
    });