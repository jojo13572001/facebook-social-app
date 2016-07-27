  var mySwiper = new Swiper('.swiper-container',{
    pagination: '.pagination',
    paginationClickable: true
  })

  /* Dynamic Swiper Links*/
  function randomColor () {
    var colors = ('blue red green orange pink').split(' ');
    return colors[ Math.floor( Math.random()*colors.length ) ]
  }
  var count = 4;
  $('.sdl-append').click(function(e) {
    e.preventDefault();
    mySwiper.appendSlide('<div class="title">Slide '+(++count)+'</div>', 'swiper-slide '+randomColor()+'-slide')
  });
  $('.sdl-prepend').click(function(e) {
    e.preventDefault();
    mySwiper.prependSlide('<div class="title">Slide  '+(++count)+'</div>', 'swiper-slide '+randomColor()+'-slide')
  });
  $('.sdl-swap').click(function(e) {
    e.preventDefault();
    mySwiper
      .getFirstSlide()
      .insertAfter(1)
  });
  $('.sdl-insert').click(function(e) {
    e.preventDefault();
    mySwiper
      .createSlide('<div class="title">Slide  '+(++count)+'</div>', 'swiper-slide '+randomColor()+'-slide')
      .insertAfter(0)
  });
  $('.sdl-remove1').click(function(e) {
    e.preventDefault();
    mySwiper.removeSlide(0)
  });
  $('.sdl-removel').click(function(e) {
    e.preventDefault();
    mySwiper.removeLastSlide()
  });
  $('.sdl-remove2').click(function(e) {
    e.preventDefault();
    mySwiper.removeSlide(1)
  });