function onclickDataChange() {
  for (i = 0; i < occupyDataArray.length; i++) {
    occupyDataArray[i].airlineoccupancyCount = Math.floor(Math.random() * 10000);
    occupyDataArray[i].airlineAdherence = Math.floor(Math.random() * 100);
  }
  createoccupancyByAirllineChartData();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createoccupancyByAirllineChartData() {
  var occupyBubbleChartData = [];
  var jsonObj, circleObjects = [],
    primary_y_axis = [],
    primary_x_axis = [],
    horizontal_lines = [],
    class_collection;
  var circle_background = '',
    max_x_axis = 0,
    max_y_axis = 0,
    getMod, occupancyByGroupAnnotations = [];
  var primary_y_axis_space = 30,
    primary_y_axis_padding = 23,
    canvas_padding_left = 50,
    canvas_padding_right = 18;
  class_collection = ".primaryYAxisGrpGroupHorizontalDivisions {fill: none;stroke: #717070;stroke-meterlimit:10;stroke-width:0.5px;stroke-dasharray:2}" +
    " " + ".averageGrpGroupPath{fill: none;stroke: #3db2e6;stroke-meterlimit:10;stroke-dasharray:2}";

  for (i = 0; i < occupyDataArray.length; i++) {
    circle_background =
      (occupyDataArray[i].airlineAdherence < avgoccupyByGroup) ?
      '#e95950' : '#7eb339';
    max_x_axis = max_x_axis < occupyDataArray[i].airlineoccupancyCount ?
      Number(occupyDataArray[i].airlineoccupancyCount) : max_x_axis;
    max_y_axis = max_y_axis < occupyDataArray[i].airlineAdherence ?
      Number(occupyDataArray[i].airlineAdherence) : max_y_axis;
    jsonObj = {
      'x': occupyDataArray[i].airlineoccupancyCount,
      'y': occupyDataArray[i].airlineAdherence,
      'name': occupyDataArray[i].airlineGroupName,
      'radius': 23,
      'style': {
        'background_color': circle_background,
        'color': '#ffffff',
        'font_size': '16px',
        'font_family': 'goodFont-Medium',
        'vertical_align': 'middle'
      }
    };
    circleObjects.push(jsonObj);
  }

  max_x_axis += Math.floor(max_x_axis / 13);
  getMod = Math.floor(max_x_axis / 12000);
  getMod = (max_x_axis % 12000) ? (getMod + 1) * 12000 : max_x_axis;
  max_x_axis = getMod + Math.floor(getMod * (40 / (73 * 13)));
  max_y_axis = 100;
  var get_canvas_padding_value = primary_y_axis_space + primary_y_axis_padding;
  var active_width_horizontal_lines = $('.grpbyGroupSVGContainer').outerWidth() - (canvas_padding_left + canvas_padding_right);

  var createAnnotation = {
    'id': 'grpGroupCircleAnnt',
    'annotation_type': 'circle',
    'radius': 6,
    'x': active_width_horizontal_lines,
    'y': avgoccupyByGroup,
    'perform_x_scaling': false,
    'perform_y_scaling': true,
    'style': {
      'background_color': '#3db2e6',
      'margin': [0, 0]
    }
  }
  occupancyByGroupAnnotations.push(createAnnotation);
  createAnnotation = {
    'id': 'grpGroupTextTargetAnnt',
    'annotation_type': 'text',
    'text': 'COLOR TARGET',
    'x': active_width_horizontal_lines,
    'y': avgoccupyByGroup,
    'perform_x_scaling': false,
    'perform_y_scaling': true,
    'style': {
      'color': '#3db2e6',
      'margin': [0, -15],
      'font_size': '11px',
      'font_family': 'goodFont-Medium',
      'align': 'end'
    }
  }
  occupancyByGroupAnnotations.push(createAnnotation);


  for (i = 1; i <= 4; i++) {
    jsonObj = {
      'text': max_y_axis * i / 4 + ' %',
      'value': max_y_axis * i / 4,
      'class': 'primaryYAxisGrpGroupText',
      'style': {
        'color': '#000000',
        'font_size': '12px',
        'font_family': 'goodFont-Medium',
        'align': 'start'
      }
    }
    primary_y_axis.push(jsonObj);
    jsonObj = {
      'value': max_y_axis * i / 4,
      'start_point': get_canvas_padding_value,
      'end_point': active_width_horizontal_lines - get_canvas_padding_value,
      'class': 'primaryYAxisGrpGroupHorizontalDivisions'
    }
    horizontal_lines.push(jsonObj);
  }
  var average_occupancy_line = {
    'value': avgoccupyByGroup,
    'start_point': get_canvas_padding_value,
    'end_point': active_width_horizontal_lines - get_canvas_padding_value,
    'class': 'averageGrpGroupPath'
  }
  horizontal_lines.push(average_occupancy_line);
  for (i = 1; i <= 12; i++) {
    jsonObj = {
      'text': numberWithCommas(getMod * i / 12),
      'value': getMod * i / 12,
      'class': 'primaryYAxisGrpGroupText',
      'style': {
        'color': '#000000',
        'font_size': '12px',
        'font_family': 'goodFont-Medium'
      }
    }
    primary_x_axis.push(jsonObj);
  }

  occupyBubbleChartData = {
    'collection_circle_objects': circleObjects,
    'x_axis_max_value': max_x_axis,
    'y_axis_max_value': 100,
    'canvas_padding_top': 70,
    'canvas_padding_right': canvas_padding_right,
    'canvas_padding_bottom': 10,
    'canvas_padding_left': canvas_padding_left,
    'primary_y_axis_space': primary_y_axis_space,
    'primary_y_axis_padding': primary_y_axis_padding,
    'primary_y_axis': primary_y_axis,
    'primary_x_axis_space': 10,
    'primary_x_axis_padding': 100,
    'primary_x_axis': primary_x_axis,
    'horizontal_lines': horizontal_lines,
    'class_collection': class_collection,
    'bubble_hover_in_function': bubbleHoveredIn,
    'bubble_hover_out_function': bubbleHoveredOut,
    'annotation_series': occupancyByGroupAnnotations
  }
  $('.grpbyGroupSVGContainer').uj_create_bubble_chart(occupyBubbleChartData);
}

function bubbleHoveredIn(i, self_attr, self, config) {
  var canvas = d3.select('.grpbyGroupSVGContainer').select('svg');
  canvas.selectAll('.uj_bubble_circle_object')
    .data(config.collection_circle_objects).transition()
    .duration(1000)
    .style('fill', function(d) {
      return (self_attr.name != d.name) ?
        '#afafaf' : d.style.background_color;
    });
  canvas.selectAll('.averageGrpGroupPath')
    .transition()
    .duration(1000)
    .style('stroke', '#afafaf');
  canvas.selectAll('#grpGroupTextTargetAnnt')
    .transition()
    .duration(1000)
    .style('fill', '#afafaf');
  canvas
    .selectAll('#grpGroupCircleAnnt')
    .transition()
    .duration(1000)
    .style('fill', '#afafaf');
}

function bubbleHoveredOut(i, self_attr, self, config) {
  var canvas = d3.select('.grpbyGroupSVGContainer').select('svg');
  canvas.selectAll('.uj_bubble_circle_object')
    .data(config.collection_circle_objects).transition()
    .duration(1000)
    .style('fill', function(d) {
      return d.style.background_color;
    });
  canvas.selectAll('.averageGrpGroupPath')
    .transition()
    .duration(1000)
    .style('stroke', null);
  canvas.selectAll('#grpGroupTextTargetAnnt')
    .transition()
    .duration(1000)
    .style('fill', '#3db2e6');
  canvas
    .selectAll('#grpGroupCircleAnnt')
    .transition()
    .duration(1000)
    .style('fill', '#3db2e6');
}
$(function() {
  createoccupancyByAirllineChartData();
});
