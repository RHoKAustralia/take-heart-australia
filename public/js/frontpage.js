$(document).ready(function() {
  $(".carousel").carousel({
    interval: 5000
  });
  $('#donate-carousel').on('slide.bs.carousel', function () {
      
  
    $(".myCarousel-target.active").removeClass("active");
    
    $('#donate-carousel').on('slid.bs.carousel', function () {
      
      var to_slide = $(".carousel-item.active").attr("data-slide-no");	
   		
      $(".nav-indicators li[data-slide-to=" + to_slide + "]").addClass("active");
      
  	 });
   });
    
});

$(function() {
var $iframe = $('iframe'),
    $videoLink = $('.video-link'),
    playerTemplate = '<div class="player"><div class="player__video"><div class="video-filler"></div><button class="video-close">&times;</button><iframe class="video-iframe" src="{{iframevideo}}" frameborder="0" allowfullscreen></iframe></div><div/>';


$videoLink.on('click', function(e) {
  console.log("abc");
    var localTemplate = '',
        videoWidth = parseInt($(this).data('width')),
        videoHeight = parseInt($(this).data('height')),
        videoAspect = ( videoHeight / videoWidth ) * 100,
        // elements
        $player = null,
        $video = null,
        $close = null,
        $iframe = null;

    e.preventDefault();

    localTemplate = playerTemplate.replace('{{iframevideo}}', $(this).prop('href'));

    $player = $(localTemplate);

    $player
        .find('.video-filler')
        .css('padding-top', videoAspect + '%');

    $close = $player
        .find('.video-close')
        .on('click', function() {
            $(this).off().closest('.player').hide().remove();
        });

    $player.appendTo('body').addClass('js--show-video');
});

});