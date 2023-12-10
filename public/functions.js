// ------------Click event handler using 
function customVisibilityToggle(selector, target) {
    $(document).on('click', selector, function() {
      console.log("xXXasdXX");
      $(target).slideDown();
        if ($(target).css('display') === 'none') {
            $(target).css('display', 'block');
        } else {
            $(target).css('display', 'none');
        }
    });
}


function yell(){
    console.log("HELOOOOOO!!!");
}
// -------Event handler for form submissions
function handleFormSubmission(formId, url, method, successCallback, errorCallback) {
    $(formId).on('submit', function(event) {
        event.preventDefault();
        const formData = $(this).serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});
        makeAjaxRequest(url, method, formData, successCallback, errorCallback);
    });
}
// -------AJAX request function-------
function makeAjaxRequest(url, method, data, successCallback, errorCallback) {
    $.ajax({
        url: url,
        method: method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: successCallback,
        error: errorCallback
    });
}