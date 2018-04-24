var async = require('async')
var emojis = require('emojis')
var replace = require('replace-string')

var social = `
<div>
<div class='label' id='social-label'>slack</div>
<div class='sublabel' id='social-sublabel'>select a channel: 
	<select id='channel-select' class='channel-select'>
		<option value='#hca-comp-meeting'>#hca-comp-meeting</option>
		<option value='#hca-comp-cellstate'>#hca-comp-cellstate</option>
		<option value='#hca-comp-trajectories'>#hca-comp-trajectories</option>
		<option value='#hca-comp-latent'>#hca-comp-latent</option>
		<option value='#hca-comp-populations'>#hca-comp-populations</option>
		<option value='#hca-comp-manifolds'>#hca-comp-manifolds</option>
		<option value='#hca-comp-multiomics'>#hca-comp-multiomics</option>
		<option value='#hca-comp-imaging'>#hca-comp-imaging</option>
		<option value='#hca-comp-scale'>#hca-comp-scale</option>
		<option value='#hca-comp-compression'>#hca-comp-compression</option>
		<option value='#hca-comp-bioconductor'>#hca-comp-bioconductor</option>
		<option value='#hca-comp-portals'>#hca-comp-portals</option>
	</select>
</div>
<div class='inner-content'>
	<div class='messages' id='messages'></div>
</div>
</div>
`

const slack = require('slack')
const token = process.env.SLACK_TOKEN
const count = 200

var channel
var usercache = {}

function showerror () {
	document.getElementById('messages').innerHTML = 'error loading messages'
}

function showloading () {
	document.getElementById('messages').innerHTML = 'loading messages'
}

function showdone () {
	document.getElementById('messages').innerHTML = ''
}

function displaymessage (username, text) {
	var el = document.createElement('div')
	el.className = 'message'
	el.innerHTML = `<span class='username'>${username}</span>: <span 'message'>${text}</span>`
	document.getElementById('messages').appendChild(el)
}

function scroll () {
	var el = document.getElementById('messages')
  el.scrollTop = el.scrollHeight
}

function resize () {
	if (window.innerWidth > 800) {
		var container = document.getElementById('links')
		var tmp1 = document.getElementById('social-label').offsetHeight
		var tmp2 = document.getElementById('social-sublabel').offsetHeight
		document.getElementById('messages').style.height = (container.offsetHeight - tmp1 - tmp2 - 60) + 'px'
	}
}

function fetchmessages (channel) {
	showloading()
	slack.channels.history({ token, channel, count }, (err, data) => {
	  if (err) {
	  	console.log(err)
	    showerror()
	    return
	  }

	  data.messages = _.sortBy(data.messages, function (d) {
	  	return d.ts
	  })

	  function replaceid (msg) {
			var matches = msg.match(/<@\w*>/g)
			if (matches) {
				matches.forEach(function (d) {
					msg = msg.replace(d, usercache[d.slice(2, d.length - 1)])
				})
			}
			return msg
	  }

	  function replacehash (msg) {
	  	var matches = msg.match(/#.*\|/g)
	  	if (matches) {
	  		matches.forEach(function (d) {
					msg = msg.replace(d, '')
				})
				var matches = msg.match(/<.*>/g)
				if (matches) {
					matches.forEach(function (d) {
						msg = msg.replace(d, '#' + d.slice(1, d.length - 1))
					})
				}
	  	}
	  	return msg
	  }

	  function fixurls (msg) {
	  	var matches = msg.match(/<.*>/g)
			if (matches) {
				matches.forEach(function (d) {
					msg = msg.replace(d, d.slice(1, d.length - 1))
				})
			}
			return msg
	  }

	  function process (msg, cb) {
	  	console.log(msg)
	  	if ((msg.subtype != 'channel_join') && (msg.subtype != 'channel_topic') 
	  			&& (msg.subtype != 'file_comment') && (msg.subtype != 'file_share')
	  			&& (msg.subtype != 'channel_name')) {
	  		var text = msg.text
	  		var user = msg.user
	  		var username
	  		if (usercache[user]) {
	  			username = usercache[user]
	  			cb(null, {username: username, text: text})
	  		} else {
					slack.users.info({ token, user }, (err, data) => {
						if (err) {
					  	console.log(err)
					    showerror()
					    return
					  }
						username = data.user.real_name
						usercache[user] = data.user.real_name
						return cb(null, {username: username, text: text})
			  	})
	  		}
  		} else {
  			cb(null, '')
  		}
	  }

	  async.map(data.messages, process, function (err, results) {
	  	showdone()
	  	_.forEach(results, function (d) {
	  		if (d != '') {
	  			d.text = replaceid(d.text)
	  			d.text = replacehash(d.text)
	  			d.text = fixurls(d.text)
	  			d.text = emojis.unicode(d.text)
	  			displaymessage(d.username, d.text)
	  		}
	  	})
	  	scroll()
	  })
	})
}

function setup () {
	slack.channels.list({ token }, (err, data) => {
	  if (err) {
	    showerror()
	    return
	  }

	  function findchannel (name) {
			var target = name.slice(1,name.length)
		  var id = _.find(data.channels, function (d) {
		  	return d.name == target
		  })['id']
		  return id
		}

	  var el = document.getElementById('channel-select')
	  channel = findchannel (el.value)
	  fetchmessages(channel)

	  el.onchange = function (e) {
	  	channel = findchannel (el.value)
	  	fetchmessages(channel)
	  }

	  window.addEventListener('resize', function (d) {
			resize()
		  scroll()
		})

		resize()
	})
}

setup()

module.exports = social