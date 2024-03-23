document.querySelector('.hamburger').addEventListener('click', () => {
    console.log(document.querySelector('.nav-links'))
    document.querySelector('.nav-mobile .nav-links').classList.toggle('expanded');
});