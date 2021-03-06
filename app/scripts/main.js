// jshint devel:true

var drawing, sim;

// when the browser resizes (or switches between vertical and
// horizontal on mobile), we potentially want to scale our diagram up
// or down.
function scaleDrawing() {
    'use strict';
    var viewport = $('#model1').find('#viewport')[0];
    if (!viewport)
        return;
    var bbox = viewport.getBBox();
    // truncate to 2 decimal places
    var scale = ((($('.jumbotron').width()/bbox.width)*100)|0)/100;
    drawing.transform(scale, 0, 0);
    $('#model1').attr('height', ((bbox.height*scale)|0)+50);
}

$(window).resize(scaleDrawing);

function getQueryParams(qs) {
    'use strict';
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}


$(function(){
    var params = getQueryParams(document.location.search);
    var modelPath = 'university-promotion.xmile'; // 'population.xmile';
    if ('model' in params)
	modelPath = params['model'];

    var stocksXYCenter = params['use_stock_xy_as_center'] === 'true';

    $('#main-header').text(modelPath);

    sd.load(modelPath, function(model) {
        drawing = model.drawing('#model1', true, false, stocksXYCenter);

        scaleDrawing();

        sim = model.sim();
        sim.setDesiredSeries(Object.keys(drawing.namedEnts));
        sim.runToEnd().then(function(data) {
            drawing.visualize(data);
        });
        sim.csv().then(function(csv) {
            console.log(csv);
        });
    });
});
