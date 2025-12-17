<?php
session_start();
function get_info_connexion($matricule) {
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://test.uahb.sn/api_authentification',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => http_build_query(array('option' => '2', 'matricule' => $matricule)), // Utilise http_build_query pour formater correctement les champs POST
  CURLOPT_HTTPHEADER => array(
    'Cookie: PHPSESSID=8cb0e85bed40346dc1e2e59ba2972678'
  ),
));

$response = curl_exec($curl);

if (curl_errno($curl)) {
    echo json_encode(['error' => curl_error($curl)]);
} else {
    echo $response;
}

curl_close($curl);
}

function get_personnel() {
  $curl = curl_init();
  
  curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://test.uahb.sn/api_authentification',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => http_build_query(array('option' => '3')), // Utilise http_build_query pour formater correctement les champs POST
    CURLOPT_HTTPHEADER => array(
      'Cookie: PHPSESSID=8cb0e85bed40346dc1e2e59ba2972678'
    ),
  ));
  
  $response = curl_exec($curl);
  
  if (curl_errno($curl)) {
      echo json_encode(['error' => curl_error($curl)]);
  } else {
      echo $response;
  }
  
  curl_close($curl);
  }
if($_GET['action'] == 'get_user'){
  $matricule = $_GET['matricule'];
  get_info_connexion($matricule);
}elseif ($_POST['action'] == 'current_user'){
  get_info_connexion($_SESSION['matricule']);
}elseif($_GET['action'] == 'liste_personnel'){
  get_personnel();
}
