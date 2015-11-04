var apiURL = 'http://webopsapi.esri.com/Applications/UCVoting/CastVote';
$(document).ready(function(e) {
	chooseLogo();
	ucVotingSlider();
	changeLogoSelection();
});

function handleSuccess(results) {
		if(!results.success) {
			$('#form-content').fadeOut();
			$('#error-display').fadeIn();
			$('#form-header #title h2').html(results.errorMessage);
		}else{
			window.location.hash = 'ref=' + results.data.voteId;
			$('#form-content').fadeOut();
			$('#vote-confirmation').fadeIn();
			$('#form-header #title h2').html("Thanks for the vote, spread the word.");
			var voteCounts = results.data.voteCount;
			var totals = voteCounts.map(function (voteCount) {
											return parseInt(voteCount.votes);
									});
			var max = getMaxOfArray(totals);
			$.each(voteCounts, function(i, obj) {
				$('#bar' + (obj.logoName) + ' > p').html(obj.votes);
				$('#bar' + (obj.logoName)).css({'height': ((parseInt(obj.votes) / max) * 100) + "px"});
			});
		}
}

function handleError(xhr, status, error) {
	$('#form-content').fadeOut();
	$('#error-display').fadeIn();
	$('#form-header #title h2').html("There was an error processing your vote");
}

function submitForm(payload) {
	$.ajax({
		url:apiURL,
		method:"GET",
		dataType:"jsonp",
		data:{payload:JSON.stringify(payload)},
		success:handleSuccess,
		error:handleError
	});
}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function chooseLogo() {
	var user = 	{};
	try{
		user = eval('('+$COOKIE('esri_auth')+')');
		if(user){
			$('#fname').val(user.firstName);
	  	$('#lname').val(user.lastName);
		}
	}catch(e){
		
	}
	$('.gray-bar').click(function() {
		resetSelected();
		$(this).find('.check').addClass('selected');
		$(this).addClass('add-blue-bg');
		$(this).find('.choose').addClass('add-white-txt');
	});
}

function resetSelected() {
	$('.check').removeClass('selected');
	$('.gray-bar').removeClass('add-blue-bg');
	$('.choose').removeClass('add-white-txt');
}

function changeLogoSelection() {
	$('#logo-selected').next('a').click(function() {
		removeLightbox();
	});
}

function userSelection(selection) {
//		VotingAPI.castVote(selection).then(function(response) {
//			showSuccess(selection, response);
//		}).fail(showFail);
}

function showSuccess(selection, response) {
	$('#logo-selected')
		.removeClass()
		.addClass('logo-selected-' + selection)
		.data('selected', selection);
}

function showFail(response) {
	$('<div class="voting-error">'+response+'</div>').appendTo('body');
}

function ucVotingSlider() {
	$('.slide-btn').click(function() {
		var dir = $(this).hasClass('prev-slide') ? "left" : "right";
		var logo = $(this).siblings('.logo');	
		advanceSlider(dir, logo);
	});
	$('.logo').click(function() {
		if($(this).siblings('.slide-btn').css('display') === 'none'){
			advanceSlider("right", this);
		}
	});
}

function advanceSlider(dir, logo) {
		var curIndex = parseInt($(logo).data('logo'));
		if(dir == "left") {
			curIndex--;
			curIndex = curIndex == 0 ? 4 : curIndex;
		}else{
			curIndex++;
			curIndex = curIndex == 5 ? 1 : curIndex;
		}
		$(logo).removeClass(function(i, css) {
			return (css.match(/(^|\s)img\S+/g) || []).join(" ");
		});
		$(logo).addClass('img' + curIndex).data('logo', curIndex);
}
