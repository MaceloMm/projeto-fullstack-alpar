angular.module('lojaApp')
  .controller('IndexController', function($scope, IndexService) {
    $scope.modalActive = true;
    $scope.toggleModal = () => {
        $scope.modalActive = !$scope.modalActive;
      };

  });
