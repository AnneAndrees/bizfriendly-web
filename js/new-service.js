var newService = (function (newService) {
  // private properties
  

  // PUBLIC METHODS
  // initialize variables and load JSON
  function init(){
    _main()
  }

  // PRIVATE METHODS
  function _main(response){
     // Make sure they are logged in
    _checkIfLoggedIn();
    // Get all the existing categories
    _getCategories();
    // Controllers
    _iconUpload();
    _imageUpload();
    $("#add-tips").click(_addTipsClicked);
    $("#add-resources").click(_addResourcesClicked);
    $("#preview").click(_previewClicked);
    $("#save-draft").click(_saveDraftClicked);
    $("#submit").click(_submitClicked);
  }

  function _checkIfLoggedIn(){
    if (!BfUser.bfAccessToken){
      $('#main').hide();
      $('.login-required').show();
    }
  }

  function _getCategories(){
    // Get the existing categories
    $.get(config.bfUrl+config.bfApiVersion+'/categories', function(response){
      $.each(response.objects, function(i){
        if (response.objects[i].state == "published"){
          $('#category-id').append('<option value='+response.objects[i].id+'>'+response.objects[i].name+'</option>');
        }
      })
      $('#category-id').append('<option value="add-new-category">Add new category</option>');
    }).done(function(){
      $('.selectpicker').selectpicker();
      _watchCategory();
    })
  }

  function _watchCategory(){
    // Add a listener to the category menu.
    // If they choose to add a new category, open that page.
    $("#new-category-form").on("change", "#category-id", function(){
      if ($("#category-id").val() == "add-new-category"){
        window.open("http://bizfriend.ly/new-category.html");
      }
    });
  }

  function _iconUpload(){
    $("#icon-upload").attr("data-url",config.bfUrl+"/image_upload");
    $('#icon-upload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                // console.log(index);
                // console.log(file);
                $("#icon-upload-form").remove();
                $("#uploaded-icon").html('<img src="'+file.url+'" width="50">');
            });
        },
        progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#icon-upload-progress .progress-bar').css(
              'width',
              progress + '%'
          );
        },
        error : function(response){
          response = $.parseJSON(response.responseText);
          $('#icon-upload-form').append(response["message"]);
          // console.log(response.responseText);
        }
    });
  }

  function _imageUpload(){
    $("#image-upload").attr("data-url",config.bfUrl+"/image_upload");
    $('#image-upload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                // console.log(index);
                // console.log(file);
                $("#image-upload-form").remove();
                $("#uploaded-image").html('<img src="'+file.url+'">');
            });
        },
        progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#image-upload-progress .progress-bar').css(
              'width',
              progress + '%'
          );
        },
        error : function(response){
          response = $.parseJSON(response.responseText);
          $('#image-upload-form').append(response["message"]);
          // console.log(response.responseText);
        }
    });
  }

  function _addTipsClicked(){
    if ($("#tips2").hasClass("hidden")){
      $("#tips2").removeClass("hidden");
    } else {
      if ($("#tips3").hasClass("hidden")){
        $("#tips3").removeClass("hidden");
        $("#add-tips").remove();
      }
    }
  }

  function _addResourcesClicked(){
    if ($("#additional-resources-name2").hasClass("hidden")){
      $("#additional-resources-name2").removeClass("hidden");
      $("#additional-resources-url2").removeClass("hidden");
    } else {
      if ($("#additional-resources-name3").hasClass("hidden")){
        $("#additional-resources-name3").removeClass("hidden");
        $("#additional-resources-url3").removeClass("hidden");
      } else {
          if ($("#additional-resources-name4").hasClass("hidden")){
            $("#additional-resources-name4").removeClass("hidden");
            $("#additional-resources-url4").removeClass("hidden");
          } else {
            if ($("#additional-resources-name5").hasClass("hidden")){
              $("#additional-resources-name5").removeClass("hidden");
              $("#additional-resources-url5").removeClass("hidden");
              $("#add-resources").remove();
            }
          }
      }
    }
  }

  function _previewClicked(){
    $(".modal-title").text($("#new-service-name").val());
    $(".modal-body").append("URL: "+$("#new-service-url").val()+"<br/>");
    $(".modal-body").append("Short Description: "+$("#new-service-short-description").val()+"<br/>");
    $(".modal-body").append("Long Description: "+$("#new-service-long-description").val()+"<br/>");
    $(".modal-body").append("Tips 1: "+$("#tips1").val()+"<br/>");
    if ($("#tips2").val()){
      $(".modal-body").append("Tips 2: "+$("#tips2").val()+"<br/>");
    }
    if ($("#tips3").val()){
      $(".modal-body").append("Tips 3: "+$("#tips3").val()+"<br/>");
    }
    $(".modal-body").append("Additional Resources 1: "+$("#additional-resources-name1").val()+"<br/>");
    $(".modal-body").append("Additional Resources URL 1: "+$("#additional-resources-url1").val()+"<br/>");
    if ($("#additional-resources-name2").val()){
      $(".modal-body").append("Additional Resources 2: "+$("#additional-resources-name2").val()+"<br/>");
      $(".modal-body").append("Additional Resources URL 2: "+$("#additional-resources-url2").val()+"<br/>");
    }
    if ($("#additional-resources-name3").val()){
      $(".modal-body").append("Additional Resources 3: "+$("#additional-resources-name3").val()+"<br/>");
      $(".modal-body").append("Additional Resources URL 3: "+$("#additional-resources-url3").val()+"<br/>");
    }
    if ($("#additional-resources-name4").val()){
      $(".modal-body").append("Additional Resources 4: "+$("#additional-resources-name4").val()+"<br/>");
      $(".modal-body").append("Additional Resources URL 4: "+$("#additional-resources-url4").val()+"<br/>");
    }
    if ($("#additional-resources-name5").val()){
      $(".modal-body").append("Additional Resources 5: "+$("#additional-resources-name5").val()+"<br/>");
      $(".modal-body").append("Additional Resources URL 5: "+$("#additional-resources-url5").val()+"<br/>");
    }
    $(".modal-body").append("Uploaded Icon: "+$("#uploaded-icon").html()+"<br/>");
    $(".modal-body").append("Uploaded Image: "+$("#uploaded-image").html()+"<br/>");
    $(".modal-body").append("YouTube Link: "+$("#service-video-link").val()+"<br/>");
    
    $('#previewModal').modal()
  }

  function _saveDraftClicked(){
    newService = {
      name : $("#new-skill-name").val(),
      description : $("#new-skill-description").val(),
      state : "published",
      creator_id : BfUser.id
    }
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: config.bfUrl+config.bfApiVersion+'/categories',
      data: JSON.stringify(newService),
      dataType: "json",
      success : function(){
        window.location.replace("submission-complete.html");
      },
      error : function(error){
        $(".alert").removeClass("hidden");
      }
    });
  }

  function _submitClicked(){
    newService = {
      name : $("#new-skill-name").val(),
      description : $("#new-skill-description").val(),
      state : "published",
      creator_id : BfUser.id
    }
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: config.bfUrl+config.bfApiVersion+'/categories',
      data: JSON.stringify(newService),
      dataType: "json",
      success : function(){
        window.location.replace("submission-complete.html");
      },
      error : function(error){
        $(".alert").removeClass("hidden");
      }
    });
  }

  // add public methods to the returned module and return it
  newService.init = init;
  return newService;
}(newService || {}));

// initialize the module
newService.init()
