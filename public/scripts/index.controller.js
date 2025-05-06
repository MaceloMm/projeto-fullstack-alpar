angular.module("lojaApp").controller("IndexController", function ($scope, $http) {
  const vm = this;

  //sidebar
  vm.sidebarVisivel = false;
  vm.showSidebar = () => (vm.sidebarVisivel = true);
  vm.hideSidebar = () => (vm.sidebarVisivel = false);

  //barra de pesquisa
  vm.pesquisaExpandida = false;
  vm.togglePesquisa = function () {
    vm.pesquisaExpandida = !vm.pesquisaExpandida;
  };

  //fecha a pesquisa clicando fora
  document.addEventListener("click", (e) => {
    const barra = document.getElementById("barraPesquisa");
    if (barra && !barra.contains(e.target)) {
      vm.pesquisaExpandida = false;
      //força o Angular a aplicar mudança fora do digest loop
      const scope = angular.element(barra).scope();
      scope.$apply();
    }
  });
/*   $scope.products = [
    { name: "Produto 1", price: 200, image: "images/image.png" },
    { name: "Produto 2", price: 150, image: "images/image.png" },
    { name: "Produto 3", price: 300, image: "images/image.png" },
    { name: "Produto 4", price: 180, image: "images/image.png" },
  ]; */

  $scope.cart = [];
  $scope.products= [];

    $scope.callAPI = async () => {
      const response = await $http.get('http://localhost:3000/products');
      $scope.products = response.data;
      $scope.$apply();
    };

    $scope.callAPI()

  $scope.toggleCart = function () {
    $scope.showCart = !$scope.showCart;
  };

  $scope.addToCart = function (product) {
    const existing = $scope.cart.find((item) => item.name === product.name);
    if (existing) {
      existing.quantity++;
    } else {
      $scope.cart.push({ ...product, quantity: 1 });
    }
  };

  $scope.increaseQuantity = function (item) {
    item.quantity++;
  };

  $scope.decreaseQuantity = function (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      $scope.cart = $scope.cart.filter((p) => p !== item);
    }
  };




  
});
