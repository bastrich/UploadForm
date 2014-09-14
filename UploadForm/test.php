<?php
$zip = new ZipArchive();
$zip->open($fileName, ZIPARCHIVE::CREATE);
$zip->addFile;
$zip->close();
?>