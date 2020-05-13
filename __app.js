var App = {
	key: [5,6,3,2,9,7,1,8,4,9,8,4,1,6,3,2,5,7,7,1,2,5,4,8,9,6,3,1,4,6,7,2,9,8,3,5,2,3,7,6,8,5,4,1,9,8,5,9,3,1,4,7,2,6,3,9,1,4,5,2,6,7,8,6,7,8,9,3,1,5,4,2,4,2,5,8,7,6,3,9,1],
	input: [5,6,3,2,9,7,1,8,4,9,8,4,1,6,3,2,5,7,7,1,2,5,4,8,9,6,3,1,4,6,7,2,9,8,3,5,2,3,7,6,8,5,4,1,9,8,5,9,3,1,4,7,2,6,3,9,1,4,5,2,6,7,8,6,7,8,9,3,1,5,4,2,4,2,5,8,7,6,3,9,1],
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

	/*
	* Simulate
	*/
	var I = 0;
	while(I<30){
		var ind = Math.floor(Math.random() * 81);
		if(App.input[ind] != ''){
			App.input[ind] = '';
			I++;
		}
	}
	/*
	* end of
	*/

	$(document).ready(function() {
		setup();
	});

	$('#start').click(function(){
		recursive();
	});

	function setup(){
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
					.css('background-color', data[i] == '' ? 'red' : '')
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

	function recursive(){
		cleanPossible();
		$('#meter span').text(++App.activities);
		var entried = 0;

		App.possibleNumber.forEach(function(number){

			var possible = [];
			App.blank.forEach(function(i, index){
				if(isPossible(number, i)){
					possible.push(i);
				}
			});

			App.possible[number] = possible;

			possible.forEach(function(i, index){
				if(isFit(number, i, index)){
					App.blank.splice(App.blank.indexOf(i), 1);
					inject(number, i);
					App.possible[number].splice(App.possible[number].indexOf(i), 1);
					App.box.children().eq(i).text(number);

					entried++;
				}
			});
		});

		if(entried > 0){
			recursive();
		}

	}

	function cleanPossible(){
		App.possible = [];
		for(var i=0;i<9;i++){
			App.possible[i+1] = [];
		}
	}

	function clean(){
		cleanPossible();

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

	function isPossible(number, index){
		var x1 = Math.floor(index/9);
		var y1 = index%9;
		var z1 = ((Math.floor(x1/3)) * 3) + Math.floor(y1/3);

		return (App.data.horizontal[x1].includes(number) == false && App.data.vertical[y1].includes(number) == false && App.data.box[z1].includes(number) == false);
	}

	function isFit(number, index, current){
		var possible = clone(App.possible[number]);
		possible.splice(current, 1);

		var x1 = Math.floor(index/9);
		var y1 = index%9;
		var z1 = ((Math.floor(x1/3)) * 3) + Math.floor(y1/3);

		var possibleX = [];
		var possibleY = [];
		var possibleZ = [];

		for(var i=0;i<possible.length;i++){
			var x2 = Math.floor(index/9);
			var y2 = index%9;
			var z2 = ((Math.floor(x2/3)) * 3) + Math.floor(y2/3);

			if(x2==x1) possibleX.push(possible[i]);
			if(y2==y1) possibleY.push(possible[i]);
			if(z2==z1) possibleZ.push(possible[i]);
		}

		if(possibleZ.length > 0){
			return false
		}
		else{
			return true;
		}
	}

}(jQuery));