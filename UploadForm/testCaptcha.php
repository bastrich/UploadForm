<?php
$captcha = $_POST["captcha"];
$captchaHash = $_POST["captchaHash"];
if (hash("md5", $captcha) != $captchaHash)
    echo "FAIL";
else
    echo "OK";
?>