var main = {
    // create game board
    create: function(){

    var app = this.app;
    var paper = app._svg_;
    var sizes = app._sizes_;
    var settings = app._settings_;
    var races = app._races_;
    var sounds = app.sound;
    
    var road = roads[settings.road];
    
    var road_params = { 
      cell: 0.1,
      radius: road.radius,
      indent_finish: 10,
      size: 0,
      body: '#555',
      
      attr_road: {
        'stroke': '#000', 
        'stroke-width': 0.1, 
        'fill': road.fill, 
        'title': 'road', 
      },
      
      attr_border: {
        'stroke': '#444', 
        'stroke-width': 1, 
        'stroke-linejoin': 'round',
        'title': 'border', 
      },
      
      attr_finish: {
        'stroke': '#BB3', 
        'stroke-width': 1,
        'stroke-linecap': 'round', 
        'title': 'finish',
      },
      
      attr_boxes: {
        'stroke': '#000',
       'stroke-width': 0.1,
        'stroke-linejoin': 'round',
       'fill': '#444',
        'title': 'boxes',
      },
      
      get_size: function(){
        this.size = this.cell * this.radius;
      },
      free_view: false,
      renders_rivals: true,
      volume_music: 0.4,
    };   
    
    var speed = 50;
    var frames_for_races = 1000 / speed;    
    // obj draw field
    var field = {            
      border: null,            
      road: null,
      boxes: null,
      finish: {
        el: null,
        point_up: null,
        point_down: null,
      },
    };
    
    var road_array = [];
    
    var create_field = function(){      
      //     
      var rects = (function(array, size){
      
        var arr_lines = get_array_lines();
        
        return get_lines(arr_lines);
        
        function get_lines(points){
          
          var ls = [];
          
          var i;
          
          var arg;
          // indents
          var ids;
          
          var one_line;
          
          for(i = 0; i < points.length; i++){
          
            if (points[i][0].x == points[i][1].x){
              if (points[i][0].y > points[i][1].y){
                
                one_line = [
                  {x: points[i][1].x - points[i][2], y: points[i][1].y - points[i][2]},
                  {x: points[i][1].x + points[i][2], y: points[i][1].y - points[i][2]},
                  {x: points[i][0].x + points[i][2], y: points[i][0].y + points[i][2]},                    
                  {x: points[i][0].x - points[i][2], y: points[i][0].y + points[i][2]},
                ];

              } else {
                
                one_line = [
                  {x: points[i][0].x - points[i][2], y: points[i][0].y - points[i][2]},
                  {x: points[i][0].x + points[i][2], y: points[i][0].y - points[i][2]},
                  {x: points[i][1].x + points[i][2], y: points[i][1].y + points[i][2]},                    
                  {x: points[i][1].x - points[i][2], y: points[i][1].y + points[i][2]},
                ];
              }
              
              ls.push(one_line);
              continue;
              
            } else if (points[i][0].y == points[i][1].y){
                
                one_line = [
                  {x: points[i][0].x - points[i][2], y: points[i][0].y - points[i][2]},
                  {x: points[i][1].x + points[i][2], y: points[i][1].y - points[i][2]},
                  {x: points[i][1].x + points[i][2], y: points[i][1].y + points[i][2]},                    
                  {x: points[i][0].x - points[i][2], y: points[i][0].y + points[i][2]},
                ];
                      
              ls.push(one_line);
              continue;                
            }
          
            arg = get_arg(i);
            
            if (arg > Math.PI / 4){
              ids = get_indents(i, (arg - Math.PI / 4)); 
            } else {
              ids = get_indents(i, arg);               
            }
                          
            if (points[i][0].y > points[i][1].y){
              if (arg > Math.PI / 4){
                one_line = [
                  {x: points[i][0].x - ids[1], y: points[i][0].y + ids[0]},
                  {x: points[i][1].x - ids[0], y: points[i][1].y - ids[1]},
                  {x: points[i][1].x + ids[1], y: points[i][1].y - ids[0]},                    
                  {x: points[i][0].x + ids[0],  y: points[i][0].y + ids[1]},
                ];
              } else {
                one_line = [
                  {x: points[i][0].x - ids[1],  y: points[i][0].y - ids[0]},
                  {x: points[i][1].x + ids[0],  y: points[i][1].y - ids[1]},
                  {x: points[i][1].x + ids[1],  y: points[i][1].y + ids[0]},                    
                  {x: points[i][0].x - ids[0],  y: points[i][0].y + ids[1]},
                ];
              }
            } else {
              if (arg > Math.PI / 4){
                
                one_line = [
                  {x: points[i][0].x - ids[1],  y: points[i][0].y - ids[0]},
                  {x: points[i][0].x + ids[0],  y: points[i][0].y - ids[1]},
                  {x: points[i][1].x + ids[1],  y: points[i][1].y + ids[0]},                    
                  {x: points[i][1].x - ids[0],  y: points[i][1].y + ids[1]},
                ];
              } else {
                one_line = [                  
                  {x: points[i][0].x - ids[0],  y: points[i][0].y - ids[0]},
                  {x: points[i][0].x + ids[1],  y: points[i][0].y - ids[1]},
                  {x: points[i][1].x + ids[0],  y: points[i][1].y + ids[0]},                    
                  {x: points[i][1].x - ids[1],  y: points[i][1].y + ids[1]},
                ];
              }              
            }
                          
            ls.push(one_line);
            
          }

          return ls;

          function get_arg(num){
            
            var length_x = points[num][1].x - points[num][0].x;
            var length_y = Math.abs(points[i][0].y - points[i][1].y);
            
            if (length_x > length_y){
              return Math.atan(length_x / length_y);
            } else {
              return Math.atan(length_y / length_x);
            }
          }

          function get_indents(num, rad){
            
            var hyp;
            var inds;
            var cs;
            var sn;
            
            
            hyp = points[num][2] * Math.sin(Math.PI / 4);
            
            rad = Math.PI / 4 - rad;
            
            cs = Math.cos(rad) * hyp;
            sn = Math.sin(rad) * hyp;

            if (cs > sn){
              inds = [sn, cs];
            } else {
              inds = [cs, sn];
            }
            
            return inds;
          }      
        }
        
        function get_array_lines(){

          var i, j;
          var point_1, point_2;
          
          var ar = [];
                                  
          for(i = 0; i < array.length; i++){
            if (i + 1 < array.length){
              if (array[i].x < array[i + 1].x){
                ar.push([{x: get_size(array[i].x), y: get_size(array[i].y)},
                       {x: get_size(array[i+1].x), y: get_size(array[i+1].y)}, get_size(array[i].b, true)]);
              } else {
                ar.push([{x: get_size(array[i + 1].x), y: get_size(array[i + 1].y)},
                   {x: get_size(array[i].x), y: get_size(array[i].y)}, get_size(array[i].b, true)]);
              }
            } else {
              if (array[i].x < array[0].x){
                ar.push([{x: get_size(array[i].x), y: get_size(array[i].y)}, 
                  {x: get_size(array[0].x), y: get_size(array[0].y)}, get_size(array[i].b, true)]);
              } else {
                ar.push([{x: get_size(array[0].x), y: get_size(array[0].y)},
                       {x: get_size(array[i].x), y: get_size(array[i].y)}, get_size(array[i].b, true)]);
              }
            }
          }
          
          return ar;
        }

        function get_size(val, simple){
          if (simple){
            return val * size;
          } else {
            return val * size + size * 0.5;
          }
        }
     
      }(road.array, road_params.cell));
      
      // create array for road
      (function(array, lines, prms, finish, boxes){
                                  
        var i, j, num;
        var check_rect;
        var m, n;
        
        for (i = 0; i < prms.radius; i++){
          array[i] = [];
          for (j = 0; j < prms.radius; j++){
            
            array[i][j] = 1;  
                          
            for (num = 0; num < lines.length; num++){
              
              
              check_rect = (lines[num][0].x < get_point(i) && lines[num][2].x > get_point(i)) &&
                            (lines[num][1].y < get_point(j) && lines[num][3].y > get_point(j));
                            
              if (check_rect){
              
                if (check_point({x: get_point(i), y: get_point(j)}, lines[num])){
                  array[i][j] = 0;
                  break;
                }
              }
            }              
          
          }
        }
        
        for (num = 0; num < boxes.length; num++){
          for(m = 0; m < boxes[num].size; m++){
            for (n = 0; n < boxes[num].size; n++){
              if (m + boxes[num].i < prms.radius && n + boxes[num].j < prms.radius){
                array[m + boxes[num].i][n + boxes[num].j] = 3;
              }
            }
          }
        }
           
        set_finish(finish);
                
        function check_point(point, rect){
          
          var xy_point;
          var xy_rect;
          var len;
          
          var count;
          
          for (count = 0; count < 4; count++){
            
            switch(count){
              case 0:
              
                xy_rect = {
                  x: rect[1].x - rect[0].x,
                  y: rect[0].y - rect[1].y, 
                };
                
                xy_point = {
                  x: point.x - rect[0].x,
                  y: point.y - rect[1].y,
                };
                
              break;
              case 1:
              
                xy_rect = {
                  x: rect[2].x - rect[1].x,
                  y: rect[2].y - rect[1].y, 
                };
                
                xy_point = {
                  x: rect[2].x - point.x,
                  y: point.y - rect[1].y,
                };
                
              break;
              case 2:
              
                xy_rect = {
                  x: rect[2].x - rect[3].x,
                  y: rect[3].y - rect[2].y, 
                };
                
                xy_point = {
                  x: rect[2].x - point.x,
                  y: rect[3].y - point.y,
                };
                
              break;
              case 3:
              
                xy_rect = {
                  x: rect[3].x - rect[0].x,
                  y: rect[3].y - rect[0].y, 
                };
                
                xy_point = {
                  x: point.x - rect[0].x,
                  y: rect[3].y - point.y,
                };
                
              break;
            }
            
            len = (xy_rect.x / xy_rect.y) * xy_point.y; 
              
            if (xy_rect.x > (xy_point.x + len)){
              return false;
            }
            
          }
          
          return true;
        }
        
        function get_point(val){
          return prms.cell * val + 0.5 * prms.cell;
        }
        
        function set_finish(w){
          
          var width = prms.indent_finish;
          
          var m, n;
          
          var count = 0;
          
          exit:
          
          for (m = 0; m < array[w].length; m++){
            if (array[w][m] == 0){
              for (n = m; n < array[w].length; n++){      
                if (array[w][n] == 1){
                  
                  if (width > count){
                    count++;
                    w++;
                    m = 0;
                    continue exit;
                  } else {
                    break exit;                    
                  }
                  
                } else {
                  array[w][n] = 2;
                }
              }
            }
          }                        
        }
                            
      }(road_array, rects, road_params, road.finish, road.boxes));
              
      // draw road for road array        
      (function(obj, lines, array, p, svg){
        
        var i, j;
        var cell = p.cell;
        var point_up, point_down;
        var finish;
        var return_field;
        var scale = 15;
        
        var boxes = '';
        var check_corner;
        
        var path = '';
        
        if (p.free_view){
          svg.setViewBox(0, 0, sizes.w * scale, sizes.h * scale);
        }
        
              
        for (i = 0; i < array.length; i++){
          for (j = 0; j < array[i].length; j++){
                      
            if (array[i][j] == 2){
              if (point_up === undefined){
                point_up = {i: i, j: j};
              }
            }
                              
            check_corner = (((i - 1) > 0 && (j - 1) > 0 && array[i - 1][j - 1] == 3) && ((j - 1) > 0 && array[i - 1][j] == 3) 
                      && ((j - 1) > 0 && (j + 1) < p.radius && array[i - 1][j + 1] !== 3)
                         && ((j - 1) > 0 && array[i][j - 1] !== 3));
                      
            if (check_corner){
              boxes += set_path_border({i: i, j: j, root: 0}, 3);
            }            
            
          }
        }
                  
        for (j = point_up.j; j < array[point_up.i].length; j++){
          if (array[point_up.i][j] == 1){
            point_down = {i: point_up.i, j: j - 1};
            break;
          }
        }
        
        finish = 'M' + ((point_up.i + 0.5) * cell) + ',' + (point_up.j * cell) +
                  'L' +  ((point_down.i + 0.5) * cell) + ',' + ((point_down.j + 1) * cell);  
        
        point_up.i += p.indent_finish * 2;
        point_down.i += p.indent_finish * 2;
        
        for(i = 0; i < lines.length; i++){
          path += 'M' + lines[i][0].x + ',' + lines[i][0].y + 'L' + lines[i][1].x + ',' + lines[i][1].y + 
            'L' + lines[i][2].x + ',' + lines[i][2].y + 'L' + lines[i][3].x + ',' + lines[i][3].y  + 'Z';
        }         
         
        obj.border = svg.path(path).attr(p.attr_border);
        obj.road = svg.path(path).attr(p.attr_road);
        obj.boxes = svg.path(boxes).attr(p.attr_boxes);
        obj.finish.el = svg.path(finish).attr(p.attr_finish);
        obj.finish.point_up = point_up;
        obj.finish.point_down = point_down;          
        
         // draw_border          
        function set_path_border(begin, stuff){
          
          var count = 0;
          var path = '';
          var m, n;
          var stright;
          var root = begin.root;
          var cycle_points = {
            i: begin.i,
            j: begin.j,
          };
          
          var check_roots = function(){
            
            if (count != 0 && begin.i == cycle_points.i && begin.j == cycle_points.j){
              
              path += 'Z';
              return;
              
            }
            
            if (count == 0){
              path += 'M';
            } else {
              if (!stright){
                path += 'L';
              }
            }
            
            m = cycle_points.i;
            n = cycle_points.j;
            
            stright = false;
            
            switch(root){
              case 0:
                
                if (array[m - 1] && (array[m - 1][n - 1] !== stuff)){
                  root = 6;
                  cycle_points.i--;
                  cycle_points.j--;
                } else if (array[m][n - 1] !== stuff) {
                  cycle_points.j--;
                  stright = true;
                } else {
                  root = 2;
                }

                if (!stright){
                  path += (m * cell) + ',' + ((n + 1) * cell) + 'L' + (m * cell) + ',' + (n * cell);
                } 
                
              break;
              case 1:
                                
                if (array[m + 1] && (array[m + 1][n + 1] !== stuff)){
                  root = 3;
                  cycle_points.i++;
                  cycle_points.j++;
                } else if (array[m + 1] && (array[m + 1][n] !== stuff)){
                  cycle_points.i++;
                  stright = true;                
                } else {
                  root = 7;
                }

                if (!stright){
                  path += (m * cell) + ',' + ((n + 1) * cell) + 'L' + ((m + 1) * cell) + ',' + ((n + 1) * cell);
                } 

              break;
              case 2:
              
                                
                if (array[m + 1] && (array[m + 1][n - 1] !== stuff)){
                  root = 0;
                  cycle_points.i++;
                  cycle_points.j--;
                } else if (array[m + 1] && (array[m + 1][n] !== stuff)){
                  cycle_points.i++;
                  stright = true;
                } else {
                  root = 4;
                }

                if (!stright){
                  path += (m * cell) + ',' + (n * cell) + 'L' + ((m + 1) * cell) + ',' + (n * cell);
                } 

              break;
              case 3: 
                                
                if (array[m - 1] && (array[m - 1][n + 1] !== stuff)){
                  root = 5;
                  cycle_points.i--;
                  cycle_points.j++;
                } else if (array[m][n + 1] !== stuff){
                  cycle_points.j++;
                  stright = true;                
                } else {
                  root = 1;
                }

                if (!stright){
                  path += (m * cell) + ',' + (n * cell) + 'L' + (m * cell) + ',' + ((n + 1) * cell);
                } 

              break;
              case 4:
                                
                if (array[m + 1] && (array[m + 1][n + 1] !== stuff)){
                  root = 2;
                  cycle_points.i++;
                  cycle_points.j++;
                } else if (array[m][n + 1] !== stuff){
                  cycle_points.j++;
                  stright = true;                
                } else {
                  root = 6;
                }

                if (!stright){
                  path += ((m + 1) * cell) + ',' + (n * cell) + 'L' + ((m + 1) * cell) + ',' + ((n + 1) * cell);
                } 

              break;

              case 5:
                                
                if (array[m - 1] && (array[m - 1][n - 1] !== stuff)){
                  root = 7;
                  cycle_points.i--;
                  cycle_points.j--;
                } else if (array[m - 1] && (array[m - 1][n] !== stuff)){
                  cycle_points.i--;
                  stright = true;                
                } else {
                  root = 3;
                }

                if (!stright){
                  path += ((m + 1) * cell) + ',' + (n  * cell) + 'L' + (m * cell) + ',' + (n * cell);
                } 


              break;            
              case 6:
                                
                if (array[m - 1] && (array[m - 1][n + 1] !== stuff)){
                  root = 4;
                  cycle_points.i--;
                  cycle_points.j++;
                } else if (array[m - 1] && (array[m - 1][n] !== stuff )){
                  cycle_points.i--;
                  stright = true;                
                } else {
                  root = 0;
                }

                if (!stright){
                  path += ((m + 1) * cell) + ',' + ((n + 1) * cell) + 'L' + (m  * cell) + ',' + ((n + 1) * cell);
                } 

              break;
              case 7:
                
                if (array[m + 1] && (array[m + 1][n - 1] !== stuff)){
                  root = 1;
                  cycle_points.i++;
                  cycle_points.j--;
                } else if (array[m][n - 1] !== stuff) {
                  cycle_points.j--;
                  stright = true;
                } else {
                  root = 5;
                }

                if (!stright){
                  path += ((m + 1) * cell) + ',' + ((n + 1) * cell) + 'L' + ((m + 1) * cell) + ',' + (n * cell);
                } 
              break;        
            }
            
            if (count > p.radius){
              return;
            } else {
              count++;
              check_roots();
            }
          };
          
          check_roots();
          
          return path;
        };
        
      }(field, rects, road_array, road_params, paper));
  
    };
        
    var proto_racers = {
      
      cell: road_params.cell,
                
      frames: frames_for_races, 
        
      // remove racer from road 
      del: function(){
        this.point.remove();
      },
      // create elements for racer
      create: function(){
        
        var s = this.cell;

        var point_attr = {
          'fill': '#' + this.fill, 
          'stroke-width': s * 0.3,
          'stroke': this.border, 
          'title': 'racer',
        };
        
        
        this.point = paper.path('').attr(point_attr);
      },         
      
      set_racer: (function(){
        
        var path;
        
        var calc = function(xy, num, add){
            switch(num){
              case '05':
                if (add){
                  return xy + 2 * road_params.cell;
                } else {
                  return xy - (2 * road_params.cell);
                }
              break;
              case '025':
                if (add) {
                  return xy + 0.8 * road_params.cell;
                } else {
                  return xy -(0.8 * road_params.cell);
                }
            }
        };
        
        var indent_x = 0.005;
        var indent_y = 0.005;
        
        var get_indent = function(count){
          
          var root = count % 7;
                        
          switch(root){
            case 0:
              return {
                x: 0,
                y: -(indent_y),
              };
            break;
             case 1:
              return {
                x: indent_x,
                y: -(indent_y),
              };
            break;
            case 2:
              return {
                x: indent_x,
                y: 0,
              };
            break;
            case 3:
              return {
                x: indent_x,
                y: indent_y,
              };
            break;
            case 4:
              return {
                x: 0,
                y: indent_y,
              };
            break;
            case 5:
              return {
                x: -(indent_x),
                y: indent_y,
              };
            break;
            case 6:
              return {
                x: -(indent_x),
                y: 0,
              };
            break;
            case 6:
              return {
                x: -(indent_x),
                y: -(indent_y),
              };
            break;
          }
        }
        
        var xy;
        
        var get_path = function(x, y, root){
          switch(root){
            case 0:
              return 'M' + calc(x, '05') + ',' + calc(y, '05', true) + 'L' + x + ',' + calc(y, '05') + 
                      'L' + calc(x, '05', true) + ',' + calc(y, '05', true) + 'L' + x + ',' + calc(y, '025', true) + 'Z';
            break;
            case 1:
              return 'M' + calc(x, '05') + ',' + calc(y, '025') + 'L' + calc(x, '05', true) + ',' + calc(y, '05') + 
                      'L' + calc(x, '025', true) + ',' + calc(y, '05', true) + 'L' + x + ',' + y + 'Z';
            break;
            case 2:
              return 'M' + calc(x, '05') + ',' + calc(y, '05') + 'L' + calc(x, '05', true) + ',' + y + 
                      'L' + calc(x, '05') + ',' + calc(y, '05', true) + 'L' + calc(x, '025') + ',' + y + 'Z';
            break;
            case 3:
              return 'M' + calc(x, '025', true) + ',' + calc(y, '05') + 'L' + calc(x, '05', true) + ',' + calc(y, '05', true) + 
                      'L' + calc(x, '05') + ',' + calc(y, '025', true) + 'L' + x + ',' + y + 'Z';
            break;
            case 4:
              return 'M' + calc(x, '05', true) + ',' + calc(y, '05') + 'L' + x + ',' + calc(y, '05', true) + 
                      'L' + calc(x, '05') + ',' + calc(y, '05') + 'L' + x + ',' + calc(y, '025') + 'Z';
            break;
            case 5:
              return 'M' + calc(x, '05', true) + ',' + calc(y, '025', true) + 'L' + calc(x, '05') + ',' + calc(y, '05', true) + 
                      'L' + calc(x, '025') + ',' + calc(y, '05') + 'L' + x + ',' + y + 'Z';
            break;
            case 6:
              return 'M' + calc(x, '05', true) + ',' + calc(y, '05', true) + 'L' + calc(x, '05') + ',' + y + 
                      'L' + calc(x, '05', true) + ',' + calc(y, '05') + 'L' + calc(x, '025', true) + ',' + y + 'Z';
            break;
            case 7:
              return 'M' + calc(x, '025') + ',' + calc(y, '05', true) + 'L' + calc(x, '05') + ',' + calc(y, '05') + 
                      'L' + calc(x, '05', true) + ',' + calc(y, '025') + 'L' + x + ',' + y + 'Z';
            break;
          }
        };
                            
        return function(x, y, root){
          
          if (this.speed < 15){
                      
            xy = get_indent(this.steps.count);
          
            x += xy.x;
            y += xy.y;
            
          }
            
          path = get_path(x, y, root);

          this.point.attr('path', path);
        };
      }()),
      
      calcuts_x_y: function(i, j){
        return {
          x: i * this.cell + this.cell / 2,
          y: j * this.cell + this.cell / 2,
        };
      },

      set_point: (function(){
        
        var xy;
        var params_view;
        
        return function(i, j){
        
          xy = this.calcuts_x_y(i, j);
          
          if (this.type == 'user'){
            params_view = this.set_viewBox(xy.x, xy.y, this.frames);
          }
                        
          this.coord.i = i;
          this.coord.j = j;
          this.coord.x = xy.x;
          this.coord.y = xy.y;
          
          if (this.type == 'user'){
            this.set_racer(xy.x, xy.y, this.current_speed_root.r);
          } else {
            this.set_racer(xy.x, xy.y, this.root);
          }
                                                                                  
        };
      }()),
    
      set_viewBox: (function(){
    
        var w, h, x, y;
        var older_level = 0;
        var type_calcuts = 'qul';
        var scale;
        var add_scale = 0.02;
        var frames = frames_for_races;
        var svg = paper;
        var s = sizes;
        var level;
        var multy = 0.006;
        var no_view = road_params.free_view;
        var params = road_params;
        var half_w, half_h;
        
        return function (x_racer,  y_racer, count){        
          
          if (no_view){
            return;
          }
                    
          if (this.current_speed_root.s == 0){
            older_level = 0;
          }
                                        
          level = Math.floor(this.current_speed_root.s / 20);
    
          if (count === 1){ 
            if (level > older_level){
              type_calcuts = 'up';
            } else if (level < older_level) {                  
              type_calcuts = 'down';
            } else {
              type_calcuts = 'qul';
            }
            
            older_level = level;
          }
                          
          switch(type_calcuts){
            case 'up':
              scale = (older_level - 1 + (1 / frames * count)) * multy;
            break;
            case 'down':
              scale = (older_level + 1 - (1 / frames * count)) * multy;
            break;
            case 'qul':
              scale = older_level * multy;
            break
          }
                                     
          scale += add_scale;
          
          w = s.w * scale;
          h = s.h * scale;
                 
          half_w = w / 2;
          half_h = h / 2;       
                 
          if (x_racer - half_w <= 0){
            x = 0;
          } else if (x_racer + half_w > params.size){
            x = params.size - w;
          } else {
            x = x_racer - half_w;
          }
          
          if (y_racer - half_h <= 0){
            y = 0;
          } else if (y_racer + half_h > params.size){
            y = params.size - h;
          } else {
            y = y_racer - half_h;
          }

          svg.setViewBox(x, y, w, h);                              
        };
      }()),
    };
            
    var CreateRacer = function(user, params){
    
      var xy;

      this.root = 2;
      this.speed = 0;
      
      this.start = {
        i: params.i,
        j: params.j,  
      };
      
      this.name  = params.name;
      this.fill = params.color;
      
      // for racer of control user
      if (user){
        
        this.border = "#FFF";
        
        this.renders = {
          status: false,
          racer: {
            x: 0,
            y: 0,
          },
          viewBox: {
            x: 0,
            y: 0,
            count: 0,
          },
          fire: '',
        };
        
        this.steps = {
          cycle: false,
          count: 0, 
          bit: 0,
          begin_path: '',
          path: '',
          fire: '',
          goal: {
            i: 0,
            j: 0,
            x: 0,
            y: 0,
          },
          
          
        };            
        
        this.fly = [{s: 0, wait: 0}];
                
        this.type = 'user';

        this.current_speed_root = {
          s: this.speed,
          r: this.root,
        };
      } else {
       
        this.border = "#000";
       
        this.renders = {
          status: false,
          racer: {
            x: 0,
            y: 0,
          },
          fire: '',
        };

        this.steps = {
          cycle: true,
          count: 0, 
          bit: 0,
          begin_path: '',
          path: '',
          goal: {
            i: 0,
            j: 0,
            x: 0,
            y: 0,
          },
          wait: 0,
          num: 0,
        };

        this.fly = params.array;
        this.time = params.time;
        this.human_time = params.human_time;
        
        this.type = 'rival';
        
        this.write_wins = false; 
      }        
      
      this.coord = {
        i: 0,
        j: 0,
        x: 0,
        y: 0,
      };
              
      this.create();
      this.set_point(this.start.i, this.start.j);
    };      
                        
    var popup = {
      steps: {
        count: 0,
        frames: 0,
        go: false,        
      },
      el: document.getElementById('div_popup'),
      set_start_attr: function(){
        this.el.style.display = 'none';
      },
      set_left_top: function(){
        this.el.style.left = ((sizes.w - this.el.clientWidth) / 2) + 'px';
        this.el.style.top = ((sizes.h - this.el.clientHeight) / 2) + 'px';            
      },
      set_text: function(text){
        this.el.innerHTML = text; 
      }, 
      set_visibility: function(num){
        if (num === 0){
          this.el.style.display = 'none';
        } else{
          if (this.el.style.display !== 'block'){
            this.el.style.display = 'block';
          }
        }
        
        this.el.style.visibility = '' + num;
      },
      //countdown for start
      computation_start: function(persents){
        
          if (persents == 0){
              
              this.set_text('Для начала нажмите любую клавишу!');
              this.set_visibility(1 / 100);

          } else if (persents < 30){
              
              this.set_text('3!');
              this.set_visibility(persents / 100);
              
          } else if (persents < 60){
              
              this.set_text('2!');
              this.set_visibility(persents / 100);
              
          } else if (persents < 80){
          
            this.set_text('1!');
            this.set_visibility(persents / 100);
              
          } else if (persents < 99) {
            
            this.set_text('START!');
            this.set_visibility(persents / 100);
            
            if (persents == 90){
              sounds.setVolume(sounds.play('bip', false), 0.5);
            }

          } else {

            this.set_visibility(0);
          }
          
           this.set_left_top();              
      },
    };
    
    var popup_finish = {
      
      el: document.getElementById('div_popup_finish'),
      
      show: false,
      
      to_show: function(){
        
        this.show = true;
        this.el.style.display = "block";
        this.el.style.left = (sizes.w - this.el.clientWidth) / 2;
        this.el.style.top = (sizes.h - this.el.clientHeight) / 2;        
      },
      
      to_hide: function(){
        this.show = false;
        this.el.style.display = "none";
      },
      
      set_clicks: function(){
        var bottons = this.el.getElementsByTagName('input');
        
        bottons[0].onclick = function(){
          popup_finish.to_hide();
          
          app._call_menu_(true);
        },
        
        bottons[1].onclick = function(){
          popup_finish.to_hide();
          app._get_races_();
          game.restart();
        };
      },
      
      set_text: function(text){

        div = this.el.getElementsByTagName('div')[0];
        
        div.innerHTML = text;
      },
      
      set_bottons: function(show){
        
        var bottons = this.el.getElementsByTagName('input');
        
        if (show){
          bottons[0].focus();
          bottons[0].style.display = 'inline';
          bottons[1].style.display = 'inline';
        } else {
          bottons[0].style.display = 'none';
          bottons[1].style.display = 'none';
        }
      },
      
      set_text_wait: function(text) {
        var span = this.el.getElementsByTagName('span')[0];
        
        if (text){
          span.innerHTML = text;  
        } else {
          span.innerHTML = '';
        }
      }
    };
    
    // menu_game
    var menu = {
      show: false,
      el: document.getElementById('div_menu'),
      time: 0,
      sum_time: 0,
      
      set_sizes: function(){
        this.el.style.display = 'block';
        this.el.style.left = (sizes.w - this.el.clientWidth) / 2;
        this.el.style.top = (sizes.h - this.el.clientHeight) / 2; 
      },
      
      set_clicks: function(){
              
        var bottons = this.el.getElementsByTagName('input');
               
        bottons[0].onclick = function(){
          menu.to_hide();
          game.restart();
        };
        
        bottons[1].onclick = function(){
          menu.to_hide();
          app._call_menu_()
        };
        
        bottons[2].onclick = function(){
          menu.to_hide();
        };
      },
      
      to_show: function(){
        this.show = true;
        this.set_sizes();
        this.time = (new Date()).getTime();
        
        this.el.getElementsByTagName('input')[0].focus();
      },
      
      to_hide: function(){
        this.sum_time += (new Date()).getTime() - this.time;
        this.time = 0;  
        this.show = false;
        this.el.style.display = 'none';
      },
    };
        
    // anim hit rice with walls
    var crash  = {
      
      anim: false,
      count: 0,
      frames: 100,
      
      rnds: {
        r: 0,
        op: 1,
      },
      
      add_str: 0,
      
      el: paper.circle(0, 0, 0).attr({'stroke-opacity': 0.1, 'stroke': '#000',
                              'fill': '#444', 'stroke-width': 0.3}),
      // first step for hit
      start: function(x, y, add){
      
        this.el.toFront();
        this.el.attr({'cx': x, 'cy': y});
        this.anim = true;
        this.el.show();
        this.rnds.r = 0;
        this.rnds.op = 1; 
        this.add_str = add / 2000;
      
        sounds.setVolume(sounds.play('hit'), 0.5);
        
      },
            
      steps: function(){
        
        this.rnds.r += this.count * 0.01 + this.add_str + app.ease(this.count / 1000, 'inQuart') * 10;
        this.rnds.op = 10 / this.count  + 0.3;
        
        if (this.rnds.op > 1){
          this.rnds.op = 1;
        }
                
        if (this.count > this.frames){
          this.anim = false;
          this.count = 0;
          this.el.hide();
        } else {
          this.count += 10;
        }
      },
      
      renders: function(){
        this.el.attr({'r': this.rnds.r, 'fill-opacity': this.rnds.op});
      }
    };
        
    // controls the game
    var game = {
      sounds: sounds,
      music: undefined,
      hit: crash,
      menu: menu,
      params: road_params,
      sizes: sizes,
      svg: paper,
      array: road_array,
      field: field,
      racer: null,
      time_start: 0,
      fires_racers: null,
      racer_keypress: {
        right: false,
        left: false,
        up: false,
        down: false,
        
        del_up: false,
        del_down: false,

        clear_all: function(){
        
          this.right = false;
          this.left = false;
          this.up = false;
          this.del_up = false;
          this.down = false;
          this.del_down = false;
        },
        set_key: function(key){
          switch(key){
            case 'up':
              this.up = true;
              this.down = false;
              this.del_down = false;
              this.del_up = false;
            break;
            case 'down':
              this.down = true;
              this.del_down = false;
              this.del_up = false;
              this.up = false;
            break;
            case 'right':
              this.right = true;
              this.left = false;
            break;
            case 'left':
              this.left = true;
              this.right = false;
            break;                
          }
        },
        clear: function(key){
          switch(key){
            case 'up':
              this.del_up = true;
            break;
            case 'down':
              this.del_down = true;
            break;
          }            
        },
        del: function(){
          if (this.del_up){
            this.del_up = false;
            this.up = false;
          }
          
          if (this.del_down){
            this.del_down = false;
            this.down = false;
          }  
          
          if (this.right){
            this.right = false;
          }
          
          if (this.left){
            this.left = false;
          }
        },
      },
      rival: [],
      wins: [],
      up: popup,
      up_finish: popup_finish,
      frames: 1000 / speed,
      // begin, main, end
      status: '',
      timer: 0,
      
      create_paths_for_racers: function(){
        
        var attr_fire = {
          'stroke': '#FF5',
          'stroke-width': road_params.cell * 1.8,
          'stroke-linecap': 'round',
          'opacity': 0.9,
          'title': 'fires',
        };
                  
        this.fires_racers = this.svg.path('').attr(attr_fire);
      },
            
      //set sounds for current place race
      set_sounds_for_racer: (function(){
        
        var count, len_lens;
        
        var current;

        var vol_for_speed;  
        var vol_for_move; 
        var vol_for_wind; 
       
        var move;
        var move_near_wall;
        
        var rivals;
        
        var max_vol_for_speed = 0.01;
        var max_vol_wind = 0.5;
        var max_vol_for_rivals = 0.005;
        
        var indent_move_vol = 100;
        var indent_wind_vol = 5;
        
        var lengths_to_rivals;
        
        var get_lengths_to_rivals = function(the){
          
          var i, len;
          
          var racer_i = the.racer.coord.i;
          var racer_j = the.racer.coord.j;
          
          var lengths = [];

          len = the.rival.length;
          
          for (i = 0; i < len; i++){
            if (the.rival[i].speed == 0){
              lengths.push(false);
            } else {
              lengths.push(Math.abs(racer_i - the.rival[i].coord.i) + 
                      Math.abs(racer_j - the.rival[i].coord.j));
            }
          }
          
          return lengths;          
        };
        
        var ask_wall = function(the, root){
          
          var i = the.racer.coord.i;
          var j = the.racer.coord.j;
          var radius = the.params.radius;
          var arr = the.array;
          var len = 10;
                    
          if (root == 0 || root == 4){
                  return ((i - len < 0 || arr[i - len][j] !== 0) || (i + len > radius || arr[i + len][j] !== 0));            
          } else if (root == 1 || root == 5) {
                  return ((i - len < 0 || arr[i - len][j - len] !== 0) || 
                                    (i + len > radius || arr[i + len][j + len] !== 0));
          } else if (root == 2 || root == 6){
                  return ((arr[i][j - len] !== 0) || (arr[i][j + len] !== 0));
          } else {
                  return ((i + len > radius || arr[i + len][j - len] !== 0) || (i - len < 0 || arr[i - len][j + len] !== 0));
          }          
        };
                
        var set_volume = function(i, length, sounds){
           
          var vol_for_rival; 
                     
          if (length && length < 50){
                        
            vol_for_rival = 1 / (length * 20);
                        
            if (vol_for_rival > max_vol_for_rivals){
              vol_for_rival = max_vol_for_rivals;
            }
                        
            if (rivals[i] === undefined){
              if (i % 2 == 0){
                rivals[i] = sounds.play('fly_rival_1', true);
              } else {
                rivals[i] = sounds.play('fly_rival_2', true);
              }
            }
                                    
            sounds.setVolume(rivals[i], vol_for_rival);
            
          } else {
            if (rivals[i] !== undefined){
              
              sounds.stop(rivals[i]);
              rivals[i] = undefined;
            
            }
          } 
        };
        
        return function (){
          
          if (rivals === undefined){
            
            rivals = (function(the){
            
              var arr = [];
              var i;
              var len = the.rival.length;
              
              for (i = 0; i < len; i++){
                arr[i] = undefined;
              }
              
              return arr;
            
            }(this));
            
            
          }
          
          current = this.racer.current_speed_root;
                              
          if (current.s > 0){
            // for move race            
            vol_for_speed = current.s / 100; 
                
            if (vol_for_speed / indent_move_vol > max_vol_for_speed){
              vol_for_move = max_vol_for_speed / indent_move_vol;
            } else {
              vol_for_move = vol_for_speed / indent_move_vol;
            }
            
            if (move === undefined){
              move = this.sounds.play('fly_main', true);
            }
            
            this.sounds.setVolume(move, vol_for_move);
            
            //for wall
                        
            if (ask_wall(this, current.r)){
                                        
              if (vol_for_speed / indent_wind_vol > max_vol_wind){
                vol_for_wind = max_vol_wind / indent_wind_vol;   
              } else {
                vol_for_wind = vol_for_speed / indent_wind_vol;   
              }
              
              move_near_wall = this.sounds.play('wind');
              this.sounds.setVolume(move_near_wall, vol_for_wind);  
            
            } else {
              
              if (move_near_wall !== undefined){
                this.sounds.stop(move_near_wall);
              }
              
            }
            
          } else {

            if (move !== undefined){      
              this.sounds.stop(move);
              move = undefined;
            }
            
            if (move_near_wall !== undefined){
              this.sounds.stop(move_near_wall);
            }
          }
          
          // for racers
                    
          lengths_to_rivals = get_lengths_to_rivals(this);
                    
          len_lens = lengths_to_rivals.length;
          
          for (count = 0; count < len_lens; count++){
            
            set_volume(count, lengths_to_rivals[count], this.sounds);
          
          }
        };
      }()),
      
      send_fly: function(){
        
        var obj = this.racer.fly;
        var json = JSON.stringify(obj);
        var the = this;
        var xhr = new XMLHttpRequest();
        
        try {
          xhr.open("POST", 'record_races.php', true);
          xhr.setRequestHeader("Content-Type", "application/json");
          
          xhr.onreadystatechange = function(){
            if (xhr.readyState == 4){
              if (xhr.status == 200){
                the.up_finish.set_text_wait(xhr.responseText);
              } else {
                the.up_finish.set_text_wait('Возникла какая-то ошибка с сетью..');
              }
              
              the.up_finish.set_bottons(true);
            }
          };
          
          xhr.send(json);
        
        } catch (e) {
          console.log('settings error', xhr.readyState);
        }
      },
      
      get_human_time: function(simple){
            
            var time = (new Date()).getTime() - this.time_start - this.menu.sum_time;
            var sec;
            var min;
                        
            if (simple){
              return time;
            } else {                                    
              sec = time / 1000;
              min = Math.floor(sec / 60);
              sec = Math.floor(sec - min * 60);
              
              return '' + min + ':' + sec;
            }
      },
      
      restart: function(){
        
        this.fires_racers.remove();
        
        this.up.rend_finish = true;
        this.timer = 0;
        this.racer_keypress.clear_all();  
        this.time_start = 0;
        this.wins = [];
        
        this.menu.show = false;
        this.menu.sum_time = 0;
        this.menu.time = 0;
        
        this.hit.anim = false;
                
        this.racer.del();
        
        this.rival.forEach(function(rival){
          rival.del();
        });
        
        this.rival = [];
        this.racer = null;
        
        this.start_game();
        
        function log_trace(){
          console.log('[');
          for (var i in this.racer.fly){
            console.log(' {');
            for (var prop in this.racer.fly[i]){
              console.log("  '" + prop + "'" + ': ' + this.racer.fly[i][prop] + ',');
            }
            console.log(' },');
          }
          console.log(']');              
        }
      },
      
      steps_start: function(){
        
        if (this.up.steps.count == 0){
                        
          if (this.up.steps.go){
            this.up.steps.count++;
          }
          
        } else if (this.up.steps.count < this.up.steps.frames){
          
          this.up.steps.count++;
        
        } else {
          this.up.steps.count = 0;
          this.status = 'main';
          this.time_start = (new Date()).getTime();
        }
      },

      // start_game!      
      start_game: function(){
      
        var xy, i, j;
        var count;
    
        this.status = 'begin';            
            
        this.up.set_start_attr();                    
        this.up.steps.frames = 100;        
        
        if (this.music === undefined){
          this.music = this.sounds.play('music', true);
        }
        
        sounds.setVolume(this.music, this.params.volume_music); 
        
        this.create_paths_for_racers();
               
        for (count = 0; count < races.count; count++){ 
          if (races.array[count].road === settings.road && this.rival.length < 5){
            this.rival.push(new CreateRacer(false, races.array[count]));
          }
        }

        i = this.field.finish.point_up.i;
        
        for (count = 0; count < 20; count++){
            
          j = Math.round(Math.random() * (this.field.finish.point_down.j - this.field.finish.point_up.j) + 
                                                                              this.field.finish.point_up.j);
          
          if (this.array[i][j] === 0){
            break
          } 
        }
        
        this.racer = new CreateRacer(true, {i: i, j: j, name: settings.name, color: settings.color});                                                    
      },
      
      get_ij_from_xy: function(x, y){
        return {
          i: Math.floor(x / this.params.cell),
          j: Math.floor(y / this.params.cell),
        };
      },
      
      finish_game: function(racer){
        
        var win_obj;
        var time;
          
        if (racer.type == 'user'){
          time = this.get_human_time();
          racer.human_time = time;
        } else {
          time = racer.human_time;
        }                
                            
        win_obj = {
          type: racer.type,
          name: racer.name,
          fly:  racer.fly,
          human_time: time,               
        };
        
        this.wins.push(win_obj);
        
        if (racer.type == 'user'){
          this.status = 'end';      
        }      
      },
      
      check_finish_racer: function(){
        
        var win_obj;
        
        if (this.racer.current_speed_root.r > 0 && this.racer.current_speed_root.r < 4){
                        
          if (this.array[this.racer.coord.i][this.racer.coord.j] == 2){
            this.racer.renders.status = false;
            this.racer.steps.cycle.status = false;
            
            this.finish_game(this.racer);            
          }    
        } else {
          if (this.array[this.racer.coord.i][this.racer.coord.j] == 2){
            this.restart();
          }
        }
      },
      
      // calcuts_x_y from i, j
      calcuts_x_y: function(i, j){
                          
        return {
            x: i * road_params.cell + road_params.cell / 2,
            y: j * road_params.cell + road_params.cell / 2,
          };
      },

      // goes move for racer
      racer_go: function(racer){
      
        var s;
        var i = racer.coord.i;
        var j = racer.coord.j;
        var the = this;
        var len = this.array.length;
        
        switch (racer.root){
          case 0:
            for (s = 1; s <= racer.speed; s++ ){
                                                  
              if (j - s > 0 && (this.array[i][j - s] === 1 || this.array[i][j - s] == 3)){
                                    
                s--;
                boomb(i, j - s);                    
                break;
              } 
                                                  
              if (s == racer.speed){
                set_goal(i, j - s);                    
              }

            }
          break;
          case 1:
            for (s = 1; s <= racer.speed; s++ ){
              if ((i + s < len && j - s > 0) && 
                      (this.array[i + s][j - s] === 1 || this.array[i + s][j - s] == 3)){
                
                s--;
                boomb(i + s, j - s);
                break;
              } 
              
              if (s == racer.speed){
                set_goal(i + s, j - s);
              }
            }
          break;
          case 2: 
            for (s = 1; s <= racer.speed; s++ ){
              if (i + s < len && (this.array[i + s][j] === 1 || this.array[i + s][j] == 3)){
                s--;                                        
                boomb(i + s, j);
                break;
              } 
              
              if (s == racer.speed){
                set_goal(i + s, j);
              }
            }
          break;
          case 3: 
            for (s = 1; s <= racer.speed; s++ ){
              if ((i + s < len && j + s < len) && 
                  (this.array[i + s][j + s] === 1 || this.array[i + s][j + s] == 3)){
                s--;
                boomb(i + s, j + s);
                break;
              } 
              
              if (s == racer.speed){
                set_goal(i + s, j + s);
              }
            }
          break;
          case 4: 
            for (s = 1; s <= racer.speed; s++ ){
              if (j + s < len && (this.array[i][j + s] === 1 || this.array[i][j + s] == 3)){
                s--;
                boomb(i, j + s);
                break;
              } 
              
              if (s == racer.speed){
                set_goal(i, j + s);
              }
            }              
          break;
          case 5: 
            for (s = 1; s <= racer.speed; s++ ){
              if ((i - s > 0 && j + s < len) && 
                  (this.array[i - s][j + s] === 1 || this.array[i - s][j + s] == 3)){
                s--;
                boomb(i - s, j + s);
                break;
              } 
              
              if (s == racer.speed){
                set_goal(i - s, j + s);
              }
            }
          break;
          case 6:
            for (s = 1; s <= racer.speed; s++ ){
              if (i - s > 0 && (this.array[i - s][j] === 1 || this.array[i - s][j] == 3)){
                s--;
                boomb(i - s, j);
                break;
              } 
              
              if (s == racer.speed){
                set_goal(i - s, j);
              }
            }
          break;
          case 7: 
            for (s = 1; s <= racer.speed; s++ ){
              if ((i - s > 0 && j - s > 0) && 
                  (this.array[i - s][j - s] === 1 || this.array[i - s][j - s] == 3)){
                s--;
                boomb(i - s, j - s);
                break;
              } 
              
              if (s == racer.speed){
                set_goal(i - s, j - s);
              }
            }
          break;
        }

        racer.current_speed_root.s = racer.speed;
        racer.current_speed_root.r = racer.root;
                
        // move racer in i, j
        function set_goal(goal_i, goal_j){
          
          var xy = the.calcuts_x_y(goal_i, goal_j);
          racer.steps.goal.i = goal_i;
          racer.steps.goal.j = goal_j;
          racer.steps.goal.x = xy.x;
          racer.steps.goal.y = xy.y;
        
          racer.steps.cycle = true;        
        }
        // breack racer in i, j
        function boomb(racer_i, racer_j){
          
          var xy = the.calcuts_x_y(racer_i, racer_j);
          the.hit.start(xy.x, xy.y, racer.speed);
          
          if (racer_i == racer.coord.i && 
                            racer_j == racer.coord.j){
                        
            racer.speed = 0;
            racer.root = get_root(racer_i, racer_j);
            
          } else {
          
            racer.speed = 1;
            set_goal(racer_i, racer_j);
          
          }
        }
        
        function get_root(i, j){
                      
          var road = the.array;
          
          if (road[i][j - 1] != 0){
            return 4;
          } else if (i + 1 < len && road[i + 1][j - 1] != 0) { 
            return 5;
          } else if (i + 1 < len && road[i + 1][j] != 0){
            return 6;
          } else if (i + 1 < len && road[i + 1][j + 1] != 0){
            return 7;
          } else if (road[i][j + 1] != 0){
            return 0;
          } else if (i - 1 > 0 && road[i - 1][j + 1] != 0){
            return 1;
          } else if (i - 1 > 0 && road[i - 1][j] != 0){
            return 2;
          } else {
            return 3;
          }
        }            
      },

      // calcuts x, y for next frame rendering racer  
      steps_for_racer: function(){
        
        var racer = this.racer;
                                        
        if (racer.steps.cycle){
          this.set_renders_racer_rival(this.racer);
        }
        
        // start calcuts params for render if it is needs
        if (racer.steps.count == 0){
          
          this.check_up_down_for_racer();
          
          if(racer.speed > 0){
            this.racer_go(racer);
          } else {
            if (racer.steps.cycle){
              racer.steps.cycle = false;
            }
          }
        }            
        
        if (this.timer % 20 == 0){
          this.set_sounds_for_racer();
        }
        
        this.check_finish_racer();

        if (this.status == 'end'){
                    
          racer.fly.push({
            s: racer.current_speed_root.s,
            r: racer.current_speed_root.r,
            i: racer.steps.goal.i,
            j: racer.steps.goal.j,
            wait: 0,
            time: this.timer,
            human_time: racer.human_time,
            millis: this.get_human_time(true), 
            start_i: racer.start.i,
            start_j: racer.start.j,
            road: settings.road,
            name: racer.name,
            color: racer.fill,
          });              
        } else {
          if (racer.steps.count == 0){
            if (racer.speed > 0){
              racer.fly.push({
                s: racer.speed,
                r: racer.root,
                i: racer.coord.i,
                j: racer.coord.j,
                wait: 0,
              });
            } else {
                                        
              if (racer.fly[racer.fly.length - 1].s === 0){
                racer.fly[racer.fly.length - 1].wait++;
              } else {
                racer.fly.push({s: 0, wait: 0, i: racer.coord.i, j: racer.coord.j});
              }
            }
          }
        }
      },

      set_renders_racer_rival: function(racer){
        
        var xy;
        var ij;
        var xy_fire;
        var steps = racer.steps;
        var rnds = racer.renders;
        
        if (steps.count < racer.frames){
          
          if (steps.count == 0){
          
            steps.path = 'M' + racer.coord.x + ',' + racer.coord.y + 
                                    'L' + steps.goal.x + ',' + steps.goal.y;
          
            steps.bit = Raphael.getTotalLength(steps.path) / racer.frames;
            
            steps.begin_path = 'L' + racer.coord.x + ',' + racer.coord.y; 
                                                
            rnds.status = true;
                                                
            steps.count++;
          } 
          
          xy = Raphael.getPointAtLength(steps.path, 
                                steps.count * steps.bit);
          
          if (racer.type == 'user'){
            rnds.viewBox.x = xy.x;
            rnds.viewBox.y = xy.y;
            rnds.viewBox.count = steps.count;
          } 
                         
          rnds.racer = xy;
          
          racer.coord.x = xy.x;
          racer.coord.y = xy.y;
          
          ij = this.get_ij_from_xy(xy.x, xy.y);
          
          racer.coord.i = ij.i;
          racer.coord.j = ij.j;
          
          if (steps.count % 3 == 0){
            if (steps.count > 3){
              xy_fire = Raphael.getPointAtLength(steps.path, steps.bit * (steps.count - 5));
            } else {
              xy_fire = Raphael.getPointAtLength(steps.path, steps.count * steps.bit);
            }
          } else {
              if (steps.count > 0){
                xy_fire = Raphael.getPointAtLength(steps.path, steps.bit * (steps.count - 1));
              }
          }
          
          rnds.fire = 'M' + xy.x + ',' + xy.y + 'L' + xy_fire.x + ',' + xy_fire.y;
          
          steps.count++;
        } else {
        // end move for racer
          steps.count = 0;
          rnds.status = false;
          
          racer.coord.i = steps.goal.i;
          racer.coord.j = steps.goal.j;
          racer.coord.x = steps.goal.x;
          racer.coord.y = steps.goal.y;
                                  
          racer.set_point(steps.goal.i, steps.goal.j);
        }          
      },

      //draw freme for move racer
      renders_for_racer_rival: function(){
              
        var i, len;
        var fires = ''; 
        
        var rnds_r = this.racer.renders; 
        var rnds_riv;
        
        var draw_fires = false;
        
        if (rnds_r.status){
      
          draw_fires = true;
      
          fires += rnds_r.fire;
          
          if (rnds_r.renders_all_path) {
            draw_paths = true;
          }
          
          this.racer.set_racer(rnds_r.racer.x, rnds_r.racer.y, this.racer.current_speed_root.r);
                    
          this.racer.set_viewBox(rnds_r.viewBox.x, rnds_r.viewBox.y, rnds_r.viewBox.count);
        }
        
        len = this.rival.length;
      
        for (i = 0; i < len; i++){
          
          rnds_riv = this.rival[i].renders;
          
          if (rnds_riv.status){
            
            if (!draw_fires){
              draw_fires = true;
            }
            
            fires += rnds_riv.fire;
            
            if(rnds_riv.renders_all_path){
            
              if (!draw_paths){
                draw_paths = true;
              }
            
            }
            
            this.rival[i].set_racer(rnds_riv.racer.x, rnds_riv.racer.y, this.rival[i].root);
            
          }
        }
        
        if (draw_fires){                
          this.fires_racers.attr('path', fires);
        }
        
      },

      steps_for_rival: (function(){                      
        // calcuts the go
        
        var rival;
        var choise;
        
        var set_goal = function(goal, the, ij){
          var xy;
          
          goal.i = ij.i;
          goal.j = ij.j;
          
          xy = the.calcuts_x_y(ij.i, ij.j);
          
          goal.x = xy.x;
          goal.y = xy.y;            
        };
        
        var rend_for_rival = function(rival){ 
                    
          var fly_length = rival.fly.length;
                                                        
          if (fly_length > rival.steps.num + 1){
            
            if ( rival.fly[rival.steps.num].wait > 0 && 
                    rival.fly[rival.steps.num].wait > rival.steps.wait){
              
              rival.steps.wait++;
              rival.renders.status = false;
            
            } else {
                                              
              if (rival.steps.count == 0){
                                  
                  rival.root = rival.fly[rival.steps.num].r;
                  
                  rival.speed = rival.fly[rival.steps.num + 1].s;
                                        
                  set_goal(rival.steps.goal, this, rival.fly[rival.steps.num + 1]);
                   
                  this.set_renders_racer_rival(rival);
                                  
              } else {
                this.set_renders_racer_rival(rival);
              }
              
              if (rival.steps.wait > 0 || rival.steps.count == 0){
                rival.steps.num++;
              }
              
              if (rival.steps.wait > 0){
                rival.steps.wait = 0;
              }
            }
  
          } else {

            if (rival.write_wins){
              rival.renders.status = false;
              rival.steps.cycle = false;
            } 

          }
          
          if (this.timer >= rival.time && !rival.write_wins){
                        
            rival.write_wins = true;
            this.finish_game(rival);
                              
          }
          
        };
        
        return function(){
              
          var i, len;
          
          len = this.rival.length;
        
          for (var i = 0; i < len; i++){
            if (this.rival[i].steps.cycle){
              rend_for_rival.call(this, this.rival[i]);
            }
          }
        };
      }()),
      
      check_up_down_for_racer: function(){
      
        var racer = this.racer;
        var current = this.racer.current_speed_root;
        
        if (this.racer_keypress.up){
          if (racer.speed < 100 && current.s >= racer.speed){
            if (racer.speed < 5){
              racer.speed++;
            } else {
              racer.speed += 3;
            }
          }          
        }
        
        if (this.racer_keypress.down){
          if (racer.speed > 0 && current.s <= racer.speed){
            if (racer.speed > 10){
              racer.speed -= 10;
            } else {
              racer.speed = 0;
            }
          }
        }
        
        this.racer_keypress.del();
              
      },
      
      check_right_left_for_racer: function(){
            
        var racer = this.racer;
        var current = this.racer.current_speed_root;
        
        if (this.racer_keypress.right){
          if (current.r == 7 && racer.root == 7){
            racer.root = 0;
          } else if (current.r < 7 && current.r >= racer.root){
            racer.root++;
          }
        }
          
        if (this.racer_keypress.left){
          if (current.r == 0 && racer.root == 0){
            racer.root = 7;
          } else if (current.r > 0 && current.r <= racer.root){
            racer.root--;
          }
        }
        
      },
    };
    
    popup_finish.set_clicks();
    menu.set_clicks();

    road_params.get_size();
    
    CreateRacer.prototype = proto_racers;    

    document.body.style.backgroundColor = road_params.body;    
    
    create_field();
    
    this._gm_ = game;
    
    app._call_game_ = function(){
      
      road = roads[settings.road];
      
      road_params.radius = road.radius;
      road_params.attr_road.fill = road.fill;
      
      road_params.get_size();
      
      game.field.border.remove();
      game.field.road.remove();
      game.field.boxes.remove();
      game.field.finish.el.remove();
      
      create_field();
            
      game.restart();
    };
    
    this.step = function(){

      var gm = this._gm_;
      var text, i, wins_user, wins_length;
      
      switch(gm.status){
        case 'begin':
          gm.steps_start();
        break;
        case 'main':

          if (!gm.menu.show){
          
            gm.timer++;
            
            gm.steps_for_racer();
            
            if (gm.params.renders_rivals){
              gm.steps_for_rival();
            }
            
            if (crash.anim){
              gm.hit.steps();
            }
            
          }

        break;
        case 'end':
        
          if (!gm.up_finish.show){            
            
            gm.up_finish.set_text_wait('');
            gm.up_finish.to_show();
            
            text = '';
            
            for(i = 0; i < gm.wins.length; i++){
              text += (i + 1) + '.  ' + gm.wins[i].name + ', время ' + gm.wins[i].human_time + '<br/>'; 
            }
            
            gm.up_finish.set_text(text);
            
            wins_user = false;
            
            if (gm.wins.length > 4){
              wins_length = 4;
            } else {
              wins_length = gm.wins.length; 
            } 
                        
            for(i = 0; i < wins_length; i++){
              if (gm.wins[i].type == 'user'){
                wins_user = true;
                break;
              }
            }
            
            if (wins_user){
              gm.up_finish.set_bottons(false);
              gm.up_finish.set_text_wait('Пожалуйста подождите, ваш результат отправляется...');
              gm.send_fly();
            } else {
              gm.up_finish.set_bottons(true);
            }            
          }       
        break;
      }
    };
    
    this.render = function(){
      
      var gm = this._gm_; 
      
      switch(gm.status){
        case 'begin':

            gm.up.computation_start(100 * gm.up.steps.count / gm.up.steps.frames);

        break;
        case 'main':
          if (!gm.menu.show){
          
            gm.renders_for_racer_rival();
                        
            if(gm.hit.anim){
              gm.hit.renders();
            }

          }
        break;
      }          
    };
    
    this.keydown = function(data){
        
      var gm = this._gm_;
      
      switch (gm.status){
        case 'begin':
          gm.up.steps.go = true;
        break;
        case 'main':
          if (data.key == 'escape'){
            if (gm.menu.show){
              gm.menu.to_hide()
            } else {
              gm.menu.to_show();
            }
          }
          
          gm.racer_keypress.set_key(data.key);
          
          if (data.key == 'right' || data.key == 'left'){
            gm.check_right_left_for_racer();
          }
          
        break;
        case 'end':
          //gm.restart();
        break;
      }
    };
    
    this.keyup = function(data){
      
      var gm = this._gm_;
      
      switch(gm.status){
        case 'begin':
        break;
        case 'main':
          gm.racer_keypress.clear(data.key);
        break;
        case 'end':
        break;
      }
    }
  
    game.start_game();
  },
};
