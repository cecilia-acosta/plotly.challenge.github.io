function optionChanged(newData){
  barPlot(newData);
  bubblePlot(newData);
  Gauge(newData);
  demographics(newData)
};

function getData() {
    
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
  
    // Assign the value of the dropdown menu option to a variable
    let subjectId = dropdownMenu.property("value");
  
    // Create dropdownList
    d3.json("static/js/samples.json").then(d=>{
      
      console.log(d.names)
  
      let subjectIds = d.names;
  
      let dropdownList = subjectIds.forEach(el => {
        dropdownMenu.append("option").text(el).property("value");
      });
      
      barPlot(subjectIds[0]);
      bubblePlot(subjectIds[0]);
      Gauge(subjectIds[0])
      demographics(subjectIds[0])
    });
  };
  
  getData();

function demographics(newData) {
    let label = d3.select("#sample-metadata");

    d3.json("static/js/samples.json").then(d=>{
      
      console.log(d.metadata)
      
      let metadata = d.metadata;
      let filteredResult = metadata.filter(sampleObject => sampleObject.id == newData);
      let result = filteredResult[0];
      
      let demo = Object.entries(result).forEach(([key, value]) => {
        label.append("p").text(`${key}: ${value}`);

      });
    });
  };
  
  demographics();

function barPlot(newData){
  d3.json("static/js/samples.json").then(d=>{
    
    let samples = d.samples;
    let filteredResult = samples.filter(sampleObject => sampleObject.id == newData);
    let result = filteredResult[0];
  
    let sampleValues = result.sample_values.slice(0,10);
    let otuIds = result.otu_ids.slice(0,10);
    let otuLabels = result.otu_labels.slice(0,10);

    let trace = {
        x:otuIds,
        y:sampleValues,
        text:otuLabels,
        type:'bar',
        width: 15,
        orientation:'h'
    };
    
    let plotData = [trace];
  
    let layout = {
        title: 'Top 10 OTUs',
        height: 600,
        width: 600,
        yaxis: {title:'OTU Id'}
      };
  
      Plotly.newPlot("bar", plotData, layout);
      console.log(result);
      console.log(sampleValues);
  });
};

// Bubble Chart

function bubblePlot(newData){
  
  d3.json("static/js/samples.json").then(d=>{

    let samples = d.samples;
    let filteredResult = samples.filter(sampleObject => sampleObject.id == newData);
    let result = filteredResult[0];
    
    let sampleValues = result.sample_values;
    let otuIds = result.otu_ids;
    let otuLabels = result.otu_labels;
    
    let trace2 = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          color: otuIds,
          size: sampleValues,
        }
      };
      
      let plotData2 = [trace2];
      
      let layout2 = {
        title: 'Bubble Chart Hover for selected ID',
        showlegend: false,
        height: 600,
        width: 1200
      };
      
      Plotly.newPlot('bubble', plotData2, layout2);
  });
};

// Gauge Chart

function Gauge(newData){
  
  d3.json("static/js/samples.json").then(d=>{

    let metadata = d.metadata;
    let filteredResult = metadata.filter(sampleObject => sampleObject.id == newData);
    let result = filteredResult[0];
    console.log(result)
    
    let wfreq = result.wfreq;
    
    let plotData3 = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Washing Frequency" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    
    var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    
    Plotly.newPlot('gauge', plotData3, layout3);

  });
};