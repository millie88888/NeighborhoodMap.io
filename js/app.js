function initMap() {

    // fMarker to set the marker display
    function fMarker(name, lat, lng, type, content, id) {
        var icon = {
            path: 'M24,0C14.2,0,6.3,7.8,6.3,17.4C6.3,32.9,24,48,24,48s17.7-15.4,17.7-30.6C41.7,7.8,33.8,0,24,0z',
            fillColor: '#efb7c2',
            fillOpacity: 1,
            scale: 0.5,
            strokeWeight: 2,
            strokeColor: '#efb7c2',

        };

        this.name = name;
        this.lat = lat;
        this.long = lng;
        this.type = type;
        this.content = content;
        this.id = id;

        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            title: name,
            map: map,
            content: content,
            draggable: true,
            animation: google.maps.Animation.DROP,
            icon: icon,
            id: id
        });

        this.marker.addListener('click', function() {

            var marker = this;
            if (this.getAnimation() !== null) {
                this.setAnimation(null);

            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 750);

            }

            this.addInfoToWindow = function() {
                $.ajax({
                    url: "https://api.foursquare.com/v2/venues/" + marker.id + '?client_id=HEBIV3Y4ZJODRMIQ5SL2NHEUDQJHNGLZBDKZXJZP3LELTNWN&client_secret=E2EU3RZ23OUJZWKYD3DV22C5H3GFWK5WESZRCIBKIPZTRCTB&v=20170925',
                    dataType: "json",
                    success: function(data) {
                        // stores results to display likes and ratings
                        var result = data.response.venue;
                        // add likes and ratings to marker
                        marker.likes = result.likes.summary ? result.likes.summary : "No Likes";
                        marker.rating = result.hasOwnProperty('rating') ? result.rating : "No Rating";

                        infowindow.setContent('<div><strong>' + marker.title + '</strong></div>' + '<div>' + marker.content + '<br>' + marker.likes + '<br>' + marker.rating);
                        infowindow.open(map, marker);

                    },
                    //alert if there is error in recievng json
                    error: function(xhr, status, thrownError) {
                        marker.likes = "FS Like Data unavailable";
                        marker.rating = "FS Rating Data unavailable";
                        infowindow.setContent('<div><strong>' + marker.title + '</strong></div>' + '<div>' + marker.content + '<br>' + marker.likes + '<br>' + marker.rating);
                        infowindow.open(map, marker);
                    }

                });

            };
            //console.log("My function gets called")
            if (!marker.likes) {
                console.log("addInfoToWindow");
                this.addInfoToWindow(marker);
            } else {
                console.log('open');
                infowindow.setContent('<div><strong>' + marker.title + '</strong></div>' + '<div>' + marker.content + '<br>' + marker.likes + '<br>' + marker.rating);
                infowindow.open(map, marker);
            }

        });

    }

    function errorMap(){
        window.open('error.html', '_self');
    };


    // Constructor function
    var ViewModel = function() {

        var self = this;
        this.points = ko.observableArray([
            new fMarker('Ikko Sushi', 38.99119779999999, -77.02930119999999, 'restaurant', 'WOW!I am a Japanese restaurant', '4bfeb934daf9c9b6ed26f9ef'),
            new fMarker('Kung Fu Tea', 38.9970677, -77.0269637, 'drink', 'WOW!I am a Bubble Tea.', '58221955fed4400bb04805d4'),
            new fMarker('Olazzo italian', 38.9926756, -77.02641129999999, 'restaurant', 'WOW!I am a Italian restaurant', '4ad4c018f964a520a5f020e3'),
            new fMarker('Bump n Grind', 38.990391, -77.029788, 'drink', 'Want some coffe?', '527b9be311d25146b36f2986'),
            new fMarker('Whole Foods Market', 38.996330, -77.024240, 'grocery', 'Its always Fresh', '4a76d917f964a52031e31fe3')
        ]);

        ///fitler for the sidebar in html
        this.filterOptions = [{
            label: "All",
            value: 'all'
        }, {
            label: "Restaurants",
            value: 'restaurant'
        }, {
            label: "Drinks",
            value: 'drink'
        }, {
            label: "Grocery",
            value: 'grocery'
        }];

        this.typeToShow = ko.observable('all');

        this.clickOption = function(option) {
            self.typeToShow(option.value);
        };

        // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
        this.markerOpenInfoWindow = function(clickedItem) {
            var marker = clickedItem.marker;
            console.log(clickedItem);
            google.maps.event.trigger(marker, 'click');
        };

        ///filter marker with checked: typeToShow
        this.markersToShow = ko.computed(function() {

            var desiredType = this.typeToShow();
            if (desiredType == 'all') {
                this.points().forEach(function(point) {
                    point.marker.setVisible(true);

                });

                return this.points();
            }
            return ko.utils.arrayFilter(this.points(), function(point) {
                var match = point.type === desiredType; // true or false

                point.marker.setVisible(match); // true or false

                console.log('comparing ' + point.type + ' to ' + desiredType);
                return match;
            });

        }, this);




    };

    /////////////////////////////////////////////////////////////

    // hamburger nav with slideDown and slideUp
    $(document).ready(function() {
        $(".dropdown").hover(
            function() {
                $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true, true).slideDown("400");
                $(this).toggleClass('open');
            },
            function() {
                $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true, true).slideUp("400");
                $(this).toggleClass('open');
            }
        );


        var trigger = $('.hamburger'),
            overlay = $('.overlay'),
            isClosed = false;

        trigger.click(function() {
            hamburger_cross();
        });

        function hamburger_cross() {

            if (isClosed === true) {
                overlay.hide();
                trigger.removeClass('is-open');
                trigger.addClass('is-closed');
                isClosed = false;
            } else {
                overlay.show();
                trigger.removeClass('is-closed');
                trigger.addClass('is-open');
                isClosed = true;
            }
        }

        $('[data-toggle="offcanvas"]').click(function() {
            $('#wrapper').toggleClass('toggled');
        });
    });


    ///////// Drawing map style

    var styles = [{
        "elementType": "geometry",
        "stylers": [{
            "color": "#f5f5f5"
        }]
    }, {
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#616161"
        }]
    }, {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#f5f5f5"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#bdbdbd"
        }]
    }, {
        "featureType": "poi",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#eeeeee"
        }]
    }, {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#757575"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e5e5e5"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#ffffff"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#757575"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#dadada"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#616161"
        }]
    }, {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    }, {
        "featureType": "transit",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e5e5e5"
        }]
    }, {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
            "color": "#eeeeee"
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#c9c9c9"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    }];



    /////// call map to display

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(38.9926756, -77.02641129999999),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styles
    });


    var infowindow = new google.maps.InfoWindow();



    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);

}





