// FONCTION ONGLETS

(function(){
	let displayTabs = function (a, animations){
		if(animations === undefined){
			animations = true
		}
		let li = a.parentNode
		let div = a.parentNode.parentNode.parentNode
		let activeTab = div.querySelector('.tabs-content .active')
		let toDisplay = div.querySelector(a.getAttribute('href'))

		if(li.classList.contains('active')){
			return false
		}
		div.querySelector('.tabs .active').classList.remove('active')
		li.classList.add('active')
		
		if(animations){
			activeTab.classList.add('fade')
			activeTab.classList.remove('in')
			let transitionend = function(){
				this.classList.remove('fade')
				this.classList.remove('active')
				toDisplay.classList.add('active')
				toDisplay.classList.add('fade')
				toDisplay.offsetWidth
				toDisplay.classList.add('in')
				activeTab.removeEventListener('transitionend',transitionend)
				activeTab.removeEventListener('webkitTransitionEnd',transitionend)
				activeTab.removeEventListener('oTransitionEnd',transitionend)
			}
			activeTab.addEventListener('transitionend',transitionend)
			activeTab.addEventListener('webkitTransitionEnd',transitionend)
			activeTab.addEventListener('oTransitionEnd',transitionend)
		}else{
			toDisplay.classList.add('active')
			activeTab.classList.remove('active')
		}
	}

	let tabs = document.querySelectorAll('.tabs a')
	for(let i =0; i < tabs.length; i++){
		tabs[i].addEventListener('click', function(e){
			displayTabs(this)
		})
	}

	let hashChange = function(e){
		let hash = window.location.hash
		let a = document.querySelector('a[href="' + hash + '"]')
		if (a !== null && !a.parentNode.classList.contains('active')){
			displayTabs(a, e !== undefined)
		}
	}
	window.addEventListener('hashchange', hashChange)
	hashChange()
	
})()


// LES VARIABLES ///////////////////////////////////////////////////////////////////////////////////////////

let tabContent = document.querySelector('.tab-content')
let accueil = document.getElementById('accueil')
let ficheContain = document.getElementById('product')
let panierContain = document.getElementById('panier')
let orderContain = document.getElementById('order-contain')
let orderC = document.getElementById('orderC')
orderC.classList.add('left')
let liens = []

let fiche = undefined
let config = document.createElement('select')

let image
let title
let prix = 'Prix :'
let euros = '€'
let price
let priceTitle
let priceNumber
let priceMonnaie
let description
let sommeTotal = 0
let total = document.createElement('p')
let addTotal
let panier
let options
let response
let responses
let select 
let label

let ficheDescription

let form = document.getElementById('my-form')
form.classList.add('hidden')

let ficheNone = document.querySelector('.fiche-none')
let panierNone = document.querySelector('.panier-none')

let containButtonFiche = document.querySelector('.contain-button-fiche')
containButtonFiche.classList.replace('contain-button-fiche','hidden')
let homeReturn = document.querySelector('.home-return')
let validButtonFiche = document.querySelector('.valid-button-fiche')


let containButtonPanier = document.querySelector('.contain-button-panier')
containButtonPanier.classList.replace('contain-button-panier','hidden')
let shopContinue = document.querySelector('.shop-continue')
let resetPanierB = document.querySelector('.reset-panier')
let validButtonPanier = document.querySelector('.valid-button-panier')
let errorAlert = document.createElement('p')

let products = []

// FONCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////


// fonction de requète GET globale 
function get(url){
	return new Promise(function(resolve, reject){
		let xhr = new window.XMLHttpRequest()

		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				if(xhr.status === 200){
					resolve(xhr.responseText)
				}else{
					reject(xhr)
				}
			}
		}
		xhr.open('get', url, true)
		xhr.send()
	})
}

// Fonction GET (appareil Photo) création JS de la page d'acceuil 
// TEST : responses == JSON (lenses, _id, name, price,
// description, imageUrl)
get("http://localhost:3000/api/cameras").then(function(response){
	 responses = JSON.parse(response)
	createHomePage()
	createFichePage()   
})

// Pour toutes les réponses de la requète création d'un article
// TEST : for reponses[i] création d'un article contenant 
// ( name, price, imageUrl + lenses description et _id en "hidden")
function createHomePage(){
	for (let i = 0 ; i < responses.length; i++) {
		response = responses[i]
		
		lien = document.createElement('a')
		tabContent.appendChild(lien)
		lien.classList.add('article')
		lien.href = '#product'

		id = document.createElement('p')
		id.innerHTML = responses[i]._id
		id.classList.add('hidden')
		lien.appendChild(id)

		image = new Image(225, 150) 
		image.src = responses[i].imageUrl
		lien.appendChild(image)

		title = document.createElement('h2')
		title.innerHTML ='Modèle : ' + responses[i].name
		lien.appendChild(title)
		
		price = document.createElement('div')
		price.classList.add('price')
		priceTitle = document.createElement('p')
		priceNumber = document.createElement('p')
		priceNumber.classList.add('priceNumber')
		priceMonnaie = document.createElement('p')
		priceNumber.textContent = (responses[i].price/100).toFixed(2)
		priceTitle.innerHTML = prix
		priceMonnaie.innerHTML = euros
		lien.appendChild(price)
		price.appendChild(priceTitle)
		price.appendChild(priceNumber)
		price.appendChild(priceMonnaie)
			
		description = document.createElement('p')  
		description.innerHTML = 'Description : ' + responses[i].description
		description.classList.add('hidden')
		lien.appendChild(description)

		select = document.createElement('select')
		select.textContent ='Configuration : '
		select.setAttribute('type', 'select')
		select.setAttribute('id', 'config-select')
		select.classList.add('hidden')
		lien.appendChild(select)
		
		options = responses[i].lenses
		for (let i2 = 0; i2 < options.length; i2++) {
			let option = document.createElement('option')
			option.setAttribute("value", "value")
			option.innerHTML = options[i2]
			select.appendChild(option)
		}
    }
}


// Pour tout les articles, au click, création d'une nouvelle page description de l'article 
// TEST : for articles[i] au click création d'une nouvelle page
// (avec lenses et description sans "hidden") 
function createFichePage(){
	liens = document.querySelectorAll('.article')
    for (let i = 0; i < liens.length; i++) {
    	liens[i].addEventListener('click', function(){
    		ficheNone.classList.add('hidden')
    		if(fiche === undefined){
    			fiche = document.createElement('div')
	    		fiche.classList.add('fiche')
	    		ficheContain.insertBefore(fiche, containButtonFiche)
	    		fiche.innerHTML = event.currentTarget.innerHTML
    		}else{
	    		fiche.innerHTML = event.currentTarget.innerHTML
    		}

    		ficheDescription = document.createElement('p')
    		ficheDescription.innerHTML = event.currentTarget.childNodes[4].innerHTML
    		fiche.appendChild(ficheDescription)

    		label = document.createElement('label')
			label.setAttribute('for', 'config-select')
			label.textContent ='Configurez votre appareil :'
			fiche.appendChild(label)

    		config.innerHTML = event.currentTarget.lastChild.innerHTML
    		fiche.appendChild(config)
    		config.setAttribute('required','')

    		containButtonFiche.classList.replace('hidden','containButtonFiche')
    		window.scrollBy({
			  top: 1000,
			  behavior: 'smooth'
			})
    	})
    }
}


// Function globale de mise a zero de la page description ( ex: retour accueil)
// TEST : click de (accueil ou retour accueil) == fiche = undefined
function resetFicheContain(){
	if(fiche !== undefined){
		fiche.innerHTML = ''
		ficheContain.removeChild(fiche)
		fiche = undefined
		containButtonFiche.classList.replace('containButtonFiche', 'hidden')
		ficheNone.classList.remove('hidden')
	}if(form.classList.length === 2){
		form.classList.remove('in')
		form.classList.replace('fade', 'hidden')
	}
}


// Function 'Ajouter au panier' créer un apercu dans le panier 
// TEST : click d'(ajouter au panier) == new apercu panier 
// TEST : Total commande == somme des articles selectionnés
function validationFiche(){
	panierNone.classList.add('hidden')

	panier = document.createElement('div')
	panier.classList.add('panier')
	panier.innerHTML = fiche.innerHTML
	panier.removeChild(panier.children[8])
	panier.removeChild(panier.children[7])
	panier.removeChild(panier.children[6])
	panierContain.insertBefore(panier, containButtonPanier)

	products.push(panier.firstChild.innerHTML)
	
	localStorage.setItem('MonPanier', products)
	
	addTotal = document.querySelectorAll('.panier .priceNumber')
	sommeTotal = 0
	for (let i = 0; i < addTotal.length; i++) {
		sommeTotal += Number(addTotal[i].innerHTML)
	}
	total.innerHTML = 'Total de la commande : ' + sommeTotal.toFixed(2) + ' €'

	panierContain.insertBefore(total, containButtonPanier)
	containButtonPanier.classList.replace('hidden', 'containButtonPanier')
}


// Supprime les éléments du panier 
// TEST : click de (vider panier ou envoyer form) == panier = undefined
function resetPanier(){
	let paniers = document.querySelectorAll('.panier')
	for (let i = 0; i < paniers.length; i++) {
		panierContain.removeChild(paniers[i])
	}

	form.classList.remove('in')
	form.classList.replace('fade', 'hidden')
	containButtonPanier.classList.replace('containButtonPanier','hidden')
	panierContain.removeChild(total)
	panierNone.classList.remove('hidden')
}


// Renvois vers la page d'accueil tout en concervant le panier 
// TEST 
function shopContinueButton(){
	if (form.classList.length === 2){
		form.classList.remove('in')
		form.classList.replace('fade', 'hidden')
	}
}


// Fais apparaitre le formulaire de Commande 
// TEST : click de (valider commande) == Apparition du Formulaire
function validationPanier(){
	event.preventDefault()
	form.classList.replace('hidden', 'fade')
	form.classList.add('in')
	window.scrollBy({
	  top: 1000,
	  behavior: 'smooth'
	})
}

// Requète POST d'envoi du formulaire et des ID du panier 
// retourne un Numéro de Commande 
// Créer une page de confirmation de commande
// TEST : contact == formulaire valid 
// TEST : products == tableau des ID selectionnés 
// TEST : Envoie du Form == contact + products
// TEST : si requete OK == Récap commande = orderId ( renvoyé par le serveur)
function sendData(){

	let req = new XMLHttpRequest()
	let contact = new Object()
	contact.firstName = form.firstName.value
	contact.lastName = form.lastName.value
	contact.address = form.address.value
	contact.city = form.city.value
	contact.email = form.email.value 
	
	req.open("POST", "http://localhost:3000/api/cameras/order")
	req.setRequestHeader("Content-Type", "application/json")
	req.send(JSON.stringify({contact, products}))

	req.onreadystatechange = function(){
		if (this.readyState == XMLHttpRequest.DONE && this.status == 201){

		let responseOrder = JSON.parse(req.responseText)
		let order = document.createElement('div')
		order.classList.add('order')
		orderContain.appendChild(order)
		let p = document.createElement('p')
		p.innerHTML = 'ORINOCO vous remercie pour votre commande !'
		order.appendChild(p) 
		let totalOrder = document.createElement('p')
		totalOrder.innerHTML = 'Total de la commande : ' + sommeTotal.toFixed(2) + ' €'
		order.appendChild(totalOrder)
		let orderId = document.createElement('p')
		orderId.innerHTML = 'Numéro de commande : ' + responseOrder.orderId
		order.appendChild(orderId)
		}
	}
}

// LES ÉVÉNEMENTS /////////////////////////////////////////////////////////

// Onglet Accueil
accueil.addEventListener('click', resetFicheContain)
// Bouton Retour accueil (dans la page produit)
homeReturn.addEventListener('click', resetFicheContain)
// Bouton Ajouter au panier 
validButtonFiche.addEventListener('click', validationFiche)
// Bouton Continuer achats
shopContinue.addEventListener('click', shopContinueButton)
// Bouton Vider le panier 
resetPanierB.addEventListener('click', resetPanier)
// Bouton Valider le panier 
validButtonPanier.addEventListener('click', validationPanier)
	


let aForm = document.getElementById('aForm')
// Bouton Valider le Formulaire (envoi des données)
// TEST FONTIONNEL: verifier si LastName FirstName et city n'accepte que des lettres
// TEST FONTIONNEL: verifier si Address n'accepte que des chiffres et des lettres
// TEST FONTIONNEL: verifier si formatage Email et valide 
aForm.addEventListener('click', function (event) {
	let regexString = /^[a-zA-Z -]+$/
	let validFirstName = regexString.test(form.firstName.value)
	let validLastName = regexString.test(form.lastName.value)
	let validCity = regexString.test(form.city.value)
	
	
	let regexAlphaNumber = /^[A-Za-z0-9 ]+$/
	let validAddress = regexAlphaNumber.test(form.address.value)
	let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/
	let validEmail = regexEmail.test(form.email.value)

	errorAlert.innerHTML = ''

	if(validFirstName == true && validLastName == true && validCity == true && validAddress == true && validEmail == true){
		sendData()
		orderC.classList.remove('left')
		resetPanier()
	}else{
		event.preventDefault()
		form.appendChild(errorAlert)
		if (validFirstName == false) {
			let errorFirstName = document.createElement('span')
			errorFirstName.innerHTML = "Prénom incorrect </br>"
			errorAlert.appendChild(errorFirstName)
		}
		if (validLastName == false) {
			let errorLastName = document.createElement('span')
			errorLastName.innerHTML = "Nom incorrect </br>"
			errorAlert.appendChild(errorLastName)
		}
		if (validCity == false) {
			let errorCity = document.createElement('span')
			errorCity.innerHTML = "Ville incorrecte </br>"
			errorAlert.appendChild(errorCity)
		}
		if (validAddress == false) {
			let errorAddress = document.createElement('span')
			errorAddress.innerHTML = "Adresse incorrect </br>"
			errorAlert.appendChild(errorAddress)
		}
		if (validEmail == false) {
			let errorEmail = document.createElement('span')
			errorEmail.innerHTML = "Email non valide </br>"
			errorAlert.appendChild(errorEmail)
		}
		window.scrollBy({
		  top: 1000,
		  behavior: 'smooth'
		})
	}
})