$(document).ready(function () {
    const HOST = 'http://0.0.0.0:5001';
    const selectedAmenities = {};
    const selectedCities = {};
    const selectedStates = {};
  
    $('ul li input[type="checkbox"]').on('change', function (e) {
      const checkbox = e.target;
      let selectedFilters;
  
      switch (checkbox.id) {
        case 'state_filter':
          selectedFilters = selectedStates;
          break;
        case 'city_filter':
          selectedFilters = selectedCities;
          break;
        case 'amenity_filter':
          selectedFilters = selectedAmenities;
          break;
      }
  
      if (checkbox.checked) {
        selectedFilters[checkbox.dataset.name] = checkbox.dataset.id;
      } else {
        delete selectedFilters[checkbox.dataset.name];
      }
  
      if (checkbox.id === 'amenity_filter') {
        $('.amenities h4').text(Object.keys(selectedAmenities).sort().join(', '));
      } else {
        $('.locations h4').text(
          Object.keys(Object.assign({}, selectedStates, selectedCities)).sort().join(', ')
        );
      }
    });
  
    // Check API status
    $.getJSON(`${HOST}/api/v1/status/`, function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    });
  
    // Fetch data about places
    $.post({
      url: `${HOST}/api/v1/places_search`,
      data: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      success: function (data) {
        $(data).each(function (index, place) {
          $('section.places').append(
            `<article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">
                ${place.description}
              </div>
              <div class="reviews" data-place="${place.id}">
                <h2></h2>
                <ul></ul>
              </div>
            </article>`
          );
          fetchReviews(place.id);
        });
      }
    });
  
    // Search places
    $('.filters button').on('click', searchPlaces);
    searchPlaces();
  
    // Filter places by Amenity, States and Cities
    function searchPlaces () {
      $.post({
        url: `${HOST}/api/v1/places_search`,
        data: JSON.stringify({
          amenities: Object.values(selectedAmenities),
          states: Object.values(selectedStates),
          cities: Object.values(selectedCities)
        }),
        headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        success: function (data) {
          $('section.places').empty();
          $(data).each(function (index, place) {
            $('section.places').append(
              `<article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
                <div class="reviews" data-place="${place.id}">
                  <h2></h2>
                  <ul></ul>
                </div>
              </article>`
            );
            fetchReviews(place.id);
          });
        }
      });
    }
  
    // Show or Hide Reviews
    function fetchReviews (placeId) {
      $.getJSON(
        `${HOST}/api/v1/places/${placeId}/reviews`,
        function (data) {
          const reviewsContainer = $(`.reviews[data-place="${placeId}"]`);
          reviewsContainer.find('h2').html(`${data.length} Reviews <span id="toggle_review">show</span>`);
  
          const toggleReview = reviewsContainer.find('#toggle_review');
          const reviewsList = reviewsContainer.find('ul');
  
          toggleReview.on('click', function () {
            if (reviewsList.css('display') === 'none') {
              reviewsList.css('display', 'block');
              data.forEach(function (review) {
                $.getJSON(
                  `${HOST}/api/v1/users/${review.user_id}`,
                  function (userData) {
                    reviewsList.append(`
                      <li>
                        <h3>From ${userData.first_name} ${userData.last_name} on ${review.created_at}</h3>
                        <p>${review.text}</p>
                      </li>`
                    );
                  }
                );
              });
            } else {
              reviewsList.css('display', 'none');
            }
          });
        }
      );
    }
  });