function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metaUrl = `/metadata/${sample}`;
  d3.json(metaUrl).then(function(response) {
    // Use d3 to select the panel with id of `#sample-metadata`\
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    var data = Object.entries(response);
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    data.forEach(function([key, value]) {
      var row = panel.append("p");
      row.text(`${key}: ${value} \n`);
    });
   });
}
  
  

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleUrl = `/samples/${sample}`;
  d3.json(sampleUrl).then(function(response) {
    // @TODO: Build a Bubble Chart using the sample data
      // @TODO: Build a Bubble Chart using the sample data
    var bubbleIds = response.otu_ids;
    var bubbleLabels = response.otu_labels;
    var bubbleValues = response.sample_values;

    var trace = {
      x: bubbleIds,
      y: bubbleValues,
      text: bubbleLabels,
      mode: 'markers',
      type: "scatter",
      marker: {color: bubbleIds, colorscale: 'Rainbow', symbol: "circle", size: bubbleValues}
    };

    var data = [trace];

    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', data, layout);
  });

    // @TODO: Build a Pie Chart

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(sampleUrl).then(function(response) {
      var slicedIds = response.otu_ids.slice(0,10);
      var slicedLabels = response.otu_labels.slice(0,10);
      var slicedValues = response.sample_values.slice(0,10);

      var slicedData = [{
        "labels" : slicedIds,
        "values" : slicedValues,
        "hovertext" : slicedLabels,
        "type" : "pie"
      }];

      Plotly.newPlot('pie', slicedData);
      })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
