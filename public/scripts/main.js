let slideIndex = 0;
const slidesEl = document.querySelectorAll(".slide");
const prevEl = document.querySelector(".controls .prev");
const nextEl = document.querySelector(".controls .next");
const slideActEl = document.querySelectorAll(".controls .slideRet");

function showSlide(index) {
  slidesEl.forEach((slide, i) => {
    slide.classList.remove("active");
    slideActEl[i].classList.remove("active");
    if (index === i) {
      slide.classList.add("active");
      slideActEl[index].classList.add("active");
    }
  });
}

setInterval(() => {
  slideIndex = (slideIndex + 1) % slidesEl.length;
  showSlide(slideIndex);
}, 7000);

slideActEl.forEach((slide, i) => {
  slide.addEventListener("click", () => {
    slideIndex = i;
    showSlide(i);
  });
});

//imagem no cadastro de produto

function mostrarMiniatura(event) {
  const input = event.target;
  const previewContainer = document.getElementById("preview-container");
  const preview = document.getElementById("preview");
  const removerBtn = document.getElementById("removerImagem");

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      previewContainer.style.display = "block";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

document.getElementById("removerImagem").addEventListener("click", function () {
  const input = document.getElementById("imagem");
  const previewContainer = document.getElementById("preview-container");
  const preview = document.getElementById("preview");

  input.value = "";

  preview.src = "#";
  previewContainer.style.display = "none";
});

function formatarPreco(input) {
  let valor = input.value.replace(/\D/g, "");
  valor = (Number(valor) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  input.value = valor;
}
