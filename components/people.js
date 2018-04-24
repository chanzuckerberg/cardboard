var people = `
<div class='namecard-header'>
	<div class='namecard-header-label label'>people</div>
	<input id='namecard-header-search' class='namecard-header-search' placeholder='type a name'></input>
	<div class='namecard-header-buttons'>
		<div class='namecard-arrow' id='namecard-arrow-left'>
			<span class='namecard-arrow-icon simple-svg' data-icon='mdi-arrow-left-bold-box' data-inline='false'></span>
		</div>
		<div class='namecard-arrow' id='namecard-arrow-right'>
			<span class='namecard-arrow-icon simple-svg' data-icon='mdi-arrow-right-bold-box' data-inline='false'></span>
		</div>
	</div>
</div>
<div class='namecard' id='namecard'>
</div>
`

d3.csv('assets/data/people.csv', function (data) {

	var index = Math.floor((Math.random() * data.length))
	var minheight = 0

	function namecard (data) {
		return `
		<img src=${'https://meetings.czi.technology/human-cell-atlas/comp-tools/assets/photos/' + data['Headshot file']} alt='' class='namecard-picture'></img>
		<div class='namecard-about'>
			<div>${data['First name'] + ' ' + data['Last name']}</div>
			<div class='namecard-about-organization'>${data['Organization'] || ''}</div>
			<div class='namecard-about-project'>${(data['Project'] == '--') ? '' : data['Project']}</div>
		</div>
		<div class='namecard-bio' id='namecard-bio'>${data['Bio']}</div>
		`
	}

	function fakenamecard (data) {
		return `
		<img class='namecard-picture'></img>
		<div class='namecard-about'>
			<div>${data['First name'] + ' ' + data['Last name']}</div>
			<div class='namecard-about-organization'>${data['Organization'] || ''}</div>
			<div class='namecard-about-project'>${data['Project']}</div>
		</div>
		<div class='namecard-bio' id='namecard-bio'>${data['Bio']}</div>
		`
	}

	function emptynamecard (text) {
		return `
		<div class='namecard-bio' id='namecard-bio'>${text}</div>
		`
	}

	function resetheight () {
		var max = _.maxBy(data, function (d) {
			return d['Bio'] ? d['Bio'].length : 1
		})
		minheight = fakeupdate(max)
	}

	window.addEventListener('resize', function (d) {
		if (window.innerWidth > 800) {
			resetheight()
			update(data[index])
		}
	})

	function update(d) {
		document.getElementById('namecard').innerHTML = namecard(d)
		document.getElementById('namecard').style.opacity = 1
	}

	function fakeupdate(d) {
		document.getElementById('namecard').style.opacity = 0
		document.getElementById('namecard').innerHTML = fakenamecard(d)
		return document.getElementById('namecard-bio').offsetHeight
	}

	function noresults() {
		document.getElementById('namecard').innerHTML = emptynamecard('no results found')
	}

	function manyresults(n) {
		document.getElementById('namecard').innerHTML = emptynamecard(n + ' results found')
	}

	document.getElementById('namecard-arrow-left').onclick = function (d) {
		if (index > 0) {
			index = index - 1
		} else if (index == 0) {
			index = data.length - 1
		}
		update(data[index])
	}
	
	document.getElementById('namecard-arrow-right').onclick = function (d) {
		if (index < (data.length - 1)) {
			index = index + 1
		} else if (index == (data.length - 1)) {
			index = 0
		}  
		update(data[index])
	}

	document.getElementById('namecard-header-search').oninput = function (e) {
    var searching = (e.data || e.inputType == 'insertFromPaste') ? true : false
    var target = e.srcElement.value
    if (!(target == "")) {
    	var found = _.filter(data, function (d) {
	    	var concat = d['First name'] + ' ' + d['Last name']
	      return concat.toLowerCase().includes(target.toLowerCase())
	    })
	    console.log(found)
	    if (found.length == 1) {
	    	index = _.findIndex(data, function (d) {
	    		return (d['First name'] == found[0]['First name']) && (d['Last name'] == found[0]['Last name'])
	    	})
	      update(data[index])
	    }
	    if ((e.srcElement.value == "") || (found.length == 0)) {
	    	noresults()
	    }
	    if (found.length > 1) {
	    	manyresults(found.length)
	    }
    } else {
    	update(data[index])
    }
  }

	if (window.innerWidth > 800) {
		resetheight()
	} else {
		minheight = 150
	}
	update(data[index])
})

module.exports = people