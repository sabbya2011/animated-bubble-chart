(function($) {
    var uj_defaultBubbleProps = { //default properties
        canvas_height: '100%',
        canvas_width: '100%',
        canvas_className: 'uj_bubble_chart_canvas',
        canvas_id: 'uj_bubbleChartCanvas_' + Math.floor(Math.random() * 100),
        canvas_padding_top: 10,
        canvas_padding_right: 10,
        canvas_padding_bottom: 10,
        canvas_padding_left: 10,
        x_axis_max_value: '',
        y_axis_max_value: '',
        primary_y_axis_space: false,
        primary_y_axis_padding: 0,
        primary_y_axis: [],
        primary_x_axis_space: false,
        primary_x_axis_padding: 0,
        primary_x_axis: [],
        horizontal_lines: [],
        collection_circle_objects: [],
        class_collection: false,
        bubble_hover_in_function: false,
        bubble_hover_out_function: false,
        annotation_series: []
    };
    var uj_create_intermediate_class = function(self) { //form the intermediate class
        self[0].className = (self[0].className ||
            'uj_intermediate_classname_' + Math.floor(Math.random() * 1000));
        return self[0].className;
    }
    var uj_check_availability = function(container, item) { //returns presence of an item
        return (d3.select(container).select(item).empty()) ? true : false
    };
    var uj_scale_nonscale_coordinate = function(value, scale_status, scaler, margin) {
        return (scale_status) ? margin + scaler(value) : margin + value;
    }
    var uj_annotation_text = function(item, self, x_scale, y_scale) {
        var circle_annotation_object;
        var annotation_id = '#' + item.id;
        (self.select(annotation_id).empty()) ?
        circle_annotation_object = self.append('text'):
            circle_annotation_object = self.select(annotation_id);

        circle_annotation_object
            .text(item.text)
            .attr('id', item.id)
            .attr('x', function() {
                return uj_scale_nonscale_coordinate(item.x, item.perform_x_scaling, x_scale, item.style.margin[0])
            })
            .attr('y', function() {
                return uj_scale_nonscale_coordinate(item.y, item.perform_y_scaling, y_scale, item.style.margin[1])
            })
            .attr("dy", "0.35em")
            .attr('class', 'uj_annotation_circle_object')
            .style('fill', item.style.color)
            .style('font-size', item.style.font_size)
            .style('font-family', item.style.font_family)
            .style("text-anchor", item.style.align);
    }
    var uj_annotation_circle = function(item, self, x_scale, y_scale) {
        var circle_annotation_object;
        var annotation_id = '#' + item.id;
        (self.select(annotation_id).empty()) ?
        circle_annotation_object = self.append('circle'):
            circle_annotation_object = self.select(annotation_id);

        circle_annotation_object.attr('id', item.id)
            .attr('cx', function() {
                return uj_scale_nonscale_coordinate(item.x, item.perform_x_scaling, x_scale, item.style.margin[0])
            })
            .attr('cy', function() {
                return uj_scale_nonscale_coordinate(item.y, item.perform_y_scaling, y_scale, item.style.margin[1])
            })
            .attr('r', item.radius)
            .attr('class', 'uj_annotation_circle_object')
            .style('fill', item.style.background_color);
    }
    var uj_create_y_axis = function(self, config,
        x_scale, y_scale) {
        self.text(function(d) {
                return d.text;
            })
            .attr('x', 0)
            .attr('y', function(d) {
                return y_scale(d.value);
            })
            .attr('class', 'uj_y_axis_object')
            .attr("dy", "0.35em")
            .style('fill', function(d) {
                return d.style.color;
            })
            .style('font-size', function(d) {
                return d.style.font_size;
            })
            .style('font-family', function(d) {
                return d.style.font_family;
            })
            .style("text-anchor", function(d) {
                return d.style.align;
            });

        //.style('dominant-baseline', 'middle'); //no ie support
        return self;
    };
    var uj_create_x_axis = function(self, config,
        x_scale, y_scale) {
        self.text(function(d) {
                return d.text;
            })
            .attr('x', function(d) {
                return x_scale(d.value);
            })
            .attr('y', function(d) {
                var p = (config.canvas_info.height -
                    config.primary_x_axis_space);
                return p;
            })
            .attr('class', 'uj_x_axis_object')
            .attr("dy", "0.35em")
            .style('fill', function(d) {
                return d.style.color;
            })
            .style('font-size', function(d) {
                return d.style.font_size;
            })
            .style('font-family', function(d) {
                return d.style.font_family;
            })
            .style("text-anchor", "middle");

        return self;
    };

    var uj_create_horizontal_lines = function(self, config,
        x_scale, y_scale) { //create horizontal line
        self.attr('d', function(d) {
                return "m " + d.start_point +
                    " " + y_scale(d.value) + " h " + d.end_point;
            })
            .attr('class', function(d) {
                return d.class + ' uj_horizontal_line';
            });

        return self;
    };
    var uj_create_bubble_objects = function(self,
        x_scale, y_scale) { //create bubbles

        self.attr('cx', function(d) {
                return x_scale(d.x);
            })
            .attr('cy', function(d) {
                return y_scale(d.y);
            })
            .attr('r', function(d) {
                return d.radius;
            })
            .attr('class', 'uj_bubble_circle_object')
            .style('fill', function(d) {
                return d.style.background_color;
            });
        return self;
    }
    var uj_create_bubble_text = function(self,
        x_scale, y_scale) { //create texts inside bubble
        self.text(function(d) {
                return d.name;
            })
            .attr('x', function(d) {
                return x_scale(d.x);
            })
            .attr('y', function(d) {
                return y_scale(d.y);
            })
            .attr('class', 'uj_bubble_text_object')
            .attr("dy", "0.35em")
            .style('fill', function(d) {
                return d.style.color;
            })
            .style('font-size', function(d) {
                return d.style.font_size;
            })
            .style('font-family', function(d) {
                return d.style.font_family;
            })
            .style("text-anchor", function(d) {
                return d.style.vertical_align;
            });

        //.style('dominant-baseline', 'middle'); //no ie support
        return self;
    }
    var uj_create_new_bubble_chart = function(self, config, x_scale, y_scale) { //create bubble chart

        var canvas = d3.select(self).append('svg'); //create svg
        if (config.class_collection) {
            var defs_style = canvas.append('defs').append('style');
            defs_style.text(config.class_collection); //create definition
        }
        canvas.attr('height', config.canvas_height)
            .attr('width', config.canvas_width)
            .attr('id', config.canvas_id)
            .attr('class', config.canvas_className);
        var inner_canvas = canvas.append('g');
        inner_canvas.attr('class', 'uj_drawable_area')
            .attr('transform', 'translate(' + config.canvas_padding_left + ',' + config.canvas_padding_top + ')');
        if (config.primary_y_axis.length != 0) {
            var y_axis_objects_group = inner_canvas.append('g')
                .attr('class', 'uj_y_axis_group')
                .selectAll('.uj_y_axis_object')
                .data(config.primary_y_axis)
                .enter().append('text');
            uj_create_y_axis(y_axis_objects_group, config, x_scale, y_scale); //create y axis
        }
        if (config.primary_x_axis.length != 0) {
            var x_axis_objects_group = inner_canvas.append('g')
                .attr('class', 'uj_x_axis_group')
                .selectAll('.uj_x_axis_object')
                .data(config.primary_x_axis)
                .enter().append('text');
            uj_create_x_axis(x_axis_objects_group, config, x_scale, y_scale); //create y axis
        }
        if (config.horizontal_lines.length) {
            var horizontal_line_objects_group = inner_canvas.append('g')
                .attr('class', 'uj_horizontal_line_group')
                .selectAll('.uj_horizontal_line')
                .data(config.horizontal_lines)
                .enter().append('path');
            uj_create_horizontal_lines(horizontal_line_objects_group, config, x_scale, y_scale); //create horizontal Lines
        }
        if (config.collection_circle_objects.length) {
            var bubble_objects_circle_group = inner_canvas.append('g') //create svg Bubbles
                .attr('class', 'uj_bubble_objects_circle_group')
                .selectAll('.uj_bubble_circle_object')
                .data(config.collection_circle_objects)
                .enter().append('circle')
                .on('mouseover', function(d, i) {
                    if (config.bubble_hover_in_function) {
                        config.bubble_hover_in_function(i, d, this, config);
                    }
                })
                .on('mouseout', function(d, i) {
                    if (config.bubble_hover_out_function) {
                        config.bubble_hover_out_function(i, d, this, config);
                    }
                })

            uj_create_bubble_objects(bubble_objects_circle_group, x_scale, y_scale);

            var bubble_objects_text_group = inner_canvas.append('g')
                .attr('class', 'uj_bubble_objects_text_group')
                .selectAll('.uj_bubble_text_object')
                .data(config.collection_circle_objects)
                .enter().append('text');
            uj_create_bubble_text(bubble_objects_text_group, x_scale, y_scale);
        }
        if (config.annotation_series.length != 0) {
            config.annotation_series.forEach(function(d, i) {
                if (d.annotation_type == 'circle') {
                    uj_annotation_circle(d, inner_canvas, x_scale, y_scale);
                }
                if (d.annotation_type == 'text') {
                    uj_annotation_text(d, inner_canvas, x_scale, y_scale);
                }
            });
        }

    };

    var uj_update_bubble_chart = function(self, config, x_scale, y_scale) { //update bubble chart
        var canvas = d3.select(self).select('svg');
        if (config.class_collection) {
            var defs_style = canvas.select('defs').select('style');
            defs_style.text(config.class_collection);
        }
        if (config.collection_circle_objects.length) {
            var bubble_objects = canvas.selectAll('.uj_bubble_circle_object')
                .data(config.collection_circle_objects).transition()
                .duration(1000);
            uj_create_bubble_objects(bubble_objects, x_scale, y_scale);
            var bubble_text_objects = canvas.select('.uj_bubble_objects_text_group')
                .selectAll('.uj_bubble_text_object ')
                .data(config.collection_circle_objects).transition()
                .duration(1000);
            uj_create_bubble_text(bubble_text_objects, x_scale, y_scale);
        }
        if (config.primary_x_axis.length != 0) {
            var x_axis_range_text = canvas.select('.uj_x_axis_group')
                .selectAll('.uj_x_axis_object')
                .data(config.primary_x_axis);
            uj_create_x_axis(x_axis_range_text, config, x_scale, y_scale);
        }
        if (config.primary_y_axis.length != 0) {
            var y_axis_objects_group = canvas.select('.uj_y_axis_group')
                .selectAll('.uj_y_axis_object')
                .data(config.primary_y_axis);
            uj_create_y_axis(y_axis_objects_group, config, x_scale, y_scale); //create y axis
        }
        if (config.horizontal_lines.length) {
            var horizontal_line_objects_group = canvas.select('.uj_horizontal_line_group')
                .selectAll('.uj_horizontal_line')
                .data(config.horizontal_lines);
            uj_create_horizontal_lines(horizontal_line_objects_group, config, x_scale, y_scale); //create horizontal Lines
        }
        if (config.annotation_series.length != 0) {
            config.annotation_series.forEach(function(d, i) {
                if (d.annotation_type == 'circle') {
                    uj_annotation_circle(d, canvas.select('.uj_drawable_area'), x_scale, y_scale);
                }
                if (d.annotation_type == 'text') {
                    uj_annotation_text(d, canvas.select('.uj_drawable_area'), x_scale, y_scale);
                }
            });
        }
    }

    var uj_form_bubble_chart = function(self, config) { //formation of bubbble chart starts here either update or append
        var canvas_details = d3.select(self)
            .node().getBoundingClientRect().valueOf();
        var canvas_info = {
            'height': canvas_details.height - ((config.canvas_padding_top) + config.canvas_padding_bottom),
            'width': canvas_details.width - ((config.canvas_padding_left) + config.canvas_padding_right)
        };
        config.canvas_info = canvas_info;
        var canvas_drawable_x_start = 0,
            canvas_drawable_y_start = 0;
        if (config.primary_y_axis_space) {
            canvas_drawable_x_start = config.primary_y_axis_space + config.primary_y_axis_padding;
        }
        if (config.primary_x_axis_space) {
            canvas_drawable_y_start = config.primary_x_axis_space + config.primary_x_axis_padding;
        }
        var x_scale = d3.scaleLinear().domain([0, config.x_axis_max_value])
            .range([canvas_drawable_x_start, canvas_info.width]),
            y_scale = d3.scaleLinear().domain([0, config.y_axis_max_value])
            .range([canvas_info.height - canvas_drawable_y_start, 0]);
        (uj_check_availability(self, 'svg')) ?
        uj_create_new_bubble_chart(self, config, x_scale, y_scale):
            uj_update_bubble_chart(self, config, x_scale, y_scale);
    };

    $.fn.uj_create_bubble_chart = function(config) { //creation of uj jquery plugin
        var updatedConfig = $.extend(uj_defaultBubbleProps, config);
        var container_classname = '.' + uj_create_intermediate_class(this);
        uj_form_bubble_chart(container_classname, updatedConfig);
    };

    //all code will be given inside this
})(jQuery);
