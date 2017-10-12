import $ from 'jquery';
import _ from 'lodash';
let SendRest = require('./sendRest.js');
let Secrets = require('./secret').b2bSecrets;
import aws_login_ui from './aws_login_ui.js';
import google_oauth_ui from './google_oauth_ui.js';

let id_token;

$(document).ready(function() {
  div_ctrl();
  aws_login_ui.init();
  google_oauth_ui.init();

  google_oauth_ui.oauthCallback(window.location.href);

  $("#callResource").on("click", async function(){
    callResource();
  });
});

function div_ctrl(){
  //init
  $("#aws_signup_div").hide();
  $("#test_div").hide();

  //event
  $("#aws_signup_title").on('click', function(){
    $("#aws_signup_div").toggle();
  });

  $("#aws_login_title").on('click', function(){
    $("#aws_login_div").toggle();
  });

  $("#b2c_login_title").on('click', function(){
    $("#b2c_login_div").toggle();
  });

  $("#test_title").on('click', function(){
    $("#test_div").toggle();
  });
}

async function callResource(){
  try {
    let uri = $("#api").val();
    let result = await SendRest.sendToAPIGateway(AWS.config.credentials, Secrets.api_baseurl, "GET", uri);

    $("#rest_result").html(JSON.stringify(result.data));
  }
  catch(err) {
    alert(err);
  }
}


