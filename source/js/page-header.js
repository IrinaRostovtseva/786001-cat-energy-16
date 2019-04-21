var menuButton = document.querySelector(".page-header__burger-btn");
var headerMenu = document.querySelector(".page-header__site-nav");

if (headerMenu.classList.contains("page-header__site-nav--no-js")) {
  headerMenu.classList.remove("page-header__site-nav--no-js");
}

menuButton.addEventListener("click", function (evt) {
  evt.preventDefault();
  if (headerMenu.classList.contains("page-header__site-nav--opened")) {
    headerMenu.classList.remove("page-header__site-nav--opened");
    headerMenu.classList.add("page-header__site-nav--closed");
  } else if (headerMenu.classList.contains("page-header__site-nav--closed")) {
    headerMenu.classList.remove("page-header__site-nav--closed");
    headerMenu.classList.add("page-header__site-nav--opened");
  }
});
