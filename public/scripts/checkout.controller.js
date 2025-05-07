var app = angular.module('CheckoutApp', []);

app.controller('CheckoutController', function($scope) {
  $scope.cart = JSON.parse(localStorage.getItem('cart')) || [];
  $scope.frete = 9.5;

  $scope.cartTotalPrice = $scope.cart.reduce((total, item) => total + item.price * item.quantity, 0);

  $scope.pagamentoSelecionado = {
    cartao: false,
    pix: false,
    boleto: false
  };

  $scope.dadosPagamento = {
    cartao: { numero: '', validade: '', cvv: '' },
    pix: { email: '', cpf: '' },
    boleto: { cpf: '' }
  };

  $scope.touched = {
    cartao: { numero: false, validade: false, cvv: false },
    pix: { email: false, cpf: false },
    boleto: { cpf: false }
  };

  $scope.selecionarOpcao = function(opcaoSelecionada) {
    for (let opcao in $scope.pagamentoSelecionado) {
      if (opcao !== opcaoSelecionada) {
        $scope.pagamentoSelecionado[opcao] = false;
        $scope.limparCampos(opcao);
      }
    }
    // se a opção foi desmarcada, limpa também
    if (!$scope.pagamentoSelecionado[opcaoSelecionada]) {
      $scope.limparCampos(opcaoSelecionada);
    }
  };

  $scope.limparCampos = function(opcao) {
    if ($scope.dadosPagamento[opcao]) {
      for (let campo in $scope.dadosPagamento[opcao]) {
        $scope.dadosPagamento[opcao][campo] = '';
        $scope.touched[opcao][campo] = false;
      }
    }
  };

  // Validações
  $scope.validarNumeroCartao = () => /^[0-9]{13,19}$/.test($scope.dadosPagamento.cartao.numero);
  $scope.validarValidade = () => /^(0[1-9]|1[0-2])\/\d{2}$/.test($scope.dadosPagamento.cartao.validade);
  $scope.validarCVV = () => /^[0-9]{3,4}$/.test($scope.dadosPagamento.cartao.cvv);
  $scope.validarEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.dadosPagamento.pix.email);
  $scope.validarCPF = cpf => /^\d{11}$/.test(cpf);

  $scope.formularioValido = function() {
    if ($scope.pagamentoSelecionado.cartao) {
      return $scope.validarNumeroCartao() &&
             $scope.validarValidade() &&
             $scope.validarCVV();
    }
    if ($scope.pagamentoSelecionado.pix) {
      return $scope.validarEmail() &&
             $scope.validarCPF($scope.dadosPagamento.pix.cpf);
    }
    if ($scope.pagamentoSelecionado.boleto) {
      return $scope.validarCPF($scope.dadosPagamento.boleto.cpf);
    }
    return false;
  };

  $scope.finalizarCompra = function() {
    alert('Compra finalizada com sucesso!');
  };
});
