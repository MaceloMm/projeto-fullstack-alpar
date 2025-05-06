angular.module("lojaApp").controller("IndexController", function () {
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
 
});
