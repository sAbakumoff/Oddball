define(function(require, exports, module) {
    main.consumes = ['Panel', 'fs'];
    main.provides = ['CPULimitsVisualizer'];
    return main;

    function main(options, imports, register) {
        var Panel = imports.Panel;
        var fs = imports.fs;
        var cpuLimitsFileName = '/var/log/cpulimits.log'; // I don't know the exact filename, so using the mock one.
        var interval = 5 * 60 * 1000; // interval of redrawing
        var intervalHandle = null;
        var chartStyle = {
          display:'table-cell', 
          border:'1px solid black'
        };


        var plugin = new Panel('CPULimitsVisualizer', main.consumes, {
          index    : 100,
          width    : 250,
          caption  : 'CPU Limits Visualizer',
          minWidth : 130,
          where    : 'right'
        });
        
        function buildBarStyle(height, leftMargin){
          return {
            display : 'inline-block',
            verticalAlign : 'bottom',
            width : '8px',
            background : '#999',
            height : height + 'px',
            marginLeft : leftMargin + 'px'
          };          
        }
        
        function buildErrorContent(errorMessage){
          return '<div>' + errorMessage + '</div>';
        }
        
        function getDocumentNode(htmlElement){
          var parent = htmlElement.parentNode;
          while(parent.parentNode){
            parent = parent.parentNode; //Document can never have a parent, so parentNode will always return null.
          }
          return parent;
        }

        function createElement(document, tagName, style){
          var element = document.createElement(tagName);
          var styleKeys = Object.keys(style);
          for(var i=0;i<styleKeys.length;i++){
            var styleKey = styleKeys[i];
            element.style[styleKey] = style[styleKey];
          }
          return element;
        }
        
        function drawCpuLimitsChart(hostingElement){
          fs.readFile(cpuLimitsFileName, function(err, data){
            if(err){
              hostingElement.innerHTML = buildErrorContent(err);
            }
            else{
              hostingElement.innerHTML = '';
              var htmlDocument = getDocumentNode(hostingElement);
              var values = data.split(',');
              if(values.length > 0){
                var chart = createElement(htmlDocument, 'div', chartStyle);   
                hostingElement.appendChild(chart);
                for(var i=0;i<values.length;i++){
                  // use https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus_%28.2B%29
                  // to convert strings to numbers
                  var height = +values[i];
                  if(isNaN(height)){
                    continue;
                  }
                  // using very simply bar charts to draw the CPU limitations
                  var barStyle = buildBarStyle(height, i === 0 ? 0 : 2);
                  var bar = createElement(htmlDocument, 'div', barStyle);
                  bar.setAttribute('title', height);
                  chart.appendChild(bar);    
                }                
              }
            }
          });
        }
        
        plugin.on('draw', function(e) {
          if(intervalHandle){
            clearInterval(intervalHandle);
          }
          drawCpuLimitsChart(e.html);
          intervalHandle = setInterval(function(){
            drawCpuLimitsChart(e.html);
          }, interval);
        });
    }
});
