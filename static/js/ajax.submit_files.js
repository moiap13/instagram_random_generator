//$form
$('#comments_dropping_form').on('submit', function(e) {
    if ($form.hasClass('is-uploading')) return false;

    $form.addClass('is-uploading').removeClass('is-error');

    if (isAdvancedUpload) {
        // ajax for modern browsers
        e.preventDefault();

        //var ajaxData = new FormData($form.get(0));
        var ajaxData = new FormData($('#comments_dropping_form')[0]);

        //var object = {};
        if (droppedFiles) {
            ajaxData = new FormData();
            $.each( droppedFiles, function(i, file) {
                //object[$input.attr('name')+i] = file;
                ajaxData.append($input.attr('name'), file);
            });
        }

        //var json = JSON.stringify(object);

        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: ajaxData,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            complete: function() {
              $form.removeClass('is-uploading');
            },
            success: function(data) {
                alert(data);
                $form.addClass( data.success == true ? 'is-success' : 'is-error' );
                if (!data.success) $errorMsg.text(data.error);
            },
            error: function() {
              // Log the error, show an alert, whatever works for you
            }
        });
    } else {
        // ajax for legacy browsers
        var iframeName  = 'uploadiframe' + new Date().getTime();
        $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

        $('body').append($iframe);
        $form.attr('target', iframeName);

        $iframe.one('load', function() {
        var data = JSON.parse($iframe.contents().find('body' ).text());
        $form
          .removeClass('is-uploading')
          .addClass(data.success == true ? 'is-success' : 'is-error')
          .removeAttr('target');
        if (!data.success) $errorMsg.text(data.error);
            $form.removeAttr('target');
            $iframe.remove();
        });
    }
});

$formStories.on('submit', function(e) {
    if ($formStories.hasClass('is-uploading')) return false;

    $formStories.addClass('is-uploading').removeClass('is-error');

    if (isAdvancedUpload) {
        // ajax for modern browsers
        e.preventDefault();

        var ajaxData = new FormData($formStories[0]);

        //var object = {};
        if (droppedFiles) {
            ajaxData = new FormData();
            $.each( droppedFiles, function(i, file) {
                //object[$input.attr('name')+i] = file;
                ajaxData.append($formStories.find('input[type="file"]').attr('name'), file);
            });
        }

        //var json = JSON.stringify(object);

        $.ajax({
            url: $formStories.attr('action'),
            type: $formStories.attr('method'),
            data: ajaxData,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            complete: function() {
              $formStories.removeClass('is-uploading');
            },
            success: function(data) {
                showFinalData(data.data);
                $formStories.addClass( data.success == true ? 'is-success' : 'is-error' );
                if (!data.success) $errorMsg.text(data.error);
            },
            error: function() {
              // Log the error, show an alert, whatever works for you
            }
        });
    } else {
        // ajax for legacy browsers
        var iframeName  = 'uploadiframe' + new Date().getTime();
        $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

        $('body').append($iframe);
        $formStories.attr('target', iframeName);

        $iframe.one('load', function() {
        var data = JSON.parse($iframe.contents().find('body' ).text());
        $formStories
          .removeClass('is-uploading')
          .addClass(data.success == true ? 'is-success' : 'is-error')
          .removeAttr('target');
        if (!data.success) $errorMsg.text(data.error);
            $formStories.removeAttr('target');
            $iframe.remove();
        });
    }
});

function sendInstaCredentials() {
    let username = $("#insta_username").val();
    let password = $("#insta_password").val();
    let credentials = {"username":username, "password": password}

    if (isAdvancedUpload) {
        // ajax for modern browsers

        //var json = JSON.stringify(object);

        $.ajax({
            url: "/post_insta_credentials",
            type: "POST",
            data: JSON.stringify(credentials),
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            complete: function() {
              $form.removeClass('is-uploading');
            },
            success: function(data) {
                $("#div_settings").append("<p>Instagram credentials succefully set</p>");
                setInterval(function () {
                    $("#div_settings").fadeOut();
                }, 500)
                $("#followed_by").append(data["data"]["followed_by"]);
                $("#follows").append(data["data"]["follows"]);

                $("#followed_by").show();
                $("#follows").show();
                //$form.addClass( data.success == true ? 'is-success' : 'is-error' );
                if (!data.success) $errorMsg.text(data.error);
            },
            error: function() {
              // Log the error, show an alert, whatever works for you
            }
        });
    } else {
        // ajax for legacy browsers
        var iframeName  = 'uploadiframe' + new Date().getTime();
        $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

        $('body').append($iframe);
        $form.attr('target', iframeName);

        $iframe.one('load', function() {
        var data = JSON.parse($iframe.contents().find('body' ).text());
        $form
          .removeClass('is-uploading')
          .addClass(data.success == true ? 'is-success' : 'is-error')
          .removeAttr('target');
        if (!data.success) $errorMsg.text(data.error);
            $form.removeAttr('target');
            $iframe.remove();
        });
    }
}

function sendInstaPostCode() {
    let instaPostCode = $("#insta_post_code").val();
    let ig_post_code = {"ig_post_code":instaPostCode}

    if (isAdvancedUpload) {
        // ajax for modern browsers

        //var json = JSON.stringify(object);

        $.ajax({
            url: "/post_insta_post_code",
            type: "POST",
            data: JSON.stringify(ig_post_code),
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            complete: function() {
              $form.removeClass('is-uploading');
            },
            success: function(data) {
                console.log(JSON.stringify(data));
                $("#data_comments-tab").removeClass('disabled')
                showFinalData(data.data);
                //$form.addClass( data.success == true ? 'is-success' : 'is-error' );
                if (!data.success) alert(data.data);
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Insta post code function \nError - ' + errorMessage + "\n" + "status : " + status + "\n" + "error : " + error);
                // Log the error, show an alert, whatever works for you
            }
        });
    } else {
        // ajax for legacy browsers
        var iframeName  = 'uploadiframe' + new Date().getTime();
        $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

        $('body').append($iframe);
        $form.attr('target', iframeName);

        $iframe.one('load', function() {
        var data = JSON.parse($iframe.contents().find('body' ).text());
        $form
          .removeClass('is-uploading')
          .addClass(data.success == true ? 'is-success' : 'is-error')
          .removeAttr('target');
        if (!data.success) $errorMsg.text(data.error);
            $form.removeAttr('target');
            $iframe.remove();
        });
    }
}


function send_data_to_randomize(data) {

    if (isAdvancedUpload) {
        // ajax for modern browsers

        //var json = JSON.stringify(object);

        $.ajax({
            url: "/post_insta_post_code",
            type: "POST",
            data: data, // assuming data is already stringified
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            complete: function() {
              $form.removeClass('is-uploading');
            },
            success: function(data) {
                console.log(data);
                $("#data_comments-tab").removeClass('disabled')
                showFinalData(data.data);
                //$form.addClass( data.success == true ? 'is-success' : 'is-error' );
                if (!data.success) alert(data.data);
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Send data to randomize \naError - ' + errorMessage + "\n" + "status : " + status + "\n" + "error : " + error);
                // Log the error, show an alert, whatever works for you
            }
        });
    } else {
        // ajax for legacy browsers
        var iframeName  = 'uploadiframe' + new Date().getTime();
        $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

        $('body').append($iframe);
        $form.attr('target', iframeName);

        $iframe.one('load', function() {
        var data = JSON.parse($iframe.contents().find('body' ).text());
        $form
          .removeClass('is-uploading')
          .addClass(data.success == true ? 'is-success' : 'is-error')
          .removeAttr('target');
        if (!data.success) $errorMsg.text(data.error);
            $form.removeAttr('target');
            $iframe.remove();
        });
    }
}
