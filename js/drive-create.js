// Enter a client ID for a web application from the Google Developer Console.
// The provided clientId will only work if the sample is run directly from
// https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
// In your Developer Console project, add a JavaScript origin that corresponds to the domain
// where you will be running the script.
var clientId = '338337379780-jqcvgrv75efn1rtpt7t21dd94o0r29l9.apps.googleusercontent.com';

// To enter one or more authentication scopes, refer to the documentation for the API.
var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.appdata'
];


function insertPermission(fileId, value, type, role) {
    var body = {
        'value': value,
        'type': type,
        'role': role
    };
    var request = gapi.client.drive.permissions.insert({
        'fileId': fileId,
        'resource': body
    });
    request.execute(function(resp) { 
        console.log(resp);
    });
}

function copyFile(gapi, originFileId, copyTitle, callback) {
    var body = {'title': copyTitle};
    var request = gapi.client.drive.files.copy({
        'fileId': originFileId,
        'resource': body
    });
    request.execute(callback);
    /*request.execute(function(resp) {
        console.log('Copy ID: ' + resp.id);
    });*/
}


function createFile(gapi, callback){
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var contentType = 'text/plain';
    var metadata = {
        'title': 'new file',
        'mimeType': contentType
    };

    var base64Data = btoa('Your text here');
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart', 'convert': true},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
        
    });
    request.execute(callback);
}


// Use a button to handle authentication the first time.
function handleClientLoad() {
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes.join(' '), immediate: true}, handleAuthResult);
}


function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.classList.add('hidden');
    makeApiCall();
  } else {
    authorizeButton.classList.remove('hidden');
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
    /*gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
        request.execute(function(resp) {
            var heading = document.createElement('h4');
            var image = document.createElement('img');
            image.src = resp.image.url;
            heading.appendChild(image);
            heading.appendChild(document.createTextNode(resp.displayName));
            document.getElementById('content').appendChild(heading);
        });
    });*/

    $('#create-button').click(function(){
        gapi.client.load('drive', 'v2', function(){
            /*
            var fileID = '1EfxnwIwpFuUyd-abFpZQ1VxO5cP05icmuhjcoNlRUqw';
            copyFile(gapi, fileID, 'new document', function(file){
                console.log(file);
            });
            //*/
            //*
            createFile(gapi, function(file){
                console.log(file);
                $('#open-button').attr('href', file.alternateLink);
                $('#open-button').removeClass('hidden');
                insertPermission(file.id, 'admin@p2pu.org', 'user', 'owner');
            });
            //*/
        });
    });
}
