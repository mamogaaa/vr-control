var socket = io({
    transports: ['websocket', 'polling'], 
    query: {
        type: 'display',
        id: location.search
    }
});

function sum(a, b) {
    return { x: b.x*3 + a.x, y: b.y*3+a.y };
}

var IMAGES = ['bg1.png', 'bg2.png', 'bg3.png', 'bg2.png', 'bg1.png', 'bg4.png'], CURRENT_IMAGE_IND = 0;;

$('#qrcode').qrcode("http://192.168.43.104:3000" + location.search);

socket.on('remoteConnected', function() {
    $("#qrcode").hide();
    $("body").css("background-image", "url(" + IMAGES[CURRENT_IMAGE_IND] + ")")
})

var TIMEOUT, START_POS = { x: 0, y: 0 };

socket.on('start', function(data) {
    clearTimeout(TIMEOUT);
    $("#pointer").css('opacity', '1');
    console.log('start')
    START_POS = { x: $("#pointer").offset().left, y: $("#pointer").offset().top };
});

socket.on('tap', function () {
    console.log('tap')    
    clearTimeout(TIMEOUT);
    $("#pointer").css('opacity', '1');
    TIMEOUT = setTimeout(function() {
        $("#pointer").css('opacity', '0');
    }, 1000);
    CURRENT_IMAGE_IND++;
    if (CURRENT_IMAGE_IND>= IMAGES.length) CURRENT_IMAGE_IND = 0;
    $("body").css("background-image", "url(" + IMAGES[CURRENT_IMAGE_IND] + ")")
})

socket.on('position', function(data) {
    var pos = sum(START_POS, data);
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
    if (pos.x > window.innerWidth) pos.x = window.innerWidth;
    if (pos.y > window.innerHeight) pos.y = window.innerHeight;
    $("#pointer").css('top', pos.y + "px").css('left', pos.x + "px")
});

socket.on('end', function() {
    TIMEOUT = setTimeout(function() {
        $("#pointer").css('opacity', '0');
    }, 1000);
})
