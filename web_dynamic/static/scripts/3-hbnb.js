$(function () {
  const myObjs = {};

  $('input[type="checkbox"]').change(function () {
    const dataId = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      myObjs[dataId] = dataName;
    } else {
      if (dataId in myObjs) {
        delete myObjs[dataId];
      }
    }
    $('DIV.amenities h4').text(Object.values(myObjs));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (resp, status, xhr) {
    if (xhr.status === 200) {
      if (!($('div#api_status').hasClass('available'))) {
        if ($('div#api_status').attr('style')) {
          $('div#api_status').removeAttr('style');
        }
        $('div#api_status').addClass('available');
      }
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: (resp, textStatus, xhr) => {
      resp.forEach(element => {
        $('section.places').html(<article>element.name</article>)
      });
    }
  })
});
