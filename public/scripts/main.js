let slideIndex = 0;
const slidesEl = document.querySelectorAll('.slide');
const prevEl = document.querySelector('.controls .prev');
const nextEl = document.querySelector('.controls .next');
const slideActEl = document.querySelectorAll(".controls .slideRet");

function showSlide(index) {
    slidesEl.forEach((slide, i) => {
        slide.classList.remove('active');
        slideActEl[i].classList.remove('active');
        if (index === i) {
            slide.classList.add('active');
            slideActEl[index].classList.add('active');
        }
    })
}

setInterval(() => {
    slideIndex = (slideIndex + 1) % slidesEl.length;
    showSlide(slideIndex);
}, 7000)

slideActEl.forEach((slide, i) => {
    slide.addEventListener('click', () => {
        slideIndex = i;
        showSlide(i);
    })
})