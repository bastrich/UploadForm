var filesCounter = 1;
var sumFilesSize = 0;
var MAX_SIZE = 104857600;
function submitEventHandler(formData, jqForm, options) {
	var captcha = true;
	$.ajax({
		type: 'POST',
		url: 'testCaptcha.php',
		data: 'captcha=' + $('#captcha').val() + '&captchaHash=' + $('#captchaHash').val(),
		async: false,
		success: function (data) {
			if (data == "FAIL") {
				captcha = false;
			}
		}
	});
	if (!captcha) {
		alert("Неправильно введён код CAPTCHA");
		$('#captcha').clearInputs();
		refreshCaptcha();
		return false;
	}
	if ($("#name").val() == "") {
		alert('Поле "Имя" обязательно к заполнению!');
		return false;
	}
	if ($("name").length > 50) {
		alert('Поле "Имя" должно быть не больше 50 символов');
		return false;
	}
	if ($("#phone").val() == "") {
		alert('Поле "Телефон" обязательно к заполнению!');
		return false;
	}
	if ($("#email").val() == "") {
		alert('Поле "E-mail" обязательно к заполнению!');
		return false;
	}
	if ($("email").length > 50) {
		alert('Поле "E-mail" должно быть не больше 50 символов');
		return false;
	}
	if (!/^.+@.+\..+$/i.test($("#email").val())) {
		alert('Поле "E-mail" введено в неверном формате!');
		return false;
	}
	if ($("#comment").val() == "") {
		alert('Поле "Комментарий" обязательно к заполнению!');
		return false;
	}
	if ($("comment").length > 1000) {
		alert('Поле "Коментарий" должно быть не больше 1000 символов');
		return false;
	}
	$.blockUI({ message: '<div id="circular3dG"> <div id="circular3d_1G" class="circular3dG"> </div> <div id="circular3d_2G" class="circular3dG"> </div> <div id="circular3d_3G" class="circular3dG"> </div> <div id="circular3d_4G" class="circular3dG"> </div> <div id="circular3d_5G" class="circular3dG"> </div> <div id="circular3d_6G" class="circular3dG"> </div> <div id="circular3d_7G" class="circular3dG"> </div> <div id="circular3d_8G" class="circular3dG"> </div> </div><h3>Пожалуйста, подождите, происходит отправка...</h3>' });
	return true;
}
function responseEventHandler(responseText, statusText, xhr, $form) {
	$.unblockUI({
		onUnblock: function () {
			if (responseText.status == "OK") {
				alert('Заказ успешно отправлен. Номер заказа: ' + responseText.orderNumber);
				$('#name').clearInputs();
				$('#phone').clearInputs();
				$('#email').clearInputs();
				$('#comment').clearInputs();
				$('#captcha').clearInputs();
				$('.files').empty();
				filesCounter = 1;
				sumFilesSize = 0;
				$(".files").append('<div class="fileUploadLine" id="fileUploadLine1"><input class="fileUploadButton" type="file" name="uploadedFile1" id="uploadedFile1" /></div>');
			}
			else {
				$('#captcha').clearInputs();
				alert('При отправке возникла ошибка: ' + responseText.message);
			}
		}
	});
	refreshCaptcha();
}
function fileButtonsUpdate() {
	var fileName = $(this).val();
	var inputNumber = parseInt(this.name.replace(/\D/g, ''), 10);
	if (fileName == null || fileName == "")
		return;
	var fileSize = this.files[0].size;
	if (fileSize > MAX_SIZE) {
		alert('Превышено ограничение на максимальный объём одного файла!');
		$(this).val("");
		return;
	}
	else if (sumFilesSize + fileSize > MAX_SIZE) {
		alert('Превышено ограничение на максимальный суммарный объём файлов!');
		$(this).val("");
		return;
	}
	if (!testExtension(fileName)) {
		alert('Недопустимое расширение файла!');
		$(this).val("");
		return;
	}
	sumFilesSize += fileSize;
	if ($(this).parent().children(".deleteFileButton").length == 0) {
		$("#fileUploadLine" + inputNumber).append('<input class="deleteFileButton" id="deleteFileButton' + inputNumber + '" type="button" value="Удалить"/>');
		$('#deleteFileButton' + inputNumber).click(fileUploadRemove);
	}

	if (filesCounter > 9) return;
	var append = true;
	$(".fileUploadButton").each(function () {
		if ($(this).val() == "" || $(this).val() == null)
			append = false;
	});
	if (!append)
		return;
	filesCounter++;
	var num = getId();
	$(".files").append('<div class="fileUploadLine" id="fileUploadLine' + num + '"><input class="fileUploadButton" type="file" name="uploadedFile' + num + '" id="uploadedFile' + num + '" /></div>');
	$('#uploadedFile' + num).change(fileButtonsUpdate);
}
function refreshCaptcha() {
	$(".captcha").css('cursor', 'wait');
	$.getJSON("captcha.php", function (data) {
		$(".captcha").empty();
		$(".captcha").append($("<img />").attr({ 'src': 'data:image/gif;charset=utf8;base64,' + data.image, "alt": "Щёлкните, чтобы обновить", "title": "Щёлкните, чтобы обновить" }));
		$("#captchaHash").val(data.captchaHash);
		$(".captcha").css('cursor', 'default');
	});
}
function fileUploadRemove() {
	var id = parseInt(this.id.replace(/\D/g, ''), 10);
	var fileSize = 0;
	if ($("#uploadedFile" + id).get(0).files !== undefined)
		fileSize = $("#uploadedFile" + id).get(0).files[0].size;
	filesCounter--;
	sumFilesSize -= fileSize;
	$(this).parent().remove();
	var append = true;
	$(".fileUploadButton").each(function () {
		if ($(this).val() == "" || $(this).val() == null)
			append = false;
	});
	if (append) {
		filesCounter++;
		var num = getId();
		$(".files").append('<div class="fileUploadLine" id="fileUploadLine' + num + '"><input class="fileUploadButton" type="file" name="uploadedFile' + num + '" id="uploadedFile' + num + '" /></div>');
		$('#uploadedFile' + num).change(fileButtonsUpdate);
	}
}
function getId() {
	var res = 1;
	for (var res = 1; res <= 10; res++) {
		var exist = false;
		$(".fileUploadButton").each(function () {
			if (parseInt(this.name.replace(/\D/g, ''), 10) == res)
				exist = true;
		});
		if (!exist)
			return res;
	}

}
function testExtension(name) {
	var ext = name.split(".").pop().toLowerCase();
	var need = ['pdf', 'jpg', 'tiff', 'bmp', 'gif', 'png', 'dwg', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'odt', 'odw', 'cdr', 'psd', 'zip', 'rar'];
	if ($.inArray(ext, need) == -1)
		return false;
	return true;
}
$(function () {
	jQuery(function ($) {
		$("#phone").mask("+7(999)999-99-99");
	});
	$('.uploadForm').submit(function () {
		var options = {
			beforeSubmit: submitEventHandler,
			success: responseEventHandler,
			dataType: 'json'
		};
		$(this).ajaxSubmit(options);
		return false;
	});
	$("#uploadedFile1").change(fileButtonsUpdate);
	$(".captcha").click(refreshCaptcha);
	refreshCaptcha();
});