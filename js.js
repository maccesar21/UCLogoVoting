$.post(apiURL, {payload:JSON.stringify(payload)}, function(results) {
		if(!results.success) {
			$('#form-content').fadeOut();
			$('#error-display').fadeIn();
			$('#form-header #title h2').html("Try again tomorrow");
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
	});