function loadCarousel() {
    $('.slide').not('.slick-initialized').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
    });
}

function loadImages(date) {
    var req_imgs = new XMLHttpRequest();
    req_imgs.open('GET', "https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?" + "earth_date=" + date + "&api_key=EaSj7UvtgabEBB9Mv06GqK6goCoG8ayBO6kDtHfZ", true);
    req_imgs.send();

    req_imgs.onreadystatechange = function () {
        if (req_imgs.readyState == 4 && req_imgs.status == 200) {
            var data = JSON.parse(req_imgs.responseText)
            var cameralist = [];
            for (i = 0; i < data['photos'].length; ++i) {
                if (data['photos'][i]['camera']['id'] === 24) { //ignore from camera ID 24
                    continue;
                } else {
                    if (!cameralist.includes(data['photos'][i]['camera']['full_name'])) {
                        cameralist.push(data['photos'][i]['camera']['full_name']);
                    }
                    var img = document.createElement("IMG");
                    img.setAttribute("src", data['photos'][i]['img_src']);
                    img.setAttribute("style", "height: auto")
                    document.getElementById("imgDiv").appendChild(img);
                }
            }
            for (i = 0; i < cameralist.length; ++i) {
                document.getElementById("cameralist").innerHTML += "[" + cameralist[i] + "] ";
            }
            loadCarousel();
            $(".se-pre-con").fadeOut("slow");
        }
    }
}
$(document).ready(function maxDate() {
    //first API call retrieves the latest date that Curiosity has photos for
    var req_maxdate = new XMLHttpRequest();
    req_maxdate.open('GET', "https://mars-photos.herokuapp.com/api/v1/manifests/curiosity", true);
    req_maxdate.send();

    req_maxdate.onreadystatechange = function() {
        if (req_maxdate.readyState == 4 && req_maxdate.status == 200) {
            var data = JSON.parse(req_maxdate.responseText);
            var maxdate = data['photo_manifest']['max_date'];
            loadImages(maxdate); //pass max date to the next API call
            //turn date into m/d/y format
            maxdate = maxdate.split("-");
            var buildstring = maxdate[1] + "/" + maxdate[2] + "/" + maxdate[0];
            document.getElementById("date").innerHTML += buildstring;
        }
    }
});
