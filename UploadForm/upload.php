<?php
include 'config.php';
header('Access-Control-Allow-Origin: *');
$captcha = $_POST["captcha"];
$captchaHash = $_POST["captchaHash"];
if (hash("md5", $captcha) != $captchaHash){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", "Неверно введён код CAPTCHA")
    );
    $json = json_encode($results);
    echo $json;
    return;
}
$name = $_POST["name"];
if ($name == null || $name == ""){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "Имя" должно быть заполнено')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
if (strlen($name) > 50){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "Имя" должно быть не больше 50 символов')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
$email = $_POST["email"];
if ($email  == null || $email  == ""){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "E-mail" должно быть заполнено')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
if (strlen($email) > 50){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "E-mail" должно быть не больше 50 символов')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
$phone = $_POST["phone"];
if ($phone == null || $phone == ""){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "Телефон" должно быть заполнено')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
if (strlen($name) > 50){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "Телефон" должно быть не больше 50 символов')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
$comment = $_POST["comment"];
if ($comment == null || $comment == ""){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "Комментарий к заказу" должно быть заполнено')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
if (strlen($comment) > 1000){
    $results = array(
        'status' => "FAIL",
        'message' => iconv("windows-1251", "UTF-8", 'Поле "Имя" должно быть не больше 50 символов')
    );
    $json = json_encode($results);
    echo $json;
    return;
}
$sumFilesSize = 0;
$MAX_SIZE = 104857600;
foreach($_FILES as $file){
    if ($file["error"] == UPLOAD_ERR_OK) {
        $fileSize = $file["size"];
        if ($fileSize > $MAX_SIZE){
            $results = array(
                'status' => "FAIL",
                'message' => iconv("windows-1251", "UTF-8", 'Превышен максимальный объём файла')
            );
            $json = json_encode($results);
            echo $json;
            return;
        }
        $sumFilesSize += $fileSize;
        if ($sumFilesSize > $MAX_SIZE){
            $results = array(
                'status' => "FAIL",
                'message' => iconv("windows-1251", "UTF-8", 'Превышен максимальный суммарный объём файлов')
            );
            $json = json_encode($results);
            echo $json;
            return;
        }
    }   
    else{
        $results = array(
            'status' => "FAIL",
            'message' => iconv("windows-1251", "UTF-8", 'Ошибка загрузки файла')
        );
        $json = json_encode($results);
        echo $json;
        return;
    }
}
while (!($fp = fopen('counter', 'r+b')));  
$orderNumber = fread($fp,filesize('counter'));
if (!$orderNumber) 
    $orderNumber = 0;
$orderNumber++;
fseek($fp, 0);
$fp = fwrite($fp, $orderNumber);
fclose($fp);
$filesList = "";
if (count($_FILES) > 0){ 
    mkdir($folderPath);
    $zip = new ZipArchive();
    $zip->open($folderPath."/".$orderNumber.".zip", ZIPARCHIVE::CREATE);    
    foreach($_FILES as $file){       
        $tmpFileName = $file["tmp_name"];
        $fileName = $file["name"];       
        $zip->addFile($tmpFileName, $fileName);        
    }  
    $zip->close();
    $filesList = "http://vps-1028601.srv.pa.infobox.ru/".$folderPath."/".$orderNumber.".zip";
}
else
    $filesList = "Файлов нет";
$filesList = iconv("windows-1251", "UTF-8", $filesList);
$to = $sendEmail;
$subject = "Заказ № ".$orderNumber;
$message = iconv("windows-1251", "UTF-8", "Номер заказа: ").$orderNumber.iconv("windows-1251", "UTF-8", "\r\nИмя: ").$name.iconv("windows-1251", "UTF-8", "\r\nE-mail: ").$email.iconv("windows-1251", "UTF-8", "\r\nТелефон: ").$phone.iconv("windows-1251", "UTF-8", "\r\nКомментарий: ").$comment.iconv("windows-1251", "UTF-8", "\r\nФайлы: ").$filesList;
$headers = 'Content-type: text/plain; charset=utf-8' . "\r\n";
mail($to,$subject,$message, $headers);
$results = array(
        'status' => "OK",
        'orderNumber' => $orderNumber
    );
$json = json_encode($results);
echo $json;
?>