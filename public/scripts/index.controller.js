angular.module("lojaApp").run(function ($window) {
  const expirationTime = localStorage.getItem('token_expiration');

  if (expirationTime && Date.now() > parseInt(expirationTime)) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    $window.href = 'location/login'
  }
});

angular.module("lojaApp").controller("IndexController", function ($scope, $http, $window) {
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

  // login

  $scope.logged = localStorage.getItem("token") ? true : false;
  $scope.login = { email: "", password: "" };

  $scope.verifyLogin = async () => {
    if (!$scope.login.email || !$scope.login.password) {
      console.log($scope.log.email, $scope.login.password);
      return;
    }
    try {
      console.log('teste')
      const resp = await $http.post(
        "http://localhost:3000/auth/login",
        $scope.login
      );
      localStorage.setItem("token", resp.data.token);
      const expirationTime = Date.now() + 5000; //3600000
      localStorage.setItem('token_expiration', expirationTime);
      console.log(expirationTime)

      $window.location.href = "/";
    } catch (error) {
      console.log(error.data.message);
    }
  };

  $scope.loggout = () => {
    localStorage.removeItem("token");
    $window.location.href = "/";
  };

  // Produtos 

  $scope.getProducts = async () => {
    const response = await $http.get("http://localhost:3000/products");
    console.log(response.data);
    $scope.products = response.data;
    $scope.$apply();
  };

  $scope.getProducts();

  // FIM produtos

  // CART

  // $scope.cart = []
  $scope.getCart = async () => {
    if (!$scope.logged){$window.location.href = 'views/login.html'; return}

    try{
      const reponse = await $http.get('http://localhost:3000/cart', {'headers': { 'Content-Type': undefined, 'Authorization': localStorage.getItem('token') } });
      $scope.cart = reponse.data;
      console.log($scope.cart)
    }catch (err){
      console.log(err.data.message)
    }
  }

  $scope.cartOpenedOnce = false;
  $scope.cartTotalQuantity = 0; // ← contador total de itens no carrinho
  $scope.cartTotalPrice = 0; // ← total somado dos preços

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
      $scope.cart.push({ ...product, quantity: 1 });
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

  // cadastro

  $scope.cadastro = { username: "", email: "", password: "", cPassword: "" };

  $scope.logged = localStorage.getItem('token') ? true : false;
  $scope.login = { email: "", password: "" };

  $scope.verifyLogin = async () => {
    if (!$scope.login.email || !$scope.login.password) {
      console.log($scope.log.email, $scope.login.password)
      return
    }

    try {
      const resp = await $http.post('http://localhost:3000/auth/login', $scope.login);
      localStorage.setItem('token', resp.data.token);
      $window.location.href = '/'
    } catch (error) {
      console.log(error.data.message)
    }
  };

  $scope.loggout = () => {
    localStorage.removeItem('token');
    $window.location.href = '/'
  }


  // cadastro

  $scope.messageAlert = false;

  $scope.showAlertUserC = async function (message) {
    $scope.messageCadastro = message;
    $scope.messageAlert = true;
    $scope.$apply();

    await new Promise(resolve => setTimeout(resolve, 5000));

    $scope.$apply(() => {
      $scope.messageAlert = false;
    });

  }

  $scope.closeMessage = (variableMessage) => { variableMessage = false; };

  $scope.cadastro = { username: "", email: "", password: "", cPassword: "" };

  $scope.insertUser = async () => {
    if ($scope.cadastro.password !== $scope.cadastro.cPassword) { await $scope.showAlertUserC('Senhas estão diferentes!'); return }

    try {
      $scope.cadastro = { username: $scope.cadastro.username, email: $scope.cadastro.email, password: $scope.cadastro.password }
      const resp = await $http.post('http://localhost:3000/singup/cadastrar', $scope.cadastro)
      await $scope.showAlertUserC(resp.data.message);
      $scope.cadastro = { username: "", email: "", password: "", cPassword: "" };
    } catch (error) {
      $scope.cadastro = { username: "", email: "", password: "", cPassword: "" };
      console.log(error.data.message)
      await $scope.showAlertUserC(error.data.message)
    }
  };

  // cadastro de produtos


  $scope.proAlert = false;
  $scope.campsProduct = { name: '', price: '', description: '' }

  $scope.showAlertUserP = async function (message) {
    $scope.messageP = message;
    $scope.proAlert = true;
    $scope.$apply();

    await new Promise(resolve => setTimeout(resolve, 5000));

    $scope.$apply(() => {
      $scope.proAlert = false;
    });
  }

  $scope.insertProduct = async () => {

    if (!$scope.logged) { await $scope.showAlertUserP('Favor realizar login!') };

    const inputFile = document.getElementById('imagem');
    const file = inputFile.files[0];

    try {
      const formData = new FormData();
      console.log(toString($scope.campsProduct.price))
      formData.append('name', $scope.campsProduct.name);
      formData.append('price', $scope.campsProduct.price);
      formData.append('description', $scope.campsProduct.description);
      formData.append('image', file);

      const config = { transformRequest: angular.identity, headers: { 'Content-Type': undefined, 'Authorization': localStorage.getItem('token') } };

      const response = await $http.post('http://localhost:3000/products', formData, config)
      await $scope.showAlertUserP(response.data.message);
      $scope.campsProduct = { name: '', price: '', description: '' }
      inputFile.value = '';
      $scope.getProducts();
      $window.location.href = '/'
    } catch (err) {
      console.log(err.data.message);
      await $scope.showAlertUserP(err.data.message);
      $scope.campsProduct = { name: '', price: '', description: '' }
      inputFile.value = '';
      $window.location.href = '/'
    }
  }

  // front-end functions
});
