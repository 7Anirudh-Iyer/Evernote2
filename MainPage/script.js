let db = firebase.database()
let uid, profile, email, name, image, cursorP

let finalText

firebase.auth().onAuthStateChanged(user => {  
	if(user) {
	    uid = user.uid
	    email = user.email

	    let noOfNotes
	    db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
			noOfNotes = data.val()
			for(let i=0; i<noOfNotes; i++){
				let title, date, content
				let j = i+1
				db.ref('Users/'+uid+'/Notes/'+j+'/title/').on('value', (data)=>{
					title = data.val()
				})
				db.ref('Users/'+uid+'/Notes/'+j+'/date/').on('value', (data)=>{
					date = data.val()
				})
				db.ref('Users/'+uid+'/Notes/'+j+'/content/').on('value', (data)=>{
					content = data.val()
				})
				const myTimeout = setTimeout(()=>{
		        	Note(title, date, content, i)
		        }, 500);
			}

			const d = new Date();
			let day = d.getDate() + "/" + d.getMonth() + "/" + d.getYear();
			let i = noOfNotes+1
			let idOfSave = "save"+i
			$('#add').click(()=>{
				Note("New Note", day, "Type here", noOfNotes)
				db.ref('Users/'+uid).update({
					NoOfNotes: noOfNotes+1
				})
				db.ref('Users/'+uid+'/Notes/'+i).update({
					title: "New note",
					date: day,
					content: "type here"
				})
				window.location.reload()
			})
		})
	} if(!user) {
		location.href = '../SignInPage/signIn.html'
	}
})

$('#so').click(()=>{
	firebase.auth().signOut()
})

//learn how this function works
function showCursPos(divName, position){
    selection = document.getSelection();
    childOffset = selection.focusOffset;

    const range = document.createRange();
    eDiv = document.getElementById(divName);
    range.setStart(eDiv, 0);
    range.setEnd(selection.focusNode, childOffset);

    var sHtml = range.toString();
    p = sHtml.length; 
    cursorP = p
  }

function Note(title, date, content, i){
	let idOfDiv = "note"+i
	div = document.createElement('div')
	div.id = idOfDiv
	document.getElementById('contentbar').appendChild(div)

	$('#'+idOfDiv).css({
		backgroundColor: "transparent",
		borderColor: "black",
		border: "groove",
		width: "100%",
		height: "10%",
		textAlign: "center",
		cursor: "pointer"
	})

	$('#'+idOfDiv).click(()=>{
		let remEl = document.getElementById('editor')
		while (remEl.lastElementChild) {
			remEl.removeChild(remEl.lastElementChild);
		}
		let input = document.createElement('input')
		let idOfIn = "input"+i
		input.id = idOfIn
		input.value = title
		document.getElementById('editor').appendChild(input)
		$('#'+idOfIn).css({
			width: "30%",
			height: "5%",
			backgroundColor: "transparent",
			marginLeft: "30%",
			borderWidth: "1vw",
			borderRight: "none",
			borderTop: "none",
			borderBottom: "none",
			border: "none",
			textAlign: "center",
			borderColor: "skyblue",
			backgroundColor: "transparent",
			fontSize: "2vw",
			marginTop: "2%",
			fontFamily: "Annie use your telescope"
		})

		let ta = document.createElement('div')
		let pSpace = document.createElement('p')
		document.getElementById('editor').appendChild(pSpace)
		document.getElementById('editor').appendChild(ta)
		let idOfTa = "ta"+i
		ta.id = idOfTa
		$('#'+idOfTa).css({
			marginTop: "2%",
			marginLeft: "1%",
			backgroundColor: "white",
			width: "98%",
			fontFamily: "arial",
			maxHeight: "90%",
			overflow: "scroll"
		})

		let pCont = document.createElement('p')
		pCont.innerHTML = content
		pCont.contentEditable = "true"
		let idOfP = "p"+i
		pCont.id = idOfP
		document.getElementById(idOfTa).appendChild(pCont)
		$('#'+idOfP).css({
			marginTop: "5%",
			marginLeft: "4%",
			marginRight: "4%",
			marginBottom: "5%"
		})

		//learn how this code works
		$('#'+idOfTa).keyup(e => {
			var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13) {
			    console.log('enter was pressed')
			}
		})

		let save = document.createElement('button')
		let idOfSave = "save"+i
		save.id = idOfSave
		save.innerHTML = "Save"
		document.getElementById('editor').appendChild(save)
		$('#'+idOfSave).css({
			backgroundColor: "red",
			color: "white",
			fontFamily: "spirax",
			width: "10%",
			height: "5%",
			position: "absolute",
			top: 1,
			marginLeft: "66%",
			border: "none",
			borderRadius: 10,
			curson: "pointer"
		})
		$('#'+idOfSave).click(()=>{
			let j = i+1
			db.ref('Users/'+uid+"/Notes/"+j).update({
				title: $('#'+idOfIn).val(),
				content: $('#'+idOfP).html()
			})
			window.location.reload()
		})
	})

	let idOfTitle = "title"+i
	let tON = document.createElement('h5')
	tON.innerHTML = title
	tON.id = idOfTitle
	tON.style.marginTop = "2%"
	tON.style.fontSize = "1vw"
	tON.style.fontWeight = "bold"
	document.getElementById(idOfDiv).appendChild(tON)

	let idOfDate = "date"+i
	let dON = document.createElement('h6')
	dON.innerHTML = "Created on: "+date
	dON.id = idOfDate
	dON.style.fontSize = "1vw"
	dON.style.marginTop = "-10%"
	document.getElementById(idOfDiv).appendChild(dON)

	let idOfDel = "del"+i
	let deON = document.createElement('h6')
	deON.innerHTML = "Delete"
	deON.id = idOfDel
	deON.style.fontSize = "1vw"
	deON.style.marginTop = "-10%"
	deON.style.textDecorationLine = "underline"
	deON.onclick = function(){
		let noOfNotes
		console.log('delete was pressed')
		db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
			noOfNotes = data.val()
		})
		timer = setTimeout(function() {
			db.ref('Users/'+uid).update({
				NoOfNotes: noOfNotes-1
			})
			db.ref('Users/'+uid+'/Notes/'+i).remove()
			window.location.reload()
		}, 100);
	}
	$('#'+idOfDiv).mouseenter(()=>{
		document.getElementById(idOfDiv).appendChild(deON)
	})
	$('#'+idOfDiv).mouseleave(()=>{
		document.getElementById(idOfDiv).removeChild(deON)
	})
}