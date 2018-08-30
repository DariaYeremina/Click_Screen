$(document).ready(function(){
    // var buttonWrapHeight = document.querySelector('.js-screen').clientHeight - (document.querySelector('.js-screen').clientHeight * 0.16) - document.querySelector('.header').offsetHeight - document.querySelector('.app-screen').offsetHeight;
    // if (buttonWrapHeight >= document.querySelector('.button').clientHeight){
    //     document.querySelector('.button__wrap').style.height = buttonWrapHeight + 'px';
    // }

    var viewportHeight = $(window).height();
    var viewportWidth = $(window).width();
    var scrollOffset = viewportHeight * 0.33; // 20% of the view port height
    var startPoint = viewportHeight - scrollOffset;
    var scrollIndex = viewportWidth / viewportHeight;
    var fromTopToBottom = false;
    var prevPosition = 0;
    var logo = $('.logo');
    var triangleBg = $('.background');
    var downloadBtn = $('#downloadBtn');
    var scrollFlag = $('#scrollFlag');
    var scrollEl = $('#scrollFlag .scroll-flag');
    var screenBtns = $('.screenshot__btn');
    var tooltipsArr = document.querySelectorAll('.tooltips');
    var screenshot = $('.screenshot');
    var screenshotLeft = -(viewportWidth * 0.20);
    var screenMoved = false;

    screenshot.css('margin-left', screenshotLeft + 'px');

    scrollFlag.scroll(function() {
        var currPosition = scrollFlag.scrollTop();
        fromTopToBottom = currPosition > prevPosition;

        logo.css('margin-top', '-' + currPosition + 'px');
        triangleBg.css('margin-right','-' + currPosition * scrollIndex + 'px');
        downloadBtn.css('margin-right','-' + currPosition + 'px');

        var currPercent = currPosition < 2 ? 0 : (currPosition * 100) / (13 * viewportHeight);
        var currScreenLeft = screenshotLeft + (screenshotLeft * -currPercent);
        screenshot.css('margin-left', currScreenLeft > 0 ? 0 : currScreenLeft + 'px');
        if (currScreenLeft >= 0 && screenMoved) {
            screenMoved = false;
            tooltipsLines();
        } else if (currScreenLeft < 0) {
            screenMoved = true;
        }

        var currOpacity = (1 - (startPoint - (currPosition - scrollOffset)) / startPoint) * 1.3;
        if (currPosition / viewportHeight <= 1.15){
            screenBtns.css('opacity', currOpacity);
            $(tooltipsArr).css('opacity', currOpacity);
            screenshot.css('opacity', 1);
        } else if (currPosition / viewportHeight > 1.3){
            currOpacity = (1 + (viewportHeight - (currPosition - scrollOffset)) / scrollOffset) * 1.4;
            screenBtns.css('opacity', currOpacity);
            $(tooltipsArr).css('opacity', currOpacity);
            screenshot.css('opacity', currOpacity);
        }
            // debugger;
        if ((prevPosition < currPosition) && (currPosition / scrollEl.height() >= 0.62)){
        //    window.scrollTo( 0, scrollEl.height());
        //    scrollEl.scrollTop(scrollEl.height());
            document.querySelector('#scrollFlag .scroll-flag').scrollIntoView({block: "end", behavior: "smooth"});
        } else if ((prevPosition > currPosition) && (currPosition / scrollEl.height() <= 0.05)){
            document.querySelector('#scrollFlag .scroll-flag').scrollIntoView({block: "start", behavior: "smooth"});
            // var i = 10;
            // var int = setInterval(function() {
            //     document.querySelector('#scrollFlag .scroll-flag').scrollTo(0, i);
            //     i += 10;
            //     if (i >= 200) clearInterval(int);
            // }, 20);
            // scrollEl.animate({scrollTop: 0},'50');
            // scrollEl.scrollTop (0);
        }
        console.log({currPosition: currPosition, scrollElHeight: scrollEl.height(), percent:  currPosition / scrollEl.height()});
        
        prevPosition = currPosition;
    });


    //tooltips height
    var tooltipsHeight = (document.querySelector('.screen_tooltips').clientHeight - document.querySelector('.screenshot').offsetHeight) / 2;
    for (var i = 0; i < tooltipsArr.length; i++){
        tooltipsArr[i].style.height = tooltipsHeight + 'px';
        tooltipsArr[i].style.marginLeft = '-' + tooltipsArr[i].offsetWidth / 2 + 'px';
    }

    // tooltips line
    function getCoords(elArr, newArr, flag){
        for (var i = 0; i < elArr.length; i++){
            var temp = {
                clientX: elArr[i].getBoundingClientRect().left,
                clientY: elArr[i].getBoundingClientRect().top
            };
            if (flag == 1){
                temp.clientBottom = elArr[i].getBoundingClientRect().bottom;
            }
            newArr[i] = temp;
        }
    };

    function tooltipsLines() {
        var buttonsCoord = [];
        var buttonsArr = document.querySelectorAll('.screenshot__btn .round-number');
        getCoords(buttonsArr, buttonsCoord);
        var tooltipCoord = [];
        var tooltipItemsArr = document.querySelectorAll('.tooltips__item'); 
        getCoords(tooltipItemsArr, tooltipCoord, 1);

        for (var i = 0; i < tooltipItemsArr.length; i++ ){
            var dataNumProp = tooltipItemsArr[i].getAttribute('data-num');
            var currentButtonCoord = {clientX: 0, clientY: 0};
            for(var j = 0; j < buttonsArr.length; j++){
                if (buttonsArr[j].getAttribute('data-num') == dataNumProp){
                    currentButtonCoord.clientX = buttonsCoord[j].clientX;
                    currentButtonCoord.clientY = buttonsCoord[j].clientY;
                }
            }
            // A and B coords
            var ax = tooltipCoord[i].clientX + tooltipItemsArr[0].offsetWidth / 2;
            var ay = tooltipCoord[i].clientBottom;
            var bx = currentButtonCoord.clientX + 12;
            var by = currentButtonCoord.clientY + 12;

            var lineEl = tooltipItemsArr[i].querySelector('.tooltips__line');
            var lineHeight = 0; 

            // C coords
            if(tooltipItemsArr[i].classList.contains('tooltips__item_top')){
                var cx = ax;
                var cy = by;
                
                // height of line
                lineHeight = Math.sqrt(Math.pow((bx - ax), 2) + Math.pow((by - ay), 2)) - 5;

                // angle
                var angle = Math.atan(Math.abs((cy - ay)/(cx - ax))) - Math.atan(Math.abs((by - ay)/(bx - ax)));
                angle = (180 / Math.PI) * angle;
                if(ax < bx){
                    var textTransf = 'rotate(-' + angle + 'deg)';            
                } else{
                    var textTransf = 'rotate(' + angle + 'deg)'; 
                }
                lineEl.style.transform = textTransf;
                lineEl.style.msTransform = textTransf;
                lineEl.style.webkitTransform = textTransf;
            }

            if(tooltipItemsArr[i].classList.contains('tooltips__item_bottom')){
                ay = tooltipCoord[i].clientY;
                var cx = bx;
                var cy = ay;
                
                // height of line
                lineHeight = Math.sqrt(Math.pow((ax - bx), 2) + Math.pow((ay - by), 2)) - 5;

                // angle            
                if(ax < bx){
                    var angle = Math.atan(Math.abs(cy - ay)/(cx - ax)) - Math.atan(Math.abs((by - ay)/(bx - ax)));
                    angle = 90 - (180 / Math.PI) * angle;
                    var textTransf = 'rotate( -' + angle + 'deg)';            
                } else{
                    var angle = Math.atan(Math.abs(by - ay)/(bx - ax)) - Math.atan(Math.abs((cy - ay)/(cx - ax)));
                    angle = 180 - (180 / Math.PI) * angle - 90;
                    var textTransf = 'rotate(' + angle + 'deg)'; 
                }
                lineEl.style.transform = textTransf;
                lineEl.style.msTransform = textTransf;
                lineEl.style.webkitTransform = textTransf;
            }
            lineEl.style.height = lineHeight + 'px';
        }
    }
});