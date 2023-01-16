/**
 * @params {String} a
 * @params {Node} b
*/

var $ = (a, b)=>{
	var p = b || document, c = (p.querySelector)? p.querySelector(a) : null, d = (p.querySelectorAll)? p.querySelectorAll(a) : null;
	if (d.length > 1) return d;
	else return c;
}
var time_current = 0, 				// timeInterval
	current = 0, 					// Initializes the current block of information.
	currentQuestion = 1, 			// Initializes and indicates the current question.
	time = 20, 						// Delimits the time (min) to finish answering each question.
	time_left = time, 				// time_left is the variable responsible for the decrement action, thus receiving the value of the time variable, updating all the function blocks.
	v_bar = 0, 						// Initializes the total value in percentage of the action bar.
	r_bar = 0, 						// Initializes the percentage value of each bar action.
	errors = 0,						// Initializes the number of questions that were incorrect.
	success = 0;					// Initializes the number of questions that were answered correctly.

function barAction(){
	r_bar = (((outerWidth/questions.length)*100)/outerWidth); 	
	v_bar += r_bar; 						
	if (v_bar >= 100){
		v_bar = 100;
	}
	$(".bar-action").style.width = v_bar+"%";
	$(".bar-action").style.transition = "all ease 0.2s"
}
function start(){
	var a = $(".info-box");
	a[current].classList.remove("active");
	current++;
	a[current].classList.add("active");
	barAction();
	optionsList();
	answer();
	timeout();
}
function next(){
	currentQuestion++;
	time_left = time;
	for(var child of $(".option")){
		child.remove();
	}
	optionsList();
	barAction();
	if(currentQuestion > questions.length){
		var a = $(".info-box");
		a[current].classList.remove("active");
		current++;
		a[current].classList.add("active");
		calcFinal();
	}
	answer();
	timeout();
}
function timeout(){
	var a = $(".option");
	var n = document.getElementById("next");
	$(".time-out").innerHTML = time_left;
	if (time_left != 0) {
		n.style.display = "none";
	} 
	time_current = setInterval(function(){
		time_left--;
		if (time_left == 0) {
			clearInterval(time_current);
			n.style.display = "block";
			for(var i=0;i<a.length;i++){
				a[i].removeEventListener("click", r);
			}
			vl();
		}
		$(".time-out").innerHTML = time_left;
	}, 1000);
}
function exit(){
	current = 0;
	currentQuestion = 1;
	time_left = time;
	v_bar = 0; 
	r_bar = 0;
	errors = 0;
	success = 0;
	clearInterval(time_current);
	for(var i=0;i<$(".info-box").length;i++){
		$(".info-box")[i].classList.remove("active");
	}
	if ($(".option") != null) for(var child of $(".option")) child.remove();
	$(".info-box")[0].classList.add("active");
	$(".bar-action").style.width = "0%";
	$(".bar-action").style.transition = "none";
}
function answer(){
	var a = $(".option");
	if (a) for(var i=0;i<a.length;i++) a[i].addEventListener("click", r);
}
function r(){
	var a = $(".option"), d = this, e = d.getAttribute("data-quiz"), f = d.getAttribute("data-id"), n = document.getElementById("next");
	var v = questions.filter(function(o){
		return o.qt == e;
	});
	v.map(function(o){
		for(var i=0;i<o.options.length;i++){
			if (o.options[i].id == f) {
				if (o.options[i].r == true) {
					d.classList.add("success");	
					success += 1;
				}else{
					d.classList.add("error");
					vl();
				}
			}
		}
	});
	for(var k=0;k<a.length;k++){
		a[k].removeEventListener("click", r);
	}
	clearInterval(time_current);
	n.style.display = "block";
}
function vl(){
	var a = $(".option");
	for(var i=0;i<a.length;i++){
		var d = a[i].getAttribute("data-quiz");
		var e = a[i].getAttribute("data-id");
		var v = questions.filter(function(o){
			return o.qt == d;
		});
		v.map(function(o){
			for(var k=0;k<o.options.length;k++){
				if (o.options[k].id == e) {
					if (o.options[k].r == true) {
						a[k].classList.add("success");	
					}
				}
			}
		});
	}
	errors += 1;
}
function optionsList(){
	var v = questions.filter(function(o){
		return o.qt == currentQuestion;
	});
	v.map(function(o){	
		$(".question").innerHTML = o.title;
		for(var i=0;i<o.options.length;i++){
			var d = document.createElement("div");
			d.setAttribute("data-quiz", currentQuestion);
			d.setAttribute("data-id", o.options[i].id);
			d.setAttribute("class", "option");
			d.innerHTML = `<div class="n-id">${o.options[i].id}</div><div class="text-answer">"${o.options[i].q}"</div>`;
			$(".options").appendChild(d);
		}
	});
}
function calcFinal(){
	$(".total").innerHTML = questions.length;
	$(".right").innerHTML = success;
	$(".porcent-right").innerHTML = ((100*success)/questions.length).toFixed()+"%";
	$(".errors").innerHTML = errors;
	$(".porcent-errors").innerHTML = ((100*errors)/questions.length).toFixed()+"%";
}