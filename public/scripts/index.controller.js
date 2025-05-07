angular
  .module("lojaApp")
  .controller("IndexController", function ($scope, $http, $window) {
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

    $scope.cart = [];
    
    $scope.products = [];
    $scope.cartOpenedOnce = false;
    $scope.cartTotalQuantity = 0; // ← contador total de itens no carrinho
    $scope.cartTotalPrice = 0; // ← total somado dos preços
    
    $scope.getProducts = async () => {
      const response = await $http.get("http://localhost:3000/products");
      console.log(response.data);
      $scope.products = response.data;
      $scope.$apply();
    };
    
    $scope.getProducts();

    $scope.toggleCart = function () {
      $scope.showCart = !$scope.showCart;
    };

    // Atualiza o total de produtos e o total de preço no carrinho
    $scope.updateCartSummary = function () {
      $scope.cartTotalQuantity = $scope.cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      $scope.cartTotalPrice = $scope.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      //[CHECKOUT 0.1]

      localStorage.setItem("cart", JSON.stringify($scope.cart));
    };

    //[CHECKOUT 0.1]
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      $scope.cart = JSON.parse(savedCart);
      $scope.updateCartSummary();
    }
  
    if (savedCart) {
      $scope.cart = JSON.parse(savedCart);
      $scope.updateCartSummary();
    }

    $scope.addToCart = function (product) {
      const existing = $scope.cart.find((item) => item.name === product.name);
      if (existing) {
        existing.quantity++;
      } else {
        $scope.cart.push({...product, quantity: 1});
      }

      if (!$scope.cartOpenedOnce) {
        $scope.showCart = true;
        $scope.cartOpenedOnce = true;
      }

      $scope.updateCartSummary(); // ← atualiza total de itens e valor
      localStorage.setItem("cart", JSON.stringify($scope.cart)); //[CHECKOUT 0.1]
    };

    if ($scope.cartOpenedOnce) {
      $scope.showCart = true;
      $scope.cartOpenedOnce = true;
    }

    $scope.increaseQuantity = function (item) {
      item.quantity++;
      $scope.updateCartSummary(); // ← atualiza ao aumentar
    };

    $scope.decreaseQuantity = function (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        $scope.cart = $scope.cart.filter((p) => p !== item);
      }
      $scope.updateCartSummary(); // ← atualiza ao diminuir
    };
    //[CHECKOUT 0.1]
    localStorage.setItem('cart', JSON.stringify($scope.cart));

    // login

    $scope.logged = localStorage.getItem("token") ? true : false;
    $scope.login = {email: "", password: ""};

    $scope.verifyLogin = async () => {
      if (!$scope.login.email || !$scope.login.password) {
        console.log($scope.log.email, $scope.login.password);
        return;
      }

      try {
        const resp = await $http.post(
          "http://localhost:3000/auth/login",
          $scope.login
        );
        localStorage.setItem("token", resp.data.token);
        $window.location.href = "/";
      } catch (error) {
        console.log(error.data.message);
      }
    };

    $scope.loggout = () => {
      localStorage.removeItem("token");
      $window.location.href = "/";
    };

    // cadastro

    $scope.cadastro = {username: "", email: "", password: "", cPassword: ""};

    $scope.insertUser = async () => {
      if ($scope.cadastro.password !== $scope.cadastro.cPassword) {
        console.log("senhas diferentes");
        return;
      }

      try {
        $scope.cadastro = {
          username: $scope.cadastro.username,
          email: $scope.cadastro.email,
          password: $scope.cadastro.password,
        };
        const resp = await $http.post(
          "http://localhost:3000/singup/cadastrar",
          $scope.cadastro
        );
        console.log(resp.data.message);
      } catch (error) {
        console.log(error.data.message);
      }
    };

    // front-end functions
  });
