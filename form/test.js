// test
//var container = document.getElementsByTagName("body")[0];
var container = document.getElementById("J_formContainer");

$.getJSON("test.json", function (data) {
    container.appendChild(Form.BootstrapForm(data).getElement());
});
