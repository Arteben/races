<?php
/*
var races = [];
        //road: 0,
        //time: 3913,
        //name: 'Green!',
        //color: '#5D5',
        //i: 371,
        //j: 200,
        //array: [
 
*/
/*
's': 29,
  'r': 2,
  'i': 258,
  'j': 91,
  'time': 1087,
  'frames': 20,
  'start_i': 270,
  'start_j': 132,
  */
  // record racer fly in db
  
  $path = 'data/races.json';
  
  $raw_sting = $HTTP_RAW_POST_DATA;
    
  $file = file_get_contents($path);
    
  $racer_take = json_decode($raw_sting, true);
  
  if (count($racer_take) <  10){
    echo 'error 1, неверный формат данных!';
    die();
  }
          
  if (isset($racer_take[count($racer_take) - 1]['time']) && 
              isset($racer_take[count($racer_take) - 1]['road'])){
    
    $time_racer =  $racer_take[count($racer_take) - 1]['time'];
    $road_racer =  $racer_take[count($racer_take) - 1]['road'];
  
  } else {
  
    echo 'error 2, неверный формат данных';
    die();
  
  }
  
  $races_file = json_decode($file, true);

  if (count($races_file) == 0){
    record_racer($races_file, $racer_take, $path);
    die();
  }
  
  $races_for_road = array();
  $racer_from_file = array();
  
  $check_time = 0;
  
  foreach($races_file as $key => $racer_from_file){
    
    if ($racer_from_file['road'] == $road_racer){
            
      $races_for_road []= $key;
      
      if ($racer_from_file['time'] > $time_racer){
        $check_time++;
      }
      
      if (count($races_for_road) > 1){
        break;
      }
    }
  }
  
  if ($time_racer > 0 && $check_time > 0){
    
    if (count($races_for_road) > 1){
      if ($races_file[$races_for_road[0]]['time'] < $races_file[$races_for_road[1]]['time']){
        unset($races_file[$races_for_road[1]]);
      } else {
        unset($races_file[$races_for_road[0]]);        
      }
    }
    
    record_racer($races_file, $racer_take, $path);        
  
  } else {
    echo 'errr 3! неверный формат данных!';
    die();
  }

function record_racer($json, $racer, $p){
    
    $array_racer = array();
    
    $data_racer = array();
    
    $data_racer = $racer[count($racer) - 1];
     
    $array_racer['array'] = array();
    
    $fly = array();
    
    foreach($racer as $fly){
      $array_racer['array'] []= array(  's' => (int) $fly['s'],
                                        'r' => (int) $fly['r'],
                                        'wait' => (int) $fly['wait'],
                                        'i' => (int) $fly['i'],
                                        'j' => (int) $fly['j']);
    }    
    
    //echo 'what is it? '.data_racer[0];
    
    $array_racer['color'] = htmlspecialchars(substr($data_racer['color'], 0, 3));
    $array_racer ['name'] = htmlspecialchars(substr($data_racer['name'], 0, 20));
    $array_racer ['human_time'] =  htmlspecialchars(substr($data_racer['human_time'], 0, 5));

    $array_racer ['road'] = (int) $data_racer['road'];
    $array_racer ['time'] = (int) $data_racer['time'];
    $array_racer ['i'] = (int) $data_racer['start_i'];
    $array_racer ['j'] = (int) $data_racer['start_j'];
    $array_racer ['millis'] = (int) $data_racer['millis'];

    $json []= $array_racer;
    
    if (file_put_contents($p, json_encode($json))){
      echo 'Результат сохранен!';
    }
  }
?>
