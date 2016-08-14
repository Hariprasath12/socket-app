var name= getQueryVariable('name') || Anonymous;
var room= getQueryVariable('room');
$('.room').text(room);
var Socket = io();

Socket.on('connect', function() {
	console.log('connected to the Socket io');
	Socket.emit('joinroom',{
		name:name,
		room:room
	});
	
});

Socket.on('message', function(message) {
	var momentSTAMP = moment.utc(message.timestamp).zone("+05:30");
	
	var $apap=jQuery('.messages');
	console.log('new message:');
	console.log(message.text);
     $apap.append('<p><strong>'+ message.name +' '+ momentSTAMP.format('LT') +'</strong> </p>');
	//$('.messages').append('<p> ' + message.text + '<sub>' + momentSTAMP.format('h:m a') + '</sub></p>');
      $apap.append('<p>' + message.text +' </p>');
});

var $form = jQuery('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();
	var $msg = $form.find('input[name=message]');
	Socket.emit('message', {
		name:name,
		text: $msg.val()
	});
	$msg.val('')

});