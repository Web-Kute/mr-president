import { medals } from './medals';
import { imgPresident, women } from './presidents';

/**
 * @description Game player
 * @param {string} pseudo
 * @param {number} score
 * @param {number} rank
 */
export function Game() {
	// Init Var
	this.cardNumber = 14;
	this.duration = 1000;

	this.fullName = null;
	this.lastName = null;

	this.points = 1000;
	this.clockId = null;

	this.pseudo = {
		score: `${this.points} points`,
		rank: 8,
		value: () => this.elements.pseudoInput.value
	}

	this.allScore = null;
	this.ranking = null;

	this.setScoreMinus = p => this.points = Math.max(0, this.points - p);
	this.setScorePlus = p => this.points = Math.min(1000, this.points + p);

	this.hide = elem => elem.classList.add('hide');
	this.show = elem => elem.classList.remove('hide');

	// Shuffle photos & cards
	this.shuffledCards = shuffle(medals);
	this.shufflePresident = shuffle(imgPresident);
	this.tipsPresident = Object.keys(this.shufflePresident[0].indice);
	this.tipsLen = this.tipsPresident.length;

	this.registerElements();
	this.elements.pseudoInput.focus();
	this.shufflePhotos(0);
}

Game.prototype.registerElements = function () {
	this.elements = {
		// Pseudo
		pseudoInput: document.getElementById('pseudo'),
		// Declare variables buttons
		btnStart: document.querySelector('.start'),
		btnStartAgain: document.getElementById('start-again'),
		btnReset: document.querySelector('.reset'),
		btnSeeTip: document.getElementById('seetip'),
		scoreDisplay: document.querySelector('.score'),
		clock: document.querySelector('.timer'),
		btnCloseRules: document.querySelector('.btn-close-rules'),
		btnCloseGreets: document.querySelector('.btn-close-greets'),
		rules: document.querySelector('.rules'),
		btnSeeMore: document.querySelector('.more'),
		// Display variables pic's president + tips
		containerCenter: document.getElementById('center'),
		contentCenter: document.querySelector('.center-content'),
		indices: document.getElementById('indices'),
		rewards: document.querySelector('.rewards'),
		rankDisplay: document.getElementById('rank'),
		// Declare variables Title President's names
		title: document.querySelector('.title_president'),
		titleName: document.querySelector('.title_president-name'),
		titleMandat: document.querySelector('.title_president-mandat'),
		tipsArray: {},
		// Form Lucky
		lucky: document.querySelector('.leftside_btn-tips'),
		luckyInput: document.querySelector('#lucky'),
		luckySubmit: document.getElementById('lucky-submit'),
		luckyForm: document.getElementById('lucky-form'),
		luckyError: document.getElementById('error'),
		luckyGreets: document.getElementById('greets'),
		nbrClick: document.querySelector('.nclick'),
		// Declare variables for images
		containerCards: document.querySelector('.cards__container'),
		card: document.getElementsByClassName('card'),
		cardImage: document.getElementsByClassName('card_img')
	}
}

Game.prototype.events = function () {
	this.elements.btnStart.addEventListener('click', this.startGame.bind(this));
	this.elements.btnStartAgain.addEventListener('click', this.startAgain.bind(this));
	this.elements.btnReset.addEventListener('click', this.resetGame.bind(this));
	this.elements.luckySubmit.addEventListener('click', this.luckyGuess.bind(this));
	this.elements.luckyInput.addEventListener('click', this.emptyInput.bind(this));
	this.elements.btnSeeTip.addEventListener('click', this.indicesReveal.bind(this));
	// Open new tab to Elysée website
	this.elements.btnSeeMore.addEventListener('click', () => window.open(this.locationUrl, '_blank'));
}

Game.prototype.emptyInput = function (e, w) {
	w = Math.floor(Math.random() * women.length);
	if (e.target && this.elements.luckyInput.value !== "") {
		this.elements.luckyInput.setAttribute('placeholder', shuffle(women)[w]);
		this.elements.luckyInput.value = "";
		this.elements.luckyError.setAttribute('hidden', '');
	}
}

Game.prototype.lostGame = function () {
	this.resetWin();
	// this.elements.containerCards.innerHTML = "";
	this.elements.containerCenter.removeChild(this.elements.containerCards);
	this.hide(this.elements.containerCards);
	this.elements.containerCards.remove();
	this.elements.nbrClick.previousElementSibling.innerHTML = "";
	this.elements.nbrClick.innerHTML = `<span class='greet-name'> ${this.pseudo.value()} </span> vous avez perdu !<div> ${this.fullName} </div> est élu.`;
}

Game.prototype.displayChrono = function () {
	this.elements.clock.innerHTML = `${this.minutes}m ${this.seconds}s`;
}

Game.prototype.timerGame = function () {
	this.startChrono = Date.now();
	this.totalTime = 2 * 60 * 1000;

	this.clockId = setInterval(() => {
		let elapsedTime = this.totalTime - (Date.now() - this.startChrono);

		this.minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
		this.seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

		this.displayChrono();

		if (this.minutes === 0 && this.seconds === 0) {
			clearInterval(this.clockId);
			this.lostGame();
		}

		this.scoreTotal();
	}, this.duration);
}

Game.prototype.resetTimer = function () {
	this.points = 1000;
	this.minutes = 2;
	this.seconds = 0;
	clearInterval(this.clockId);
	this.elements.scoreDisplay.innerHTML = `${this.points} points`;
	this.displayChrono();
}

/**
 * @param {number} n
 * @description Random President's pics
 */
Game.prototype.shufflePhotos = function (n) {
	this.president = this.shufflePresident[n];
	this.fullName = this.president.name.toLowerCase();
	this.lastName = this.president.lastName.toLowerCase();
	const stylesPres = {
		backgroundImage: `url(${this.president.src})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat"
	}
	Object.assign(this.elements.containerCenter.style, stylesPres);
	// Display title
	this.elements.titleName.innerHTML = this.fullName;
	this.elements.titleMandat.innerHTML = this.president.mandat;
	// Display indice
	this.elements.tipsArray = Object.values(this.president.indice);
	// URL to Elysée website
	this.locationUrl = this.president.url;
}

/**
 * @param {number} n
 */
Game.prototype.initParams = function (n) {
	this.t = 0;
	this.points = 1000;
	n = Math.floor(Math.random() * imgPresident.length);
	this.shufflePhotos(n);
}

Game.prototype.init = function (n) {
	let cardsContainer = document.createElement('div');
	cardsContainer.classList.add('cards__container');
	this.elements.containerCenter.appendChild(this.elements.containerCards);
	this.hide(this.elements.contentCenter);
	this.pseudo.value();
	this.initParams();
	this.timerGame();
	this.show(this.elements.containerCards);
	this.displayCards();
	this.clickCard();
	this.indices();
	this.indicesArray = Array.from(this.tipsPresident);
	this.hide(this.elements.title);
	this.show(this.elements.btnSeeTip);
	this.elements.btnSeeTip.classList.remove('trans');
}

Game.prototype.setHighscore = function (score) {
	let highscore = this.getHighscore();
	let pointsValue = [];
	let maxi = [0];
	let mini;
	this.allScore = highscore.map((i) => {
		this.ranking = {
			pseudo: i.pseudo,
			points: i.points
		}
		let sortable = [];
		for (let player in this.ranking) {
			if (this.ranking.hasOwnProperty(player)) {
				sortable.push([this.ranking[player]]);
			}
		}
		let rank = Array.from(sortable);
		return `<div>${rank.join(' : ')} points</div>`;
	})
	highscore.length <= 4 ? highscore.push(score) : null;
	localStorage.setItem('highscore', JSON.stringify(highscore));
}
Game.prototype.getHighscore = function () {
	let highscore;
	try {
		highscore = JSON.parse(localStorage.getItem('highscore'));
		if (!Array.isArray(highscore)) {
			highscore = [];
		}
	}
	catch (e) {
		highscore = [];
	}

	return highscore;
}

/**
 * @param {number} n
 * @param {number} w
 * @description Start Game on click "Commencer"
 */
Game.prototype.startGame = function (n, w) {
	w = Math.floor(Math.random() * women.length);
	this.init();
	this.enableBtn();
	this.elements.luckyInput.setAttribute('placeholder', shuffle(women)[w]);
	this.elements.rules.classList.add('close');
	this.elements.luckyInput.disabled = false;
	this.elements.btnStart.classList.add('trans');
}

/**
 * @param {number} n
 * @description When click on "Recommencer"
 */
Game.prototype.startAgain = function (n) {
	// Empty container before init
	this.elements.indices.innerHTML = "";
	this.elements.luckyInput.disabled = false;
	this.resetBtn();
	this.init();
	shuffle(medals);
}

// Display deck cards
Game.prototype.displayCards = function () {
	const cardHtml = this.shuffledCards.map((i) => `<div class="card"><img src="${i.url}" data-id="${i.id}" alt="${i.title}" class="card_img"></div>`).join('');
	this.elements.containerCards.innerHTML += cardHtml;
}

// When user play again
Game.prototype.resetBtn = function () {
	this.hide(this.elements.btnStartAgain);
	this.hide(this.elements.btnSeeMore);
	this.hide(this.elements.title)
	this.show(this.elements.luckySubmit)
	this.show(this.elements.btnSeeTip);
	this.elements.luckyError.setAttribute('hidden', '');
	this.elements.luckyGreets.setAttribute('hidden', '');
	this.elements.rankDisplay.setAttribute('hidden', '');
	this.elements.luckyInput.value = "";
	this.elements.luckyInput.focus();
	this.elements.containerCards.innerHTML = "";
	shuffle(medals);
}

// Reset game on click "Annuler"
Game.prototype.resetGame = function (n) {
	this.initParams();
	this.resetTimer();
	this.elements.indices.innerHTML = "";
	this.resetBtn();
	this.hide(this.elements.btnReset);
	this.hide(this.elements.btnSeeTip);
	this.hide(this.elements.lucky);
	this.show(this.elements.title);
	this.elements.btnStart.classList.remove('trans');
	this.elements.rewards.innerHTML = "";
	this.pseudo.disabled = false;
	this.elements.pseudoInput.value = "";
	this.elements.pseudoInput.focus();
}

// Enable Buttons
Game.prototype.enableBtn = function () {
	this.show(this.elements.btnReset);
	this.show(this.elements.luckySubmit);
	this.show(this.elements.lucky);
	this.show(this.elements.btnSeeTip);
	this.elements.luckyInput.value = "";
	this.elements.luckyInput.focus();
}

// Display Indices
Game.prototype.indices = function () {
	const tipsHtml = this.tipsPresident.map((i) => `<div class="${i} indice hide"></div>`).join('');
	this.elements.indices.innerHTML += tipsHtml;
}

Game.prototype.indicesReveal = function () {
	const displayTips = document.querySelector(`.${this.indicesArray[0]}`);
	this.show(displayTips);
	displayTips.innerHTML = this.elements.tipsArray[this.t];
	this.indicesArray.splice(0, 1);
	this.t++;
	this.indicesArray.length === 0 ? this.elements.btnSeeTip.classList.add('trans') : null;
	this.setScoreMinus(100);
}

// Manage displaying Cards
Game.prototype.clickCard = function () {
	// Make a shallow copy of cardImage to add classes back
	let cards = [...this.elements.cardImage],
		flippedCards,
		firstCard,
		secondCard;
	this.numberOfClick = 0;
	this.countEven = 0;
	cards.forEach((mask) => {
		mask.addEventListener('click', () => {
			const displayRewards = mask.getAttribute("alt");
			this.numberOfClick++;
			mask.classList.add('back');
			flippedCards = cards.filter(card => card.classList.contains('back'));
			firstCard = flippedCards[0];
			secondCard = flippedCards[1];
			// Display rewards name in left sidebar
			this.elements.rewards.innerHTML = displayRewards;
			if (secondCard) {
				this.elements.rewards.innerHTML = "";
			}
			// If medals matched
			if (flippedCards.length === 2) {
				if (firstCard.dataset.id === secondCard.dataset.id) {
					this.countEven++;
					this.setScorePlus(20);
					setTimeout(() => {
						firstCard.parentNode.classList.add('matched');
						secondCard.parentNode.classList.add('matched');
					}, this.duration);

					setTimeout(() => {
						firstCard.classList.remove('back');
						secondCard.classList.remove('back');
					}, this.duration);
					// If all cards are flipped
					if (this.countEven === (this.cardNumber / 2)) {
						this.elements.containerCenter.removeChild(this.elements.containerCards);
						this.resetWin();
					}
				}
				// If medals unmatched
				else {
					this.setScoreMinus(50);
					setTimeout(() => {
						firstCard.classList.remove('back');
						secondCard.classList.remove('back');
					}, this.duration);
				}
				// Disabled cards container after 1 pair flipped
				this.stopEvent();
			}
		});
	});
};

Game.prototype.stopEvent = function () {
	this.elements.containerCards.classList.add('disabled');
	setTimeout(() => {
		this.elements.containerCards.classList.remove('disabled');
	}, this.duration);
}

// Reset Game when user won
Game.prototype.resetWin = function () {
	this.show(this.elements.title);
	this.show(this.elements.contentCenter);
	this.elements.luckyGreets.removeAttribute('hidden');
	this.elements.rankDisplay.removeAttribute('hidden');
	this.elements.luckyGreets.classList.remove('close');
	this.show(this.elements.btnStartAgain);
	this.show(this.elements.btnSeeMore);
	this.hide(this.elements.luckySubmit);
	this.hide(this.elements.btnSeeTip);
	this.elements.luckyInput.value = "";
	this.elements.luckyInput.disabled = true;
	this.elements.luckyError.setAttribute('hidden', '');
	this.elements.nbrClick.previousElementSibling.innerHTML = `Félicitations ${this.elements.pseudoInput.value}`;
	this.elements.nbrClick.innerHTML = `Vous avez élu<div> ${this.fullName} </div> avec ${this.numberOfClick} clicks`;
	this.elements.rewards.innerHTML = "";
	clearInterval(this.clockId);
	shuffle(medals);
	// Display text for Indices
	this.elements.tipsArray.map((text, i) => {
		const tip = document.querySelector(`.tip${i + 1}`);
		tip.classList.remove('hide');
		return tip.innerHTML = text;
	}).join('');

	var highscore = this.setHighscore({
		pseudo: this.pseudo.value(),
		points: this.points
	});
	if (this.ranking !== null) {
		this.elements.rankDisplay.innerHTML = `${this.allScore.join(' ')}`;
	} else {
		this.hide(this.elements.rankDisplay);
	}
}

// Check if input equal president's name
Game.prototype.luckyGuess = function (e) {
	e.preventDefault();
	const userGuess = (this.elements.luckyInput.value).toLowerCase();
	if (userGuess.includes(this.fullName) || userGuess.includes(this.lastName)) {
		this.resetWin();
		this.elements.luckyError.setAttribute('hidden', '');
		this.elements.containerCenter.removeChild(this.elements.containerCards);
	}
	else {
		this.elements.luckyError.removeAttribute('hidden');
		this.setScoreMinus(200);
	}
}

Game.prototype.scoreTotal = function () {
	this.setScoreMinus(1);
	this.total = `${this.points} points`;
	this.points === 0 ? this.lostGame() : null;
	this.elements.scoreDisplay.innerHTML = this.total;
};

let game = new Game();
