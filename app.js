var App = {
	input: [],
	data: {
		urutan: [],
		box: [],
		horizontal: [],
		vertical: []
	},
	box: $('#app .box'),
	blank: [],
	possible: [],
	activities: 0,
	solved: 0
};

(function($){

	'use strict';

	$(document).ready(function() {

	});

	$('#setup').click(function(){
		setup();
	});

	$('#recursive').click(function(){
		console.log('me');
		recursive();
	});

	$('#backtracking').click(function(){
		backtracking();
	});

	function setup(){
		var s = $('#input').val();
		for(i=0;i<9;i++){
			s = s.replace("\n", "");
		}
		App.input = s.split('').map(function(item){
			return item == " " ? "" : parseInt(item, 10);
		});
		clean();

		if(App.input.length == 81){
			var data = clone(App.input);

			for(var i=0;i<81;i++){

				if(data[i] == ''){
					App.blank.push(i);
				}

				$('<div></div>')
					.addClass('bottom')
					.addClass('right')
					.addClass((i%27 < 9) ? 'top' : '')
					.addClass((i%9==0) ? 'left' : '')
					.addClass((i%3==0) ? 'left' : '')
					.text(data[i])
					.appendTo(App.box);

				/* Horizontal */
				var x = Math.floor(i/9);

				/* Vertical */
				var y = i%9;

				/* 9*9 */
				var z = ((Math.floor(x/3)) * 3) + Math.floor(y/3);
				
				App.data.horizontal[x].push(data[i]);
				App.data.vertical[y].push(data[i]);
				App.data.box[z].push(data[i]);
				App.data.urutan.push(data[i]);
			}
		}
		else{
			console.error('Input tidak valid');
		}
	}

	async function recursive(){
		$('#meter span').text(++App.activities);

		App.possible = [];
		var total = App.blank.length;
		var entried = 0;

		for(var i=0;i<total;i++){
			var possible = [];

			App.possibleNumber.forEach(function(el){
				if(isPossible(el, App.blank[i])){
					possible.push(el);
				}
			});

			App.possible[App.blank[i]] = possible;
		}

		if(App.possible.length > 0){
			App.possible.forEach(function(el, i){
				if(el.length == 1){
					var number = el.shift();
					var indexBlank = App.blank.indexOf(i);

					if(indexBlank >= 0) App.blank.splice(indexBlank, 1);

					App.box.children().eq(i).text(number);
					inject(number, i);

					entried++;
					App.solved++;
				}
			});

			if(entried > 0){
				await sleep(50);
				await recursive();
			}
		}
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function backtracking(){
		$('#meter span').text(++App.activities);
		if(App.blank.length == 0){
			return true;
		}

		var index = App.blank.shift();

		for(var i=0; i<App.possibleNumber.length; i++){
			var number = App.possibleNumber[i];

			if(isPossible(number, index)){
				inject(number, index);
				App.box.children().eq(index).text(number);
				await sleep(10);

				if(await backtracking()){
					return true;
				}

				uninject(index);
				App.box.children().eq(index).text('');
				await sleep(10);
			}
		};

		App.blank.unshift(index);
		return false;
	}

	function clean(){
		App.box.empty();

		App.data.box = [];
		App.data.horizontal = [];
		App.data.vertical = [];
		App.data.urutan = [];
		App.possibleNumber = [];
		App.blank = [];

		for(var i=0;i<9;i++){
			App.data.box.push([]);
			App.data.horizontal.push([]);
			App.data.vertical.push([]);
			App.possibleNumber.push(i+1);
		}

		return true;
	}

	function clone(data){
		if(Array.isArray(data)){
			return Object.assign([], data);
		}
		else{
			console.error('Argumen bukan merupakan array');
			return false;
		}
	}

	function inject(number, index){
		/* Horizontal */
		var x = Math.floor(index/9);
		/* Vertical */
		var y = index%9;
		/* 9*9 */
		var z = ((Math.floor(x/3)) * 3) + Math.floor(y/3);
		var z1 = ((x%3)*3)+(y%3);

		App.data.urutan[index] = number;
		App.data.horizontal[x][y] = number;
		App.data.vertical[y][x] = number;
		App.data.box[z][z1] = number;
	}

	function uninject(index){
		/* Horizontal */
		var x = Math.floor(index/9);
		/* Vertical */
		var y = index%9;
		/* 9*9 */
		var z = ((Math.floor(x/3)) * 3) + Math.floor(y/3);
		var z1 = ((x%3)*3)+(y%3);

		App.data.urutan[index] = "";
		App.data.horizontal[x][y] = "";
		App.data.vertical[y][x] = "";
		App.data.box[z][z1] = "";
	}

	function isPossible(number, index){
		/* Horizontal */
		var x = Math.floor(index/9);
		/* Vertical */
		var y = index%9;
		/* 9*9 */
		var z = ((Math.floor(x/3)) * 3) + Math.floor(y/3);

		return (App.data.horizontal[x].includes(number) == false && App.data.vertical[y].includes(number) == false && App.data.box[z].includes(number) == false);
	}

}(jQuery));