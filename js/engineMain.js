var main = {
    // create game board
    create: function(){

    var app = this.app;
    var paper = app._svg_;
    var sizes = app._sizes_;
    
    var settings = app._settings_;
    
    var road = roads[settings.road];
    
    var road_params = { 
      cell: 10,
      radius: road.radius,
      indent_finish: 10,
      size: 0,
      body: '#222',
      attr_road: {'stroke': '#000', 'stroke-width': 10, 'fill': road.fill},
      attr_border: {'stroke': '#444', 'stroke-width': 100, 'stroke-linejoin': 'round'},
      attr_finish: {'stroke': '#DD3', 'stroke-width': 15, 'stroke-linecap': 'round'},
      attr_boxes: {'stroke': '#000', 'stroke-width': 10, 'stroke-linejoin': 'round', 'fill': '#444'},
      get_size: function(){
        this.size = this.cell * this.radius;
      },
      free_view: false,
      renders_rivals: true,
    };   
    
    var speed = 50;
        
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
    var road_array = (function(lines, prms, finish, boxes){
                                
      var i, j, num;
      var check_rect;
      var m, n;
      
      var array = [];

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
      
      return array;
      
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
                          
    }(rects, road_params, road.finish, road.boxes));
            
    // draw road for road array        
    var field = (function(lines, array, p, svg){
      
      var i, j;
      var cell = p.cell;
      var point_up, point_down;
      var finish;
      var return_field;
      var scale = 20;
      
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
                
      return_field = {            
        border: svg.path(path).attr(p.attr_border),            
        road: svg.path(path).attr(p.attr_road),
        boxes: svg.path(boxes).attr(p.attr_boxes),
        finish: {
          el: svg.path(finish).attr(p.attr_finish),
          point_up: point_up,
          point_down: point_down,
        },
      };
              
      return return_field;
      
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
      
    }(rects, road_array, road_params, paper));
    
    var proto_racers = {
      
      cell: road_params.cell,
                
      frames: 1000 / speed, 
        
      // remove racer from road 
      del: function(){
        this.point.remove();
        this.path.el.remove();
        this.path_anim.glow.remove();
        this.path_anim.fire.remove();
      },
      // create elements for racer
      create: function(){
                    
        var fire = {
          'stroke': '#FF5',
          'stroke-width': this.cell * 1.2,
          'stroke-linecap': 'round',
          'opacity': 0.7,  
        };
        
        
        var glow = {
          'stroke': this.fill,
          'stroke-width': this.cell * 0.8,
          'stroke-linecap': 'butt',
          'stroke-linejoin': 'round',
          'opacity': 0.1,  
        };
        
        var s = this.cell;
        
        this.path.el = paper.path(this.path.str).attr(glow);
              
        this.path_anim = {
          glow: paper.path("").attr(glow),
          fire: paper.path("").attr(fire), 
        };

        this.point = paper.path('').attr({'fill': this.fill, 
                  'stroke-width': this.cell * 0.1, 'stroke': this.border});
      },         
      
      set_path: function(type, path, fire){
        if (type == 'full'){
            this.path.str += path;
            this.path.el.attr('path', this.path.str);            
        } else {
            this.path_anim.glow.attr('path', path);
            this.path_anim.fire.attr('path', fire);            
        }
      },

      set_racer: (function(){
        
        var path;
        
        var calc = function(xy, num, add){
            switch(num){
              case '05':
                if (add){
                  return xy + 1.4 * road_params.cell;
                } else {
                  return xy - (1.4 * road_params.cell);
                }
              break;
              case '025':
                if (add) {
                  return xy + 0.5 * road_params.cell;
                } else {
                  return xy -(0.5 * road_params.cell);
                }
            }
        };
        
        var indent_x = 0.3;
        var indent_y = 0.3;
        
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
          
          if (this.speed < 5){
                      
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
        }
      },

      set: (function(){
        
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
                                                          
          this.set_path('anim', '', '');
          this.set_path('full', 'L' + xy.x + ',' + xy.y);
                        
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
            set: false,
            x: 0,
            y: 0,
            count: 0,
          },
          path: '',
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
        
        this.flay = [{s: 0, wait: 0}];
                
        this.type = 'user';

        this.current_speed_root = {
          s: this.speed,
          r: this.root,
        };
        
        this.set_viewBox = (function(){
      
          var w, h, x, y;
          var older_level = 0;
          var type_calcuts = 'qul';
          var scale;
          var add_scale = 0.5;
          var frames = proto_racers.frames;
          var svg = paper;
          var s = sizes;
          var level;
          var multy = 0.2;
          var no_view = road_params.free_view;
          
          return function (x_racer,  y_racer, count){        
            
            if (no_view){
              return;
            }
            
            if (this.current_speed_root.s == 0){
              older_level = 0;
            }
                                          
            level = Math.floor(this.current_speed_root.s / 3);
      
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
            x = x_racer - w / 2;              
            y = y_racer - h / 2;
            
            svg.setViewBox(x, y, w, h);                              
          };
        }());
        
      } else {
       
        this.border = "#000";
       
        this.renders = {
          status: false,
          racer: {
            x: 0,
            y: 0,
          },
          path: '',
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

        this.flay = params.array;
        this.time = params.time;
        
        this.type = 'rival'; 
      }        
      
      this.coord = {
        i: 0,
        j: 0,
        x: 0,
        y: 0,
      };
      
      xy = this.calcuts_x_y(this.start.i, this.start.j);
      
      this.path = {
          str: 'M' + xy.x + ',' + xy.y,
          el: null,
      };
      
      this.point = null;
      this.path_anim = null;
        
      this.create();
      this.set(this.start.i, this.start.j);
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
            
          } else {
            this.set_visibility(0);
          }
          
           this.set_left_top();              
      },
      
      rend_finish: true,
      
      show_finish: function(res, wins){
        this.set_visibility(100);
        this.set_text('Победитель ' + wins  + ' c результатом ' + res + "<br/> для рестарта игры нажмите любую кнопку!");
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
          settings.call_menu();
        },
        
        bottons[1].onclick = function(){
          popup_finish.to_hide();
          game.restart();
        };
      },
      
      set_text: function(text){

        span = this.el.getElementsByTagName('div');
        
        span[0].innerHTML = text;
      },      
    };
    
    var steps_popup = {
      count: 0,
      frames: 0,
      go: false,
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
          settings.call_menu()
        };
        
        bottons[2].onclick = function(){
          menu.to_hide();
        };
      },
      
      
      to_show: function(){
        this.show = true;
        this.set_sizes();
        this.time = (new Date()).getTime();
      },
      
      to_hide: function(){
        this.sum_time += (new Date()).getTime() - this.time;
        this.time = 0;  
        this.show = false;
        this.el.style.display = 'none';
      },
    };
        
    // controls the game
    var game = {
      menu: menu,
      params: road_params,
      sizes: sizes,
      svg: paper,
      array: road_array,
      field: field,
      racer: null,
      time_start: 0,
      racer_keypress: {
        right: false,
        left: false,
        up: false,
        down: false,
        
        del_up: false,
        del_down: false,

        clear_all: function(){
        
          this.right = false;
          this.del_right = false;
          this.left = false;
          this.del_left = false;
          this.up = false;
          this.del_up = false;
          this.down = false;
          this.del_down = false;
        },
        set: function(key){
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
      wins: null,
      up: popup,
      up_finish: popup_finish,
      frames: 1000 / speed,
      // begin, main, end
      status: '',
      timer: 0,
      
      get_human_time: function(time){
            
            var sec;
            var min;
                        
            sec = time / 1000;
            min = Math.floor(sec / 60);
            sec = Math.floor(sec - min * 60);
            
            return '' + min + ':' + sec;
      },
      
      restart: function(){

        this.up.rend_finish = true;
        this.timer = 0;
        this.racer_keypress.clear_all();  
        this.time_start = 0;
        this.wins = null;
        
        this.menu.show = false;
        this.menu.sum_time = 0;
        this.menu.time = 0;

        log_trace.call(this);
        
        this.racer.del();
        
        this.rival.forEach(function(rival){
          rival.del();
        });
        
        this.rival = [];
        this.racer = null;
        
        this.start_game();
        
        function log_trace(){
          console.log('[');
          for (var i in this.racer.flay){
            console.log(' {');
            for (var prop in this.racer.flay[i]){
              console.log("  '" + prop + "'" + ': ' + this.racer.flay[i][prop] + ',');
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
        
        for (count = 0; count < races.length; count++){ 
          if (races[count].road === settings.road){
            this.rival.push(new CreateRacer(false, races[count]));
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
      
      check_finish_racer: function(){
                      
        if (this.racer.current_speed_root.r > 0 && this.racer.current_speed_root.r < 4){
                        
          if (this.array[this.racer.coord.i][this.racer.coord.j] == 2){
            this.racer.renders.status = false;
            this.racer.steps.cycle.status = false;
            
            if (this.wins === null){            
              this.wins = {
                type: this.racer.type,
                name: this.racer.name,
                fly: this.racer.fly,
                human_time: this.get_human_time((new Date()).getTime() - this.time_start - this.menu.sum_time), 
              };
            }
            
            this.status = 'end';            
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
        racer.steps.cycle = true;
        
        // move racer in i, j
        function set_goal(goal_i, goal_j){
          
          var xy = the.calcuts_x_y(goal_i, goal_j);
          racer.steps.goal.i = goal_i;
          racer.steps.goal.j = goal_j;
          racer.steps.goal.x = xy.x;
          racer.steps.goal.y = xy.y;
        }
        // breack racer in i, j
        function boomb(racer_i, racer_j){

          //racer.steps.cycle = true;              
          //racer.root = (function(road, i, j){
            //if (road[i][j - 1] !== 0){
              //return 4;
            //} else if (road[i + 1] && road[i + 1][j] !== 0){
              //return 6;
            //} else if (road[i][j + 1] !== 0){
              //return 0;
            //} else if (road[i - 1] && road[i - 1][j] !== 0){
              //return 2;
            //} else {
              //return 2;
            //}
          //}(the.array, racer_i, racer_j));                
          
          racer.speed = 0;
          
          var xy = the.calcuts_x_y(racer_i, racer_j);
          racer.steps.cycle = true;
          racer.steps.goal.i = racer_i;
          racer.steps.goal.j = racer_j;
          racer.steps.goal.x = xy.x;
          racer.steps.goal.y = xy.y;
          
          //racer.set(racer_i, racer_j);
        }            
      },

      // calcuts x, y for next frame rendering racer  
      steps_for_racer: function(){
                                  
        if (this.racer.steps.cycle){
          this.set_renders_racer_rival(this.racer);
        }
        
        // start calcuts params for render if it is needs
        if (this.racer.steps.count == 0){
          
          this.key_check_for_racer();
          
          if(this.racer.speed > 0){
            this.racer_go(this.racer);
          } else {
            if (this.racer.steps.cycle){
              this.racer.steps.cycle = false;
            }
          }
        }            
        
        this.check_finish_racer();

        if (this.status == 'end'){
          this.racer.flay.push({
            s: this.racer.current_speed_root.s,
            r: this.racer.current_speed_root.r,
            i: this.racer.steps.goal.i,
            j: this.racer.steps.goal.j,
            time: this.timer, 
            frames: this.frames,
            start_i: this.racer.start.i,
            start_j: this.racer.start.j,
            millisecouns: this.wins.human_time,
          });              
        } else {
          if (this.racer.steps.count == 0){
            if (this.racer.speed > 0){
              this.racer.flay.push({
                s: this.racer.speed,
                r: this.racer.root,
                i: this.racer.coord.i,
                j: this.racer.coord.j,
              });
            } else {
              if (this.racer.flay[this.racer.flay.length - 1].s === 0){
                this.racer.flay[this.racer.flay.length - 1].wait++;
              } else {
                this.racer.flay.push({s: 0, wait: 0, i: this.racer.coord.i, j: this.racer.coord.j});
              }
            }
          }
        }
      },

      set_renders_racer_rival: function(racer){
        
        var xy;
        var ij;
        var xy_fire;
        
        if (racer.steps.count < racer.frames){
          if (racer.steps.count == 0){
            racer.steps.path = 'M' + racer.coord.x + ',' + racer.coord.y + 
                                    'L' + racer.steps.goal.x + ',' + racer.steps.goal.y;
            racer.steps.bit = Raphael.getTotalLength(racer.steps.path) / racer.frames;
            
            racer.steps.begin_path = 'L' + racer.coord.x + ',' + racer.coord.y; 
                                                
            racer.renders.status = true;
            racer.renders.path = '';
            racer.steps.count++;
          }

          xy = Raphael.getPointAtLength(racer.steps.path, 
                                racer.steps.count * racer.steps.bit);
          
          if (racer.type == 'user'){
            racer.renders.viewBox.x = xy.x;
            racer.renders.viewBox.y = xy.y;
            racer.renders.viewBox.count = racer.steps.count;
          } 
                         
          racer.renders.racer = xy;
          
          racer.coord.x = xy.x;
          racer.coord.y = xy.y;
          
          ij = this.get_ij_from_xy(xy.x, xy.y);
          
          racer.coord.i = ij.i;
          racer.coord.j = ij.j;
          
          
          if (racer.steps.count % 3 == 0){
            if (racer.steps.count > 5){
              xy_fire = Raphael.getPointAtLength(racer.steps.path, 5 * racer.steps.bit);
            } else {
              xy_fire = Raphael.getPointAtLength(racer.steps.path, racer.steps.count * racer.steps.bit);
            }
            
            racer.renders.fire = 'M' + xy.x + ',' + xy.y + 'L' + xy_fire.x + ',' + xy_fire.y;
          } else {
            racer.renders.fire = '';  
          }
          
          racer.renders.path = 'M' + xy.x + ',' + xy.y + racer.steps.begin_path;
          
          racer.steps.count++;
        } else {
        // end move for racer
          racer.steps.count = 0;
          racer.renders.status = false;
          
          racer.coord.i = racer.steps.goal.i;
          racer.coord.j = racer.steps.goal.j;
          racer.coord.x = racer.steps.goal.x;
          racer.coord.y = racer.steps.goal.y;
                        
          racer.set(racer.steps.goal.i, racer.steps.goal.j);
        }          
      },

      //draw freme for move racer
      renders_for_racer: function(){
      
        var rnds = this.racer.renders;
                    
        this.racer.set_racer(rnds.racer.x, rnds.racer.y, this.racer.current_speed_root.r);
                      
        this.racer.set_viewBox(rnds.viewBox.x, rnds.viewBox.y, rnds.viewBox.count);
                               
        this.racer.set_path('anim', rnds.path, rnds.fire);                       
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
                                              
          if (rival.flay.length > rival.steps.num + 1){
            
            if (rival.flay[rival.steps.num].s === 0 && 
                    rival.flay[rival.steps.num].wait > rival.steps.wait){
              
              rival.steps.wait++;
              rival.renders.status = false;
            
            } else {
                                              
              if (rival.steps.count == 0){
                                  
                  rival.root = rival.flay[rival.steps.num].r;
                  
                  rival.speed = rival.flay[rival.steps.num + 1].s;
                                        
                  set_goal(rival.steps.goal, this, rival.flay[rival.steps.num + 1]);
                   
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
            if (this.timer >= rival.time){
              rival.renders.status = false;
              rival.steps.cycle = false;
              this.wins = {
                type: rival.type,
                name: rival.name,
                fly: null,
                human_time: this.get_human_time((new Date()).getTime() - this.time_start - this.menu.sum_time), 
              };
                    
              return;
            }

            this.set_renders_racer_rival(rival);
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

      renders_for_rival: function(rival){
                
        rival.set_racer(rival.renders.racer.x, rival.renders.racer.y, rival.root);                   
        rival.set_path('anim', rival.renders.path, rival.renders.fire); 
                              
      },

      key_check_for_racer: function(){
        
        if (this.racer_keypress.up){
          if (this.racer.speed < 50 && this.racer.current_speed_root.s >= this.racer.speed){
            this.racer.speed++;
          }
        }
        
        if (this.racer_keypress.down){
          if (this.racer.speed > 0 && this.racer.current_speed_root.s <= this.racer.speed){
            if (this.racer.speed > 3){
              this.racer.speed -= 3;
            } else {
              this.racer.speed = 0;
            }
          }
        }
        
        if (this.racer_keypress.right){
          if (this.racer.current_speed_root.r == 7 && this.racer.root == 7){
            this.racer.root = 0;
          } else if (this.racer.current_speed_root.r < 7 && this.racer.current_speed_root.r >= this.racer.root){
            this.racer.root++;
          }
        }
          
        if (this.racer_keypress.left){
          if (this.racer.current_speed_root.r == 0 && this.racer.root == 0){
            this.racer.root = 7;
          } else if (this.racer.current_speed_root.r > 0 && this.racer.current_speed_root.r <= this.racer.root){
            this.racer.root--;
          }
        }
        
        this.racer_keypress.del();

      },
    };
    
    popup_finish.set_clicks();
    menu.set_clicks();

    road_params.get_size();
    
    CreateRacer.prototype = proto_racers;    

    document.body.style.backgroundColor = road_params.body;    
    
    this._gm_ = game;
    app._gm_ = game;
    
    this.step = function(pps){

      var gm = this._gm_;

      switch(gm.status){
        case 'begin':
          gm.steps_start();
        break;
        case 'main':
          gm.timer++;
          if (!gm.menu.show){
            gm.steps_for_racer();
            
            if (gm.params.renders_rivals){
              gm.steps_for_rival();
            }
          
          }
        break;
        case 'end':
          //console.log('game_end!', this._gm_.timer);
        break;
      }
    };
    
    this.render = function(){
      
      var gm = this._gm_; 
      var i, len, time;
      
      switch(gm.status){
        case 'begin':
          gm.up.computation_start(100 * gm.up.steps.count / gm.up.steps.frames);
        break;
        case 'main':
          if (!gm.menu.show){
            if (gm.racer.renders.status){
              gm.renders_for_racer();
            }
            
            len = gm.rival.length;
            
            for(i = 0; i < len; i++){
              if (gm.rival[i].renders.status){
                gm.renders_for_rival(gm.rival[i]);
              }
            }
          }
        break;
        case 'end':
          if (!gm.up_finish.show){
            
            gm.up_finish.set_text('' + gm.wins.name + ' победил с временем ' +  gm.wins.human_time);
            
            gm.up_finish.to_show();
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
          
          gm.racer_keypress.set(data.key);

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
