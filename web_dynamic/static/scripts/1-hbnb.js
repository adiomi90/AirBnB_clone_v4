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
});
