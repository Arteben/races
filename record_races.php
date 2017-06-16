<?php
  
  $path = 'data/races.json';
  
  $raw_sting = $HTTP_RAW_POST_DATA;
  
  $racer_take = json_decode($raw_sting, true);
  
  if (count($racer_take) <  10){
    echo 'error 1, неверный формат данных!';
    die();
  }
          
  if (isset($racer_take[count($racer_take) - 1]['time']) && 
              isset($racer_take[count($racer_take) - 1]['road'])){
    
    $time_racer = (int) $racer_take[count($racer_take) - 1]['time'];
    $road_racer = (int) $racer_take[count($racer_take) - 1]['road'];
  
  } else {
  
    echo 'error 2, неверный формат данных';
    die();
  
  }
  
  $file = file_get_contents($path);
  $races_file = json_decode($file, true);

  unset($file);

  if (count($races_file) == 0){
    record_racer($races_file, $racer_take, $path);
    die();
  }
  
  $races_for_road = array();
  $racer_from_file = array();
  
  $check_time = 0;
  
  foreach($races_file as $key => $racer_from_file){
    
    if ((int) $racer_from_file['road'] == $road_racer){
            
      $races_for_road []= $key;
      
      if ((int) $racer_from_file['time'] > $time_racer){
        $check_time++;
      }
      
      if (count($races_for_road) > 3){
        break;
      }
    }
  }
  
  if (count($races_for_road) > 3){
    
    if ($time_racer > 0 && $check_time > 0){
          
      foreach($races_for_road as $key){
        
        $max = $key;
        
        if ((int) $races_file[$key]['time'] > $races_file[$max]['time']){
          $max = $key;
        } 
      }
      
      if ( isset($max)){
        unset ($races_file[$max]);
      }
      
      record_racer($races_file, $racer_take, $path);        
    
    } else {
      echo 'errr 3! неверный формат данных!';
      die();
    }

  } else {

    record_racer($races_file, $racer_take, $path);        

  }

function record_racer($json, $racer, $p){
    
    $array_racer = array();
    
    $data_racer = array();
    
    $data_racer = $racer[count($racer) - 1];
     
    $array_racer['array'] = array();
    
    $fly = array();
    
    foreach($racer as $key => $fly){
      
      $array_racer['array'][$key]['s'] = (int) $fly['s'];
      
      $array_racer['array'][$key]['wait'] = (int) $fly['wait'];
      
      if (isset($fly['r'])){
      
        $array_racer['array'][$key]['r'] = (int)  $fly['r'];
      
      }
      
      if (isset($fly['i'])){
  
        $array_racer['array'][$key]['i'] = (int)  $fly['i'];  
      
      }
      
      if (isset($fly['j'])){
      
        $array_racer['array'][$key]['j'] = (int)  $fly['j'];
              
      }
    }
    
    //echo 'what is it? '.data_racer[0];
    
    $array_racer['color'] = substr(htmlspecialchars($data_racer['color'], ENT_QUOTES, 'UTF-8'), 0, 3);
        
    $array_racer ['name'] =  substr(htmlspecialchars($data_racer['name'], ENT_QUOTES, 'UTF-8'), 0, 30);
    
    $array_racer ['human_time'] =  substr(htmlspecialchars($data_racer['human_time'], ENT_QUOTES, 'UTF-8'), 0, 5);

    $array_racer ['road'] = (int) $data_racer['road'];
    
    $array_racer ['time'] = (int) $data_racer['time'];
    
    $array_racer ['i'] = (int) $data_racer['start_i'];
    
    $array_racer ['j'] = (int) $data_racer['start_j'];
    
    $array_racer ['millis'] = (int) $data_racer['millis'];

    $json []= $array_racer;
    
    if (count($json) > 0){
    
      if (file_put_contents($p, json_encode($json))){
        echo 'Результат сохранен!';
        die();
      } else {
        echo 'error 4, Ошибка записи!';
        die();
      }
      
    } else {
      echo 'erro 5, нет массива';
      die(); 
    }
  }
?>
