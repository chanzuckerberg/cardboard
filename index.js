var projects = require('./components/projects.js')
var meeting = require('./components/meeting.js')
var github = require('./components/github.js')
var header = require('./components/header.js')
var people = require('./components/people.js')
var links = require('./components/links.js')
var social = require('./components/social.js')
var footer = require('./components/footer.js')

var app = `
<div class='container'>
	<div class='header'>
	${header}
	</div>
	<div class='row row-1'>
		<div class='card meeting'>
		${meeting}
		</div>
		<div class='card projects'>
		${projects}
		</div>
		<div class='card github'>
		${github}
		</div>
	</div>
	<div class='row row-2'>
		<div id='people' class='card people'>
		${people}
		</div>
		<div id='links' class='card links'>
		${links}
		</div>
		<div id='social' class='card social'>
		${social}
		</div>
	</div>
	${footer}
</div>
`

document.body.innerHTML = app

