var menu = {
    create: function(){
                
        var the = this;        
                
        var set_race;
        
        var app = this.app; 
        var sizes = this.app._sizes_;
        var svg = this.app._svg_;
                
        var races = {
            count: 0,
            array: [],
        };
        
        var reces_for_menu;
        
        app._races_ = races;
                            
        var menu = document.getElementById('table_menu');
        var input_name = document.getElementById('input_name');
                
        var settings = {
            name: '',
            color: '',
            road: 0,
        };
                
        var cookie;
                        
        if (document.cookie !== ''){
            cookie = document.cookie.split('+');
        }
        
        if (cookie === undefined){
            set_race = Math.floor(Math.random() * 3);
        } else {
            set_race = +cookie[0];
        }
        
        if (cookie !== undefined){
                        
            if (cookie[1]){
                input_name.value = cookie[1];                                
            }
        }
                
        app._call_menu_ = function(maps){
    
            var collection;
            var i;
            var tables
            var div;
            
            if (maps){
            
                collection = document.getElementById('td_maps_collection');
                div = collection.getElementsByTagName('div')[0];
                tables = collection.getElementsByClassName('table_maps');
                
                for (i = tables.length - 1; i >= 0; i--){
                    div.removeChild(tables[i]);
                }
                                
                get_races_for_menu();
                
                get_maps();
            }
        
            menu.style.display = 'block';
            menu.style.left = (sizes.w - menu.clientWidth) / 2;
            menu.style.top = (sizes.h - menu.clientHeight) / 2;
            app.setState(ENGINE.menu);
        };
        
        app._get_races_ = get_races;

        set_choise_races(set_race); 

        //get_races();
        
        get_races_for_menu();
        
        get_maps();
        
        ready_menu();
        
        function get_races_for_menu(){        
            
            var arr = [];
            var i;
            var rand = (new Date()).getTime();
            
            races_for_menu = [];
            
            xhr = new XMLHttpRequest(); 
                    
            try {
              xhr.open("GET", 'get_races_for_menu.php?nocache=' + rand, false);                            
              
              xhr.send(null);
                            
              if (xhr.responseText == ''){
                races.count = 0;
              } else {
                
                arr = JSON.parse(xhr.responseText)
              }
            } catch (e) {
              console.log('settings error in get_racer_for_menu!', xhr.readyState);
            }
                
            for (i in arr){
                races_for_menu.push(arr[i]);
            }
        }
        
        function get_races(){
            
            var arr = [];
            var i;
                        
            xhr = new XMLHttpRequest(); 
                    
            try {
              xhr.open("GET", 'get_races_for_road.php?numroad='+ settings.road, false);                            
              xhr.send(null);
              
              races.array = [];
              
              if (xhr.responseText == ''){
                races.count = 0;
              } else {
                
                arr = JSON.parse(xhr.responseText)
              }
            } catch (e) {
              console.log('settings error!', xhr.readyState);
            }
                
            for (i in arr){
                races.array.push(arr[i]);
            }
            
            races.count = races.array.length;            
        }
                
        function ready_menu(){

            set_clicks();
        
            menu.style.display = 'block';
            menu.style.left = (sizes.w - menu.clientWidth) / 2;
            menu.style.top = (sizes.h - menu.clientHeight) / 2;
        }
        
        function set_clicks(){
            var i;
            var imgs = menu.getElementsByClassName('img_racer');
            var maps = menu.getElementsByClassName('table_maps');
            var botton_sound = document.getElementById('button_sounds');
            var botton_start = document.getElementById('button_start');
            
            for (i = 0; i < imgs.length; i++){
                imgs[i].onclick = (function(){
                    
                    var num = i;
                    
                    return function(){
                        set_choise_races(num);
                    };
                }())
            }
                        
            botton_sound.onclick = function(){
            
                if (settings.sounds){
                    settings.sounds = false;
                    app.sound.setMaster(0);
                    botton_sound.value = 'Звук вкл!';
                } else {
                    settings.sounds = true;
                    app.sound.setMaster(1);
                    botton_sound.value = 'Звук выкл.';
                }           
            };
            
            botton_start.onclick = function (){
                start_game();
            };
            
        }
        
        function start_game(){

            var input = document.getElementById('input_name');
            
            if (input.value != ''){
                settings.name = input.value;
            }
        
            document.cookie = '' + set_race + '+' + settings.name;
                        
            the.app._settings_ = settings;
            menu.style.display = 'none';
            
            get_races();
            
            if (the.app._call_game_){
                the.app._call_game_();
            }
            
            the.app.setState(ENGINE.main);
        }
        
        function set_choise_maps(num){
            var i;
            var maps = menu.getElementsByClassName('table_maps');
            
            for (i = 0; i < maps.length; i++){
                maps[i].className = 'table_maps';
                
                if (i == num){
                    maps[i].className += ' table_maps_choise';
                    settings.road = i;
                }
            }
        }
        
        function get_human_time(time){
            var sec;
            var min;
                        
            sec = time / 1000;
            min = Math.floor(sec / 60);
            sec = Math.floor(sec - min * 60);
            
            return '' + min + ':' + sec;
            
        }
        
        function get_maps(){
            
            var i, j, count;
            var one_map;
            var tr_1_in_dom;
            var tr_1;
            
            var collection = document.getElementById('td_maps_collection');
            var div = collection.getElementsByTagName('div')[0];
            
            var one_map_in_dom = document.getElementsByClassName('table_maps')[0];
            var tr_1_in_dom = one_map_in_dom.getElementsByTagName('tr')[0];
            
            var name;
            var show_races;
            
            for(i = 0; i < roads.length; i++){
                                
                one_map = one_map_in_dom.cloneNode();
                
                if (i == settings.road){
                    one_map.className = 'table_maps table_maps_choise';
                }
                
                for(count = 0; count < one_map_in_dom.getElementsByTagName('tr').length; count++){
                    one_map.appendChild(one_map_in_dom.getElementsByTagName('tr')[count].cloneNode());
                }
                            
                tr_1 = one_map.getElementsByTagName('tr')[0];
                
                for(count = 0; count < tr_1_in_dom.getElementsByTagName('td').length; count++){
                    tr_1.appendChild(tr_1_in_dom.getElementsByTagName('td')[count].cloneNode());
                }
                                
                name = roads[i].name;
                
                show_races = [];
                                
                for (j = 0; j < races_for_menu.length; j++){
                    
                    if (races_for_menu[j].road == i){
                        show_races.push({
                            human_time: races_for_menu[j].human_time,
                            name: races_for_menu[j].name,
                        });                        
                    }
                }
                                                                                                     
                tr_1.getElementsByTagName('td')[0].innerHTML += name;
                                
                if (show_races.length > 0){
                    tr_1.getElementsByTagName('td')[1].innerHTML += show_races[0].name + ' ' + show_races[0].human_time;
                }
                
                one_map.style.display = 'block';
                
                one_map.onclick = (function(){
   
                    var num = i;
                    
                    return function(){
                        set_choise_maps(num);    
                    };
                
                }());
                                
                div.appendChild(one_map);
            }
        }
        
        function set_choise_races(color){
            var i,j;
            var img_races = menu.getElementsByClassName('img_racer');
            var name;
            var value;
            var names = [
                'Синий гонщик',
                'Красный гонщик',
                'Зеленый гонщик',
                'Бирюзовый гонщик',
                'Желтый гонщик',
                'Черный гонщик',
                '',
            ];
            
            for(i = 0; i < img_races.length; i++){
                img_races[i].className = 'img_racer';
            }
            
            switch(color){
                case 0:
                    settings.color = '77D';
                    img_races[0].className += ' img_racer_choise'; 
                    name = names[0];
                    set_race = 0;
                break;
                case 1:
                    settings.color = 'D55';
                    img_races[1].className += ' img_racer_choise'; 
                    name = names[1];
                    set_race = 1;
                break;
                case 2:
                    settings.color = '6D6';
                    img_races[2].className += ' img_racer_choise'; 
                    name = names[2];
                    set_race = 2;
                break;
                case 3:
                    settings.color = '6DD';
                    img_races[3].className += ' img_racer_choise'; 
                    name = names[3];
                    set_race = 3;
                break;
                case 4:
                    settings.color = 'FF6';
                    img_races[4].className += ' img_racer_choise'; 
                    name = names[4];
                    set_race = 4;
                break;
                case 5:
                    settings.color = '000';
                    img_races[5].className += ' img_racer_choise'; 
                    name = names[5];
                    set_race = 5;
                break;
            }
            
            value = input_name.value;
            
            for (i = 0; i < names.length; i++){

                if (value == names[i]){
                
                    input_name.value = name;
                    break;
                
                }
                
            }
        }
     },
     
     ready: function(){
     
        console.log('ready!');
        
     },
};
