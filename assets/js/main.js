$(document).ready(function () {
	$('.toggle-menu').click(function () {
		$(this).toggleClass('active');
	});
	$('.menu-first li a').click(function () {
		$('.toggle-menu').removeClass('active');
	});

	// Cache selectors
	var lastId,
		topMenu = $(".menu-first"),
		// All list items
		menuItems = topMenu.find("a"),
		// Anchors corresponding to menu items
		scrollItems = menuItems.map(function () {

			if ($(this).hasClass('external')) {
				return;
			}

			var item = $($(this).attr("href"));
			if (item.length) {
				return item;
			}
		});

	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.click(function (e) {
		var href = $(this).attr("href"),
			offsetTop = href === "#" ? 0 : $(href).offset().top - $("header").height() + 1;
		$('html, body').stop().animate({
			scrollTop: offsetTop
		}, 300);
		e.preventDefault();
	});

	// Bind to scroll
	$(window).scroll(function () {
		// Get container scroll position
		var fromTop = $(this).scrollTop() + $("header").height();

		// Get id of current scroll item
		var cur = scrollItems.map(function () {
			if ($(this).offset().top < fromTop)
				return this;
		});
		// Get the id of the current element
		cur = cur[cur.length - 1];
		var id = cur && cur.length ? cur[0].id : "";

		if (lastId !== id) {
			lastId = id;
			// Set/remove active class
			menuItems
				.parent().removeClass("active")
				.end().filter("[href=" + id + "]").parent().addClass("active");
		}
	});

	$.extend($.fn.dataTable.defaults, {
		responsive: true
	});
	$("#team table").DataTable({
		"searching": false,
		"lengthChange": false,
		"responsive": true,
		"paging": false,
		"info": false,
		"order": []
	});
	memberTable = $("#members table").DataTable({
		processing: true,
		"ajax": {
			"url": "/directory.json?" + (new Date()).toISOString().split(":")[0],
			"dataSrc": "members"
		},
		"columns": [{
			"data": "ID"
		}, {
			"data": "Name"
		}, {
			"data": "Batch",
			"width": "6em"
		}, {
			"data": "Location"
		}],
		pageLength: 20,
		searching: false,
		lengthChange: false,
		responsive: true,
		deferRender: true
	}).on('init', function () {
		var tempData = memberTable.rows()[0].slice(-10);
		tempData.sort(function () {
			return 0.5 - Math.random()
		});
		$(tempData).each(function (h, id) {
			var user = memberTable.row(id).data();
			$("#news .latest_members ul").append("<li>" + user.Name + " - ICSE " + user.Batch + "</li>");
		})
	})
	$("#gallery>div").nanoGallery({
		thumbnailWidth: 'auto',
		thumbnailHeight: 250,
		userID: '116255173276367308235',
		kind: 'picasa',
		colorScheme: 'none',
		thumbnailHoverEffect: [{
			name: 'labelAppear75',
			duration: 300
		}],
		theme: 'light',
		thumbnailGutterWidth: 0,
		thumbnailGutterHeight: 0,
		i18n: {
			thumbnailImageDescription: 'View Photo',
			thumbnailAlbumDescription: 'Open Album'
		},
		thumbnailLabel: {
			display: true,
			position: 'overImageOnMiddle',
			align: 'center'
		}
	});
	window.fbAsyncInit = function () {
		FB.init({
			appId: '1505942642993852',
			xfbml: true,
			version: 'v2.6'
		});
	};

	(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
});
$(window).on('load resize', function () {
	$("#news .fb-page.feed iframe").attr("src", function () {
		return "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffidelianalumni%2F&tabs=timeline&width=" + parseInt($("#news .fb-page").width()) + "&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId=1505942642993852"
	});
	$("#news .fb-page.message iframe").attr("src", function () {
		return $("#news .fb-page.message iframe").attr("src").replace(/width=[0-9]+/, "width=" + parseInt($("#news .fb-page:first").width()))
	});
	$("#news .fb-page.event iframe").attr("src", function () {
		return $("#news .fb-page.event iframe").attr("src").replace(/width=[0-9]+/, "width=" + parseInt($("#news .fb-page:first").width()))
	});
});
