function bootstrapAlert(msg) {
  let alert = $('<div class="alert alert-danger alert-dismissible fade in out col-xs-12 col-sm-8 col-sm-push-2 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4 text-center err-msg" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Fermer"><span aria-hidden="true">&times;</span></button>' + msg + '</div>'),
      target = $('.wrapper');

  alert.prependTo(target).fadeIn();
  $('.btn-refresh').on('click', function () {
    location.reload(false);
  });
}

function smoothScroll() {
  $('a[href*="#"]:not([href="#"])').on('click', function (e) {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') || location.hostname === this.hostname) {
      let target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      if (target.length) {
        e.preventDefault();
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 800);

        return false;
      }
    }
  });
}

function onloadStickyNavbar() {
  // Disable sticky navbar on load if screen width > 768px
  if ($(window).width() >= 768) {
    stickyNavbar(false);
  }
}

function scrollSpyStickyNavbar() {
  // Dynamic sticky navbar if screen width > 768px
  if ($(window).width() >= 768) {
    $(window).scroll(function () {
      if ($(window).scrollTop() > 115) {
        stickyNavbar(true);
      } else {
        stickyNavbar(false);
      }
    });
  }
}

function stickyNavbar(enable) {
  let jNav = $('.navbar-sgj'),
      jWrapper = $('.wrapper');

  if (enable) {
    jNav.addClass('navbar-fixed-top');
    jWrapper.addClass('fixed-navbar');
  } else {
    jNav.removeClass('navbar-fixed-top');
    jWrapper.removeClass('fixed-navbar');
  }
}

function getCSRFToken() {
  let req = $.ajax({
    method: 'GET',
    url: 'php/csrf_token.php'
  });

  req.done(function (token) {
    $('#csrfToken').val(token);
  }).fail(function () {
    // Disable all form controls.
    $('#contactForm input,textarea,button').each(function (i, input) {
      $(this).attr('disabled', 'true');
    });
    // Add tooltip to form to let user know why it is disabled.
    $('#contactForm').tooltip({
      title: 'Désolé, impossible d\'activer le formulaire de contact :-(',
      placement: 'top'
    });
  });
}

function contactSubmitHandler() {
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    let submitBtn = $('#sendMsg'),
        formData = $(this).serialize(),
        req = $.ajax({
          method: 'POST',
          url: 'php/send_msg.php',
          data: formData
        });

    submitBtn.attr('disabled', 'true')
             .html('<span class="glyphicon glyphicon-cog gly-spin"></span>');

    // AJAX request successfull
    req.done(function (ret) {
      // PHPMailer return code success
      if (ret) {
        submitBtn.removeClass('btn-primary')
                 .addClass('btn-success')
                 .html('<span class="glyphicon glyphicon-ok"></span>');
      // PHPMailer return code failure
      } else {
        submitBtn.removeClass('btn-primary')
                 .addClass('btn-danger')
                 .html('<span class="glyphicon glyphicon-remove"></span>');
        bootstrapAlert('Désolé, le mail n\'a pas pu être envoyé :-/<br />Veuillez cliquer <button class="btn btn-default btn-xs btn-refresh" type="button"><span class="glyphicon glyphicon-refresh"></span> ici</button> pour recharger la page et réessayer.')
      }
    // AJAX request failure
    }).fail(function () {
      submitBtn.removeClass('btn-primary')
               .addClass('btn-danger')
               .html('<span class="glyphicon glyphicon-remove"></span>');
      bootstrapAlert('Désolé, le mail n\'a pas pu être envoyé :-/<br />Veuillez cliquer <button class="btn btn-default btn-xs btn-refresh" type="button"><span class="glyphicon glyphicon-refresh"></span> ici</button> pour recharger la page et réessayer.')
    });
  });
}

function enableTooltips() {
  $('[data-toggle="tooltip"]').tooltip();
}


function main() {
  smoothScroll();
  onloadStickyNavbar();
  scrollSpyStickyNavbar();
  getCSRFToken();
  contactSubmitHandler();
  enableTooltips();
}


$(document).ready(function () {
  main();
});
