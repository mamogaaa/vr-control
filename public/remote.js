var socket = io({
    transports: ['websocket', 'polling'], 
    query: {
        type: 'remote',
        id: location.search
    }
});

socket.emit('remoteConnected');

function delta(a, b) {
    return { x: b.x - a.x, y: b.y-a.y };
}
var started = false;
$(window).swipe( {
    swipeStatus: function (event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection) {
        event.preventDefault();
        if (phase == 'start') $("#pointer").css('opacity', '1');
        if (phase == 'end') $("#pointer").css('opacity', '0');

        socket.emit('phase', phase)
        
        if (distance > 25 && fingerCount == 1) {
            if (!started) socket.emit('start');
            started = true;
            console.log('swipe detected', event.pageX/window.innerWidth, event.pageY/window.innerHeight);
            socket.emit('position', delta(fingerData[0].start, fingerData[0].last));
            
        }

        if (started && (phase == 'end' || phase == 'cancel')) {
            started = false;
            socket.emit('end');
        }

        if (distance < 50 && duration < 200 && phase == 'cancel') socket.emit('tap'); 
       
        $("#pointer").css('top', fingerData[0].end.y + "px").css('left', fingerData[0].end.x + "px")
        event.preventDefault();
        
    }
});

document.addEventListener("touchmove", function(e) {
    e.preventDefault();
}, false);

document.ontouchmove = function(event){
    event.preventDefault();
}
$(document).bind(
    'touchmove',
        function(e) {
          e.preventDefault();
        }
);