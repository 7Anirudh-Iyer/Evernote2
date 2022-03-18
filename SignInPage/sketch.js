let db = firebase.database()

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
    	let uid = firebaseUser.uid
    	let email = firebaseUser.email
        let noOfNotes;
        db.ref('Users/'+uid+"/NoOfNotes").on('value', (data)=>{
            noOfNotes = data.val()
            if(noOfNotes > 0){
                db.ref('Users/'+uid).update({
                    email: email,
                    NoOfNotes: noOfNotes
                })
            } else {
                db.ref('Users/'+uid).update({
                    email: email,
                    NoOfNotes: 0
                })
            }
        })
        const myTimeout = setTimeout(()=>{
        	location.href = '../MainPage/main.html'
        }, 2000);
    } else if(!firebaseUser) {
    	console.log('please sign in')
    }
})
$('#signup').click((e) => {
    let email = $('#email').val()
	let password = $('#password').val()
    const auth = firebase.auth()
    const promise = auth.createUserWithEmailAndPassword(email, password)
    promise.catch(e => {alert('Invalid Entry')})
})
$('#signin').click((e) => {
    let email = $('#email').val()
    let password = $('#password').val()
    const auth = firebase.auth()
    const promise = auth.signInWithEmailAndPassword(email, password)
    promise.catch(e => {alert('Invalid Entry')})
})