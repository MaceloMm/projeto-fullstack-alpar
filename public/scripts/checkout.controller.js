var app = angular.module("CheckoutApp", []);

app.controller("CheckoutController", function ($scope, $http, $window) {
  $scope.getCart = async () => {
    try {
      const reponse = await $http.get("http://localhost:3000/cart", {
        headers: {
          "Content-Type": undefined,
          Authorization: localStorage.getItem("token"),
        },
      });
      $scope.cart = reponse.data.items;
      $scope.cartTotalPrice = $scope.cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      $scope.$apply();
    } catch (err) {
      console.log(err.data.message);
    }
  };

  $scope.getCart();
  $scope.frete = 9.5;

  $scope.pagamentoSelecionado = {
    cartao: false,
    pix: false,
    boleto: false,
  };

  $scope.dadosPagamento = {
    cartao: {numero: "", validade: "", cvv: ""},
    pix: {email: "", cpf: ""},
    boleto: {cpf: ""},
  };

  $scope.touched = {
    cartao: {numero: false, validade: false, cvv: false},
    pix: {email: false, cpf: false},
    boleto: {cpf: false},
  };

  $scope.selecionarOpcao = function (opcaoSelecionada) {
    for (let opcao in $scope.pagamentoSelecionado) {
      if (opcao !== opcaoSelecionada) {
        $scope.pagamentoSelecionado[opcao] = false;
        $scope.limparCampos(opcao);
      }
    }
    if (!$scope.pagamentoSelecionado[opcaoSelecionada]) {
      $scope.limparCampos(opcaoSelecionada);
    }
  };

  $scope.limparCampos = function (opcao) {
    if ($scope.dadosPagamento[opcao]) {
      for (let campo in $scope.dadosPagamento[opcao]) {
        $scope.dadosPagamento[opcao][campo] = "";
        $scope.touched[opcao][campo] = false;
      }
    }
  };

  // Formatação de CPF (Pix e Boleto)
  $scope.formatarCPF = function (opcao) {
    let cpf = $scope.dadosPagamento[opcao].cpf.replace(/\D/g, "");
    if (cpf.length > 11) cpf = cpf.substring(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    $scope.dadosPagamento[opcao].cpf = cpf;
  };

  // Validações
  $scope.validarNumeroCartao = () =>
    /^[0-9]{13,19}$/.test($scope.dadosPagamento.cartao.numero);
  $scope.validarValidade = () =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test($scope.dadosPagamento.cartao.validade);
  $scope.validarCVV = () =>
    /^[0-9]{3,4}$/.test($scope.dadosPagamento.cartao.cvv);
  $scope.validarEmail = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.dadosPagamento.pix.email);
  $scope.validarCPF = (cpf) => {
    const cpfNumerico = cpf.replace(/\D/g, "");
    return /^\d{11}$/.test(cpfNumerico);
  };

  $scope.formularioValido = function () {
    if ($scope.pagamentoSelecionado.cartao) {
      return (
        $scope.validarNumeroCartao() &&
        $scope.validarValidade() &&
        $scope.validarCVV()
      );
    }
    if ($scope.pagamentoSelecionado.pix) {
      return (
        $scope.validarEmail() &&
        $scope.validarCPF($scope.dadosPagamento.pix.cpf)
      );
    }
    if ($scope.pagamentoSelecionado.boleto) {
      return $scope.validarCPF($scope.dadosPagamento.boleto.cpf);
    }
    return false;
  };

  $scope.finalizarCompra = async function () {
    try {
      const resp = await $http.put(
        "http://localhost:3000/cart/status",
        {},
        {
          headers: {
            "Content-Type": undefined,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert(resp.data.message);
      $window.location.href = "/";
    } catch (err) {
      console.log(err.data.message);
    }
  };
});
