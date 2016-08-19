// page init
jQuery(function(){
	initCycleCarousel();
	initBackgroundResize();
	initCustomList();
	initHubspotForms();
	new Navigation();

	$(".social-stick").stick_in_parent({
		offset_top: 205
	});
    
    $('.secondary-articles li').matchHeight();
    $('.serv-box-text').matchHeight();
    
    // size column dividing line correctly on case study
    var dividerHeight = $('.case-main-text').height() -140;
    $('.text-divider').css({ height: dividerHeight });
    
    // case study 
    $('.toggle a').click(function(){
        $('.toggle a').removeClass('selected');
        $(this).addClass('selected');
        var togGroup = '#toggle-group-' + $(this).attr('togglegroup');
        if($(togGroup).is(":visible")) {
            //
        } else {
            $('#toggle-group-1, #toggle-group-2').hide();
            $(togGroup).show();
        }
        return false; 
    });

});

jQuery(window).load(function(){
	initCustomForms();
});

// cycle scroll gallery init
function initCycleCarousel() {
	jQuery('div.cycle-gallery').scrollAbsoluteGallery({
		mask: 'div.mask',
		slider: 'div.slideset',
		slides: 'div.slide',
		btnPrev: 'a.btn-prev',
		btnNext: 'a.btn-next',
		pagerLinks: '.pagination li',
		stretchSlideToMask: true,
		pauseOnHover: true,
		maskAutoSize: true,
		autoRotation: false,
		switchTime: 3000,
		animSpeed: 500
	});
}


// NAVIGATION
var Navigation = function() {
	// Distance in pixels before transition is completed.
	this.transitionDistance = 80;

	this.toggle = $('.nav-toggle');
	this.overlay = $('.nav-overlay');
	this.navbar = $('.page-header-topbar');
	this.isOpen = false;

	$(this.toggle).click(this.toggleNav.bind(this));
	$(this.overlay).click(this.toggleNav.bind(this));

	this.bindScroll();
	$(window).on('resize', this.bindScroll.bind(this));

	var self = this;
	$(document).keyup(function(e) {
		e.preventDefault();
		if (e.keyCode === 27 && self.isOpen) {
			self.toggleNav(e);
		}
		return false;
	});	
};

Navigation.prototype.toggleNav = function (event) {
	// Only link clicks will navigate away, others will close the overlay
	if ($(event.target).is('a')) {
		return;
	}

	event.preventDefault();

	var overlay = this.overlay;
	this.navbar.toggleClass('mod-hide-sheen');
	if (overlay.hasClass('is-visible')) {
		$('.nav-toggle').attr('aria-expanded', false);
		this.isOpen = false;
		overlay.removeClass('is-visible');
		setTimeout(function () {
		  	overlay.removeClass('is-on-screen');
		}, 300);
	} else {
	    $('.nav-toggle').attr('aria-expanded', true);
	    this.isOpen = true;
	    overlay.addClass('is-on-screen');
	    setTimeout(function () {
	      overlay.addClass('is-visible');
	    }, 0);
	}

	this.toggle.toggleClass('is-off is-on');
	$('body').toggleClass('mod-no-scroll');
};

Navigation.prototype.bindScroll = function () {
	if (document.body.clientWidth < this.navBreakPoint) {
		$(window).off('scroll.savvy');
		return;
	}
	$(window).on('scroll.savvy', this.scroll.bind(this));
	this.splashHeight = $('#wrapper .visual-box').outerHeight();
	this.navHeight = this.navbar.outerHeight();
};

Navigation.prototype.scroll = function () {
	var scroll = window.scrollY;
	if (scroll > this.splashHeight - this.transitionDistance) {
		this.navbar.parent('#header').addClass('mod-sticky');
	} else {
		this.navbar.parent('#header').removeClass('mod-sticky');
	}
};



function initHubspotForms(){
	if (jQuery('.form-block').length) {
		hbspt.forms.create({
			portalId: '464087',
			formId: 'fd09ef27-fd4d-4a89-95f9-27ab64351c92'
		});
		jQuery('.hbspt-form').appendTo(jQuery('.form-block'));
	}
}


// stretch background to fill blocks
function initBackgroundResize() {
	jQuery('.bg-stretch').each(function() {
		ImageStretcher.add({
			container: this,
			image: 'img',
			complete: function(element, container) {
				$(container).fadeIn(1500);
			}
		});
	});
}

// custom list init
function initCustomList(){
	var win = jQuery(this);
	jQuery('.images-wrap ul').each(function() {
		var list = jQuery(this);
		var items = list.find('li');
		var mobileK = 0.3;
		var tabletK = 0.6;

		function setWidth() {
			items.each(function(){
				var item = jQuery(this);

				item.css({
					width: ''
				});

				if (win.width() > 1023) {
					item.css({
						width: ''
					});
				} else if (win.width() > 767) {
					item.css({
						width: item.find('img').width() * tabletK
					});
				} else {
					item.css({
						width: item.find('img').width() * mobileK
					});
				}
			});
		}
		setWidth();

		win.on('resize orientationchange', setWidth);
	});
}

/*
 * jQuery Cycle Carousel plugin
 */
;(function($){
	function ScrollAbsoluteGallery(options) {
		this.options = $.extend({
			activeClass: 'active',
			mask: 'div.slides-mask',
			slider: '>ul',
			slides: '>li',
			btnPrev: '.btn-prev',
			btnNext: '.btn-next',
			pagerLinks: 'ul.pager > li',
			generatePagination: false,
			pagerList: '<ul>',
			pagerListItem: '<li><a href="#"></a></li>',
			pagerListItemText: 'a',
			galleryReadyClass: 'gallery-js-ready',
			currentNumber: 'span.current-num',
			totalNumber: 'span.total-num',
			maskAutoSize: false,
			autoRotation: false,
			pauseOnHover: false,
			stretchSlideToMask: false,
			switchTime: 3000,
			animSpeed: 500,
			handleTouch: true,
			swipeThreshold: 15,
			vertical: false
		}, options);
		this.init();
	}
	ScrollAbsoluteGallery.prototype = {
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			// find structure elements
			this.holder = $(this.options.holder).addClass(this.options.galleryReadyClass);
			this.mask = this.holder.find(this.options.mask);
			this.slider = this.mask.find(this.options.slider);
			this.slides = this.slider.find(this.options.slides);
			this.btnPrev = this.holder.find(this.options.btnPrev);
			this.btnNext = this.holder.find(this.options.btnNext);

			// slide count display
			this.currentNumber = this.holder.find(this.options.currentNumber);
			this.totalNumber = this.holder.find(this.options.totalNumber);

			// create gallery pagination
			if(typeof this.options.generatePagination === 'string') {
				this.pagerLinks = this.buildPagination();
			} else {
				this.pagerLinks = this.holder.find(this.options.pagerLinks);
			}

			// define index variables
			this.sizeProperty = this.options.vertical ? 'height' : 'width';
			this.positionProperty = this.options.vertical ? 'top' : 'left';
			this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';

			this.slideSize = this.slides[this.sizeProperty]();
			this.currentIndex = 0;
			this.prevIndex = 0;

			// reposition elements
			this.options.maskAutoSize = this.options.vertical ? false : this.options.maskAutoSize;
			if(this.options.vertical) {
				this.mask.css({
					height: this.slides.innerHeight()
				});
			}
			if(this.options.maskAutoSize){
				this.mask.css({
					height: this.slider.height()
				});
			}
			this.slider.css({
				position: 'relative',
				height: this.options.vertical ? this.slideSize * this.slides.length : '100%'
			});
			this.slides.css({
				position: 'absolute'
			}).css(this.positionProperty, -9999).eq(this.currentIndex).css(this.positionProperty, 0);
			this.refreshState();
		},
		buildPagination: function() {
			var pagerLinks = $();
			if(!this.pagerHolder) {
				this.pagerHolder = this.holder.find(this.options.generatePagination);
			}
			if(this.pagerHolder.length) {
				this.pagerHolder.empty();
				this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
				for(var i = 0; i < this.slides.length; i++) {
					$(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
				}
				pagerLinks = this.pagerList.children();
			}
			return pagerLinks;
		},
		attachEvents: function() {
			// attach handlers
			var self = this;
			if(this.btnPrev.length) {
				this.btnPrevHandler = function(e) {
					e.preventDefault();
					self.prevSlide();
				};
				this.btnPrev.click(this.btnPrevHandler);
			}
			if(this.btnNext.length) {
				this.btnNextHandler = function(e) {
					e.preventDefault();
					self.nextSlide();
				};
				this.btnNext.click(this.btnNextHandler);
			}
			if(this.pagerLinks.length) {
				this.pagerLinksHandler = function(e) {
					e.preventDefault();
					self.numSlide(self.pagerLinks.index(e.currentTarget));
				};
				this.pagerLinks.click(this.pagerLinksHandler);
			}

			// handle autorotation pause on hover
			if(this.options.pauseOnHover) {
				this.hoverHandler = function() {
					clearTimeout(self.timer);
				};
				this.leaveHandler = function() {
					self.autoRotate();
				};
				this.holder.bind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
			}

			// handle holder and slides dimensions
			this.resizeHandler = function() {
				if(!self.animating) {
					if(self.options.stretchSlideToMask) {
						self.resizeSlides();
					}
					self.resizeHolder();
					self.setSlidesPosition(self.currentIndex);
				}
			};
			$(window).bind('load resize orientationchange', this.resizeHandler);
			if(self.options.stretchSlideToMask) {
				self.resizeSlides();
			}

			// handle swipe on mobile devices
			if(this.options.handleTouch && window.Hammer && this.mask.length && this.slides.length > 1 && isTouchDevice) {
				this.swipeHandler = new Hammer.Manager(this.mask[0]);
				this.swipeHandler.add(new Hammer.Pan({
					direction: self.options.vertical ? Hammer.DIRECTION_VERTICAL : Hammer.DIRECTION_HORIZONTAL,
					threshold: self.options.swipeThreshold
				}));

				this.swipeHandler.on('panstart', function() {
					if(self.animating) {
						self.swipeHandler.stop();
					} else {
						clearTimeout(self.timer);
					}
				}).on('panmove', function(e) {
					self.swipeOffset = -self.slideSize + e[self.options.vertical ? 'deltaY' : 'deltaX'];
					self.slider.css(self.animProperty, self.swipeOffset);
					clearTimeout(self.timer);
				}).on('panend', function(e) {
					if(e.distance > self.options.swipeThreshold) {
						if(e.offsetDirection === Hammer.DIRECTION_RIGHT || e.offsetDirection === Hammer.DIRECTION_DOWN) {
							self.nextSlide();
						} else {
							self.prevSlide();
						}
					} else {
						var tmpObj = {};
						tmpObj[self.animProperty] = -self.slideSize;
						self.slider.animate(tmpObj, {duration: self.options.animSpeed});
						self.autoRotate();
					}
					self.swipeOffset = 0;
				});
			}

			// start autorotation
			this.autoRotate();
			this.resizeHolder();
			this.setSlidesPosition(this.currentIndex);
		},
		resizeSlides: function() {
			this.slideSize = this.mask[this.options.vertical ? 'height' : 'width']();
			this.slides.css(this.sizeProperty, this.slideSize);
		},
		resizeHolder: function() {
			if(this.options.maskAutoSize) {
				this.mask.css({
					height: this.slides.eq(this.currentIndex).outerHeight(true)
				});
			}
		},
		prevSlide: function() {
			if(!this.animating && this.slides.length > 1) {
				this.direction = -1;
				this.prevIndex = this.currentIndex;
				if(this.currentIndex > 0) this.currentIndex--;
				else this.currentIndex = this.slides.length - 1;
				this.switchSlide();
			}
		},
		nextSlide: function(fromAutoRotation) {
			if(!this.animating && this.slides.length > 1) {
				this.direction = 1;
				this.prevIndex = this.currentIndex;
				if(this.currentIndex < this.slides.length - 1) this.currentIndex++;
				else this.currentIndex = 0;
				this.switchSlide();
			}
		},
		numSlide: function(c) {
			if(!this.animating && this.currentIndex !== c && this.slides.length > 1) {
				this.direction = c > this.currentIndex ? 1 : -1;
				this.prevIndex = this.currentIndex;
				this.currentIndex = c;
				this.switchSlide();
			}
		},
		preparePosition: function() {
			// prepare slides position before animation
			this.setSlidesPosition(this.prevIndex, this.direction < 0 ? this.currentIndex : null, this.direction > 0 ? this.currentIndex : null, this.direction);
		},
		setSlidesPosition: function(index, slideLeft, slideRight, direction) {
			// reposition holder and nearest slides
			if(this.slides.length > 1) {
				var prevIndex = (typeof slideLeft === 'number' ? slideLeft : index > 0 ? index - 1 : this.slides.length - 1);
				var nextIndex = (typeof slideRight === 'number' ? slideRight : index < this.slides.length - 1 ? index + 1 : 0);

				this.slider.css(this.animProperty, this.swipeOffset ? this.swipeOffset : -this.slideSize);
				this.slides.css(this.positionProperty, -9999).eq(index).css(this.positionProperty, this.slideSize);
				if(prevIndex === nextIndex && typeof direction === 'number') {
					var calcOffset = direction > 0 ? this.slideSize*2 : 0;
					this.slides.eq(nextIndex).css(this.positionProperty, calcOffset);
				} else {
					this.slides.eq(prevIndex).css(this.positionProperty, 0);
					this.slides.eq(nextIndex).css(this.positionProperty, this.slideSize*2);
				}
			}
		},
		switchSlide: function() {
			// prepare positions and calculate offset
			var self = this;
			var oldSlide = this.slides.eq(this.prevIndex);
			var newSlide = this.slides.eq(this.currentIndex);
			this.animating = true;

			// resize mask to fit slide
			if(this.options.maskAutoSize) {
				this.mask.animate({
					height: newSlide.outerHeight(true)
				}, {
					duration: this.options.animSpeed
				});
			}

			// start animation
			var animProps = {};
			animProps[this.animProperty] = this.direction > 0 ? -this.slideSize*2 : 0;
			this.preparePosition();
			this.slider.animate(animProps,{duration:this.options.animSpeed, complete:function() {
				self.setSlidesPosition(self.currentIndex);

				// start autorotation
				self.animating = false;
				self.autoRotate();

				// onchange callback
				self.makeCallback('onChange', self);
			}});

			// refresh classes
			this.refreshState();

			// onchange callback
			this.makeCallback('onBeforeChange', this);
		},
		refreshState: function(initial) {
			// slide change function
			this.slides.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
			this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);

			// display current slide number
			this.currentNumber.html(this.currentIndex + 1);
			this.totalNumber.html(this.slides.length);

			// add class if not enough slides
			this.holder.toggleClass('not-enough-slides', this.slides.length === 1);
		},
		autoRotate: function() {
			var self = this;
			clearTimeout(this.timer);
			if(this.options.autoRotation) {
				this.timer = setTimeout(function() {
					self.nextSlide();
				}, this.options.switchTime);
			}
		},
		makeCallback: function(name) {
			if(typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},
		destroy: function() {
			// destroy handler
			this.btnPrev.unbind('click', this.btnPrevHandler);
			this.btnNext.unbind('click', this.btnNextHandler);
			this.pagerLinks.unbind('click', this.pagerLinksHandler);
			this.holder.unbind('mouseenter', this.hoverHandler);
			this.holder.unbind('mouseleave', this.leaveHandler);
			$(window).unbind('load resize orientationchange', this.resizeHandler);
			clearTimeout(this.timer);

			// destroy swipe handler
			if(this.swipeHandler) {
				this.swipeHandler.destroy();
			}

			// remove inline styles, classes and pagination
			this.holder.removeClass(this.options.galleryReadyClass);
			this.slider.add(this.slides).removeAttr('style');
			if(typeof this.options.generatePagination === 'string') {
				this.pagerHolder.empty();
			}
		}
	};

	// detect device type
	var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

	// jquery plugin
	$.fn.scrollAbsoluteGallery = function(opt){
		return this.each(function(){
			$(this).data('ScrollAbsoluteGallery', new ScrollAbsoluteGallery($.extend(opt,{holder:this})));
		});
	};
}(jQuery));


/*
 * Image Stretch module
 */
var ImageStretcher = {
	getDimensions: function(data) {
		// calculate element coords to fit in mask
		var ratio = data.imageRatio || (data.imageWidth / data.imageHeight),
			slideWidth = data.maskWidth,
			slideHeight = slideWidth / ratio;

		if(slideHeight < data.maskHeight) {
			slideHeight = data.maskHeight;
			slideWidth = slideHeight * ratio;
		}
		return {
			width: slideWidth,
			height: slideHeight,
			top: (data.maskHeight - slideHeight) / 2,
			left: (data.maskWidth - slideWidth) / 2
		};
	},
	getRatio: function(image) {
		if(image.prop('naturalWidth')) {
			return image.prop('naturalWidth') / image.prop('naturalHeight');
		} else {
			var img = new Image();
			img.src = image.prop('src');
			return img.width / img.height;
		}
	},
	imageLoaded: function(image, callback) {
		var self = this;
		var loadHandler = function() {
			callback.call(self);
		};
		if(image.prop('complete')) {
			loadHandler();
		} else {
			image.one('load', loadHandler);
		}
	},
	resizeHandler: function() {
		var self = this;
		jQuery.each(this.imgList, function(index, item) {
			if(item.image.prop('complete')) {
				self.resizeImage(item.image, item.container, item.callback);
			}
		});
	},
	resizeImage: function(image, container, callback) {
		this.imageLoaded(image, function() {
			var styles = this.getDimensions({
				imageRatio: this.getRatio(image),
				maskWidth: container.width(),
				maskHeight: container.height()
			});
			image.css({
				width: styles.width,
				height: styles.height,
				marginTop: styles.top,
				marginLeft: styles.left
			});
			callback(image, container);
		});
	},
	add: function(options) {
		var container = jQuery(options.container ? options.container : window);
		var image = typeof options.image === 'string' ? container.find(options.image) : jQuery(options.image);
		var complete = (typeof options.complete === 'function' ? options.complete : function(element, container) { $(container).show(); });

		// resize image
		this.resizeImage(image, container, complete);

		// add resize handler once if needed
		if(!this.win) {
			this.resizeHandler = jQuery.proxy(this.resizeHandler, this);
			this.imgList = [];
			this.win = jQuery(window);
			this.win.on('resize orientationchange', this.resizeHandler);
		}

		// store item in collection
		this.imgList.push({
			container: container,
			image: image,
			callback: complete
		});
	}
};


// initialize custom form elements
function initCustomForms() {
	jcf.setOptions('Select', {
		wrapNative: true // changed from false for temporary fix
	});
	jcf.replaceAll();
}

/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.2
 */
;(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.jcf = factory(jQuery);
	}
}(this, function($) {
	'use strict';

	// define version
	var version = '1.1.2';

	// private variables
	var customInstances = [];

	// default global options
	var commonOptions = {
		optionsKey: 'jcf',
		dataKey: 'jcf-instance',
		rtlClass: 'jcf-rtl',
		focusClass: 'jcf-focus',
		pressedClass: 'jcf-pressed',
		disabledClass: 'jcf-disabled',
		hiddenClass: 'jcf-hidden',
		resetAppearanceClass: 'jcf-reset-appearance',
		unselectableClass: 'jcf-unselectable'
	};

	// detect device type
	var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
		isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
	commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);

	// create global stylesheet if custom forms are used
	var createStyleSheet = function() {
		var styleTag = $('<style>').appendTo('head'),
			styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

		// crossbrowser style handling
		var addCSSRule = function(selector, rules, index) {
			if (styleSheet.insertRule) {
				styleSheet.insertRule(selector + '{' + rules + '}', index);
			} else {
				styleSheet.addRule(selector, rules, index);
			}
		};

		// add special rules
		addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
		addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
		addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
		addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

		// detect rtl pages
		var html = $('html'), body = $('body');
		if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
			html.addClass(commonOptions.rtlClass);
		}

		// handle form reset event
		html.on('reset', function() {
			setTimeout(function() {
				api.refreshAll();
			}, 0);
		});

		// mark stylesheet as created
		commonOptions.styleSheetCreated = true;
	};

	// simplified pointer events handler
	(function() {
		var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
			touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
			eventList, eventMap = {}, eventPrefix = 'jcf-';

		// detect events to attach
		if (pointerEventsSupported) {
			eventList = {
				pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
				pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
				pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
				pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
			};
		} else {
			eventList = {
				pointerover: 'mouseover',
				pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
				pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
				pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
			};
		}

		// create event map
		$.each(eventList, function(targetEventName, fakeEventList) {
			$.each(fakeEventList.split(' '), function(index, fakeEventName) {
				eventMap[fakeEventName] = targetEventName;
			});
		});

		// jQuery event hooks
		$.each(eventList, function(eventName, eventHandlers) {
			eventHandlers = eventHandlers.split(' ');
			$.event.special[eventPrefix + eventName] = {
				setup: function() {
					var self = this;
					$.each(eventHandlers, function(index, fallbackEvent) {
						if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
						else self['on' + fallbackEvent] = fixEvent;
					});
				},
				teardown: function() {
					var self = this;
					$.each(eventHandlers, function(index, fallbackEvent) {
						if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
						else self['on' + fallbackEvent] = null;
					});
				}
			};
		});

		// check that mouse event are not simulated by mobile browsers
		var lastTouch = null;
		var mouseEventSimulated = function(e) {
			var dx = Math.abs(e.pageX - lastTouch.x),
				dy = Math.abs(e.pageY - lastTouch.y),
				rangeDistance = 25;

			if (dx <= rangeDistance && dy <= rangeDistance) {
				return true;
			}
		};

		// normalize event
		var fixEvent = function(e) {
			var origEvent = e || window.event,
				touchEventData = null,
				targetEventName = eventMap[origEvent.type];

			e = $.event.fix(origEvent);
			e.type = eventPrefix + targetEventName;

			if (origEvent.pointerType) {
				switch (origEvent.pointerType) {
					case 2: e.pointerType = 'touch'; break;
					case 3: e.pointerType = 'pen'; break;
					case 4: e.pointerType = 'mouse'; break;
					default: e.pointerType = origEvent.pointerType;
				}
			} else {
				e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
			}

			if (!e.pageX && !e.pageY) {
				touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
				e.pageX = touchEventData.pageX;
				e.pageY = touchEventData.pageY;
			}

			if (origEvent.type === 'touchend') {
				lastTouch = { x: e.pageX, y: e.pageY };
			}
			if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
				return;
			} else {
				return ($.event.dispatch || $.event.handle).call(this, e);
			}
		};
	}());

	// custom mousewheel/trackpad handler
	(function() {
		var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
			shimEventName = 'jcf-mousewheel';

		$.event.special[shimEventName] = {
			setup: function() {
				var self = this;
				$.each(wheelEvents, function(index, fallbackEvent) {
					if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
					else self['on' + fallbackEvent] = fixEvent;
				});
			},
			teardown: function() {
				var self = this;
				$.each(wheelEvents, function(index, fallbackEvent) {
					if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
					else self['on' + fallbackEvent] = null;
				});
			}
		};

		var fixEvent = function(e) {
			var origEvent = e || window.event;
			e = $.event.fix(origEvent);
			e.type = shimEventName;

			// old wheel events handler
			if ('detail'      in origEvent) { e.deltaY = -origEvent.detail;      }
			if ('wheelDelta'  in origEvent) { e.deltaY = -origEvent.wheelDelta;  }
			if ('wheelDeltaY' in origEvent) { e.deltaY = -origEvent.wheelDeltaY; }
			if ('wheelDeltaX' in origEvent) { e.deltaX = -origEvent.wheelDeltaX; }

			// modern wheel event handler
			if ('deltaY' in origEvent) {
				e.deltaY = origEvent.deltaY;
			}
			if ('deltaX' in origEvent) {
				e.deltaX = origEvent.deltaX;
			}

			// handle deltaMode for mouse wheel
			e.delta = e.deltaY || e.deltaX;
			if (origEvent.deltaMode === 1) {
				var lineHeight = 16;
				e.delta *= lineHeight;
				e.deltaY *= lineHeight;
				e.deltaX *= lineHeight;
			}

			return ($.event.dispatch || $.event.handle).call(this, e);
		};
	}());

	// extra module methods
	var moduleMixin = {
		// provide function for firing native events
		fireNativeEvent: function(elements, eventName) {
			$(elements).each(function() {
				var element = this, eventObject;
				if (element.dispatchEvent) {
					eventObject = document.createEvent('HTMLEvents');
					eventObject.initEvent(eventName, true, true);
					element.dispatchEvent(eventObject);
				} else if (document.createEventObject) {
					eventObject = document.createEventObject();
					eventObject.target = element;
					element.fireEvent('on' + eventName, eventObject);
				}
			});
		},
		// bind event handlers for module instance (functions beggining with "on")
		bindHandlers: function() {
			var self = this;
			$.each(self, function(propName, propValue) {
				if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
					// dont use $.proxy here because it doesn't create unique handler
					self[propName] = function() {
						return propValue.apply(self, arguments);
					};
				}
			});
		}
	};

	// public API
	var api = {
		version: version,
		modules: {},
		getOptions: function() {
			return $.extend({}, commonOptions);
		},
		setOptions: function(moduleName, moduleOptions) {
			if (arguments.length > 1) {
				// set module options
				if (this.modules[moduleName]) {
					$.extend(this.modules[moduleName].prototype.options, moduleOptions);
				}
			} else {
				// set common options
				$.extend(commonOptions, moduleName);
			}
		},
		addModule: function(proto) {
			// add module to list
			var Module = function(options) {
				// save instance to collection
				if (!options.element.data(commonOptions.dataKey)) {
					options.element.data(commonOptions.dataKey, this);
				}
				customInstances.push(this);

				// save options
				this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);

				// bind event handlers to instance
				this.bindHandlers();

				// call constructor
				this.init.apply(this, arguments);
			};

			// parse options from HTML attribute
			var getInlineOptions = function(element) {
				var dataOptions = element.data(commonOptions.optionsKey),
					attrOptions = element.attr(commonOptions.optionsKey);

				if (dataOptions) {
					return dataOptions;
				} else if (attrOptions) {
					try {
						return $.parseJSON(attrOptions);
					} catch (e) {
						// ignore invalid attributes
					}
				}
			};

			// set proto as prototype for new module
			Module.prototype = proto;

			// add mixin methods to module proto
			$.extend(proto, moduleMixin);
			if (proto.plugins) {
				$.each(proto.plugins, function(pluginName, plugin) {
					$.extend(plugin.prototype, moduleMixin);
				});
			}

			// override destroy method
			var originalDestroy = Module.prototype.destroy;
			Module.prototype.destroy = function() {
				this.options.element.removeData(this.options.dataKey);

				for (var i = customInstances.length - 1; i >= 0; i--) {
					if (customInstances[i] === this) {
						customInstances.splice(i, 1);
						break;
					}
				}

				if (originalDestroy) {
					originalDestroy.apply(this, arguments);
				}
			};

			// save module to list
			this.modules[proto.name] = Module;
		},
		getInstance: function(element) {
			return $(element).data(commonOptions.dataKey);
		},
		replace: function(elements, moduleName, customOptions) {
			var self = this,
				instance;

			if (!commonOptions.styleSheetCreated) {
				createStyleSheet();
			}

			$(elements).each(function() {
				var moduleOptions,
					element = $(this);

				instance = element.data(commonOptions.dataKey);
				if (instance) {
					instance.refresh();
				} else {
					if (!moduleName) {
						$.each(self.modules, function(currentModuleName, module) {
							if (module.prototype.matchElement.call(module.prototype, element)) {
								moduleName = currentModuleName;
								return false;
							}
						});
					}
					if (moduleName) {
						moduleOptions = $.extend({ element: element }, customOptions);
						instance = new self.modules[moduleName](moduleOptions);
					}
				}
			});
			return instance;
		},
		refresh: function(elements) {
			$(elements).each(function() {
				var instance = $(this).data(commonOptions.dataKey);
				if (instance) {
					instance.refresh();
				}
			});
		},
		destroy: function(elements) {
			$(elements).each(function() {
				var instance = $(this).data(commonOptions.dataKey);
				if (instance) {
					instance.destroy();
				}
			});
		},
		replaceAll: function(context) {
			var self = this;
			$.each(this.modules, function(moduleName, module) {
				$(module.prototype.selector, context).each(function() {
					if (this.className.indexOf('jcf-ignore') < 0) {
						self.replace(this, moduleName);
					}
				});
			});
		},
		refreshAll: function(context) {
			if (context) {
				$.each(this.modules, function(moduleName, module) {
					$(module.prototype.selector, context).each(function() {
						var instance = $(this).data(commonOptions.dataKey);
						if (instance) {
							instance.refresh();
						}
					});
				});
			} else {
				for (var i = customInstances.length - 1; i >= 0; i--) {
					customInstances[i].refresh();
				}
			}
		},
		destroyAll: function(context) {
			if (context) {
				$.each(this.modules, function(moduleName, module) {
					$(module.prototype.selector, context).each(function(index, element) {
						var instance = $(element).data(commonOptions.dataKey);
						if (instance) {
							instance.destroy();
						}
					});
				});
			} else {
				while (customInstances.length) {
					customInstances[0].destroy();
				}
			}
		}
	};

	return api;
}));

/*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.2
 */
;(function($, window) {
	'use strict';

	jcf.addModule({
		name: 'Select',
		selector: 'select',
		options: {
			element: null,
			multipleCompactStyle: false
		},
		plugins: {
			ListBox: ListBox,
			ComboBox: ComboBox,
			SelectList: SelectList
		},
		matchElement: function(element) {
			return element.is('select');
		},
		init: function() {
			this.element = $(this.options.element);
			this.createInstance();
		},
		isListBox: function() {
			return this.element.is('[size]:not([jcf-size]), [multiple]');
		},
		createInstance: function() {
			if (this.instance) {
				this.instance.destroy();
			}
			if (this.isListBox() && !this.options.multipleCompactStyle) {
				this.instance = new ListBox(this.options);
			} else {
				this.instance = new ComboBox(this.options);
			}
		},
		refresh: function() {
			var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
								(!this.isListBox() && this.instance instanceof ListBox);

			if (typeMismatch) {
				this.createInstance();
			} else {
				this.instance.refresh();
			}
		},
		destroy: function() {
			this.instance.destroy();
		}
	});

	// combobox module
	function ComboBox(options) {
		this.options = $.extend({
			wrapNative: true,
			wrapNativeOnMobile: true,
			fakeDropInBody: true,
			useCustomScroll: true,
			flipDropToFit: true,
			maxVisibleItems: 10,
			fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
			fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
			optionClassPrefix: 'jcf-option-',
			selectClassPrefix: 'jcf-select-',
			dropContentSelector: '.jcf-select-drop-content',
			selectTextSelector: '.jcf-select-text',
			dropActiveClass: 'jcf-drop-active',
			flipDropClass: 'jcf-drop-flipped'
		}, options);
		this.init();
	}
	$.extend(ComboBox.prototype, {
		init: function() {
			this.initStructure();
			this.bindHandlers();
			this.attachEvents();
			this.refresh();
		},
		initStructure: function() {
			// prepare structure
			this.win = $(window);
			this.doc = $(document);
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
			this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
			this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
			makeUnselectable(this.fakeElement);

			// copy classes from original select
			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

			// handle compact multiple style
			if (this.realElement.prop('multiple')) {
				this.fakeElement.addClass('jcf-compact-multiple');
			}

			// detect device type and dropdown behavior
			if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
				this.options.wrapNative = true;
			}

			if (this.options.wrapNative) {
				// wrap native select inside fake block
				this.realElement.prependTo(this.fakeElement).css({
					position: 'absolute',
					height: '100%',
					width: '100%'
				}).addClass(this.options.resetAppearanceClass);
			} else {
				// just hide native select
				this.realElement.addClass(this.options.hiddenClass);
				this.fakeElement.attr('title', this.realElement.attr('title'));
				this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
			}
		},
		attachEvents: function() {
			// delayed refresh handler
			var self = this;
			this.delayedRefresh = function() {
				setTimeout(function() {
					self.refresh();
					if (self.list) {
						self.list.refresh();
					}
				}, 1);
			};

			// native dropdown event handlers
			if (this.options.wrapNative) {
				this.realElement.on({
					focus: this.onFocus,
					change: this.onChange,
					click: this.onChange,
					keydown: this.onChange
				});
			} else {
				// custom dropdown event handlers
				this.realElement.on({
					focus: this.onFocus,
					change: this.onChange,
					keydown: this.onKeyDown
				});
				this.fakeElement.on({
					'jcf-pointerdown': this.onSelectAreaPress
				});
			}
		},
		onKeyDown: function(e) {
			if (e.which === 13) {
				this.toggleDropdown();
			} else if (this.dropActive) {
				this.delayedRefresh();
			}
		},
		onChange: function() {
			this.refresh();
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
				this.toggleListMode(true);
				this.focusedFlag = true;
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
				this.toggleListMode(false);
				this.focusedFlag = false;
			}
		},
		onResize: function() {
			if (this.dropActive) {
				this.hideDropdown();
			}
		},
		onSelectDropPress: function() {
			this.pressedFlag = true;
		},
		onSelectDropRelease: function(e, pointerEvent) {
			this.pressedFlag = false;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onSelectAreaPress: function(e) {
			// skip click if drop inside fake element or real select is disabled
			var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
			if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
				return;
			}

			// toggle dropdown visibility
			this.selectOpenedByEvent = e.pointerType;
			this.toggleDropdown();

			// misc handlers
			if (!this.focusedFlag) {
				if (e.pointerType === 'mouse') {
					this.realElement.focus();
				} else {
					this.onFocus(e);
				}
			}
			this.pressedFlag = true;
			this.fakeElement.addClass(this.options.pressedClass);
			this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
		},
		onSelectAreaRelease: function(e) {
			if (this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = false;
			this.fakeElement.removeClass(this.options.pressedClass);
			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
		},
		onOutsideClick: function(e) {
			var target = $(e.target),
				clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

			if (!clickedInsideSelect) {
				this.hideDropdown();
			}
		},
		onSelect: function() {
			this.refresh();

			if (this.realElement.prop('multiple')) {
				this.repositionDropdown();
			} else {
				this.hideDropdown();
			}

			this.fireNativeEvent(this.realElement, 'change');
		},
		toggleListMode: function(state) {
			if (!this.options.wrapNative) {
				if (state) {
					// temporary change select to list to avoid appearing of native dropdown
					this.realElement.attr({
						size: 4,
						'jcf-size': ''
					});
				} else {
					// restore select from list mode to dropdown select
					if (!this.options.wrapNative) {
						this.realElement.removeAttr('size jcf-size');
					}
				}
			}
		},
		createDropdown: function() {
			// destroy previous dropdown if needed
			if (this.dropdown) {
				this.list.destroy();
				this.dropdown.remove();
			}

			// create new drop container
			this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
			this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
			makeUnselectable(this.dropdown);

			// handle compact multiple style
			if (this.realElement.prop('multiple')) {
				this.dropdown.addClass('jcf-compact-multiple');
			}

			// set initial styles for dropdown in body
			if (this.options.fakeDropInBody) {
				this.dropdown.css({
					position: 'absolute',
					top: -9999
				});
			}

			// create new select list instance
			this.list = new SelectList({
				useHoverClass: true,
				handleResize: false,
				alwaysPreventMouseWheel: true,
				maxVisibleItems: this.options.maxVisibleItems,
				useCustomScroll: this.options.useCustomScroll,
				holder: this.dropdown.find(this.options.dropContentSelector),
				multipleSelectWithoutKey: this.realElement.prop('multiple'),
				element: this.realElement
			});
			$(this.list).on({
				select: this.onSelect,
				press: this.onSelectDropPress,
				release: this.onSelectDropRelease
			});
		},
		repositionDropdown: function() {
			var selectOffset = this.fakeElement.offset(),
				selectWidth = this.fakeElement.outerWidth(),
				selectHeight = this.fakeElement.outerHeight(),
				dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
				winScrollTop = this.win.scrollTop(),
				winHeight = this.win.height(),
				calcTop, calcLeft, bodyOffset, needFlipDrop = false;

			// check flip drop position
			if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
				needFlipDrop = true;
			}

			if (this.options.fakeDropInBody) {
				bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
				if (this.options.flipDropToFit && needFlipDrop) {
					// calculate flipped dropdown position
					calcLeft = selectOffset.left;
					calcTop = selectOffset.top - dropHeight - bodyOffset;
				} else {
					// calculate default drop position
					calcLeft = selectOffset.left;
					calcTop = selectOffset.top + selectHeight - bodyOffset;
				}

				// update drop styles
				this.dropdown.css({
					width: selectWidth,
					left: calcLeft,
					top: calcTop
				});
			}

			// refresh flipped class
			this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
		},
		showDropdown: function() {
			// do not show empty custom dropdown
			if (!this.realElement.prop('options').length) {
				return;
			}

			// create options list if not created
			if (!this.dropdown) {
				this.createDropdown();
			}

			// show dropdown
			this.dropActive = true;
			this.dropdown.appendTo(this.fakeDropTarget);
			this.fakeElement.addClass(this.options.dropActiveClass);
			this.refreshSelectedText();
			this.repositionDropdown();
			this.list.setScrollTop(this.savedScrollTop);
			this.list.refresh();

			// add temporary event handlers
			this.win.on('resize', this.onResize);
			this.doc.on('jcf-pointerdown', this.onOutsideClick);
		},
		hideDropdown: function() {
			if (this.dropdown) {
				this.savedScrollTop = this.list.getScrollTop();
				this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
				this.dropdown.removeClass(this.options.flipDropClass).detach();
				this.doc.off('jcf-pointerdown', this.onOutsideClick);
				this.win.off('resize', this.onResize);
				this.dropActive = false;
				if (this.selectOpenedByEvent === 'touch') {
					this.onBlur();
				}
			}
		},
		toggleDropdown: function() {
			if (this.dropActive) {
				this.hideDropdown();
			} else {
				this.showDropdown();
			}
		},
		refreshSelectedText: function() {
			// redraw selected area
			var selectedIndex = this.realElement.prop('selectedIndex'),
				selectedOption = this.realElement.prop('options')[selectedIndex],
				selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
				selectedOptionText = '',
				selectedOptionClasses;

			if (this.realElement.prop('multiple')) {
				$.each(this.realElement.prop('options'), function(index, option) {
					if (option.selected) {
						selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
					}
				});
				this.selectText.removeAttr('class').html(selectedOptionText);
			} else if (!selectedOption) {
				if (this.selectImage) {
					this.selectImage.hide();
				}
				this.selectText.removeAttr('class').empty();
			} else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
				selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
				this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

				if (selectedOptionImage) {
					if (!this.selectImage) {
						this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
					}
					this.selectImage.attr('src', selectedOptionImage).show();
				} else if (this.selectImage) {
					this.selectImage.hide();
				}

				this.currentSelectedText = selectedOption.innerHTML;
				this.currentSelectedImage = selectedOptionImage;
			}
		},
		refresh: function() {
			// refresh fake select visibility
			if (this.realElement.prop('style').display === 'none') {
				this.fakeElement.hide();
			} else {
				this.fakeElement.show();
			}

			// refresh selected text
			this.refreshSelectedText();

			// handle disabled state
			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
		},
		destroy: function() {
			// restore structure
			if (this.options.wrapNative) {
				this.realElement.insertBefore(this.fakeElement).css({
					position: '',
					height: '',
					width: ''
				}).removeClass(this.options.resetAppearanceClass);
			} else {
				this.realElement.removeClass(this.options.hiddenClass);
				if (this.realElement.is('[jcf-size]')) {
					this.realElement.removeAttr('size jcf-size');
				}
			}

			// removing element will also remove its event handlers
			this.fakeElement.remove();

			// remove other event handlers
			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
			this.realElement.off({
				focus: this.onFocus
			});
		}
	});

	// listbox module
	function ListBox(options) {
		this.options = $.extend({
			wrapNative: true,
			useCustomScroll: true,
			fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
			selectClassPrefix: 'jcf-select-',
			listHolder: '.jcf-list-wrapper'
		}, options);
		this.init();
	}
	$.extend(ListBox.prototype, {
		init: function() {
			this.bindHandlers();
			this.initStructure();
			this.attachEvents();
		},
		initStructure: function() {
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
			this.listHolder = this.fakeElement.find(this.options.listHolder);
			makeUnselectable(this.fakeElement);

			// copy classes from original select
			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
			this.realElement.addClass(this.options.hiddenClass);

			this.list = new SelectList({
				useCustomScroll: this.options.useCustomScroll,
				holder: this.listHolder,
				selectOnClick: false,
				element: this.realElement
			});
		},
		attachEvents: function() {
			// delayed refresh handler
			var self = this;
			this.delayedRefresh = function(e) {
				if (e && e.which === 16) {
					// ignore SHIFT key
					return;
				} else {
					clearTimeout(self.refreshTimer);
					self.refreshTimer = setTimeout(function() {
						self.refresh();
					}, 1);
				}
			};

			// other event handlers
			this.realElement.on({
				focus: this.onFocus,
				click: this.delayedRefresh,
				keydown: this.delayedRefresh
			});

			// select list event handlers
			$(this.list).on({
				select: this.onSelect,
				press: this.onFakeOptionsPress,
				release: this.onFakeOptionsRelease
			});
		},
		onFakeOptionsPress: function(e, pointerEvent) {
			this.pressedFlag = true;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onFakeOptionsRelease: function(e, pointerEvent) {
			this.pressedFlag = false;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onSelect: function() {
			this.fireNativeEvent(this.realElement, 'change');
			this.fireNativeEvent(this.realElement, 'click');
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
				this.focusedFlag = true;
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
				this.focusedFlag = false;
			}
		},
		refresh: function() {
			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
			this.list.refresh();
		},
		destroy: function() {
			this.list.destroy();
			this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
			this.fakeElement.remove();
		}
	});

	// options list module
	function SelectList(options) {
		this.options = $.extend({
			holder: null,
			maxVisibleItems: 10,
			selectOnClick: true,
			useHoverClass: false,
			useCustomScroll: false,
			handleResize: true,
			multipleSelectWithoutKey: false,
			alwaysPreventMouseWheel: false,
			indexAttribute: 'data-index',
			cloneClassPrefix: 'jcf-option-',
			containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
			containerSelector: '.jcf-list-content',
			captionClass: 'jcf-optgroup-caption',
			disabledClass: 'jcf-disabled',
			optionClass: 'jcf-option',
			groupClass: 'jcf-optgroup',
			hoverClass: 'jcf-hover',
			selectedClass: 'jcf-selected',
			scrollClass: 'jcf-scroll-active'
		}, options);
		this.init();
	}
	$.extend(SelectList.prototype, {
		init: function() {
			this.initStructure();
			this.refreshSelectedClass();
			this.attachEvents();
		},
		initStructure: function() {
			this.element = $(this.options.element);
			this.indexSelector = '[' + this.options.indexAttribute + ']';
			this.container = $(this.options.containerStructure).appendTo(this.options.holder);
			this.listHolder = this.container.find(this.options.containerSelector);
			this.lastClickedIndex = this.element.prop('selectedIndex');
			this.rebuildList();
		},
		attachEvents: function() {
			this.bindHandlers();
			this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
			this.listHolder.on('jcf-pointerdown', this.onPress);

			if (this.options.useHoverClass) {
				this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
			}
		},
		onPress: function(e) {
			$(this).trigger('press', e);
			this.listHolder.on('jcf-pointerup', this.onRelease);
		},
		onRelease: function(e) {
			$(this).trigger('release', e);
			this.listHolder.off('jcf-pointerup', this.onRelease);
		},
		onHoverItem: function(e) {
			var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
			this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
		},
		onItemPress: function(e) {
			if (e.pointerType === 'touch' || this.options.selectOnClick) {
				// select option after "click"
				this.tmpListOffsetTop = this.list.offset().top;
				this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
			} else {
				// select option immediately
				this.onSelectItem(e);
			}
		},
		onItemRelease: function(e) {
			// remove event handlers and temporary data
			this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

			// simulate item selection
			if (this.tmpListOffsetTop === this.list.offset().top) {
				this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
			}
			delete this.tmpListOffsetTop;
		},
		onSelectItem: function(e) {
			var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
				pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
				range;

			// remove click event handler
			this.listHolder.off('click', this.indexSelector, this.onSelectItem);

			// ignore clicks on disabled options
			if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
				return;
			}

			if (this.element.prop('multiple')) {
				if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
					// if CTRL/CMD pressed or touch devices - toggle selected option
					this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
				} else if (e.shiftKey) {
					// if SHIFT pressed - update selection
					range = [this.lastClickedIndex, clickedIndex].sort(function(a, b) {
						return a - b;
					});
					this.realOptions.each(function(index, option) {
						option.selected = (index >= range[0] && index <= range[1]);
					});
				} else {
					// set single selected index
					this.element.prop('selectedIndex', clickedIndex);
				}
			} else {
				this.element.prop('selectedIndex', clickedIndex);
			}

			// save last clicked option
			if (!e.shiftKey) {
				this.lastClickedIndex = clickedIndex;
			}

			// refresh classes
			this.refreshSelectedClass();

			// scroll to active item in desktop browsers
			if (pointerType === 'mouse') {
				this.scrollToActiveOption();
			}

			// make callback when item selected
			$(this).trigger('select');
		},
		rebuildList: function() {
			// rebuild options
			var self = this,
				rootElement = this.element[0];

			// recursively create fake options
			this.storedSelectHTML = rootElement.innerHTML;
			this.optionIndex = 0;
			this.list = $(this.createOptionsList(rootElement));
			this.listHolder.empty().append(this.list);
			this.realOptions = this.element.find('option');
			this.fakeOptions = this.list.find(this.indexSelector);
			this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
			delete this.optionIndex;

			// detect max visible items
			var maxCount = this.options.maxVisibleItems,
				sizeValue = this.element.prop('size');
			if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
				maxCount = sizeValue;
			}

			// handle scrollbar
			var needScrollBar = this.fakeOptions.length > maxCount;
			this.container.toggleClass(this.options.scrollClass, needScrollBar);
			if (needScrollBar) {
				// change max-height
				this.listHolder.css({
					maxHeight: this.getOverflowHeight(maxCount),
					overflow: 'auto'
				});

				if (this.options.useCustomScroll && jcf.modules.Scrollable) {
					// add custom scrollbar if specified in options
					jcf.replace(this.listHolder, 'Scrollable', {
						handleResize: this.options.handleResize,
						alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
					});
					return;
				}
			}

			// disable edge wheel scrolling
			if (this.options.alwaysPreventMouseWheel) {
				this.preventWheelHandler = function(e) {
					var currentScrollTop = self.listHolder.scrollTop(),
						maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();

					// check edge cases
					if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
						e.preventDefault();
					}
				};
				this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
			}
		},
		refreshSelectedClass: function() {
			var self = this,
				selectedItem,
				isMultiple = this.element.prop('multiple'),
				selectedIndex = this.element.prop('selectedIndex');

			if (isMultiple) {
				this.realOptions.each(function(index, option) {
					self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
				});
			} else {
				this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
				selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
				if (this.options.useHoverClass) {
					selectedItem.addClass(this.options.hoverClass);
				}
			}
		},
		scrollToActiveOption: function() {
			// scroll to target option
			var targetOffset = this.getActiveOptionOffset();
			this.listHolder.prop('scrollTop', targetOffset);
		},
		getSelectedIndexRange: function() {
			var firstSelected = -1, lastSelected = -1;
			this.realOptions.each(function(index, option) {
				if (option.selected) {
					if (firstSelected < 0) {
						firstSelected = index;
					}
					lastSelected = index;
				}
			});
			return [firstSelected, lastSelected];
		},
		getChangedSelectedIndex: function() {
			var selectedIndex = this.element.prop('selectedIndex'),
				targetIndex;

			if (this.element.prop('multiple')) {
				// multiple selects handling
				if (!this.previousRange) {
					this.previousRange = [selectedIndex, selectedIndex];
				}
				this.currentRange = this.getSelectedIndexRange();
				targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
				this.previousRange = this.currentRange;
				return targetIndex;
			} else {
				// single choice selects handling
				return selectedIndex;
			}
		},
		getActiveOptionOffset: function() {
			// calc values
			var dropHeight = this.listHolder.height(),
				dropScrollTop = this.listHolder.prop('scrollTop'),
				currentIndex = this.getChangedSelectedIndex(),
				fakeOption = this.fakeOptions.eq(currentIndex),
				fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
				fakeOptionHeight = fakeOption.innerHeight();

			// scroll list
			if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
				// scroll down (always scroll to option)
				return fakeOptionOffset - dropHeight + fakeOptionHeight;
			} else if (fakeOptionOffset < dropScrollTop) {
				// scroll up to option
				return fakeOptionOffset;
			}
		},
		getOverflowHeight: function(sizeValue) {
			var item = this.fakeListItems.eq(sizeValue - 1),
				listOffset = this.list.offset().top,
				itemOffset = item.offset().top,
				itemHeight = item.innerHeight();

			return itemOffset + itemHeight - listOffset;
		},
		getScrollTop: function() {
			return this.listHolder.scrollTop();
		},
		setScrollTop: function(value) {
			this.listHolder.scrollTop(value);
		},
		createOption: function(option) {
			var newOption = document.createElement('span');
			newOption.className = this.options.optionClass;
			newOption.innerHTML = option.innerHTML;
			newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

			var optionImage, optionImageSrc = option.getAttribute('data-image');
			if (optionImageSrc) {
				optionImage = document.createElement('img');
				optionImage.src = optionImageSrc;
				newOption.insertBefore(optionImage, newOption.childNodes[0]);
			}
			if (option.disabled) {
				newOption.className += ' ' + this.options.disabledClass;
			}
			if (option.className) {
				newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
			}
			return newOption;
		},
		createOptGroup: function(optgroup) {
			var optGroupContainer = document.createElement('span'),
				optGroupName = optgroup.getAttribute('label'),
				optGroupCaption, optGroupList;

			// create caption
			optGroupCaption = document.createElement('span');
			optGroupCaption.className = this.options.captionClass;
			optGroupCaption.innerHTML = optGroupName;
			optGroupContainer.appendChild(optGroupCaption);

			// create list of options
			if (optgroup.children.length) {
				optGroupList = this.createOptionsList(optgroup);
				optGroupContainer.appendChild(optGroupList);
			}

			optGroupContainer.className = this.options.groupClass;
			return optGroupContainer;
		},
		createOptionContainer: function() {
			var optionContainer = document.createElement('li');
			return optionContainer;
		},
		createOptionsList: function(container) {
			var self = this,
				list = document.createElement('ul');

			$.each(container.children, function(index, currentNode) {
				var item = self.createOptionContainer(currentNode),
					newNode;

				switch (currentNode.tagName.toLowerCase()) {
					case 'option': newNode = self.createOption(currentNode); break;
					case 'optgroup': newNode = self.createOptGroup(currentNode); break;
				}
				list.appendChild(item).appendChild(newNode);
			});
			return list;
		},
		refresh: function() {
			// check for select innerHTML changes
			if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
				this.rebuildList();
			}

			// refresh custom scrollbar
			var scrollInstance = jcf.getInstance(this.listHolder);
			if (scrollInstance) {
				scrollInstance.refresh();
			}

			// refresh selectes classes
			this.refreshSelectedClass();
		},
		destroy: function() {
			this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
			this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
			this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
			this.listHolder.off('jcf-pointerdown', this.onPress);
		}
	});

	// helper functions
	var getPrefixedClasses = function(className, prefixToAdd) {
		return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
	};
	var makeUnselectable = (function() {
		var unselectableClass = jcf.getOptions().unselectableClass;
		function preventHandler(e) {
			e.preventDefault();
		}
		return function(node) {
			node.addClass(unselectableClass).on('selectstart', preventHandler);
		};
	}());

}(jQuery, this));

/*!
 * JavaScript Custom Forms : Checkbox Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.2
 */
;(function($) {
	'use strict';

	jcf.addModule({
		name: 'Checkbox',
		selector: 'input[type="checkbox"]',
		options: {
			wrapNative: true,
			checkedClass: 'jcf-checked',
			uncheckedClass: 'jcf-unchecked',
			labelActiveClass: 'jcf-label-active',
			fakeStructure: '<span class="jcf-checkbox"><span></span></span>'
		},
		matchElement: function(element) {
			return element.is(':checkbox');
		},
		init: function() {
			this.initStructure();
			this.attachEvents();
			this.refresh();
		},
		initStructure: function() {
			// prepare structure
			this.doc = $(document);
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
			this.labelElement = this.getLabelFor();

			if (this.options.wrapNative) {
				// wrap native checkbox inside fake block
				this.realElement.appendTo(this.fakeElement).css({
					position: 'absolute',
					height: '100%',
					width: '100%',
					opacity: 0,
					margin: 0
				});
			} else {
				// just hide native checkbox
				this.realElement.addClass(this.options.hiddenClass);
			}
		},
		attachEvents: function() {
			// add event handlers
			this.realElement.on({
				focus: this.onFocus,
				click: this.onRealClick
			});
			this.fakeElement.on('click', this.onFakeClick);
			this.fakeElement.on('jcf-pointerdown', this.onPress);
		},
		onRealClick: function(e) {
			// just redraw fake element (setTimeout handles click that might be prevented)
			var self = this;
			this.savedEventObject = e;
			setTimeout(function() {
				self.refresh();
			}, 0);
		},
		onFakeClick: function(e) {
			// skip event if clicked on real element inside wrapper
			if (this.options.wrapNative && this.realElement.is(e.target)) {
				return;
			}

			// toggle checked class
			if (!this.realElement.is(':disabled')) {
				delete this.savedEventObject;
				this.stateChecked = this.realElement.prop('checked');
				this.realElement.prop('checked', !this.stateChecked);
				this.fireNativeEvent(this.realElement, 'click');
				if (this.savedEventObject && this.savedEventObject.isDefaultPrevented()) {
					this.realElement.prop('checked', this.stateChecked);
				} else {
					this.fireNativeEvent(this.realElement, 'change');
				}
				delete this.savedEventObject;
			}
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.focusedFlag = true;
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.focusedFlag = false;
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
			}
		},
		onPress: function(e) {
			if (!this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = true;
			this.fakeElement.addClass(this.options.pressedClass);
			this.doc.on('jcf-pointerup', this.onRelease);
		},
		onRelease: function(e) {
			if (this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = false;
			this.fakeElement.removeClass(this.options.pressedClass);
			this.doc.off('jcf-pointerup', this.onRelease);
		},
		getLabelFor: function() {
			var parentLabel = this.realElement.closest('label'),
				elementId = this.realElement.prop('id');

			if (!parentLabel.length && elementId) {
				parentLabel = $('label[for="' + elementId + '"]');
			}
			return parentLabel.length ? parentLabel : null;
		},
		refresh: function() {
			// redraw custom checkbox
			var isChecked = this.realElement.is(':checked'),
				isDisabled = this.realElement.is(':disabled');

			this.fakeElement.toggleClass(this.options.checkedClass, isChecked)
							.toggleClass(this.options.uncheckedClass, !isChecked)
							.toggleClass(this.options.disabledClass, isDisabled);

			if (this.labelElement) {
				this.labelElement.toggleClass(this.options.labelActiveClass, isChecked);
			}
		},
		destroy: function() {
			// restore structure
			if (this.options.wrapNative) {
				this.realElement.insertBefore(this.fakeElement).css({
					position: '',
					width: '',
					height: '',
					opacity: '',
					margin: ''
				});
			} else {
				this.realElement.removeClass(this.options.hiddenClass);
			}

			// removing element will also remove its event handlers
			this.fakeElement.off('jcf-pointerdown', this.onPress);
			this.fakeElement.remove();

			// remove other event handlers
			this.doc.off('jcf-pointerup', this.onRelease);
			this.realElement.off({
				focus: this.onFocus,
				click: this.onRealClick
			});
		}
	});

}(jQuery));

/* Testing Deploybot */

/* Hubspot Form Builder - 1.2.46 */
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(a){return 10>a?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g,h=gap,i=b[a];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,g=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;f>c;c+=1)g[c]=str(c,i)||"null";return e=0===g.length?"[]":gap?"[\n"+gap+g.join(",\n"+gap)+"\n"+h+"]":"["+g.join(",")+"]",gap=h,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;f>c;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));return e=0===g.length?"{}":gap?"{\n"+gap+g.join(",\n"+gap)+"\n"+h+"}":"{"+g.join(",")+"}",gap=h,e}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;"function"!=typeof JSON.stringify&&(JSON.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;c>d;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON.stringify");return str("",{"":a})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(a,b){function c(a){return J.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}function d(a){if(!sb[a]){var b=G.body,c=J("<"+a+">").appendTo(b),d=c.css("display");c.remove(),("none"===d||""===d)&&(ob||(ob=G.createElement("iframe"),ob.frameBorder=ob.width=ob.height=0),b.appendChild(ob),pb&&ob.createElement||(pb=(ob.contentWindow||ob.contentDocument).document,pb.write((J.support.boxModel?"<!doctype html>":"")+"<html><body>"),pb.close()),c=pb.createElement(a),pb.body.appendChild(c),d=J.css(c,"display"),b.removeChild(ob)),sb[a]=d}return sb[a]}function e(a,b){var c={};return J.each(vb.concat.apply([],vb.slice(0,b)),function(){c[this]=a}),c}function f(){rb=b}function g(){return setTimeout(f,0),rb=J.now()}function h(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function i(){try{return new a.XMLHttpRequest}catch(b){}}function j(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d,e,f,g,h,i,j,k,l=a.dataTypes,m={},n=l.length,o=l[0];for(d=1;n>d;d++){if(1===d)for(e in a.converters)"string"==typeof e&&(m[e.toLowerCase()]=a.converters[e]);if(g=o,o=l[d],"*"===o)o=g;else if("*"!==g&&g!==o){if(h=g+" "+o,i=m[h]||m["* "+o],!i){k=b;for(j in m)if(f=j.split(" "),(f[0]===g||"*"===f[0])&&(k=m[f[1]+" "+o])){j=m[j],j===!0?i=k:k===!0&&(i=j);break}}!i&&!k&&J.error("No conversion from "+h.replace(" "," to ")),i!==!0&&(c=i?i(c):k(j(c)))}}return c}function k(a,c,d){var e,f,g,h,i=a.contents,j=a.dataTypes,k=a.responseFields;for(f in k)f in d&&(c[k[f]]=d[f]);for(;"*"===j[0];)j.shift(),e===b&&(e=a.mimeType||c.getResponseHeader("content-type"));if(e)for(f in i)if(i[f]&&i[f].test(e)){j.unshift(f);break}if(j[0]in d)g=j[0];else{for(f in d){if(!j[0]||a.converters[f+" "+j[0]]){g=f;break}h||(h=f)}g=g||h}return g?(g!==j[0]&&j.unshift(g),d[g]):void 0}function l(a,b,c,d){if(J.isArray(b))J.each(b,function(b,e){c||Sa.test(a)?d(a,e):l(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==J.type(b))d(a,b);else for(var e in b)l(a+"["+e+"]",b[e],c,d)}function m(a,c){var d,e,f=J.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((f[d]?a:e||(e={}))[d]=c[d]);e&&J.extend(!0,a,e)}function n(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;for(var h,i=a[f],j=0,k=i?i.length:0,l=a===fb;k>j&&(l||!h);j++)h=i[j](c,d,e),"string"==typeof h&&(!l||g[h]?h=b:(c.dataTypes.unshift(h),h=n(a,c,d,e,h,g)));return(l||!h)&&!g["*"]&&(h=n(a,c,d,e,"*",g)),h}function o(a){return function(b,c){if("string"!=typeof b&&(c=b,b="*"),J.isFunction(c))for(var d,e,f,g=b.toLowerCase().split(bb),h=0,i=g.length;i>h;h++)d=g[h],f=/^\+/.test(d),f&&(d=d.substr(1)||"*"),e=a[d]=a[d]||[],e[f?"unshift":"push"](c)}}function p(a,b,c){var d="width"===b?a.offsetWidth:a.offsetHeight,e="width"===b?1:0,f=4;if(d>0){if("border"!==c)for(;f>e;e+=2)c||(d-=parseFloat(J.css(a,"padding"+Oa[e]))||0),"margin"===c?d+=parseFloat(J.css(a,c+Oa[e]))||0:d-=parseFloat(J.css(a,"border"+Oa[e]+"Width"))||0;return d+"px"}if(d=Da(a,b),(0>d||null==d)&&(d=a.style[b]),Ka.test(d))return d;if(d=parseFloat(d)||0,c)for(;f>e;e+=2)d+=parseFloat(J.css(a,"padding"+Oa[e]))||0,"padding"!==c&&(d+=parseFloat(J.css(a,"border"+Oa[e]+"Width"))||0),"margin"===c&&(d+=parseFloat(J.css(a,c+Oa[e]))||0);return d+"px"}function q(a){var b=G.createElement("div");return Ca.appendChild(b),b.innerHTML=a.outerHTML,b.firstChild}function r(a){var b=(a.nodeName||"").toLowerCase();"input"===b?s(a):"script"!==b&&"undefined"!=typeof a.getElementsByTagName&&J.grep(a.getElementsByTagName("input"),s)}function s(a){("checkbox"===a.type||"radio"===a.type)&&(a.defaultChecked=a.checked)}function t(a){return"undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName("*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll("*"):[]}function u(a,b){var c;1===b.nodeType&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),"object"===c?b.outerHTML=a.outerHTML:"input"!==c||"checkbox"!==a.type&&"radio"!==a.type?"option"===c?b.selected=a.defaultSelected:"input"===c||"textarea"===c?b.defaultValue=a.defaultValue:"script"===c&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(J.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function v(a,b){if(1===b.nodeType&&J.hasData(a)){var c,d,e,f=J._data(a),g=J._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)J.event.add(b,c,h[c][d])}g.data&&(g.data=J.extend({},g.data))}}function w(a,b){return J.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function x(a){var b=oa.split("|"),c=a.createDocumentFragment();if(c.createElement)for(;b.length;)c.createElement(b.pop());return c}function y(a,b,c){if(b=b||0,J.isFunction(b))return J.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return J.grep(a,function(a,d){return a===b===c});if("string"==typeof b){var d=J.grep(a,function(a){return 1===a.nodeType});if(ka.test(b))return J.filter(b,d,!c);b=J.filter(b,d)}return J.grep(a,function(a,d){return J.inArray(a,b)>=0===c})}function z(a){return!a||!a.parentNode||11===a.parentNode.nodeType}function A(){return!0}function B(){return!1}function C(a,b,c){var d=b+"defer",e=b+"queue",f=b+"mark",g=J._data(a,d);!(!g||"queue"!==c&&J._data(a,e)||"mark"!==c&&J._data(a,f)||!setTimeout(function(){!J._data(a,e)&&!J._data(a,f)&&(J.removeData(a,d,!0),g.fire())},0))}function D(a){for(var b in a)if(("data"!==b||!J.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function E(a,c,d){if(d===b&&1===a.nodeType){var e="data-"+c.replace(N,"-$1").toLowerCase();if(d=a.getAttribute(e),"string"==typeof d){try{d="true"===d?!0:"false"===d?!1:"null"===d?null:J.isNumeric(d)?+d:M.test(d)?J.parseJSON(d):d}catch(f){}J.data(a,c,d)}else d=b}return d}function F(a){var b,c,d=K[a]={};for(a=a.split(/\s+/),b=0,c=a.length;c>b;b++)d[a[b]]=!0;return d}var G=a.document,H=a.navigator,I=a.location,J=function(){function c(){if(!h.isReady){try{G.documentElement.doScroll("left")}catch(a){return void setTimeout(c,1)}h.ready()}}var d,e,f,g,h=function(a,b){return new h.fn.init(a,b,d)},i=a.jQuery,j=a.$,k=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,l=/\S/,m=/^\s+/,n=/\s+$/,o=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,p=/^[\],:{}\s]*$/,q=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,r=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,s=/(?:^|:|,)(?:\s*\[)+/g,t=/(webkit)[ \/]([\w.]+)/,u=/(opera)(?:.*version)?[ \/]([\w.]+)/,v=/(msie) ([\w.]+)/,w=/(mozilla)(?:.*? rv:([\w.]+))?/,x=/-([a-z]|[0-9])/gi,y=/^-ms-/,z=function(a,b){return(b+"").toUpperCase()},A=H.userAgent,B=Object.prototype.toString,C=Object.prototype.hasOwnProperty,D=Array.prototype.push,E=Array.prototype.slice,F=String.prototype.trim,I=Array.prototype.indexOf,J={};return h.fn=h.prototype={constructor:h,init:function(a,c,d){var e,f,g,i;if(!a)return this;if(a.nodeType)return this.context=this[0]=a,this.length=1,this;if("body"===a&&!c&&G.body)return this.context=G,this[0]=G.body,this.selector=a,this.length=1,this;if("string"==typeof a){if(e="<"!==a.charAt(0)||">"!==a.charAt(a.length-1)||a.length<3?k.exec(a):[null,a,null],e&&(e[1]||!c)){if(e[1])return c=c instanceof h?c[0]:c,i=c?c.ownerDocument||c:G,g=o.exec(a),g?h.isPlainObject(c)?(a=[G.createElement(g[1])],h.fn.attr.call(a,c,!0)):a=[i.createElement(g[1])]:(g=h.buildFragment([e[1]],[i]),a=(g.cacheable?h.clone(g.fragment):g.fragment).childNodes),h.merge(this,a);if(f=G.getElementById(e[2]),f&&f.parentNode){if(f.id!==e[2])return d.find(a);this.length=1,this[0]=f}return this.context=G,this.selector=a,this}return!c||c.jquery?(c||d).find(a):this.constructor(c).find(a)}return h.isFunction(a)?d.ready(a):(a.selector!==b&&(this.selector=a.selector,this.context=a.context),h.makeArray(a,this))},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return E.call(this,0)},get:function(a){return null==a?this.toArray():0>a?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();return h.isArray(a)?D.apply(d,a):h.merge(d,a),d.prevObject=this,d.context=this.context,"find"===b?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")"),d},each:function(a,b){return h.each(this,a,b)},ready:function(a){return h.bindReady(),f.add(a),this},eq:function(a){return a=+a,-1===a?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(E.apply(this,arguments),"slice",E.call(arguments).join(","))},map:function(a){return this.pushStack(h.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:D,sort:[].sort,splice:[].splice},h.fn.init.prototype=h.fn,h.extend=h.fn.extend=function(){var a,c,d,e,f,g,i=arguments[0]||{},j=1,k=arguments.length,l=!1;for("boolean"==typeof i&&(l=i,i=arguments[1]||{},j=2),"object"!=typeof i&&!h.isFunction(i)&&(i={}),k===j&&(i=this,--j);k>j;j++)if(null!=(a=arguments[j]))for(c in a)d=i[c],e=a[c],i!==e&&(l&&e&&(h.isPlainObject(e)||(f=h.isArray(e)))?(f?(f=!1,g=d&&h.isArray(d)?d:[]):g=d&&h.isPlainObject(d)?d:{},i[c]=h.extend(l,g,e)):e!==b&&(i[c]=e));return i},h.extend({noConflict:function(b){return a.$===h&&(a.$=j),b&&a.jQuery===h&&(a.jQuery=i),h},isReady:!1,readyWait:1,holdReady:function(a){a?h.readyWait++:h.ready(!0)},ready:function(a){if(a===!0&&!--h.readyWait||a!==!0&&!h.isReady){if(!G.body)return setTimeout(h.ready,1);if(h.isReady=!0,a!==!0&&--h.readyWait>0)return;f.fireWith(G,[h]),h.fn.trigger&&h(G).trigger("ready").off("ready")}},bindReady:function(){if(!f){if(f=h.Callbacks("once memory"),"complete"===G.readyState)return setTimeout(h.ready,1);if(G.addEventListener)G.addEventListener("DOMContentLoaded",g,!1),a.addEventListener("load",h.ready,!1);else if(G.attachEvent){G.attachEvent("onreadystatechange",g),a.attachEvent("onload",h.ready);var b=!1;try{b=null==a.frameElement}catch(d){}G.documentElement.doScroll&&b&&c()}}},isFunction:function(a){return"function"===h.type(a)},isArray:Array.isArray||function(a){return"array"===h.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return null==a?String(a):J[B.call(a)]||"object"},isPlainObject:function(a){if(!a||"object"!==h.type(a)||a.nodeType||h.isWindow(a))return!1;try{if(a.constructor&&!C.call(a,"constructor")&&!C.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||C.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){return"string"==typeof b&&b?(b=h.trim(b),a.JSON&&a.JSON.parse?a.JSON.parse(b):p.test(b.replace(q,"@").replace(r,"]").replace(s,""))?new Function("return "+b)():void h.error("Invalid JSON: "+b)):null},parseXML:function(c){if("string"!=typeof c||!c)return null;var d,e;try{a.DOMParser?(e=new DOMParser,d=e.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(f){d=b}return(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&h.error("Invalid XML: "+c),d},noop:function(){},globalEval:function(b){b&&l.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(y,"ms-").replace(x,z)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var e,f=0,g=a.length,i=g===b||h.isFunction(a);if(d)if(i){for(e in a)if(c.apply(a[e],d)===!1)break}else for(;g>f&&c.apply(a[f++],d)!==!1;);else if(i){for(e in a)if(c.call(a[e],e,a[e])===!1)break}else for(;g>f&&c.call(a[f],f,a[f++])!==!1;);return a},trim:F?function(a){return null==a?"":F.call(a)}:function(a){return null==a?"":(a+"").replace(m,"").replace(n,"")},makeArray:function(a,b){var c=b||[];if(null!=a){var d=h.type(a);null==a.length||"string"===d||"function"===d||"regexp"===d||h.isWindow(a)?D.call(c,a):h.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(I)return I.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if("number"==typeof c.length)for(var f=c.length;f>e;e++)a[d++]=c[e];else for(;c[e]!==b;)a[d++]=c[e++];return a.length=d,a},grep:function(a,b,c){var d,e=[];c=!!c;for(var f=0,g=a.length;g>f;f++)d=!!b(a[f],f),c!==d&&e.push(a[f]);return e},map:function(a,c,d){var e,f,g=[],i=0,j=a.length,k=a instanceof h||j!==b&&"number"==typeof j&&(j>0&&a[0]&&a[j-1]||0===j||h.isArray(a));if(k)for(;j>i;i++)e=c(a[i],i,d),null!=e&&(g[g.length]=e);else for(f in a)e=c(a[f],f,d),null!=e&&(g[g.length]=e);return g.concat.apply([],g)},guid:1,proxy:function(a,c){if("string"==typeof c){var d=a[c];c=a,a=d}if(!h.isFunction(a))return b;var e=E.call(arguments,2),f=function(){return a.apply(c,e.concat(E.call(arguments)))};return f.guid=a.guid=a.guid||f.guid||h.guid++,f},access:function(a,c,d,e,f,g,i){var j,k=null==d,l=0,m=a.length;if(d&&"object"==typeof d){for(l in d)h.access(a,c,l,d[l],1,g,e);f=1}else if(e!==b){if(j=i===b&&h.isFunction(e),k&&(j?(j=c,c=function(a,b,c){return j.call(h(a),c)}):(c.call(a,e),c=null)),c)for(;m>l;l++)c(a[l],d,j?e.call(a[l],l,c(a[l],d)):e,i);f=1}return f?a:k?c.call(a):m?c(a[0],d):g},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=t.exec(a)||u.exec(a)||v.exec(a)||a.indexOf("compatible")<0&&w.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}h.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(c,d){return d&&d instanceof h&&!(d instanceof a)&&(d=a(d)),h.fn.init.call(this,c,d,b)},a.fn.init.prototype=a.fn;var b=a(G);return a},browser:{}}),h.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){J["[object "+b+"]"]=b.toLowerCase()}),e=h.uaMatch(A),e.browser&&(h.browser[e.browser]=!0,h.browser.version=e.version),h.browser.webkit&&(h.browser.safari=!0),l.test(" ")&&(m=/^[\s\xA0]+/,n=/[\s\xA0]+$/),d=h(G),G.addEventListener?g=function(){G.removeEventListener("DOMContentLoaded",g,!1),h.ready()}:G.attachEvent&&(g=function(){"complete"===G.readyState&&(G.detachEvent("onreadystatechange",g),h.ready())}),h}(),K={};J.Callbacks=function(a){a=a?K[a]||F(a):{};var c,d,e,f,g,h,i=[],j=[],k=function(b){var c,d,e,f;for(c=0,d=b.length;d>c;c++)e=b[c],f=J.type(e),"array"===f?k(e):"function"===f&&(!a.unique||!m.has(e))&&i.push(e)},l=function(b,k){for(k=k||[],c=!a.memory||[b,k],d=!0,e=!0,h=f||0,f=0,g=i.length;i&&g>h;h++)if(i[h].apply(b,k)===!1&&a.stopOnFalse){c=!0;break}e=!1,i&&(a.once?c===!0?m.disable():i=[]:j&&j.length&&(c=j.shift(),m.fireWith(c[0],c[1])))},m={add:function(){if(i){var a=i.length;k(arguments),e?g=i.length:c&&c!==!0&&(f=a,l(c[0],c[1]))}return this},remove:function(){if(i)for(var b=arguments,c=0,d=b.length;d>c;c++)for(var f=0;f<i.length&&(b[c]!==i[f]||(e&&g>=f&&(g--,h>=f&&h--),i.splice(f--,1),!a.unique));f++);return this},has:function(a){if(i)for(var b=0,c=i.length;c>b;b++)if(a===i[b])return!0;return!1},empty:function(){return i=[],this},disable:function(){return i=j=c=b,this},disabled:function(){return!i},lock:function(){return j=b,(!c||c===!0)&&m.disable(),this},locked:function(){return!j},fireWith:function(b,d){return j&&(e?a.once||j.push([b,d]):(!a.once||!c)&&l(b,d)),this},fire:function(){return m.fireWith(this,arguments),this},fired:function(){return!!d}};return m};var L=[].slice;J.extend({Deferred:function(a){var b,c=J.Callbacks("once memory"),d=J.Callbacks("once memory"),e=J.Callbacks("memory"),f="pending",g={resolve:c,reject:d,notify:e},h={done:c.add,fail:d.add,progress:e.add,state:function(){return f},isResolved:c.fired,isRejected:d.fired,then:function(a,b,c){return i.done(a).fail(b).progress(c),this},always:function(){return i.done.apply(i,arguments).fail.apply(i,arguments),this},pipe:function(a,b,c){return J.Deferred(function(d){J.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c,e=b[0],f=b[1];i[a](J.isFunction(e)?function(){c=e.apply(this,arguments),c&&J.isFunction(c.promise)?c.promise().then(d.resolve,d.reject,d.notify):d[f+"With"](this===i?d:this,[c])}:d[f])})}).promise()},promise:function(a){if(null==a)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({});for(b in g)i[b]=g[b].fire,i[b+"With"]=g[b].fireWith;return i.done(function(){f="resolved"},d.disable,e.lock).fail(function(){f="rejected"},c.disable,e.lock),a&&a.call(i,i),i},when:function(a){function b(a){return function(b){g[a]=arguments.length>1?L.call(arguments,0):b,i.notifyWith(j,g)}}function c(a){return function(b){d[a]=arguments.length>1?L.call(arguments,0):b,--h||i.resolveWith(i,d)}}var d=L.call(arguments,0),e=0,f=d.length,g=Array(f),h=f,i=1>=f&&a&&J.isFunction(a.promise)?a:J.Deferred(),j=i.promise();if(f>1){for(;f>e;e++)d[e]&&d[e].promise&&J.isFunction(d[e].promise)?d[e].promise().then(c(e),i.reject,b(e)):--h;h||i.resolveWith(i,d)}else i!==a&&i.resolveWith(i,f?[a]:[]);return j}}),J.support=function(){{var b,c,d,e,f,g,h,i,j,k,l,m=G.createElement("div");G.documentElement}if(m.setAttribute("className","t"),m.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",c=m.getElementsByTagName("*"),d=m.getElementsByTagName("a")[0],!c||!c.length||!d)return{};e=G.createElement("select"),f=e.appendChild(G.createElement("option")),g=m.getElementsByTagName("input")[0],b={leadingWhitespace:3===m.firstChild.nodeType,tbody:!m.getElementsByTagName("tbody").length,htmlSerialize:!!m.getElementsByTagName("link").length,style:/top/.test(d.getAttribute("style")),hrefNormalized:"/a"===d.getAttribute("href"),opacity:/^0.55/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:"on"===g.value,optSelected:f.selected,getSetAttribute:"t"!==m.className,enctype:!!G.createElement("form").enctype,html5Clone:"<:nav></:nav>"!==G.createElement("nav").cloneNode(!0).outerHTML,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},J.boxModel=b.boxModel="CSS1Compat"===G.compatMode,g.checked=!0,b.noCloneChecked=g.cloneNode(!0).checked,e.disabled=!0,b.optDisabled=!f.disabled;try{delete m.test}catch(n){b.deleteExpando=!1}if(!m.addEventListener&&m.attachEvent&&m.fireEvent&&(m.attachEvent("onclick",function(){b.noCloneEvent=!1}),m.cloneNode(!0).fireEvent("onclick")),g=G.createElement("input"),g.value="t",g.setAttribute("type","radio"),b.radioValue="t"===g.value,g.setAttribute("checked","checked"),g.setAttribute("name","t"),m.appendChild(g),h=G.createDocumentFragment(),h.appendChild(m.lastChild),b.checkClone=h.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=g.checked,h.removeChild(g),h.appendChild(m),m.attachEvent)for(k in{submit:1,change:1,focusin:1})j="on"+k,l=j in m,l||(m.setAttribute(j,"return;"),l="function"==typeof m[j]),b[k+"Bubbles"]=l;return h.removeChild(m),h=e=f=m=g=null,J(function(){var c,d,e,f,g,h,j,k,n,o,p,q,r=G.getElementsByTagName("body")[0];!r||(j=1,q="padding:0;margin:0;border:",o="position:absolute;top:0;left:0;width:1px;height:1px;",p=q+"0;visibility:hidden;",k="style='"+o+q+"5px solid #000;",n="<div "+k+"display:block;'><div style='"+q+"0;display:block;overflow:hidden;'></div></div><table "+k+"' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>",c=G.createElement("div"),c.style.cssText=p+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(c,r.firstChild),m=G.createElement("div"),c.appendChild(m),m.innerHTML="<table><tr><td style='"+q+"0;display:none'></td><td>t</td></tr></table>",i=m.getElementsByTagName("td"),l=0===i[0].offsetHeight,i[0].style.display="",i[1].style.display="none",b.reliableHiddenOffsets=l&&0===i[0].offsetHeight,a.getComputedStyle&&(m.innerHTML="",h=G.createElement("div"),h.style.width="0",h.style.marginRight="0",m.style.width="2px",m.appendChild(h),b.reliableMarginRight=0===(parseInt((a.getComputedStyle(h,null)||{marginRight:0}).marginRight,10)||0)),"undefined"!=typeof m.style.zoom&&(m.innerHTML="",m.style.width=m.style.padding="1px",m.style.border=0,m.style.overflow="hidden",m.style.display="inline",m.style.zoom=1,b.inlineBlockNeedsLayout=3===m.offsetWidth,m.style.display="block",m.style.overflow="visible",m.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=3!==m.offsetWidth),m.style.cssText=o+p,m.innerHTML=n,d=m.firstChild,e=d.firstChild,f=d.nextSibling.firstChild.firstChild,g={doesNotAddBorder:5!==e.offsetTop,doesAddBorderForTableAndCells:5===f.offsetTop},e.style.position="fixed",e.style.top="20px",g.fixedPosition=20===e.offsetTop||15===e.offsetTop,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",g.subtractsBorderForOverflowNotVisible=-5===e.offsetTop,g.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,a.getComputedStyle&&(m.style.marginTop="1%",b.pixelMargin="1%"!==(a.getComputedStyle(m,null)||{marginTop:0}).marginTop),"undefined"!=typeof c.style.zoom&&(c.style.zoom=1),r.removeChild(c),h=m=c=null,J.extend(b,g))}),b}();var M=/^(?:\{.*\}|\[.*\])$/,N=/([A-Z])/g;J.extend({cache:{},uuid:0,expando:"jQuery"+(J.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){return a=a.nodeType?J.cache[a[J.expando]]:a[J.expando],!!a&&!D(a)},data:function(a,c,d,e){if(J.acceptData(a)){var f,g,h,i=J.expando,j="string"==typeof c,k=a.nodeType,l=k?J.cache:a,m=k?a[i]:a[i]&&i,n="events"===c;if(!(m&&l[m]&&(n||e||l[m].data)||!j||d!==b))return;return m||(k?a[i]=m=++J.uuid:m=i),l[m]||(l[m]={},k||(l[m].toJSON=J.noop)),("object"==typeof c||"function"==typeof c)&&(e?l[m]=J.extend(l[m],c):l[m].data=J.extend(l[m].data,c)),f=g=l[m],e||(g.data||(g.data={}),g=g.data),d!==b&&(g[J.camelCase(c)]=d),n&&!g[c]?f.events:(j?(h=g[c],null==h&&(h=g[J.camelCase(c)])):h=g,h)}},removeData:function(a,b,c){if(J.acceptData(a)){var d,e,f,g=J.expando,h=a.nodeType,i=h?J.cache:a,j=h?a[g]:g;if(!i[j])return;if(b&&(d=c?i[j]:i[j].data)){J.isArray(b)||(b in d?b=[b]:(b=J.camelCase(b),b=b in d?[b]:b.split(" ")));for(e=0,f=b.length;f>e;e++)delete d[b[e]];if(!(c?D:J.isEmptyObject)(d))return}if(!c&&(delete i[j].data,!D(i[j])))return;J.support.deleteExpando||!i.setInterval?delete i[j]:i[j]=null,h&&(J.support.deleteExpando?delete a[g]:a.removeAttribute?a.removeAttribute(g):a[g]=null)}},_data:function(a,b,c){return J.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=J.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),J.fn.extend({data:function(a,c){var d,e,f,g,h,i=this[0],j=0,k=null;if(a===b){if(this.length&&(k=J.data(i),1===i.nodeType&&!J._data(i,"parsedAttrs"))){for(f=i.attributes,h=f.length;h>j;j++)g=f[j].name,0===g.indexOf("data-")&&(g=J.camelCase(g.substring(5)),E(i,g,k[g]));J._data(i,"parsedAttrs",!0)}return k}return"object"==typeof a?this.each(function(){J.data(this,a)}):(d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!",J.access(this,function(c){return c===b?(k=this.triggerHandler("getData"+e,[d[0]]),k===b&&i&&(k=J.data(i,a),k=E(i,a,k)),k===b&&d[1]?this.data(d[0]):k):(d[1]=c,void this.each(function(){var b=J(this);b.triggerHandler("setData"+e,d),J.data(this,a,c),b.triggerHandler("changeData"+e,d)}))},null,c,arguments.length>1,null,!1))},removeData:function(a){return this.each(function(){J.removeData(this,a)})}}),J.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",J._data(a,b,(J._data(a,b)||0)+1))},_unmark:function(a,b,c){if(a!==!0&&(c=b,b=a,a=!1),b){c=c||"fx";var d=c+"mark",e=a?0:(J._data(b,d)||1)-1;e?J._data(b,d,e):(J.removeData(b,d,!0),C(b,c,"mark"))}},queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=J._data(a,b),c&&(!d||J.isArray(c)?d=J._data(a,b,J.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=J.queue(a,b),d=c.shift(),e={};"inprogress"===d&&(d=c.shift()),d&&("fx"===b&&c.unshift("inprogress"),J._data(a,b+".run",e),d.call(a,function(){J.dequeue(a,b)},e)),c.length||(J.removeData(a,b+"queue "+b+".run",!0),C(a,b,"queue"))}}),J.fn.extend({queue:function(a,c){var d=2;return"string"!=typeof a&&(c=a,a="fx",d--),arguments.length<d?J.queue(this[0],a):c===b?this:this.each(function(){var b=J.queue(this,a,c);"fx"===a&&"inprogress"!==b[0]&&J.dequeue(this,a)})},dequeue:function(a){return this.each(function(){J.dequeue(this,a)})},delay:function(a,b){return a=J.fx?J.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function d(){--i||f.resolveWith(g,[g])}"string"!=typeof a&&(c=a,a=b),a=a||"fx";for(var e,f=J.Deferred(),g=this,h=g.length,i=1,j=a+"defer",k=a+"queue",l=a+"mark";h--;)(e=J.data(g[h],j,b,!0)||(J.data(g[h],k,b,!0)||J.data(g[h],l,b,!0))&&J.data(g[h],j,J.Callbacks("once memory"),!0))&&(i++,e.add(d));return d(),f.promise(c)}});var O,P,Q,R=/[\n\t\r]/g,S=/\s+/,T=/\r/g,U=/^(?:button|input)$/i,V=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea)?$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,Y=J.support.getSetAttribute;J.fn.extend({attr:function(a,b){return J.access(this,J.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){J.removeAttr(this,a)})},prop:function(a,b){return J.access(this,J.prop,a,b,arguments.length>1)},removeProp:function(a){return a=J.propFix[a]||a,this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,f,g,h;if(J.isFunction(a))return this.each(function(b){J(this).addClass(a.call(this,b,this.className))});if(a&&"string"==typeof a)for(b=a.split(S),c=0,d=this.length;d>c;c++)if(e=this[c],1===e.nodeType)if(e.className||1!==b.length){for(f=" "+e.className+" ",g=0,h=b.length;h>g;g++)~f.indexOf(" "+b[g]+" ")||(f+=b[g]+" ");e.className=J.trim(f)}else e.className=a;return this},removeClass:function(a){var c,d,e,f,g,h,i;if(J.isFunction(a))return this.each(function(b){J(this).removeClass(a.call(this,b,this.className))});if(a&&"string"==typeof a||a===b)for(c=(a||"").split(S),d=0,e=this.length;e>d;d++)if(f=this[d],1===f.nodeType&&f.className)if(a){for(g=(" "+f.className+" ").replace(R," "),h=0,i=c.length;i>h;h++)g=g.replace(" "+c[h]+" "," ");f.className=J.trim(g)}else f.className="";return this},toggleClass:function(a,b){var c=typeof a,d="boolean"==typeof b;return this.each(J.isFunction(a)?function(c){J(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c)for(var e,f=0,g=J(this),h=b,i=a.split(S);e=i[f++];)h=d?h:!g.hasClass(e),g[h?"addClass":"removeClass"](e);else("undefined"===c||"boolean"===c)&&(this.className&&J._data(this,"__className__",this.className),this.className=this.className||a===!1?"":J._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(R," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,f=this[0];return arguments.length?(e=J.isFunction(a),this.each(function(d){var f,g=J(this);1===this.nodeType&&(f=e?a.call(this,d,g.val()):a,null==f?f="":"number"==typeof f?f+="":J.isArray(f)&&(f=J.map(f,function(a){return null==a?"":a+""})),c=J.valHooks[this.type]||J.valHooks[this.nodeName.toLowerCase()],c&&"set"in c&&c.set(this,f,"value")!==b||(this.value=f))})):f?(c=J.valHooks[f.type]||J.valHooks[f.nodeName.toLowerCase()],c&&"get"in c&&(d=c.get(f,"value"))!==b?d:(d=f.value,"string"==typeof d?d.replace(T,""):null==d?"":d)):void 0}}),J.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,f=a.selectedIndex,g=[],h=a.options,i="select-one"===a.type;if(0>f)return null;for(c=i?f:0,d=i?f+1:h.length;d>c;c++)if(e=h[c],!(!e.selected||(J.support.optDisabled?e.disabled:null!==e.getAttribute("disabled"))||e.parentNode.disabled&&J.nodeName(e.parentNode,"optgroup"))){if(b=J(e).val(),i)return b;g.push(b)}return i&&!g.length&&h.length?J(h[f]).val():g},set:function(a,b){var c=J.makeArray(b);return J(a).find("option").each(function(){this.selected=J.inArray(J(this).val(),c)>=0}),c.length||(a.selectedIndex=-1),c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var f,g,h,i=a.nodeType;return a&&3!==i&&8!==i&&2!==i?e&&c in J.attrFn?J(a)[c](d):"undefined"==typeof a.getAttribute?J.prop(a,c,d):(h=1!==i||!J.isXMLDoc(a),h&&(c=c.toLowerCase(),g=J.attrHooks[c]||(X.test(c)?P:O)),d!==b?null===d?void J.removeAttr(a,c):g&&"set"in g&&h&&(f=g.set(a,d,c))!==b?f:(a.setAttribute(c,""+d),d):g&&"get"in g&&h&&null!==(f=g.get(a,c))?f:(f=a.getAttribute(c),null===f?b:f)):void 0},removeAttr:function(a,b){var c,d,e,f,g,h=0;if(b&&1===a.nodeType)for(d=b.toLowerCase().split(S),f=d.length;f>h;h++)e=d[h],e&&(c=J.propFix[e]||e,g=X.test(e),g||J.attr(a,e,""),a.removeAttribute(Y?e:c),g&&c in a&&(a[c]=!1))},attrHooks:{
type:{set:function(a,b){if(U.test(a.nodeName)&&a.parentNode)J.error("type property can't be changed");else if(!J.support.radioValue&&"radio"===b&&J.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}},value:{get:function(a,b){return O&&J.nodeName(a,"button")?O.get(a,b):b in a?a.value:null},set:function(a,b,c){return O&&J.nodeName(a,"button")?O.set(a,b,c):void(a.value=b)}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,f,g,h=a.nodeType;return a&&3!==h&&8!==h&&2!==h?(g=1!==h||!J.isXMLDoc(a),g&&(c=J.propFix[c]||c,f=J.propHooks[c]),d!==b?f&&"set"in f&&(e=f.set(a,d,c))!==b?e:a[c]=d:f&&"get"in f&&null!==(e=f.get(a,c))?e:a[c]):void 0},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):V.test(a.nodeName)||W.test(a.nodeName)&&a.href?0:b}}}}),J.attrHooks.tabindex=J.propHooks.tabIndex,P={get:function(a,c){var d,e=J.prop(a,c);return e===!0||"boolean"!=typeof e&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;return b===!1?J.removeAttr(a,c):(d=J.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase())),c}},Y||(Q={name:!0,id:!0,coords:!0},O=J.valHooks.button={get:function(a,c){var d;return d=a.getAttributeNode(c),d&&(Q[c]?""!==d.nodeValue:d.specified)?d.nodeValue:b},set:function(a,b,c){var d=a.getAttributeNode(c);return d||(d=G.createAttribute(c),a.setAttributeNode(d)),d.nodeValue=b+""}},J.attrHooks.tabindex.set=O.set,J.each(["width","height"],function(a,b){J.attrHooks[b]=J.extend(J.attrHooks[b],{set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}})}),J.attrHooks.contenteditable={get:O.get,set:function(a,b,c){""===b&&(b="false"),O.set(a,b,c)}}),J.support.hrefNormalized||J.each(["href","src","width","height"],function(a,c){J.attrHooks[c]=J.extend(J.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return null===d?b:d}})}),J.support.style||(J.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),J.support.optSelected||(J.propHooks.selected=J.extend(J.propHooks.selected,{get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}})),J.support.enctype||(J.propFix.enctype="encoding"),J.support.checkOn||J.each(["radio","checkbox"],function(){J.valHooks[this]={get:function(a){return null===a.getAttribute("value")?"on":a.value}}}),J.each(["radio","checkbox"],function(){J.valHooks[this]=J.extend(J.valHooks[this],{set:function(a,b){return J.isArray(b)?a.checked=J.inArray(J(a).val(),b)>=0:void 0}})});var Z=/^(?:textarea|input|select)$/i,$=/^([^\.]*)?(?:\.(.+))?$/,_=/(?:^|\s)hover(\.\S+)?\b/,aa=/^key/,ba=/^(?:mouse|contextmenu)|click/,ca=/^(?:focusinfocus|focusoutblur)$/,da=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,ea=function(a){var b=da.exec(a);return b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)")),b},fa=function(a,b){var c=a.attributes||{};return!(b[1]&&a.nodeName.toLowerCase()!==b[1]||b[2]&&(c.id||{}).value!==b[2]||b[3]&&!b[3].test((c["class"]||{}).value))},ga=function(a){return J.event.special.hover?a:a.replace(_,"mouseenter$1 mouseleave$1")};J.event={add:function(a,c,d,e,f){var g,h,i,j,k,l,m,n,o,p,q;if(3!==a.nodeType&&8!==a.nodeType&&c&&d&&(g=J._data(a))){for(d.handler&&(o=d,d=o.handler,f=o.selector),d.guid||(d.guid=J.guid++),i=g.events,i||(g.events=i={}),h=g.handle,h||(g.handle=h=function(a){return"undefined"==typeof J||a&&J.event.triggered===a.type?b:J.event.dispatch.apply(h.elem,arguments)},h.elem=a),c=J.trim(ga(c)).split(" "),j=0;j<c.length;j++)k=$.exec(c[j])||[],l=k[1],m=(k[2]||"").split(".").sort(),q=J.event.special[l]||{},l=(f?q.delegateType:q.bindType)||l,q=J.event.special[l]||{},n=J.extend({type:l,origType:k[1],data:e,handler:d,guid:d.guid,selector:f,quick:f&&ea(f),namespace:m.join(".")},o),p=i[l],p||(p=i[l]=[],p.delegateCount=0,q.setup&&q.setup.call(a,e,m,h)!==!1||(a.addEventListener?a.addEventListener(l,h,!1):a.attachEvent&&a.attachEvent("on"+l,h))),q.add&&(q.add.call(a,n),n.handler.guid||(n.handler.guid=d.guid)),f?p.splice(p.delegateCount++,0,n):p.push(n),J.event.global[l]=!0;a=null}},global:{},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r=J.hasData(a)&&J._data(a);if(r&&(m=r.events)){for(b=J.trim(ga(b||"")).split(" "),f=0;f<b.length;f++)if(g=$.exec(b[f])||[],h=i=g[1],j=g[2],h){for(n=J.event.special[h]||{},h=(d?n.delegateType:n.bindType)||h,p=m[h]||[],k=p.length,j=j?new RegExp("(^|\\.)"+j.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null,l=0;l<p.length;l++)q=p[l],!(!e&&i!==q.origType||c&&c.guid!==q.guid||j&&!j.test(q.namespace)||d&&d!==q.selector&&("**"!==d||!q.selector)||(p.splice(l--,1),q.selector&&p.delegateCount--,!n.remove||!n.remove.call(a,q)));0===p.length&&k!==p.length&&((!n.teardown||n.teardown.call(a,j)===!1)&&J.removeEvent(a,h,r.handle),delete m[h])}else for(h in m)J.event.remove(a,h+b[f],c,d,!0);J.isEmptyObject(m)&&(o=r.handle,o&&(o.elem=null),J.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,f){if(!e||3!==e.nodeType&&8!==e.nodeType){var g,h,i,j,k,l,m,n,o,p,q=c.type||c,r=[];if(ca.test(q+J.event.triggered))return;if(q.indexOf("!")>=0&&(q=q.slice(0,-1),h=!0),q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),(!e||J.event.customEvent[q])&&!J.event.global[q])return;if(c="object"==typeof c?c[J.expando]?c:new J.Event(q,c):new J.Event(q),c.type=q,c.isTrigger=!0,c.exclusive=h,c.namespace=r.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,l=q.indexOf(":")<0?"on"+q:"",!e){g=J.cache;for(i in g)g[i].events&&g[i].events[q]&&J.event.trigger(c,d,g[i].handle.elem,!0);return}if(c.result=b,c.target||(c.target=e),d=null!=d?J.makeArray(d):[],d.unshift(c),m=J.event.special[q]||{},m.trigger&&m.trigger.apply(e,d)===!1)return;if(o=[[e,m.bindType||q]],!f&&!m.noBubble&&!J.isWindow(e)){for(p=m.delegateType||q,j=ca.test(p+q)?e:e.parentNode,k=null;j;j=j.parentNode)o.push([j,p]),k=j;k&&k===e.ownerDocument&&o.push([k.defaultView||k.parentWindow||a,p])}for(i=0;i<o.length&&!c.isPropagationStopped();i++)j=o[i][0],c.type=o[i][1],n=(J._data(j,"events")||{})[c.type]&&J._data(j,"handle"),n&&n.apply(j,d),n=l&&j[l],n&&J.acceptData(j)&&n.apply(j,d)===!1&&c.preventDefault();return c.type=q,!(f||c.isDefaultPrevented()||m._default&&m._default.apply(e.ownerDocument,d)!==!1||"click"===q&&J.nodeName(e,"a")||!J.acceptData(e)||!l||!e[q]||("focus"===q||"blur"===q)&&0===c.target.offsetWidth||J.isWindow(e)||(k=e[l],k&&(e[l]=null),J.event.triggered=q,e[q](),J.event.triggered=b,!k||!(e[l]=k))),c.result}},dispatch:function(c){c=J.event.fix(c||a.event);var d,e,f,g,h,i,j,k,l,m,n=(J._data(this,"events")||{})[c.type]||[],o=n.delegateCount,p=[].slice.call(arguments,0),q=!c.exclusive&&!c.namespace,r=J.event.special[c.type]||{},s=[];if(p[0]=c,c.delegateTarget=this,!r.preDispatch||r.preDispatch.call(this,c)!==!1){if(o&&(!c.button||"click"!==c.type))for(g=J(this),g.context=this.ownerDocument||this,f=c.target;f!=this;f=f.parentNode||this)if(f.disabled!==!0){for(i={},k=[],g[0]=f,d=0;o>d;d++)l=n[d],m=l.selector,i[m]===b&&(i[m]=l.quick?fa(f,l.quick):g.is(m)),i[m]&&k.push(l);k.length&&s.push({elem:f,matches:k})}for(n.length>o&&s.push({elem:this,matches:n.slice(o)}),d=0;d<s.length&&!c.isPropagationStopped();d++)for(j=s[d],c.currentTarget=j.elem,e=0;e<j.matches.length&&!c.isImmediatePropagationStopped();e++)l=j.matches[e],(q||!c.namespace&&!l.namespace||c.namespace_re&&c.namespace_re.test(l.namespace))&&(c.data=l.data,c.handleObj=l,h=((J.event.special[l.origType]||{}).handle||l.handler).apply(j.elem,p),h!==b&&(c.result=h,h===!1&&(c.preventDefault(),c.stopPropagation())));return r.postDispatch&&r.postDispatch.call(this,c),c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,c){var d,e,f,g=c.button,h=c.fromElement;return null==a.pageX&&null!=c.clientX&&(d=a.target.ownerDocument||G,e=d.documentElement,f=d.body,a.pageX=c.clientX+(e&&e.scrollLeft||f&&f.scrollLeft||0)-(e&&e.clientLeft||f&&f.clientLeft||0),a.pageY=c.clientY+(e&&e.scrollTop||f&&f.scrollTop||0)-(e&&e.clientTop||f&&f.clientTop||0)),!a.relatedTarget&&h&&(a.relatedTarget=h===a.target?c.toElement:h),!a.which&&g!==b&&(a.which=1&g?1:2&g?3:4&g?2:0),a}},fix:function(a){if(a[J.expando])return a;var c,d,e=a,f=J.event.fixHooks[a.type]||{},g=f.props?this.props.concat(f.props):this.props;for(a=J.Event(e),c=g.length;c;)d=g[--c],a[d]=e[d];return a.target||(a.target=e.srcElement||G),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey),f.filter?f.filter(a,e):a},special:{ready:{setup:J.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){J.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=J.extend(new J.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?J.event.trigger(e,null,b):J.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},J.event.handle=J.event.dispatch,J.removeEvent=G.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},J.Event=function(a,b){return this instanceof J.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?A:B):this.type=a,b&&J.extend(this,b),this.timeStamp=a&&a.timeStamp||J.now(),this[J.expando]=!0,void 0):new J.Event(a,b)},J.Event.prototype={preventDefault:function(){this.isDefaultPrevented=A;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=A;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=A,this.stopPropagation()},isDefaultPrevented:B,isPropagationStopped:B,isImmediatePropagationStopped:B},J.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){J.event.special[a]={delegateType:b,bindType:b,handle:function(a){{var c,d=this,e=a.relatedTarget,f=a.handleObj;f.selector}return(!e||e!==d&&!J.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),J.support.submitBubbles||(J.event.special.submit={setup:function(){return J.nodeName(this,"form")?!1:void J.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=J.nodeName(c,"input")||J.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(J.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&J.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return J.nodeName(this,"form")?!1:void J.event.remove(this,"._submit")}}),J.support.changeBubbles||(J.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(J.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),J.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,J.event.simulate("change",this,a,!0))})),!1):void J.event.add(this,"beforeactivate._change",function(a){var b=a.target;Z.test(b.nodeName)&&!b._change_attached&&(J.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&J.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return J.event.remove(this,"._change"),Z.test(this.nodeName)}}),J.support.focusinBubbles||J.each({focus:"focusin",blur:"focusout"},function(a,b){var c=0,d=function(a){J.event.simulate(b,a.target,J.event.fix(a),!0)};J.event.special[b]={setup:function(){0===c++&&G.addEventListener(a,d,!0)},teardown:function(){0===--c&&G.removeEventListener(a,d,!0)}}}),J.fn.extend({on:function(a,c,d,e,f){var g,h;if("object"==typeof a){"string"!=typeof c&&(d=d||c,c=b);for(h in a)this.on(h,c,d,a[h],f);return this}if(null==d&&null==e?(e=c,d=c=b):null==e&&("string"==typeof c?(e=d,d=b):(e=d,d=c,c=b)),e===!1)e=B;else if(!e)return this;return 1===f&&(g=e,e=function(a){return J().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=J.guid++)),this.each(function(){J.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;return J(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler),this}if("object"==typeof a){for(var f in a)this.off(f,c,a[f]);return this}return(c===!1||"function"==typeof c)&&(d=c,c=b),d===!1&&(d=B),this.each(function(){J.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){return J(this.context).on(a,this.selector,b,c),this},die:function(a,b){return J(this.context).off(a,this.selector||"**",b),this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1==arguments.length?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){J.event.trigger(a,b,this)})},triggerHandler:function(a,b){return this[0]?J.event.trigger(a,b,this[0],!0):void 0},toggle:function(a){var b=arguments,c=a.guid||J.guid++,d=0,e=function(c){var e=(J._data(this,"lastToggle"+a.guid)||0)%d;return J._data(this,"lastToggle"+a.guid,e+1),c.preventDefault(),b[e].apply(this,arguments)||!1};for(e.guid=c;d<b.length;)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),J.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){J.fn[b]=function(a,c){return null==c&&(c=a,a=null),arguments.length>0?this.on(b,null,a,c):this.trigger(b)},J.attrFn&&(J.attrFn[b]=!0),aa.test(b)&&(J.event.fixHooks[b]=J.event.keyHooks),ba.test(b)&&(J.event.fixHooks[b]=J.event.mouseHooks)}),function(){function a(a,b,c,d,f,g){for(var h=0,i=d.length;i>h;h++){var j=d[h];if(j){var k=!1;for(j=j[a];j;){if(j[e]===c){k=d[j.sizset];break}if(1===j.nodeType)if(g||(j[e]=c,j.sizset=h),"string"!=typeof b){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}j=j[a]}d[h]=k}}}function c(a,b,c,d,f,g){for(var h=0,i=d.length;i>h;h++){var j=d[h];if(j){var k=!1;for(j=j[a];j;){if(j[e]===c){k=d[j.sizset];break}if(1===j.nodeType&&!g&&(j[e]=c,j.sizset=h),j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}d[h]=k}}}var d=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e="sizcache"+(Math.random()+"").replace(".",""),f=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){return i=!1,0});var m=function(a,b,c,e){c=c||[],b=b||G;var f=b;if(1!==b.nodeType&&9!==b.nodeType)return[];if(!a||"string"!=typeof a)return c;var h,i,j,k,l,n,q,r,t=!0,u=m.isXML(b),v=[],x=a;do if(d.exec(""),h=d.exec(x),h&&(x=h[3],v.push(h[1]),h[2])){k=h[3];break}while(h);if(v.length>1&&p.exec(a))if(2===v.length&&o.relative[v[0]])i=w(v[0]+v[1],b,e);else for(i=o.relative[v[0]]?[b]:m(v.shift(),b);v.length;)a=v.shift(),o.relative[a]&&(a+=v.shift()),i=w(a,i,e);else if(!e&&v.length>1&&9===b.nodeType&&!u&&o.match.ID.test(v[0])&&!o.match.ID.test(v[v.length-1])&&(l=m.find(v.shift(),b,u),b=l.expr?m.filter(l.expr,l.set)[0]:l.set[0]),b)for(l=e?{expr:v.pop(),set:s(e)}:m.find(v.pop(),1!==v.length||"~"!==v[0]&&"+"!==v[0]||!b.parentNode?b:b.parentNode,u),i=l.expr?m.filter(l.expr,l.set):l.set,v.length>0?j=s(i):t=!1;v.length;)n=v.pop(),q=n,o.relative[n]?q=v.pop():n="",null==q&&(q=b),o.relative[n](j,q,u);else j=v=[];if(j||(j=i),j||m.error(n||a),"[object Array]"===g.call(j))if(t)if(b&&1===b.nodeType)for(r=0;null!=j[r];r++)j[r]&&(j[r]===!0||1===j[r].nodeType&&m.contains(b,j[r]))&&c.push(i[r]);else for(r=0;null!=j[r];r++)j[r]&&1===j[r].nodeType&&c.push(i[r]);else c.push.apply(c,j);else s(j,c);return k&&(m(k,f,c,e),m.uniqueSort(c)),c};m.uniqueSort=function(a){if(u&&(h=i,a.sort(u),h))for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1);return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;f>e;e++)if(h=o.order[e],(g=o.leftMatch[h].exec(a))&&(i=g[1],g.splice(1,1),"\\"!==i.substr(i.length-1)&&(g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c),null!=d))){a=a.replace(o.match[h],"");break}return d||(d="undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName("*"):[]),{set:d,expr:a}},m.filter=function(a,c,d,e){for(var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);a&&c.length;){for(h in o.filter)if(null!=(f=o.leftMatch[h].exec(a))&&f[2]){if(k=o.filter[h],l=f[1],g=!1,f.splice(1,1),"\\"===l.substr(l.length-1))continue;if(s===r&&(r=[]),o.preFilter[h])if(f=o.preFilter[h](f,s,d,r,e,t)){if(f===!0)continue}else g=i=!0;if(f)for(n=0;null!=(j=s[n]);n++)j&&(i=k(j,f,n,s),p=e^i,d&&null!=i?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){if(d||(s=r),a=a.replace(o.match[h],""),!g)return[];break}}if(a===q){if(null!=g)break;m.error(a)}q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(1===d||9===d||11===d){if("string"==typeof a.textContent)return a.textContent;if("string"==typeof a.innerText)return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(3===d||4===d)return a.nodeValue}else for(b=0;c=a[b];b++)8!==c.nodeType&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c="string"==typeof b,d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f,g=0,h=a.length;h>g;g++)if(f=a[g]){for(;(f=f.previousSibling)&&1!==f.nodeType;);a[g]=e||f&&f.nodeName.toLowerCase()===b?f||!1:f===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d="string"==typeof b,e=0,f=a.length;if(d&&!l.test(b)){for(b=b.toLowerCase();f>e;e++)if(c=a[e]){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}else{for(;f>e;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(b,d,e){var g,h=f++,i=a;"string"==typeof d&&!l.test(d)&&(d=d.toLowerCase(),g=d,i=c),i("parentNode",d,h,b,g,e)},"~":function(b,d,e){var g,h=f++,i=a;"string"==typeof d&&!l.test(d)&&(d=d.toLowerCase(),g=d,i=c),i("previousSibling",d,h,b,g,e)}},find:{ID:function(a,b,c){if("undefined"!=typeof b.getElementById&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if("undefined"!=typeof b.getElementsByName){for(var c=[],d=b.getElementsByName(a[1]),e=0,f=d.length;f>e;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return 0===c.length?null:c}},TAG:function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a[1]):void 0}},preFilter:{CLASS:function(a,b,c,d,e,f){if(a=" "+a[1].replace(j,"")+" ",f)return a;for(var g,h=0;null!=(g=b[h]);h++)g&&(e^(g.className&&(" "+g.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(g):c&&(b[h]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if("nth"===a[1]){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec("even"===a[2]&&"2n"||"odd"===a[2]&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);return a[0]=f++,a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");return!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),"~="===a[2]&&(a[4]=" "+a[4]+" "),a},PSEUDO:function(a,b,c,e,f){if("not"===a[1]){if(!((d.exec(a[3])||"").length>1||/^\w/.test(a[3]))){var g=m.filter(a[3],b,c,!0^f);return c||e.push.apply(e,g),!1}a[3]=m(a[3],null,null,b)}else if(o.match.POS.test(a[0])||o.match.CHILD.test(a[0]))return!0;return a},POS:function(a){return a.unshift(!0),a}},filters:{enabled:function(a){return a.disabled===!1&&"hidden"!==a.type},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return"input"===a.nodeName.toLowerCase()&&"text"===c&&(b===c||null===b)},radio:function(a){return"input"===a.nodeName.toLowerCase()&&"radio"===a.type},checkbox:function(a){return"input"===a.nodeName.toLowerCase()&&"checkbox"===a.type},file:function(a){return"input"===a.nodeName.toLowerCase()&&"file"===a.type},password:function(a){return"input"===a.nodeName.toLowerCase()&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return("input"===b||"button"===b)&&"submit"===a.type},image:function(a){return"input"===a.nodeName.toLowerCase()&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return("input"===b||"button"===b)&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return 0===b},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if("contains"===e)return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if("not"===e){for(var g=b[3],h=0,i=g.length;i>h;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,d,f,g,h,i,j=b[1],k=a;switch(j){case"only":case"first":for(;k=k.previousSibling;)if(1===k.nodeType)return!1;if("first"===j)return!0;k=a;case"last":for(;k=k.nextSibling;)if(1===k.nodeType)return!1;return!0;case"nth":if(c=b[2],d=b[3],1===c&&0===d)return!0;if(f=b[0],g=a.parentNode,g&&(g[e]!==f||!a.nodeIndex)){for(h=0,k=g.firstChild;k;k=k.nextSibling)1===k.nodeType&&(k.nodeIndex=++h);g[e]=f}return i=a.nodeIndex-d,0===c?0===i:i%c===0&&i/c>=0}},ID:function(a,b){return 1===a.nodeType&&a.getAttribute("id")===b},TAG:function(a,b){return"*"===b&&1===a.nodeType||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):null!=a[c]?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return null==d?"!="===f:!f&&m.attr?null!=d:"="===f?e===g:"*="===f?e.indexOf(g)>=0:"~="===f?(" "+e+" ").indexOf(g)>=0:g?"!="===f?e!==g:"^="===f?0===e.indexOf(g):"$="===f?e.substr(e.length-g.length)===g:"|="===f?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];return f?f(a,c,b,d):void 0}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){return a=Array.prototype.slice.call(a,0),b?(b.push.apply(b,a),b):a};try{Array.prototype.slice.call(G.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if("[object Array]"===g.call(a))Array.prototype.push.apply(d,a);else if("number"==typeof a.length)for(var e=a.length;e>c;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;G.documentElement.compareDocumentPosition?u=function(a,b){return a===b?(h=!0,0):a.compareDocumentPosition&&b.compareDocumentPosition?4&a.compareDocumentPosition(b)?-1:1:a.compareDocumentPosition?-1:1}:(u=function(a,b){if(a===b)return h=!0,0;if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;for(;j;)e.unshift(j),j=j.parentNode;for(j=i;j;)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;c>k&&d>k;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;for(var d=a.nextSibling;d;){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=G.createElement("div"),c="script"+(new Date).getTime(),d=G.documentElement;a.innerHTML="<a name='"+c+"'/>",d.insertBefore(a,d.firstChild),G.getElementById(c)&&(o.find.ID=function(a,c,d){if("undefined"!=typeof c.getElementById&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||"undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return 1===a.nodeType&&c&&c.nodeValue===b}),d.removeChild(a),d=a=null}(),function(){var a=G.createElement("div");a.appendChild(G.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if("*"===a[1]){for(var d=[],e=0;c[e];e++)1===c[e].nodeType&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&"undefined"!=typeof a.firstChild.getAttribute&&"#"!==a.firstChild.getAttribute("href")&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),G.querySelectorAll&&function(){var a=m,b=G.createElement("div"),c="__sizzle__";if(b.innerHTML="<p class='TEST'></p>",!b.querySelectorAll||0!==b.querySelectorAll(".TEST").length){m=function(b,d,e,f){if(d=d||G,!f&&!m.isXML(d)){var g=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(g&&(1===d.nodeType||9===d.nodeType)){if(g[1])return s(d.getElementsByTagName(b),e);if(g[2]&&o.find.CLASS&&d.getElementsByClassName)return s(d.getElementsByClassName(g[2]),e)}if(9===d.nodeType){if("body"===b&&d.body)return s([d.body],e);if(g&&g[3]){var h=d.getElementById(g[3]);if(!h||!h.parentNode)return s([],e);if(h.id===g[3])return s([h],e)}try{return s(d.querySelectorAll(b),e)}catch(i){}}else if(1===d.nodeType&&"object"!==d.nodeName.toLowerCase()){var j=d,k=d.getAttribute("id"),l=k||c,n=d.parentNode,p=/^\s*[+~]/.test(b);k?l=l.replace(/'/g,"\\$&"):d.setAttribute("id",l),p&&n&&(d=d.parentNode);try{if(!p||n)return s(d.querySelectorAll("[id='"+l+"'] "+b),e)}catch(q){}finally{k||j.removeAttribute("id")}}}return a(b,d,e,f)};for(var d in a)m[d]=a[d];b=null}}(),function(){var a=G.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var c=!b.call(G.createElement("div"),"div"),d=!1;try{b.call(G.documentElement,"[test!='']:sizzle")}catch(e){d=!0}m.matchesSelector=function(a,e){if(e=e.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']"),!m.isXML(a))try{if(d||!o.match.PSEUDO.test(e)&&!/!=/.test(e)){var f=b.call(a,e);if(f||!c||a.document&&11!==a.document.nodeType)return f}}catch(g){}return m(e,null,null,[a]).length>0}}}(),function(){var a=G.createElement("div");if(a.innerHTML="<div class='test e'></div><div class='test'></div>",a.getElementsByClassName&&0!==a.getElementsByClassName("e").length){if(a.lastChild.className="e",1===a.getElementsByClassName("e").length)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){return"undefined"==typeof b.getElementsByClassName||c?void 0:b.getElementsByClassName(a[1])},a=null}}(),G.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:G.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(16&a.compareDocumentPosition(b))}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?"HTML"!==b.nodeName:!1};var w=function(a,b,c){for(var d,e=[],f="",g=b.nodeType?[b]:b;d=o.match.PSEUDO.exec(a);)f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;i>h;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=J.attr,m.selectors.attrMap={},J.find=m,J.expr=m.selectors,J.expr[":"]=J.expr.filters,J.unique=m.uniqueSort,J.text=m.getText,J.isXMLDoc=m.isXML,J.contains=m.contains}();var ha=/Until$/,ia=/^(?:parents|prevUntil|prevAll)/,ja=/,/,ka=/^.[^:#\[\.,]*$/,la=Array.prototype.slice,ma=J.expr.match.globalPOS,na={children:!0,contents:!0,next:!0,prev:!0};J.fn.extend({find:function(a){var b,c,d=this;if("string"!=typeof a)return J(a).filter(function(){for(b=0,c=d.length;c>b;b++)if(J.contains(d[b],this))return!0});var e,f,g,h=this.pushStack("","find",a);for(b=0,c=this.length;c>b;b++)if(e=h.length,J.find(a,this[b],h),b>0)for(f=e;f<h.length;f++)for(g=0;e>g;g++)if(h[g]===h[f]){h.splice(f--,1);break}return h},has:function(a){var b=J(a);return this.filter(function(){for(var a=0,c=b.length;c>a;a++)if(J.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(y(this,a,!1),"not",a)},filter:function(a){return this.pushStack(y(this,a,!0),"filter",a)},is:function(a){return!!a&&("string"==typeof a?ma.test(a)?J(a,this.context).index(this[0])>=0:J.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c,d,e=[],f=this[0];if(J.isArray(a)){for(var g=1;f&&f.ownerDocument&&f!==b;){for(c=0;c<a.length;c++)J(f).is(a[c])&&e.push({selector:a[c],elem:f,level:g});f=f.parentNode,g++}return e}var h=ma.test(a)||"string"!=typeof a?J(a,b||this.context):0;for(c=0,d=this.length;d>c;c++)for(f=this[c];f;){if(h?h.index(f)>-1:J.find.matchesSelector(f,a)){e.push(f);break}if(f=f.parentNode,!f||!f.ownerDocument||f===b||11===f.nodeType)break}return e=e.length>1?J.unique(e):e,this.pushStack(e,"closest",a)},index:function(a){return a?"string"==typeof a?J.inArray(this[0],J(a)):J.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(a,b){var c="string"==typeof a?J(a,b):J.makeArray(a&&a.nodeType?[a]:a),d=J.merge(this.get(),c);return this.pushStack(z(c[0])||z(d[0])?d:J.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),J.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return J.dir(a,"parentNode");

},parentsUntil:function(a,b,c){return J.dir(a,"parentNode",c)},next:function(a){return J.nth(a,2,"nextSibling")},prev:function(a){return J.nth(a,2,"previousSibling")},nextAll:function(a){return J.dir(a,"nextSibling")},prevAll:function(a){return J.dir(a,"previousSibling")},nextUntil:function(a,b,c){return J.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return J.dir(a,"previousSibling",c)},siblings:function(a){return J.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return J.sibling(a.firstChild)},contents:function(a){return J.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:J.makeArray(a.childNodes)}},function(a,b){J.fn[a]=function(c,d){var e=J.map(this,b,c);return ha.test(a)||(d=c),d&&"string"==typeof d&&(e=J.filter(d,e)),e=this.length>1&&!na[a]?J.unique(e):e,(this.length>1||ja.test(d))&&ia.test(a)&&(e=e.reverse()),this.pushStack(e,a,la.call(arguments).join(","))}}),J.extend({filter:function(a,b,c){return c&&(a=":not("+a+")"),1===b.length?J.find.matchesSelector(b[0],a)?[b[0]]:[]:J.find.matches(a,b)},dir:function(a,c,d){for(var e=[],f=a[c];f&&9!==f.nodeType&&(d===b||1!==f.nodeType||!J(f).is(d));)1===f.nodeType&&e.push(f),f=f[c];return e},nth:function(a,b,c,d){b=b||1;for(var e=0;a&&(1!==a.nodeType||++e!==b);a=a[c]);return a},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}});var oa="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",pa=/ jQuery\d+="(?:\d+|null)"/g,qa=/^\s+/,ra=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,sa=/<([\w:]+)/,ta=/<tbody/i,ua=/<|&#?\w+;/,va=/<(?:script|style)/i,wa=/<(?:script|object|embed|option|style)/i,xa=new RegExp("<(?:"+oa+")[\\s/>]","i"),ya=/checked\s*(?:[^=]|=\s*.checked.)/i,za=/\/(java|ecma)script/i,Aa=/^\s*<!(?:\[CDATA\[|\-\-)/,Ba={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ca=x(G);Ba.optgroup=Ba.option,Ba.tbody=Ba.tfoot=Ba.colgroup=Ba.caption=Ba.thead,Ba.th=Ba.td,J.support.htmlSerialize||(Ba._default=[1,"div<div>","</div>"]),J.fn.extend({text:function(a){return J.access(this,function(a){return a===b?J.text(this):this.empty().append((this[0]&&this[0].ownerDocument||G).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(J.isFunction(a))return this.each(function(b){J(this).wrapAll(a.call(this,b))});if(this[0]){var b=J(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){for(var a=this;a.firstChild&&1===a.firstChild.nodeType;)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(J.isFunction(a)?function(b){J(this).wrapInner(a.call(this,b))}:function(){var b=J(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=J.isFunction(a);return this.each(function(c){J(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){J.nodeName(this,"body")||J(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){1===this.nodeType&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){1===this.nodeType&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=J.clean(arguments);return a.push.apply(a,this.toArray()),this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);return a.push.apply(a,J.clean(arguments)),a}},remove:function(a,b){for(var c,d=0;null!=(c=this[d]);d++)(!a||J.filter(a,[c]).length)&&(!b&&1===c.nodeType&&(J.cleanData(c.getElementsByTagName("*")),J.cleanData([c])),c.parentNode&&c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)for(1===a.nodeType&&J.cleanData(a.getElementsByTagName("*"));a.firstChild;)a.removeChild(a.firstChild);return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return J.clone(this,a,b)})},html:function(a){return J.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return 1===c.nodeType?c.innerHTML.replace(pa,""):null;if(!("string"!=typeof a||va.test(a)||!J.support.leadingWhitespace&&qa.test(a)||Ba[(sa.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(ra,"<$1></$2>");try{for(;e>d;d++)c=this[d]||{},1===c.nodeType&&(J.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(f){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){return this[0]&&this[0].parentNode?J.isFunction(a)?this.each(function(b){var c=J(this),d=c.html();c.replaceWith(a.call(this,b,d))}):("string"!=typeof a&&(a=J(a).detach()),this.each(function(){var b=this.nextSibling,c=this.parentNode;J(this).remove(),b?J(b).before(a):J(c).append(a)})):this.length?this.pushStack(J(J.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,f,g,h,i=a[0],j=[];if(!J.support.checkClone&&3===arguments.length&&"string"==typeof i&&ya.test(i))return this.each(function(){J(this).domManip(a,c,d,!0)});if(J.isFunction(i))return this.each(function(e){var f=J(this);a[0]=i.call(this,e,c?f.html():b),f.domManip(a,c,d)});if(this[0]){if(h=i&&i.parentNode,e=J.support.parentNode&&h&&11===h.nodeType&&h.childNodes.length===this.length?{fragment:h}:J.buildFragment(a,this,j),g=e.fragment,f=1===g.childNodes.length?g=g.firstChild:g.firstChild,f){c=c&&J.nodeName(f,"tr");for(var k=0,l=this.length,m=l-1;l>k;k++)d.call(c?w(this[k],f):this[k],e.cacheable||l>1&&m>k?J.clone(g,!0,!0):g)}j.length&&J.each(j,function(a,b){b.src?J.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):J.globalEval((b.text||b.textContent||b.innerHTML||"").replace(Aa,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),J.buildFragment=function(a,b,c){var d,e,f,g,h=a[0];return b&&b[0]&&(g=b[0].ownerDocument||b[0]),g.createDocumentFragment||(g=G),1===a.length&&"string"==typeof h&&h.length<512&&g===G&&"<"===h.charAt(0)&&!wa.test(h)&&(J.support.checkClone||!ya.test(h))&&(J.support.html5Clone||!xa.test(h))&&(e=!0,f=J.fragments[h],f&&1!==f&&(d=f)),d||(d=g.createDocumentFragment(),J.clean(a,g,d,c)),e&&(J.fragments[h]=f?d:1),{fragment:d,cacheable:e}},J.fragments={},J.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){J.fn[a]=function(c){var d=[],e=J(c),f=1===this.length&&this[0].parentNode;if(f&&11===f.nodeType&&1===f.childNodes.length&&1===e.length)return e[b](this[0]),this;for(var g=0,h=e.length;h>g;g++){var i=(g>0?this.clone(!0):this).get();J(e[g])[b](i),d=d.concat(i)}return this.pushStack(d,a,e.selector)}}),J.extend({clone:function(a,b,c){var d,e,f,g=J.support.html5Clone||J.isXMLDoc(a)||!xa.test("<"+a.nodeName+">")?a.cloneNode(!0):q(a);if(!(J.support.noCloneEvent&&J.support.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||J.isXMLDoc(a)))for(u(a,g),d=t(a),e=t(g),f=0;d[f];++f)e[f]&&u(d[f],e[f]);if(b&&(v(a,g),c))for(d=t(a),e=t(g),f=0;d[f];++f)v(d[f],e[f]);return d=e=null,g},clean:function(a,b,c,d){var e,f,g,h=[];b=b||G,"undefined"==typeof b.createElement&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||G);for(var i,j=0;null!=(i=a[j]);j++)if("number"==typeof i&&(i+=""),i){if("string"==typeof i)if(ua.test(i)){i=i.replace(ra,"<$1></$2>");var k,l=(sa.exec(i)||["",""])[1].toLowerCase(),m=Ba[l]||Ba._default,n=m[0],o=b.createElement("div"),p=Ca.childNodes;for(b===G?Ca.appendChild(o):x(b).appendChild(o),o.innerHTML=m[1]+i+m[2];n--;)o=o.lastChild;if(!J.support.tbody){var q=ta.test(i),s="table"!==l||q?"<table>"!==m[1]||q?[]:o.childNodes:o.firstChild&&o.firstChild.childNodes;for(g=s.length-1;g>=0;--g)J.nodeName(s[g],"tbody")&&!s[g].childNodes.length&&s[g].parentNode.removeChild(s[g])}!J.support.leadingWhitespace&&qa.test(i)&&o.insertBefore(b.createTextNode(qa.exec(i)[0]),o.firstChild),i=o.childNodes,o&&(o.parentNode.removeChild(o),p.length>0&&(k=p[p.length-1],k&&k.parentNode&&k.parentNode.removeChild(k)))}else i=b.createTextNode(i);var t;if(!J.support.appendChecked)if(i[0]&&"number"==typeof(t=i.length))for(g=0;t>g;g++)r(i[g]);else r(i);i.nodeType?h.push(i):h=J.merge(h,i)}if(c)for(e=function(a){return!a.type||za.test(a.type)},j=0;h[j];j++)if(f=h[j],d&&J.nodeName(f,"script")&&(!f.type||za.test(f.type)))d.push(f.parentNode?f.parentNode.removeChild(f):f);else{if(1===f.nodeType){var u=J.grep(f.getElementsByTagName("script"),e);h.splice.apply(h,[j+1,0].concat(u))}c.appendChild(f)}return h},cleanData:function(a){for(var b,c,d,e=J.cache,f=J.event.special,g=J.support.deleteExpando,h=0;null!=(d=a[h]);h++)if((!d.nodeName||!J.noData[d.nodeName.toLowerCase()])&&(c=d[J.expando])){if(b=e[c],b&&b.events){for(var i in b.events)f[i]?J.event.remove(d,i):J.removeEvent(d,i,b.handle);b.handle&&(b.handle.elem=null)}g?delete d[J.expando]:d.removeAttribute&&d.removeAttribute(J.expando),delete e[c]}}});var Da,Ea,Fa,Ga=/alpha\([^)]*\)/i,Ha=/opacity=([^)]*)/,Ia=/([A-Z]|^ms)/g,Ja=/^[\-+]?(?:\d*\.)?\d+$/i,Ka=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,La=/^([\-+])=([\-+.\de]+)/,Ma=/^margin/,Na={position:"absolute",visibility:"hidden",display:"block"},Oa=["Top","Right","Bottom","Left"];J.fn.css=function(a,c){return J.access(this,function(a,c,d){return d!==b?J.style(a,c,d):J.css(a,c)},a,c,arguments.length>1)},J.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Da(a,"opacity");return""===c?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":J.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var f,g,h=J.camelCase(c),i=a.style,j=J.cssHooks[h];if(c=J.cssProps[h]||h,d===b)return j&&"get"in j&&(f=j.get(a,!1,e))!==b?f:i[c];if(g=typeof d,"string"===g&&(f=La.exec(d))&&(d=+(f[1]+1)*+f[2]+parseFloat(J.css(a,c)),g="number"),null==d||"number"===g&&isNaN(d))return;if("number"===g&&!J.cssNumber[h]&&(d+="px"),!(j&&"set"in j&&(d=j.set(a,d))===b))try{i[c]=d}catch(k){}}},css:function(a,c,d){var e,f;return c=J.camelCase(c),f=J.cssHooks[c],c=J.cssProps[c]||c,"cssFloat"===c&&(c="float"),f&&"get"in f&&(e=f.get(a,!0,d))!==b?e:Da?Da(a,c):void 0},swap:function(a,b,c){var d,e,f={};for(e in b)f[e]=a.style[e],a.style[e]=b[e];d=c.call(a);for(e in b)a.style[e]=f[e];return d}}),J.curCSS=J.css,G.defaultView&&G.defaultView.getComputedStyle&&(Ea=function(a,b){var c,d,e,f,g=a.style;return b=b.replace(Ia,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),""===c&&!J.contains(a.ownerDocument.documentElement,a)&&(c=J.style(a,b))),!J.support.pixelMargin&&e&&Ma.test(b)&&Ka.test(c)&&(f=g.width,g.width=c,c=e.width,g.width=f),c}),G.documentElement.currentStyle&&(Fa=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;return null==f&&g&&(e=g[b])&&(f=e),Ka.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left="fontSize"===b?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d)),""===f?"auto":f}),Da=Ea||Fa,J.each(["height","width"],function(a,b){J.cssHooks[b]={get:function(a,c,d){return c?0!==a.offsetWidth?p(a,b,d):J.swap(a,Na,function(){return p(a,b,d)}):void 0},set:function(a,b){return Ja.test(b)?b+"px":b}}}),J.support.opacity||(J.cssHooks.opacity={get:function(a,b){return Ha.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=J.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,b>=1&&""===J.trim(f.replace(Ga,""))&&(c.removeAttribute("filter"),d&&!d.filter)||(c.filter=Ga.test(f)?f.replace(Ga,e):f+" "+e)}}),J(function(){J.support.reliableMarginRight||(J.cssHooks.marginRight={get:function(a,b){return J.swap(a,{display:"inline-block"},function(){return b?Da(a,"margin-right"):a.style.marginRight})}})}),J.expr&&J.expr.filters&&(J.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return 0===b&&0===c||!J.support.reliableHiddenOffsets&&"none"===(a.style&&a.style.display||J.css(a,"display"))},J.expr.filters.visible=function(a){return!J.expr.filters.hidden(a)}),J.each({margin:"",padding:"",border:"Width"},function(a,b){J.cssHooks[a+b]={expand:function(c){var d,e="string"==typeof c?c.split(" "):[c],f={};for(d=0;4>d;d++)f[a+Oa[d]+b]=e[d]||e[d-2]||e[0];return f}}});var Pa,Qa,Ra=/%20/g,Sa=/\[\]$/,Ta=/\r?\n/g,Ua=/#.*$/,Va=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Wa=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,Xa=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,Ya=/^(?:GET|HEAD)$/,Za=/^\/\//,$a=/\?/,_a=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,ab=/^(?:select|textarea)/i,bb=/\s+/,cb=/([?&])_=[^&]*/,db=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,eb=J.fn.load,fb={},gb={},hb=["*/"]+["*"];try{Pa=I.href}catch(ib){Pa=G.createElement("a"),Pa.href="",Pa=Pa.href}Qa=db.exec(Pa.toLowerCase())||[],J.fn.extend({load:function(a,c,d){if("string"!=typeof a&&eb)return eb.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var f=a.slice(e,a.length);a=a.slice(0,e)}var g="GET";c&&(J.isFunction(c)?(d=c,c=b):"object"==typeof c&&(c=J.param(c,J.ajaxSettings.traditional),g="POST"));var h=this;return J.ajax({url:a,type:g,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),h.html(f?J("<div>").append(c.replace(_a,"")).find(f):c)),d&&h.each(d,[c,b,a])}}),this},serialize:function(){return J.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?J.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||ab.test(this.nodeName)||Wa.test(this.type))}).map(function(a,b){var c=J(this).val();return null==c?null:J.isArray(c)?J.map(c,function(a,c){return{name:b.name,value:a.replace(Ta,"\r\n")}}):{name:b.name,value:c.replace(Ta,"\r\n")}}).get()}}),J.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){J.fn[b]=function(a){return this.on(b,a)}}),J.each(["get","post"],function(a,c){J[c]=function(a,d,e,f){return J.isFunction(d)&&(f=f||e,e=d,d=b),J.ajax({type:c,url:a,data:d,success:e,dataType:f})}}),J.extend({getScript:function(a,c){return J.get(a,b,c,"script")},getJSON:function(a,b,c){return J.get(a,b,c,"json")},ajaxSetup:function(a,b){return b?m(a,J.ajaxSettings):(b=a,a=J.ajaxSettings),m(a,b),a},ajaxSettings:{url:Pa,isLocal:Xa.test(Qa[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":hb},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":J.parseJSON,"text xml":J.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:o(fb),ajaxTransport:o(gb),ajax:function(a,c){function d(a,c,d,g){if(2!==x){x=2,i&&clearTimeout(i),h=b,f=g||"",y.readyState=a>0?4:0;var l,n,o,v,w,z=c,A=d?k(p,y,d):b;if(a>=200&&300>a||304===a)if(p.ifModified&&((v=y.getResponseHeader("Last-Modified"))&&(J.lastModified[e]=v),(w=y.getResponseHeader("Etag"))&&(J.etag[e]=w)),304===a)z="notmodified",l=!0;else try{n=j(p,A),z="success",l=!0}catch(B){z="parsererror",o=B}else o=z,(!z||a)&&(z="error",0>a&&(a=0));y.status=a,y.statusText=""+(c||z),l?s.resolveWith(q,[n,z,y]):s.rejectWith(q,[y,z,o]),y.statusCode(u),u=b,m&&r.trigger("ajax"+(l?"Success":"Error"),[y,p,l?n:o]),t.fireWith(q,[y,z]),m&&(r.trigger("ajaxComplete",[y,p]),--J.active||J.event.trigger("ajaxStop"))}}"object"==typeof a&&(c=a,a=b),c=c||{};var e,f,g,h,i,l,m,o,p=J.ajaxSetup({},c),q=p.context||p,r=q!==p&&(q.nodeType||q instanceof J)?J(q):J.event,s=J.Deferred(),t=J.Callbacks("once memory"),u=p.statusCode||{},v={},w={},x=0,y={readyState:0,setRequestHeader:function(a,b){if(!x){var c=a.toLowerCase();a=w[c]=w[c]||a,v[a]=b}return this},getAllResponseHeaders:function(){return 2===x?f:null},getResponseHeader:function(a){var c;if(2===x){if(!g)for(g={};c=Va.exec(f);)g[c[1].toLowerCase()]=c[2];c=g[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){return x||(p.mimeType=a),this},abort:function(a){return a=a||"abort",h&&h.abort(a),d(0,a),this}};if(s.promise(y),y.success=y.done,y.error=y.fail,y.complete=t.add,y.statusCode=function(a){if(a){var b;if(2>x)for(b in a)u[b]=[u[b],a[b]];else b=a[y.status],y.then(b,b)}return this},p.url=((a||p.url)+"").replace(Ua,"").replace(Za,Qa[1]+"//"),p.dataTypes=J.trim(p.dataType||"*").toLowerCase().split(bb),null==p.crossDomain&&(l=db.exec(p.url.toLowerCase()),p.crossDomain=!(!l||l[1]==Qa[1]&&l[2]==Qa[2]&&(l[3]||("http:"===l[1]?80:443))==(Qa[3]||("http:"===Qa[1]?80:443)))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=J.param(p.data,p.traditional)),n(fb,p,c,y),2===x)return!1;if(m=p.global,p.type=p.type.toUpperCase(),p.hasContent=!Ya.test(p.type),m&&0===J.active++&&J.event.trigger("ajaxStart"),!p.hasContent&&(p.data&&(p.url+=($a.test(p.url)?"&":"?")+p.data,delete p.data),e=p.url,p.cache===!1)){var z=J.now(),A=p.url.replace(cb,"$1_="+z);p.url=A+(A===p.url?($a.test(p.url)?"&":"?")+"_="+z:"")}(p.data&&p.hasContent&&p.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",p.contentType),p.ifModified&&(e=e||p.url,J.lastModified[e]&&y.setRequestHeader("If-Modified-Since",J.lastModified[e]),J.etag[e]&&y.setRequestHeader("If-None-Match",J.etag[e])),y.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+hb+"; q=0.01":""):p.accepts["*"]);for(o in p.headers)y.setRequestHeader(o,p.headers[o]);if(p.beforeSend&&(p.beforeSend.call(q,y,p)===!1||2===x))return y.abort(),!1;for(o in{success:1,error:1,complete:1})y[o](p[o]);if(h=n(gb,p,c,y)){y.readyState=1,m&&r.trigger("ajaxSend",[y,p]),p.async&&p.timeout>0&&(i=setTimeout(function(){y.abort("timeout")},p.timeout));try{x=1,h.send(v,d)}catch(B){if(!(2>x))throw B;d(-1,B)}}else d(-1,"No Transport");return y},param:function(a,c){var d=[],e=function(a,b){b=J.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(c===b&&(c=J.ajaxSettings.traditional),J.isArray(a)||a.jquery&&!J.isPlainObject(a))J.each(a,function(){e(this.name,this.value)});else for(var f in a)l(f,a[f],c,e);return d.join("&").replace(Ra,"+")}}),J.extend({active:0,lastModified:{},etag:{}});var jb=J.now(),kb=/(\=)\?(&|$)|\?\?/i;J.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return J.expando+"_"+jb++}}),J.ajaxPrefilter("json jsonp",function(b,c,d){var e="string"==typeof b.data&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if("jsonp"===b.dataTypes[0]||b.jsonp!==!1&&(kb.test(b.url)||e&&kb.test(b.data))){var f,g=b.jsonpCallback=J.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h=a[g],i=b.url,j=b.data,k="$1"+g+"$2";return b.jsonp!==!1&&(i=i.replace(kb,k),b.url===i&&(e&&(j=j.replace(kb,k)),b.data===j&&(i+=(/\?/.test(i)?"&":"?")+b.jsonp+"="+g))),b.url=i,b.data=j,a[g]=function(a){f=[a]},d.always(function(){a[g]=h,f&&J.isFunction(h)&&a[g](f[0])}),b.converters["script json"]=function(){return f||J.error(g+" was not called"),f[0]},b.dataTypes[0]="json","script"}}),J.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){return J.globalEval(a),a}}}),J.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),J.ajaxTransport("script",function(a){if(a.crossDomain){var c,d=G.head||G.getElementsByTagName("head")[0]||G.documentElement;return{send:function(e,f){c=G.createElement("script"),c.async="async",a.scriptCharset&&(c.charset=a.scriptCharset),c.src=a.url,c.onload=c.onreadystatechange=function(a,e){(e||!c.readyState||/loaded|complete/.test(c.readyState))&&(c.onload=c.onreadystatechange=null,d&&c.parentNode&&d.removeChild(c),c=b,e||f(200,"success"))},d.insertBefore(c,d.firstChild)},abort:function(){c&&c.onload(0,1)}}}});var lb,mb=a.ActiveXObject?function(){for(var a in lb)lb[a](0,1)}:!1,nb=0;J.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&i()||h()}:i,function(a){J.extend(J.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(J.ajaxSettings.xhr()),J.support.ajax&&J.ajaxTransport(function(c){if(!c.crossDomain||J.support.cors){var d;return{send:function(e,f){var g,h,i=c.xhr();if(c.username?i.open(c.type,c.url,c.async,c.username,c.password):i.open(c.type,c.url,c.async),c.xhrFields)for(h in c.xhrFields)i[h]=c.xhrFields[h];c.mimeType&&i.overrideMimeType&&i.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(h in e)i.setRequestHeader(h,e[h])}catch(j){}i.send(c.hasContent&&c.data||null),d=function(a,e){var h,j,k,l,m;try{if(d&&(e||4===i.readyState))if(d=b,g&&(i.onreadystatechange=J.noop,mb&&delete lb[g]),e)4!==i.readyState&&i.abort();else{h=i.status,k=i.getAllResponseHeaders(),l={},m=i.responseXML,m&&m.documentElement&&(l.xml=m);try{l.text=i.responseText}catch(a){}try{j=i.statusText}catch(n){j=""}h||!c.isLocal||c.crossDomain?1223===h&&(h=204):h=l.text?200:404}}catch(o){e||f(-1,o)}l&&f(h,j,l,k)},c.async&&4!==i.readyState?(g=++nb,mb&&(lb||(lb={},J(a).unload(mb)),lb[g]=d),i.onreadystatechange=d):d()},abort:function(){d&&d(0,1)}}}});var ob,pb,qb,rb,sb={},tb=/^(?:toggle|show|hide)$/,ub=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,vb=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];J.fn.extend({show:function(a,b,c){var f,g;if(a||0===a)return this.animate(e("show",3),a,b,c);for(var h=0,i=this.length;i>h;h++)f=this[h],f.style&&(g=f.style.display,!J._data(f,"olddisplay")&&"none"===g&&(g=f.style.display=""),(""===g&&"none"===J.css(f,"display")||!J.contains(f.ownerDocument.documentElement,f))&&J._data(f,"olddisplay",d(f.nodeName)));for(h=0;i>h;h++)f=this[h],f.style&&(g=f.style.display,(""===g||"none"===g)&&(f.style.display=J._data(f,"olddisplay")||""));return this},hide:function(a,b,c){if(a||0===a)return this.animate(e("hide",3),a,b,c);for(var d,f,g=0,h=this.length;h>g;g++)d=this[g],d.style&&(f=J.css(d,"display"),"none"!==f&&!J._data(d,"olddisplay")&&J._data(d,"olddisplay",f));for(g=0;h>g;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:J.fn.toggle,toggle:function(a,b,c){var d="boolean"==typeof a;return J.isFunction(a)&&J.isFunction(b)?this._toggle.apply(this,arguments):null==a||d?this.each(function(){var b=d?a:J(this).is(":hidden");J(this)[b?"show":"hide"]()}):this.animate(e("toggle",3),a,b,c),this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,e){function f(){g.queue===!1&&J._mark(this);var b,c,e,f,h,i,j,k,l,m,n,o=J.extend({},g),p=1===this.nodeType,q=p&&J(this).is(":hidden");o.animatedProperties={};for(e in a)if(b=J.camelCase(e),e!==b&&(a[b]=a[e],delete a[e]),(h=J.cssHooks[b])&&"expand"in h){i=h.expand(a[b]),delete a[b];for(e in i)e in a||(a[e]=i[e])}for(b in a){if(c=a[b],J.isArray(c)?(o.animatedProperties[b]=c[1],c=a[b]=c[0]):o.animatedProperties[b]=o.specialEasing&&o.specialEasing[b]||o.easing||"swing","hide"===c&&q||"show"===c&&!q)return o.complete.call(this);p&&("height"===b||"width"===b)&&(o.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],"inline"===J.css(this,"display")&&"none"===J.css(this,"float")&&(J.support.inlineBlockNeedsLayout&&"inline"!==d(this.nodeName)?this.style.zoom=1:this.style.display="inline-block"))}null!=o.overflow&&(this.style.overflow="hidden");for(e in a)f=new J.fx(this,o,e),c=a[e],tb.test(c)?(n=J._data(this,"toggle"+e)||("toggle"===c?q?"show":"hide":0),n?(J._data(this,"toggle"+e,"show"===n?"hide":"show"),f[n]()):f[c]()):(j=ub.exec(c),k=f.cur(),j?(l=parseFloat(j[2]),m=j[3]||(J.cssNumber[e]?"":"px"),"px"!==m&&(J.style(this,e,(l||1)+m),k=(l||1)/f.cur()*k,J.style(this,e,k+m)),j[1]&&(l=("-="===j[1]?-1:1)*l+k),f.custom(k,l,m)):f.custom(k,c,""));return!0}var g=J.speed(b,c,e);return J.isEmptyObject(a)?this.each(g.complete,[!1]):(a=J.extend({},a),g.queue===!1?this.each(f):this.queue(g.queue,f))},stop:function(a,c,d){return"string"!=typeof a&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){function b(a,b,c){var e=b[c];J.removeData(a,c,!0),e.stop(d)}var c,e=!1,f=J.timers,g=J._data(this);if(d||J._unmark(!0,this),null==a)for(c in g)g[c]&&g[c].stop&&c.indexOf(".run")===c.length-4&&b(this,g,c);else g[c=a+".run"]&&g[c].stop&&b(this,g,c);for(c=f.length;c--;)f[c].elem===this&&(null==a||f[c].queue===a)&&(d?f[c](!0):f[c].saveState(),e=!0,f.splice(c,1));(!d||!e)&&J.dequeue(this,a)})}}),J.each({slideDown:e("show",1),slideUp:e("hide",1),slideToggle:e("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){J.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),J.extend({speed:function(a,b,c){var d=a&&"object"==typeof a?J.extend({},a):{complete:c||!c&&b||J.isFunction(a)&&a,duration:a,easing:c&&b||b&&!J.isFunction(b)&&b};return d.duration=J.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in J.fx.speeds?J.fx.speeds[d.duration]:J.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(a){J.isFunction(d.old)&&d.old.call(this),d.queue?J.dequeue(this,d.queue):a!==!1&&J._unmark(this)},d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),J.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(J.fx.step[this.prop]||J.fx.step._default)(this)},cur:function(){if(null!=this.elem[this.prop]&&(!this.elem.style||null==this.elem.style[this.prop]))return this.elem[this.prop];var a,b=J.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?b&&"auto"!==b?b:0:a},custom:function(a,c,d){function e(a){return f.step(a)}var f=this,h=J.fx;this.startTime=rb||g(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(J.cssNumber[this.prop]?"":"px"),e.queue=this.options.queue,e.elem=this.elem,e.saveState=function(){J._data(f.elem,"fxshow"+f.prop)===b&&(f.options.hide?J._data(f.elem,"fxshow"+f.prop,f.start):f.options.show&&J._data(f.elem,"fxshow"+f.prop,f.end))},e()&&J.timers.push(e)&&!qb&&(qb=setInterval(h.tick,h.interval))},show:function(){var a=J._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||J.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom("width"===this.prop||"height"===this.prop?1:0,this.cur()),J(this.elem).show()},hide:function(){this.options.orig[this.prop]=J._data(this.elem,"fxshow"+this.prop)||J.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=rb||g(),f=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(f=!1);if(f){if(null!=i.overflow&&!J.support.shrinkWrapBlocks&&J.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&J(h).hide(),i.hide||i.show)for(b in i.animatedProperties)J.style(h,b,i.orig[b]),J.removeData(h,"fxshow"+b,!0),J.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}return i.duration==1/0?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=J.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update(),!0}},J.extend(J.fx,{tick:function(){for(var a,b=J.timers,c=0;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||J.fx.stop()},interval:13,stop:function(){clearInterval(qb),qb=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){J.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&null!=a.elem.style[a.prop]?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),J.each(vb.concat.apply([],vb),function(a,b){b.indexOf("margin")&&(J.fx.step[b]=function(a){J.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),J.expr&&J.expr.filters&&(J.expr.filters.animated=function(a){return J.grep(J.timers,function(b){return a===b.elem}).length});var wb,xb=/^t(?:able|d|h)$/i,yb=/^(?:body|html)$/i;wb="getBoundingClientRect"in G.documentElement?function(a,b,d,e){try{e=a.getBoundingClientRect()}catch(f){}if(!e||!J.contains(d,a))return e?{top:e.top,left:e.left}:{top:0,left:0};var g=b.body,h=c(b),i=d.clientTop||g.clientTop||0,j=d.clientLeft||g.clientLeft||0,k=h.pageYOffset||J.support.boxModel&&d.scrollTop||g.scrollTop,l=h.pageXOffset||J.support.boxModel&&d.scrollLeft||g.scrollLeft,m=e.top+k-i,n=e.left+l-j;return{top:m,left:n}}:function(a,b,c){for(var d,e=a.offsetParent,f=a,g=b.body,h=b.defaultView,i=h?h.getComputedStyle(a,null):a.currentStyle,j=a.offsetTop,k=a.offsetLeft;(a=a.parentNode)&&a!==g&&a!==c&&(!J.support.fixedPosition||"fixed"!==i.position);)d=h?h.getComputedStyle(a,null):a.currentStyle,j-=a.scrollTop,k-=a.scrollLeft,a===e&&(j+=a.offsetTop,k+=a.offsetLeft,J.support.doesNotAddBorder&&(!J.support.doesAddBorderForTableAndCells||!xb.test(a.nodeName))&&(j+=parseFloat(d.borderTopWidth)||0,k+=parseFloat(d.borderLeftWidth)||0),f=e,e=a.offsetParent),J.support.subtractsBorderForOverflowNotVisible&&"visible"!==d.overflow&&(j+=parseFloat(d.borderTopWidth)||0,k+=parseFloat(d.borderLeftWidth)||0),i=d;return("relative"===i.position||"static"===i.position)&&(j+=g.offsetTop,k+=g.offsetLeft),J.support.fixedPosition&&"fixed"===i.position&&(j+=Math.max(c.scrollTop,g.scrollTop),k+=Math.max(c.scrollLeft,g.scrollLeft)),{top:j,left:k}},J.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){J.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;return d?c===d.body?J.offset.bodyOffset(c):wb(c,d,d.documentElement):null},J.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;return J.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(J.css(a,"marginTop"))||0,c+=parseFloat(J.css(a,"marginLeft"))||0),{top:b,left:c}},setOffset:function(a,b,c){var d=J.css(a,"position");"static"===d&&(a.style.position="relative");var e,f,g=J(a),h=g.offset(),i=J.css(a,"top"),j=J.css(a,"left"),k=("absolute"===d||"fixed"===d)&&J.inArray("auto",[i,j])>-1,l={},m={};k?(m=g.position(),e=m.top,f=m.left):(e=parseFloat(i)||0,f=parseFloat(j)||0),J.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(l.top=b.top-h.top+e),null!=b.left&&(l.left=b.left-h.left+f),"using"in b?b.using.call(a,l):g.css(l)}},J.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=yb.test(b[0].nodeName)?{top:0,left:0}:b.offset();return c.top-=parseFloat(J.css(a,"marginTop"))||0,c.left-=parseFloat(J.css(a,"marginLeft"))||0,d.top+=parseFloat(J.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(J.css(b[0],"borderLeftWidth"))||0,{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||G.body;a&&!yb.test(a.nodeName)&&"static"===J.css(a,"position");)a=a.offsetParent;return a})}}),J.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"
},function(a,d){var e=/Y/.test(d);J.fn[a]=function(f){return J.access(this,function(a,f,g){var h=c(a);return g===b?h?d in h?h[d]:J.support.boxModel&&h.document.documentElement[f]||h.document.body[f]:a[f]:void(h?h.scrollTo(e?J(h).scrollLeft():g,e?g:J(h).scrollTop()):a[f]=g)},a,f,arguments.length,null)}}),J.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,f="offset"+a;J.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(J.css(a,c,"padding")):this[c]():null},J.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(J.css(b,c,a?"margin":"border")):this[c]():null},J.fn[c]=function(a){return J.access(this,function(a,c,g){var h,i,j,k;return J.isWindow(a)?(h=a.document,i=h.documentElement[d],J.support.boxModel&&i||h.body&&h.body[d]||i):9===a.nodeType?(h=a.documentElement,h[d]>=h[e]?h[d]:Math.max(a.body[e],h[e],a.body[f],h[f])):g===b?(j=J.css(a,c),k=parseFloat(j),J.isNumeric(k)?k:j):void J(a).css(c,g)},c,a,arguments.length,null)}}),a.jQuery=a.$=J,"function"==typeof define&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return J})}(window),hsJQuery=jQuery.noConflict(!0),function(a,b){function c(a,b){return new Date(a,b+1,0).getDate()}function d(a,b){for(a=""+a,b=b||2;a.length<b;)a="0"+a;return a}function e(a,b,c,e){var f=b.getDate(),g=b.getDay(),h=b.getMonth(),i=b.getFullYear(),j={d:f,dd:d(f),ddd:n[e].shortDays[g],dddd:n[e].days[g],m:h+1,mm:d(h+1),mmm:n[e].shortMonths[h],mmmm:n[e].months[h],yy:String(i).slice(2),yyyy:i},k=l[a](c,b,j,e);return o.html(k).html()}function f(a){return parseInt(a,10)}function g(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()==b.getMonth()&&a.getDate()==b.getDate()}function h(a){if(a!==b){if(a.constructor==Date)return a;if("string"==typeof a){var c=a.split("-");if(3==c.length)return new Date(f(c[0]),f(c[1])-1,f(c[2]));if(!/^-?\d+$/.test(a))return;a=f(a)}var d=new Date;return d.setDate(d.getDate()+a),d}}function i(d,i){function j(b,c,f){D=b,r=b.getFullYear(),s=b.getMonth(),t=b.getDate(),f||(f=a.Event("api")),"click"!=f.type||a.browser.msie||d.focus(),f.type="beforeChange",I.trigger(f,[b]),f.isDefaultPrevented()||(d.val(e(c.formatter,b,c.format,c.lang)),f.type="change",I.trigger(f),d.data("date",b),w.hide(f))}function l(b){b.type="onShow",I.trigger(b),a(document).on("keydown.d",function(b){if(b.ctrlKey)return!0;var c=b.keyCode;if(8==c||46==c)return d.val(""),w.hide(b);if(27==c||9==c)return w.hide(b);if(a(m).index(c)>=0){if(!u)return w.show(b),b.preventDefault();var e=a("#"+z.weeks+" a"),f=a("."+z.focus),g=e.index(f);return f.removeClass(z.focus),74==c||40==c?g+=7:75==c||38==c?g-=7:76==c||39==c?g+=1:(72==c||37==c)&&(g-=1),g>41?(w.addMonth(),f=a("#"+z.weeks+" a:eq("+(g-42)+")")):0>g?(w.addMonth(-1),f=a("#"+z.weeks+" a:eq("+(g+42)+")")):f=e.eq(g),f.addClass(z.focus),b.preventDefault()}return 34==c?w.addMonth():33==c?w.addMonth(-1):36==c?w.today():(13==c&&(a(b.target).is("select")||a("."+z.focus).click()),a([16,17,18,9]).index(c)>=0)}),a(document).on("click.d",function(b){var c=b.target;a(c).parents("#"+z.root).length||c==d[0]||o&&c==o[0]||w.hide(b)})}var o,p,q,r,s,t,u,v,w=this,x=new Date,y=x.getFullYear(),z=i.css,A=n[i.lang],B=a("#"+z.root),C=B.find("#"+z.title),D=d.attr("data-value")||i.value||d.val(),E=d.attr("min")||i.min,F=d.attr("max")||i.max;if(0===E&&(E="0"),D=h(D)||x,E=h(E||new Date(y+i.yearRange[0],1,1)),F=h(F||new Date(y+i.yearRange[1]+1,1,-1)),!A)throw"Dateinput: invalid language: "+i.lang;if("date"==d.attr("type")){var v=d.clone(),G=v.wrap("<div/>").parent().html(),H=a(G.replace(/type/i,"type=text data-orig-type"));i.value&&H.val(i.value),d.replaceWith(H),d=H}d.addClass(z.input);var I=d.add(w);if(!B.length){if(B=a("<div><div><a/><div/><a/></div><div><div/><div/></div></div>").hide().css({position:"absolute"}).attr("id",z.root),B.children().eq(0).attr("id",z.head).end().eq(1).attr("id",z.body).children().eq(0).attr("id",z.days).end().eq(1).attr("id",z.weeks).end().end().end().find("a").eq(0).attr("id",z.prev).end().eq(1).attr("id",z.next),C=B.find("#"+z.head).find("div").attr("id",z.title),i.selectors){var J=a("<select/>").attr("id",z.month),K=a("<select/>").attr("id",z.year);C.html(J.add(K))}for(var L=B.find("#"+z.days),M=0;7>M;M++)L.append(a("<span/>").text(A.shortDays[(M+i.firstDay)%7]));a("body").append(B)}i.trigger&&(o=a("<a/>").attr("href","#").addClass(z.trigger).click(function(a){return i.toggle?w.toggle():w.show(),a.preventDefault()}).insertAfter(d));var N=B.find("#"+z.weeks);K=B.find("#"+z.year),J=B.find("#"+z.month),a.extend(w,{show:function(b){if(!(d.attr("readonly")||d.attr("disabled")||u||(b=b||a.Event(),b.type="onBeforeShow",I.trigger(b),b.isDefaultPrevented()))){a.each(k,function(){this.hide()}),u=!0,J.off("change").change(function(){w.setValue(f(K.val()),f(a(this).val()))}),K.off("change").change(function(){w.setValue(f(a(this).val()),f(J.val()))}),p=B.find("#"+z.prev).off("click").click(function(a){return p.hasClass(z.disabled)||w.addMonth(-1),!1}),q=B.find("#"+z.next).off("click").click(function(a){return q.hasClass(z.disabled)||w.addMonth(),!1}),w.setValue(D);var c=d.offset();return/iPad/i.test(navigator.userAgent)&&(c.top-=a(window).scrollTop()),B.css({top:c.top+d.outerHeight({margins:!0})+i.offset[0],left:c.left+i.offset[1]}),i.speed?B.show(i.speed,function(){l(b)}):(B.show(),l(b)),w}},setValue:function(d,e,k){var l=f(e)>=-1?new Date(f(d),f(e),f(k==b||isNaN(k)?1:k)):d||D;if(E>l?l=E:l>F&&(l=F),"string"==typeof d&&(l=h(d)),d=l.getFullYear(),e=l.getMonth(),k=l.getDate(),-1==e?(e=11,d--):12==e&&(e=0,d++),!u)return j(l,i),w;s=e,r=d,t=k;var m,n=new Date(d,e,1-i.firstDay),o=n.getDay(),v=c(d,e),y=c(d,e-1);if(i.selectors){J.empty(),a.each(A.months,function(b,c){E<new Date(d,b+1,1)&&F>new Date(d,b,0)&&J.append(a("<option/>").html(c).attr("value",b))}),K.empty();for(var B=x.getFullYear(),G=B+i.yearRange[0];G<B+i.yearRange[1];G++)E<new Date(G+1,0,1)&&F>new Date(G,0,0)&&K.append(a("<option/>").text(G));J.val(e),K.val(d)}else C.html(A.months[e]+" "+d);N.empty(),p.add(q).removeClass(z.disabled);for(var H,I,L=o?0:-7;(o?42:35)>L;L++)H=a("<a/>"),L%7===0&&(m=a("<div/>").addClass(z.week),N.append(m)),o>L?(H.addClass(z.off),I=y-o+L+1,l=new Date(d,e-1,I)):L>=o+v?(H.addClass(z.off),I=L-v-o+1,l=new Date(d,e+1,I)):(I=L-o+1,l=new Date(d,e,I),g(D,l)?H.attr("id",z.current).addClass(z.focus):g(x,l)&&H.attr("id",z.today)),E&&E>l&&H.add(p).addClass(z.disabled),F&&l>F&&H.add(q).addClass(z.disabled),H.attr("href","#"+I).text(I).data("date",l),m.append(H);return N.find("a").click(function(b){var c=a(this);return c.hasClass(z.disabled)||(a("#"+z.current).removeAttr("id"),c.attr("id",z.current),j(c.data("date"),i,b)),!1}),z.sunday&&N.find("."+z.week).each(function(){var b=i.firstDay?7-i.firstDay:0;a(this).children().slice(b,b+1).addClass(z.sunday)}),w},setMin:function(a,b){return E=h(a),b&&E>D&&w.setValue(E),w},setMax:function(a,b){return F=h(a),b&&D>F&&w.setValue(F),w},today:function(){return w.setValue(x)},addDay:function(a){return this.setValue(r,s,t+(a||1))},addMonth:function(a){var b=s+(a||1),d=c(r,b),e=d>=t?t:d;return this.setValue(r,b,e)},addYear:function(a){return this.setValue(r+(a||1),s,t)},destroy:function(){d.add(document).off("click.d keydown.d"),B.add(o).remove(),d.removeData("dateinput").removeClass(z.input),v&&d.replaceWith(v)},hide:function(b){if(u){if(b=a.Event(),b.type="onHide",I.trigger(b),b.isDefaultPrevented())return;a(document).off("click.d keydown.d"),B.hide(),u=!1}return w},toggle:function(){return w.isOpen()?w.hide():w.show()},getConf:function(){return i},getInput:function(){return d},getCalendar:function(){return B},getValue:function(a){return a?e(i.formatter,D,a,i.lang):D},isOpen:function(){return u}}),a.each(["onBeforeShow","onShow","change","onHide"],function(b,c){a.isFunction(i[c])&&a(w).on(c,i[c]),w[c]=function(b){return b&&a(w).on(c,b),w}}),i.editable||d.on("focus.d click.d",w.show).keydown(function(b){var c=b.keyCode;return!u&&a(m).index(c)>=0?(w.show(b),b.preventDefault()):((8==c||46==c)&&d.val(""),b.shiftKey||b.ctrlKey||b.altKey||9==c?!0:b.preventDefault())}),h(d.val())&&j(D,i)}a.tools=a.tools||{version:"@VERSION"};var j,k=[],l={},m=[75,76,38,39,74,72,40,37],n={};j=a.tools.dateinput={conf:{format:"yyyy-mm-dd",formatter:"default",selectors:!1,yearRange:[-5,5],lang:"en",offset:[0,0],speed:0,firstDay:0,min:b,max:b,trigger:0,toggle:0,editable:0,css:{prefix:"cal",input:"date",root:0,head:0,title:0,prev:0,next:0,month:0,year:0,days:0,body:0,weeks:0,today:0,current:0,week:0,off:0,sunday:0,focus:0,disabled:0,trigger:0}},addFormatter:function(a,b){l[a]=b},localize:function(b,c){a.each(c,function(a,b){c[a]=b.split(",")}),n[b]=c}},j.localize("en",{months:"January,February,March,April,May,June,July,August,September,October,November,December",shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",days:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",shortDays:"Sun,Mon,Tue,Wed,Thu,Fri,Sat"});var o=a("<a/>");j.addFormatter("default",function(a,b,c,d){return a.replace(/d{1,4}|m{1,4}|yy(?:yy)?|"[^"]*"|'[^']*'/g,function(a){return a in c?c[a]:a})}),j.addFormatter("prefixed",function(a,b,c,d){return a.replace(/%(d{1,4}|m{1,4}|yy(?:yy)?|"[^"]*"|'[^']*')/g,function(a,b){return b in c?c[b]:a})}),a.expr[":"].date=function(b){var c=b.getAttribute("type");return c&&"date"==c||!!a(b).data("dateinput")},a.fn.dateinput=function(b){if(this.data("dateinput"))return this;b=a.extend(!0,{},j.conf,b),a.each(b.css,function(a,c){c||"prefix"==a||(b.css[a]=(b.css.prefix||"")+(c||a))});var c;return this.each(function(){var d=new i(a(this),b);k.push(d);var e=d.getInput().data("dateinput",d);c=c?c.add(e):e}),c?c:this}}(hsJQuery),function(a){function b(b,c,d){c=a(c).first()||c;var e=b.position().top,f=b.position().left,g=d.position.split(/,?\s+/),h=g[0],i=g[1];e-=c.outerHeight()-d.offset[0],f+=b.outerWidth()+d.offset[1];var j=c.outerHeight()+b.outerHeight();"center"==h&&(e+=j/2),"bottom"==h&&(e+=j);var k=b.outerWidth();return"center"==i&&(f-=(k+c.outerWidth())/2),"left"==i&&(f-=k),{top:e,left:f}}function c(a){function b(){return this.getAttribute("type")==a}return b.key='[type="'+a+'"]',b}function d(c,d,f){function g(b,c,d){if(f.grouped||!b.length){var g;if(d===!1||a.isArray(d)){g=e.messages[c.key||c]||e.messages["*"],g=g[f.lang]||e.messages["*"].en;var h=g.match(/\$\d/g);h&&a.isArray(d)&&a.each(h,function(a){g=g.replace(this,d[a])})}else g=d[f.lang]||d;b.push(g)}}var i=this,j=d.add(i);c=c.not(":button, :image, :reset, :submit"),d.attr("novalidate","novalidate"),a.extend(i,{getConf:function(){return f},getForm:function(){return d},getInputs:function(){return c},reflow:function(){return c.each(function(){var c=a(this),d=c.data("msg.el");if(d){var e=b(c,d,f);d.css({top:e.top,left:e.left})}}),i},invalidate:function(b,d){if(!d){var e=[];a.each(b,function(a,b){var d=c.filter("[name='"+a+"']");d.length&&(d.trigger("OI",[b]),e.push({input:d,messages:[b]}))}),b=e,d=a.Event()}return d.type="onFail",j.trigger(d,[b]),d.isDefaultPrevented()||l[f.effect][0].call(i,b,d),i},reset:function(b){return b=b||c,b.removeClass(f.errorClass).each(function(){var b=a(this).data("msg.el");b&&(b.remove(),a(this).data("msg.el",null))}).off(f.errorInputEvent+".v"||""),i},destroy:function(){return d.off(f.formEvent+".V reset.V"),c.off(f.inputEvent+".V change.V"),i.reset()},checkValidity:function(b,d){b=b||c,b=b.not(":disabled");var e={};if(b=b.filter(function(){var b=a(this).attr("name");return e[b]?void 0:(e[b]=!0,a(this))}),!b.length)return!0;if(d=d||a.Event(),d.type="onBeforeValidate",j.trigger(d,[b]),d.isDefaultPrevented())return d.result;var m=[];b.each(function(){var b=[],c=a(this).data("messages",b),e=h&&c.is(":date")?"onHide.v":f.errorInputEvent+".v";return c.off(e),a.each(k,function(){var a=this,e=a[0];if(c.filter(e).length){var h=a[1].call(i,c,c.val());if(h!==!0){if(d.type="onBeforeFail",j.trigger(d,[c,e]),d.isDefaultPrevented())return!1;var k=c.attr(f.messageAttr);if(k)return b=[k],!1;g(b,e,h)}}}),b.length&&(m.push({input:c,messages:b}),c.trigger("OI",[b]),f.errorInputEvent&&c.on(e,function(a){i.checkValidity(c,a)})),f.singleError&&m.length?!1:void 0});var n=l[f.effect];if(!n)throw'Validator: cannot find effect "'+f.effect+'"';return m.length?(i.invalidate(m,d),d.stopPropagation(),d.preventDefault(),!1):(n[1].call(i,b,d),d.type="onSuccess",j.trigger(d,[b]),b.off(f.errorInputEvent+".v"),!0)}}),a.each("onBeforeValidate,onBeforeFail,onFail,onSuccess".split(","),function(b,c){a.isFunction(f[c])&&a(i).on(c,f[c]),i[c]=function(b){return b&&a(i).on(c,b),i}}),f.formEvent&&d.on(f.formEvent+".V",function(a){return i.checkValidity(null,a)?(a.target=d,void(a.type=f.formEvent)):a.preventDefault()}),d.on("reset.V",function(){i.reset()}),c[0]&&c[0].validity&&c.each(function(){this.oninvalid=function(){return!1}}),d[0]&&(d[0].checkValidity=i.checkValidity),f.inputEvent&&c.on(f.inputEvent+".V",function(b){i.checkValidity(a(this),b)}),c.filter(":checkbox, select").on("change.V",function(b){var c=a(this);(this.checked||c.is("select")&&a(this).val())&&l[f.effect][1].call(i,c,b)}),c.filter(":radio").on("change.V",function(b){var c=a("[name='"+a(b.target||b.srcElement).attr("name")+"']");null!==c&&0!==c.length&&i.checkValidity(c,b)}),a(window).resize(function(){i.reflow()})}a.tools=a.tools||{version:"@VERSION"};var e,f=/\[type=([a-z]+)\]/,g=/^-?[0-9]*(\.[0-9]+)?$/,h=a.tools.dateinput,i=/.@./,j=/^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#&+_\?\/\w \.\-=]*$/i;e=a.tools.validator={conf:{grouped:!1,effect:"default",errorClass:"invalid",inputEvent:null,errorInputEvent:"keyup",formEvent:"submit",lang:"en",message:"<div/>",messageAttr:"data-message",messageClass:"error",offset:[0,0],position:"center right",singleError:!1,speed:"normal",scrollToFirstError:!1},messages:{"*":{en:"Please correct this value"}},localize:function(b,c){a.each(c,function(a,c){e.messages[a]=e.messages[a]||{},e.messages[a][b]=c})},localizeFn:function(b,c){e.messages[b]=e.messages[b]||{},a.extend(e.messages[b],c)},fn:function(b,d,e){a.isFunction(d)?e=d:("string"==typeof d&&(d={en:d}),this.messages[b.key||b]=d);var g=f.exec(b);g&&(b=c(g[1])),k.push([b,e])},addEffect:function(a,b,c){l[a]=[b,c]}};var k=[],l={"default":[function(c){var d=this.getConf();if(a.each(c,function(c,e){var f=e.input;f.addClass(d.errorClass);var g=f.data("msg.el");g||($hsForm=a(f).closest("form"),g=a(d.message).addClass(d.messageClass).appendTo($hsForm),f.data("msg.el",g)),g.css({display:"none"}).find("p").remove(),a.each(e.messages,function(b,c){g.find(".close-form-error").remove(),a("<p/>").html(c).appendTo(g),a("<div/>").addClass("close-form-error").text("x").appendTo(g)}),g.outerWidth()==g.parent().width()&&g.add(g.find("p")).css({display:"inline"});var h=b(f,g,d);g.css({display:"none",position:"absolute",top:h.top,left:h.left}).fadeIn(d.speed)}),d.scrollToFirstError){var e="."+d.messageClass,f=a(e).filter(function(b){return"block"==a(this).css("display")}).first().css("top");window.scrollTo(0,parseInt(f,10)-15)}},function(b){var c=this.getConf(),d=b.first().parents(".multi-container");d&&b.push(d.find("input")),b.removeClass(c.errorClass).each(function(){var b=a(this).data("msg.el");b&&b.css({display:"none"})})}]};a.each("email,url,number".split(","),function(b,c){a.expr[":"][c]=function(a){return a.getAttribute("type")===c}}),a.fn.oninvalid=function(a){return this[a?"on":"trigger"]("OI",a)},e.fn(":email","Please enter a valid email address.",function(a,b){return!b||i.test(b)}),e.fn(":url","Please enter a valid URL.",function(a,b){return!b||j.test(b)}),e.fn(":number","Please enter a numeric value.",function(a,b){return g.test(b)}),e.fn("[max]","Please enter a value no larger than $1.",function(a,b){if(""===b||h&&a.is(":date"))return!0;var c=a.attr("max");return parseFloat(b)<=parseFloat(c)?!0:[c]}),e.fn("[min]","Please enter a value of at least $1.",function(a,b){if(""===b||h&&a.is(":date"))return!0;var c=a.attr("min");return parseFloat(b)>=parseFloat(c)?!0:[c]}),e.fn("[required]","Please complete this mandatory field.",function(a,b){return a.is(":checkbox")?a.is(":checked"):!!b}),e.fn("[pattern]",function(a,b){return""===b||new RegExp("^"+a.attr("pattern")+"$").test(b)}),e.fn(":radio[required]","Please select an option.",function(b){{var c=!1;a("[name='"+b.attr("name")+"']").each(function(b,d){a(d).is(":checked")&&(c=!0)})}return c?!0:!1}),a.fn.validator=function(b){var c=this.data("validator");return c&&(c.destroy(),this.removeData("validator")),b=a.extend(!0,{},e.conf,b),this.is("form")?this.each(function(){var e=a(this);c=new d(e.find(":input"),e,b),e.data("validator",c)}):(c=new d(this,this.eq(0).closest("form"),b),this.data("validator",c))}}(hsJQuery);var Kicksend={mailcheck:{threshold:2,defaultDomains:["yahoo.com","google.com","hotmail.com","gmail.com","me.com","aol.com","mac.com","live.com","comcast.net","googlemail.com","msn.com","hotmail.co.uk","yahoo.co.uk","facebook.com","verizon.net","sbcglobal.net","att.net","gmx.com","mail.com","ymail.com"],defaultTopLevelDomains:["co.uk","com","net","org","info","edu","gov","mil","com.au","co.nz","eu","at","jp","co.jp","sg","br","ca","es","io","biz","nz","dk","ie","be","fi","il","nl","no","pt","se","ch","cn","ve","uy","py","pe","mx","ec","cl","bo","de","ru","co.za"],run:function(a){a.domains=a.domains||Kicksend.mailcheck.defaultDomains,a.topLevelDomains=a.topLevelDomains||Kicksend.mailcheck.defaultTopLevelDomains,a.distanceFunction=a.distanceFunction||Kicksend.sift3Distance;var b=Kicksend.mailcheck.suggest(encodeURI(a.email),a.domains,a.topLevelDomains,a.distanceFunction);b?a.suggested&&a.suggested(b):a.empty&&a.empty()},suggest:function(a,b,c,d){a=a.toLowerCase();var e=this.splitEmail(a),f=this.findClosestDomain(e.domain,b,d);if(f){if(f!=e.domain)return{address:e.address,domain:f,full:e.address+"@"+f}}else{var g=this.findClosestDomain(e.topLevelDomain,c);if(e.domain&&g&&g!=e.topLevelDomain){var h=e.domain;return f=h.substring(0,h.lastIndexOf(e.topLevelDomain))+g,{address:e.address,domain:f,full:e.address+"@"+f}}}return!1},findClosestDomain:function(a,b,c){var d,e=99,f=null;if(!a||!b)return!1;c||(c=this.sift3Distance);for(var g=0;g<b.length;g++){if(a===b[g])return a;d=c(a,b[g]),e>d&&(e=d,f=b[g])}return e<=this.threshold&&null!==f?f:!1},sift3Distance:function(a,b){if(null==a||0===a.length)return null==b||0===b.length?0:b.length;if(null==b||0===b.length)return a.length;for(var c=0,d=0,e=0,f=0,g=5;c+d<a.length&&c+e<b.length;){if(a.charAt(c+d)==b.charAt(c+e))f++;else{d=0,e=0;for(var h=0;g>h;h++){if(c+h<a.length&&a.charAt(c+h)==b.charAt(c)){d=h;break}if(c+h<b.length&&a.charAt(c)==b.charAt(c+h)){e=h;break}}}c++}return(a.length+b.length)/2-f},splitEmail:function(a){var b=a.split("@");if(b.length<2)return!1;for(var c=0;c<b.length;c++)if(""===b[c])return!1;var d=b.pop(),e=d.split("."),f="";if(0==e.length)return!1;if(1==e.length)f=e[0];else{for(var c=1;c<e.length;c++)f+=e[c]+".";e.length>=2&&(f=f.substring(0,f.length-1))}return{topLevelDomain:f,domain:d,address:b.join("@")}}}};window.hsJQuery&&!function(a){a.fn.mailcheck=function(a){var b=this;if(a.suggested){var c=a.suggested;a.suggested=function(a){c(b,a)}}if(a.empty){var d=a.empty;a.empty=function(){d.call(null,b)}}a.email=this.val(),Kicksend.mailcheck.run(a)}}(hsJQuery),Array.indexOf||(Array.prototype.indexOf=function(a){var b,c=this.length;for(b=0;c>b;b++)if(this[b]===a)return b;return-1}),function(a){null==a.__hs_&&(a.__hs_={});var b=a.__hs_;b.now=Date.now||function(){return(new Date).getTime()},b.debounce=function(a,c,d){var e,f,g,h,i,j=function(){var k=b.now()-h;c>k?e=setTimeout(j,c-k):(e=null,d||(i=a.apply(g,f),g=f=null))};return function(){g=this,f=arguments,h=b.now();var k=d&&!e;return e||(e=setTimeout(j,c)),k&&(i=a.apply(g,f),g=f=null),i}}}(window),function(){var a;null==window.hbspt&&(window.hbspt={}),a=null!=hbspt.forms?hbspt.forms:hbspt.forms={},a.langs={en:{"*":"Please complete this mandatory field.","[required]":"Please complete this mandatory field.",":email":"Please enter a valid email address.",":url":"Please enter a valid URL.",":number":"Please enter a valid number.","[max]":"Please enter a value no larger than $1.","[min]":"Please enter a value of at least $1.","[pattern]":"",":radio[required]":"Please select at least one option.","select[required]":"Please select an option from the dropdown.",'[type="text"][required],textarea[required]':"Please complete this mandatory field.",missingOptionSelection:"Please select at least one option.",forbiddenEmailDomain:"Please enter your business email address. This form does not accept addresses from $1.",emailOptIn:"Please check your email to opt back in.",resubscribeMessage:"Looks like you've opted out of email communication. <a class='resubscribe-link' href='#resubscribe'>Click here</a> to get an email and opt back in.",":date":"Please use the datepicker to match the YYYY-MM-DD format.",phoneInvalidCharacters:"Must contain only numbers, +()-. and x",phoneInvalidLengthOrFormat:"Must be a valid phone number",emailSuggestion:"Did you mean"},da:{"*":"FГ¦rdiggГёr venligst dette obligatoriske felt.","[required]":"FГ¦rdiggГёr venligst dette obligatoriske felt.",":email":"Indtast venligst en gyldig email adresse.",":url":"Indtast venligst en gyldig URL.",":number":"Indtast venligst et gyldigt nummer.","[max]":"Indtast venligst en vГ¦rdi, der ikke overstiger $1.","[min]":"Indtast venligst en vГ¦rdi pГҐ mindst $1.","[pattern]":"",":radio[required]":"VГ¦lg venligst mindst en svarmulighed.","select[required]":"VГ¦lg venligst en af mulighederne i dropdown menuen.",'[type="text"][required],textarea[required]':"FГ¦rdiggГёr venligst dette obligatoriske felt.",missingOptionSelection:"VГ¦lg venligst mindst en af svarmulighederne.",forbiddenEmailDomain:"Indtast venligst din arbejdsemail. Denne formular accepterer ikke adresser fra $1.",emailOptIn:"Tjek din email for at tilmelde dig igen.",resubscribeMessage:"Det ser ud til at du har frabedt dig emails. <a class='resubscribe-link' href='#resubscribe'>Klik her</a> for at fГҐ en email, hvor du kan tilmelde dig igen.",":date":"Brug venligst datovГ¦lgeren for at matche YYYY-MM-DD formatet.",phoneInvalidCharacters:"MГҐ kun indeholde numre, +()-. og x",phoneInvalidLengthOrFormat:"Det skal vГ¦re et gyldigt telefonnummer",emailSuggestion:"'Mente du"},de:{"*":"Bitte fГјllen Sie dieses Pflichtfeld aus.","[required]":"Bitte fГјllen Sie dieses Pflichtfeld aus.",":email":"Bitte geben Sie eine gГјltige E-Mail-Adresse ein.",":url":"Bitte geben Sie eine gГјltige Webadresse (URL) ein.",":number":"Bitte geben Sie eine gГјltige Zahl ein.","[max]":"Bitte geben Sie einen Wert ein, jedoch nicht grГ¶Гџer als $1.","[min]":"Bitte geben Sie einen Wert ein, jedoch mindestens $1.","[pattern]":"",":radio[required]":"Bitte wГ¤hlen Sie mindestens eine Option.","select[required]":"Bitte wГ¤hlen Sie eine Option aus der Dropdown-Liste.",'[type="text"][required],textarea[required]':"Bitte fГјllen Sie dieses Pflichtfeld aus.",missingOptionSelection:"Bitte wГ¤hlen Sie mindestens eine Option.",forbiddenEmailDomain:"Bitte geben Sie Ihre geschГ¤ftliche E-Mail-Adresse ein. Dieses Formular akzeptiert keine Adressen von $1.",emailOptIn:"Ein Link wurde an Ihre E-Mail-Adresse gesendet damit Sie sich erneut anmelden kГ¶nnen.",resubscribeMessage:"Vermutlich haben Sie sich abgemeldet. Wenn Sie wieder anmelden mГ¶chten, bitte <a class='resubscribe-link' href='#resubscribe'>Klicken Sie hier</a>. Sie bekommen ein E-mail wo mit Sie sich erneut anmelden kГ¶nnen.",":date":"Bitte verwenden Sie die Kalenderfunktion um ein korrektes datum zu bekommen (JJJJ-MM-TT).",phoneInvalidCharacters:"Darf nur Zahlen, +()-. und x enthalten",phoneInvalidLengthOrFormat:"Muss eine gГјltige Telefonnummer sein",emailSuggestion:"Meinten Sie"},esES:{"*":"Rellene este campo obligatorio.","[required]":"Rellene este campo obligatorio.",":email":"Introduzca una direcciГіn de correo electrГіnico vГЎlida.",":url":"Introduzca una URL vГЎlida.",":number":"Introduzca un nГєmero vГЎlido.","[max]":"Introduzca un valor que no sea superior a $1.","[min]":"Introduzca un valor de al menos $1.","[pattern]":"",":radio[required]":"Seleccione al menos una opciГіn.","select[required]":"Seleccione una opciГіn en la lista desplegable.",'[type="text"][required],textarea[required]':"Rellene este campo obligatorio.",missingOptionSelection:"Seleccione al menos una opciГіn.",forbiddenEmailDomain:"Introduzca la direcciГіn de correo electrГіnico de su empresa. Este formulario no acepta direcciones de $1.",emailOptIn:"Compruebe el correo electrГіnico para volver a activar la funciГіn.",resubscribeMessage:"Parece que ha decidido desactivar la funciГіn de comunicaciГіn por correo electrГіnico. <a class='resubscribe-link' href='#resubscribe'>Haga clic aquГ­</a> para recibir un mensaje de correo electrГіnico y volver a activar la funciГіn.",":date":"Utilice el selector de fecha con el formato AAAA-MM-DD.",phoneInvalidCharacters:"Solo debe contener nГєmeros, +()-. y x",phoneInvalidLengthOrFormat:"Debe ser un nГєmero de telГ©fono vГЎlido",emailSuggestion:"ВїQuiso decir"},esMX:{"*":"Complete este campo obligatorio.","[required]":"Complete este campo obligatorio.",":email":"Ingrese una direcciГіn de correo electrГіnico vГЎlida.",":url":"Ingrese un URL vГЎlido.",":number":"Ingrese un nГєmero vГЎlido.","[max]":"Ingrese un valor no mayor que $1.","[min]":"Ingrese un valor de por lo menos $1.","[pattern]":"",":radio[required]":"Seleccione por lo menos una opciГіn.","select[required]":"Seleccione una opciГіn en la lista desplegable.",'[type="text"][required],textarea[required]':"Complete este campo obligatorio.",missingOptionSelection:"Seleccione por lo menos una opciГіn.",forbiddenEmailDomain:"Ingrese su direcciГіn de correo electrГіnico corporativa. Este formulario no acepta direcciones de $1.",emailOptIn:"Revise su correo electrГіnico para volver a recibir comunicaciones por correo electrГіnico.",resubscribeMessage:"Aparentemente eligiГі dejar de recibir comunicaciones por correo electrГіnico. <a class='resubscribe-link' href='#resubscribe'>Haga clic aquГ­</a> para recibir un correo electrГіnico y volver a recibir comunicaciones por correo electrГіnico.",":date":"Por favor utiliza el selector de fechas de manera que se ingrese el formato AAAA-MM-DD.",phoneInvalidCharacters:"SГіlo debe contener nГєmeros, +()-. y x",phoneInvalidLengthOrFormat:"Debe ser un nГєmero de telГ©fono vГЎlido",emailSuggestion:"ВїQuisiste decir"},fi:{"*":"TГ¤ydennГ¤ tГ¤mГ¤ pakollinen kenttГ¤.","[required]":"TГ¤ydennГ¤ tГ¤mГ¤ pakollinen kenttГ¤.",":email":"Anna kelvollinen sГ¤hkГ¶postiosoite.",":url":"Anna kelvollinen URL-osoite.",":number":"Anna kelvollinen numero.","[max]":"Anna enintГ¤Г¤n $1:n suuruinen arvo.","[min]":"Anna vГ¤hintГ¤Г¤n $1:n suuruinen arvo.","[pattern]":"",":radio[required]":"Valitse ainakin yksi vaihtoehto.","select[required]":"Valitse vaihtoehto pudotusvalikosta.",'[type="text"][required],textarea[required]':"TГ¤ydennГ¤ tГ¤mГ¤ pakollinen kenttГ¤.",missingOptionSelection:"Valitse ainakin yksi vaihtoehto.",forbiddenEmailDomain:"Anna yrityksesi sГ¤hkГ¶postiosoite. TГ¤mГ¤ lomake ei hyvГ¤ksy osoitteita palvelusta $1.",emailOptIn:"Tarkista sГ¤hkГ¶postiosoitteesi, jos haluat jatkaa viestintГ¤Г¤.",resubscribeMessage:"Olet valinnut, ettГ¤ haluat lopettaa sГ¤hkГ¶postiviestinnГ¤n. <a class='resubscribe-link' href='#resubscribe'>Napsauta tГ¤tГ¤</a> saadaksesi sГ¤hkГ¶postiviestin ja jatkaaksesi viestintГ¤Г¤.",":date":"Aseta pГ¤ivГ¤mГ¤Г¤rГ¤ valitsimella niin, ettГ¤ se vastaa VVVV-KK-PP вЂ“muotoa.",phoneInvalidCharacters:"Saa sisГ¤ltГ¤Г¤ vain numeroita tai merkit +()-. ja x",phoneInvalidLengthOrFormat:"TГ¤mГ¤n on oltava kelvollinen puhelinnumero",emailSuggestion:"Tarkoititko"},fr:{"*":"Ce champ doit ГЄtre complГ©tГ©.","[required]":"Ce champ doit ГЄtre complГ©tГ©.",":email":"Saisissez une adresse e-mail valide.",":url":"Saisissez une URL valide.",":number":"Saisissez un numГ©ro valide.","[max]":"Saisissez une valeur infГ©rieure ou Г©gale Г  $1.","[min]":"Saisissez une valeur supГ©rieure ou Г©gale Г  $1.","[pattern]":"",":radio[required]":"SГ©lectionnez au moins une option.","select[required]":"SГ©lectionnez une option dans le menu dГ©roulant.",'[type="text"][required],textarea[required]':"Ce champ doit ГЄtre renseignГ©.",missingOptionSelection:"SГ©lectionnez au moins une option.",forbiddenEmailDomain:"Saisissez votre adresse e-mail professionnelle. Les adresses de type $1 ne peuvent pas ГЄtre indiquГ©es sur ce formulaire.",emailOptIn:"Consultez votre boГ®te de rГ©ception pour recevoir Г  nouveau des notifications.",resubscribeMessage:"Vous avez demandГ© Г  ce que des notifications ne vous soient plus envoyГ©es par e-mail. <a class='resubscribe-link' href='#resubscribe'>Cliquez ici</a> pour recevoir un e-mail vous permettant d'en bГ©nГ©ficier Г  nouveau.",":date":"Utilisez le sГ©lectionneur de date pour adopter un format de type AAAA-MM-JJ.",phoneInvalidCharacters:"Doit uniquement contenir des nombres, ou les symboles  +()-. et x",phoneInvalidLengthOrFormat:"Il doit s'agir d'un numГ©ro de tГ©lГ©phone valide",emailSuggestion:"Vouliez-vous dire"},it:{"*":"Compila questo campo obbligatorio.","[required]":"Compila questo campo obbligatorio.",":email":"Inserisci un indirizzo e-mail valido.",":url":"Inserisci un URL valido.",":number":"Inserisci un numero valido.","[max]":"Inserisci un valore non superiore a $1.","[min]":"Inserisci un valore minimo di $1.","[pattern]":"",":radio[required]":"Seleziona almeno un'opzione.","select[required]":"Seleziona un'opzione dal menu a discesa.",'[type="text"][required],textarea[required]':"Compila questo campo obbligatorio.",missingOptionSelection:"Seleziona almeno un'opzione.",forbiddenEmailDomain:"Inserisci il tuo indirizzo e-mail aziendale. Il presente modulo non accetta indirizzi da $1.",emailOptIn:"Verifica il tuo indirizzo e-mail per scegliere di partecipare nuovamente.",resubscribeMessage:"Sembra che hai deciso di non voler ricevere comunicazioni e-mail. <a class='resubscribe-link' href='#resubscribe'>Fai clic qui</a> per ricevere un'e-mail e scegliere di partecipare nuovamente.",":date":"Utilizza lo strumento di selezione data per rispettare il formato AAAA-MM-GG.",phoneInvalidCharacters:"Deve contenere solo numeri, +()-. e x",phoneInvalidLengthOrFormat:"Deve essere un numero di telefono valido.",emailSuggestion:"Forse intendevi"},jaJP:{"*":"еї…й €гЃ®гѓ•г‚Јгѓјгѓ«гѓ‰г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚","[required]":"еї…й €гЃ®гѓ•г‚Јгѓјгѓ«гѓ‰г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",":email":"жњ‰еЉ№гЃЄEгѓЎгѓјгѓ«г‚ўгѓ‰гѓ¬г‚№г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",":url":"жњ‰еЉ№гЃЄURLг‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",":number":"жњ‰еЉ№гЃЄз•ЄеЏ·г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚","[max]":"$1д»Ґдё‹гЃ®еЂ¤г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚","[min]":"$1д»ҐдёЉгЃ®еЂ¤г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏпЅ„гЃ•гЃ„гЂ‚","[pattern]":"",":radio[required]":"1гЃ¤д»ҐдёЉгЃ®г‚Єгѓ—г‚·гѓ§гѓіг‚’йЃёжЉћгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚","select[required]":"гѓ‰гѓ­гѓѓгѓ—гѓЂг‚¦гѓігЃ‹г‚‰г‚Єгѓ—г‚·гѓ§гѓіг‚’йЃёжЉћгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",'[type="text"][required],textarea[required]':"еї…й €гЃ®гѓ•г‚Јгѓјгѓ«гѓ‰г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",missingOptionSelection:"1гЃ¤д»ҐдёЉгЃ®г‚Єгѓ—г‚·гѓ§гѓіг‚’йЃёжЉћгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",forbiddenEmailDomain:"гѓ“г‚ёгѓЌг‚№з”ЁгЃ®EгѓЎгѓјгѓ«г‚ўгѓ‰гѓ¬г‚№г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚гЃ“гЃ®гѓ•г‚©гѓјгѓ гЃ«$1гЃ‹г‚‰гЃ®г‚ўгѓ‰гѓ¬г‚№г‚’е…ҐеЉ›гЃ™г‚‹гЃ“гЃЁгЃЇе‡єжќҐгЃѕгЃ›г‚“гЂ‚",emailOptIn:"EгѓЎгѓјгѓ«г‚’гѓЃг‚§гѓѓг‚ЇгЃ—гЃ¦г‚Єгѓ—гѓ€г‚¤гѓігЃ«еѕ©её°гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",resubscribeMessage:"EгѓЎгѓјгѓ«гЃ§гЃ®гЃ”йЂЈзµЎгЃЊг‚Єгѓ—гѓ€г‚ўг‚¦гѓ€гЃ•г‚ЊгЃ¦гЃ„г‚‹г‚€гЃ†гЃ§гЃ™гЂ‚<a class='resubscribe-link' href='#resubscribe'>EгѓЎгѓјгѓ«г‚’еЏ—дїЎгЃ—гЃ¦г‚Єгѓ—гѓ€г‚¤гѓігЃ«еѕ©её°гЃ™г‚‹гЃ«гЃЇгЂЃгЃ“гЃ“г‚’г‚ЇгѓЄгѓѓг‚ЇгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„</a>гЂ‚",":date":"гѓ‡гѓјг‚їгѓ”гѓѓг‚«гѓјг‚’дЅїз”ЁгЃ—гЃ¦ YYYY-MM-DD еЅўејЏгЃ§жЊ‡е®љгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",phoneInvalidCharacters:"ж•°е­—гЃЁ+гЂЃ(гЂЃ)гЂЃ-гЂЃ.гЂЃxгЃ®гЃїе…ҐеЉ›гЃ§гЃЌгЃѕгЃ™",phoneInvalidLengthOrFormat:"ж­ЈгЃ—гЃ„еЅўејЏгЃ®й›»и©±з•ЄеЏ·г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„",emailSuggestion:"г‚‚гЃ—гЃ‹гЃ—гЃ¦: "},nl:{"*":"Vul dit verplichte veld in.","[required]":"Vul dit verplichte veld in.",":email":"Voer een geldig e-mailadres in.",":url":"Voer een geldige URL in.",":number":"Voer een geldig nummer in.","[max]":"Voer een waarde in die kleiner is dan $1.","[min]":"Voer een waarde in van minstens $1.","[pattern]":"",":radio[required]":"Selecteer minstens Г©Г©n optie.","select[required]":"Selecteer een optie in de vervolgkeuzelijst.",'[type="text"][required],textarea[required]':"Vul dit verplichte veld in.",missingOptionSelection:"Selecteer minstens Г©Г©n optie.",forbiddenEmailDomain:"Voer uw zakelijke e-mailadres in. In dit formulier kunt u geen adressen invullen van $1.",emailOptIn:"Controleer uw e-mail om u opnieuw aan te melden.",resubscribeMessage:"U hebt zich afgemeld voor e-mailberichten. <a class='resubscribe-link' href='#resubscribe'>Klik hier</a> om een e-mail te ontvangen en u opnieuw aan te melden.",":date":"Gebruik de datumkiezer voor de datumnotatie JJJJ-MM-DD.",phoneInvalidCharacters:"Mag alleen de tekens +()-. en x bevatten",phoneInvalidLengthOrFormat:"Moet een geldig telefoonnummer zijn",emailSuggestion:"Bedoel je"
},pl:{"*":"UzupeЕ‚nij pole obowiД…zkowe.","[required]":"UzupeЕ‚nij pole obowiД…zkowe.",":email":"Podaj poprawny adres email.",":url":"Podaj poprawny adres URL.",":number":"Podaj poprawnД… wartoЕ›Д‡ liczbowД….","[max]":"Podaj wartoЕ›Д‡ nie wiД™kszД… niЕј $1.","[min]":"Podaj wartoЕ›Д‡ nie mniejszД… niЕј $1.","[pattern]":"",":radio[required]":"Wybierz przynajmniej jednД… opcjД™.","select[required]":"Wybierz z listy rozwijanД™j.",'[type="text"][required],textarea[required]':"UzupeЕ‚nij pole obowiД…zkowe.",missingOptionSelection:"Wybierz przynajmniej jednД… opcjД™.",forbiddenEmailDomain:"Podaj firmowy adres email. Ten formularz nie akceptuje adresГіw w domenie $1.",emailOptIn:"SprawdЕє swojД… skrzynkД™ email aby potwierdziД‡ subskrypcjД™.",resubscribeMessage:"WyglД…da na to, Ејe zrezygnowaЕ‚eЕ› z otrzymywania naszej komunikacji. <a class='resubscribe-link' href='#resubscribe'>Kliknij</a> aby zapisaД‡ siД™ ponownie.",":date":"UЕјyj kalendarza aby podaД‡ datД™ w formacie YYYY-MM-DD.",phoneInvalidCharacters:"MoЕјe zawieraД‡ tylko liczby oraz  +()-. i x",phoneInvalidLengthOrFormat:"NieprawidЕ‚owy format numeru telefonu",emailSuggestion:"Czy chodziЕ‚o Ci o"},ptBR:{"*":"Preencha este campo obrigatГіrio.","[required]":"Preencha este campo obrigatГіrio.",":email":"Insira um endereГ§o de e-mail vГЎlido.",":url":"Insira uma URL vГЎlida.",":number":"Insira um nГєmero vГЎlido.","[max]":"Insira um valor que nГЈo seja maior que $1.","[min]":"Insira um valor de pelo menos $1.","[pattern]":"",":radio[required]":"Selecione pelo menos uma opГ§ГЈo.","select[required]":"Selecione uma opГ§ГЈo do menu suspenso.",'[type="text"][required],textarea[required]':"Preencha este campo obrigatГіrio.",missingOptionSelection:"Selecione pelo menos uma opГ§ГЈo.",forbiddenEmailDomain:"Insira o seu endereГ§o de e-mail comercial. Este formulГЎrio nГЈo aceita endereГ§os de $1.",emailOptIn:"Verifique seu e-mail para voltar a receber a comunicaГ§ГЈo.",resubscribeMessage:"Parece que vocГЄ optou por sair da comunicaГ§ГЈo por e-mail. <a class='resubscribe-link' href='#resubscribe'>Clique aqui</a> para receber um e-mail e voltar a receber a comunicaГ§ГЈo.",":date":"Use o seletor de data para corresponder ao formato AAAA-MM-DD.",phoneInvalidCharacters:"Deve conter apenas nГєmeros +()-. e x",phoneInvalidLengthOrFormat:"Deve ser um nГєmero de telefone vГЎlido",emailSuggestion:"VocГЄ quis dizer"},svSE:{"*":"Fyll i detta obligatoriska fГ¤lt.","[required]":"Fyll i detta obligatoriska fГ¤lt.",":email":"Ange en giltig e-postadress.",":url":"Ange en giltig webbadress (URL).",":number":"Ange ett giltigt nummer.","[max]":"Ange ett vГ¤rde som inte Г¶verstiger $1.","[min]":"Ange ett vГ¤rde som inte understiger $1.","[pattern]":"",":radio[required]":"VГ¤lj minst ett alternativ.","select[required]":"VГ¤lj ett alternativ i listan.",'[type="text"][required],textarea[required]':"Fyll i alla obligatoriska fГ¤lt.",missingOptionSelection:"VГ¤lj minst ett alternativ.",forbiddenEmailDomain:"Ange ditt fГ¶retags e-postadress. FormulГ¤ret godtar inte adresser frГҐn $1.",emailOptIn:"Se din e-post fГ¶r mer information om hur du anmГ¤ler dig igen",resubscribeMessage:"Det verkar som om du har tackat nej till e-postutskick. <a class='resubscribe-link' href='#resubscribe'>Klicka hГ¤r</a> om du vill fГҐ ett e-postmeddelande med mГ¶jlighet att anmГ¤la dig igen.",":date":"AnvГ¤nd kalenderfunktionen sГҐ fГҐr du korrekt datumformat (Г…Г…Г…Г…-MM-DD).",phoneInvalidCharacters:"FГҐr endast innehГҐlla siffror, +()-. och x",phoneInvalidLengthOrFormat:"MГҐste vara ett giltigt telefonnummer",emailSuggestion:"'Menade du"},zhCN:{"*":"ж­¤дёєеї…еЎ«ж ЏпјЊиЇ·е®Њж•ґеЎ«е†™гЂ‚","[required]":"ж­¤дёєеї…еЎ«ж ЏпјЊиЇ·е®Њж•ґеЎ«е†™гЂ‚",":email":"иЇ·иѕ“е…Ґжњ‰ж•€зљ„з”µй‚®ењ°еќЂгЂ‚",":url":"иЇ·иѕ“е…Ґжњ‰ж•€зљ„зЅ‘еќЂгЂ‚",":number":"иЇ·иѕ“е…Ґжњ‰ж•€зљ„ж•°е­—гЂ‚","[max]":"иЇ·иѕ“е…ҐдёЌе¤§дєЋ$1зљ„ж•°еЂјгЂ‚","[min]":"иЇ·иѕ“е…Ґи‡іе°‘дёє$1зљ„ж•°еЂјгЂ‚","[pattern]":"",":radio[required]":"иЇ·и‡іе°‘йЂ‰ж‹©дёЂйЎ№гЂ‚","select[required]":"иЇ·ењЁдё‹ж‹‰иЏњеЌ•дё­йЂ‰ж‹©дёЂйЎ№гЂ‚",'[type="text"][required],textarea[required]':"ж­¤дёєеї…еЎ«ж ЏпјЊиЇ·е®Њж•ґеЎ«е†™гЂ‚",missingOptionSelection:"иЇ·и‡іе°‘йЂ‰ж‹©дёЂйЎ№гЂ‚",forbiddenEmailDomain:"иЇ·иѕ“е…Ґж‚Ёзљ„е•†еЉЎз”µй‚®ењ°еќЂгЂ‚ж­¤иЎЁж јдёЌжЋҐеЏ—жќҐи‡Є$1зљ„ењ°еќЂгЂ‚",emailOptIn:"иЇ·жџҐж”¶й‚®д»¶д»Ґй‡Ќж–°йЂ‰ж‹©еЉ е…ҐгЂ‚",resubscribeMessage:"ж‚Ёдјјд№Ћи¦ЃйЂ‰ж‹©йЂЂе‡єз”µй‚®йЂљи®ЇгЂ‚<a class='resubscribe-link' href='#resubscribe'>з‚№е‡»ж­¤е¤„</a>иЋ·еѕ—й‡Ќж–°йЂ‰ж‹©еЉ е…Ґзљ„з”µй‚®",":date":"иЇ·дЅїз”Ёж—ҐжњџйЂ‰ж‹©е™ЁжЊ‰з…§е№ґ-жњ€-ж—Ґж јејЏиѕ“е…Ґ",phoneInvalidCharacters:"д»…иѓЅеЊ…еђ«ж•°е­—гЂЃxпјЊд»ҐеЏЉж ‡з‚№з¬¦еЏ·пјљ+()-.",phoneInvalidLengthOrFormat:"еї…йЎ»жЇжњ‰ж•€зљ„з”µиЇќеЏ·з Ѓ",emailSuggestion:"ж‚Ёзљ„ж„ЏжЂќжЇ"},zhHK:{"*":"ж­¤з‚єеї…еЎ«ж¬„пјЊи«‹е®Њж•ґеЎ«еЇ«гЂ‚","[required]":"ж­¤з‚єеї…еЎ«ж¬„пјЊи«‹е®Њж•ґеЎ«еЇ«гЂ‚",":email":"и«‹ијёе…Ґжњ‰ж•€зљ„й›»йѓµењ°еќЂгЂ‚",":url":"и«‹ијёе…Ґжњ‰ж•€зљ„з¶ІеќЂгЂ‚",":number":"и«‹ијёе…Ґжњ‰ж•€зљ„ж•ёе­—гЂ‚","[max]":"и«‹ијёе…ҐдёЌе¤§ж–ј$1зљ„ж•ёеЂјгЂ‚","[min]":"и«‹ијёе…Ґи‡іе°‘з‚є$1зљ„ж•ёеЂјгЂ‚","[pattern]":"",":radio[required]":"и«‹и‡іе°‘йЃёж“‡дёЂй …гЂ‚","select[required]":"и«‹ењЁдё‹ж‹‰жё…е–®дё­йЃёж“‡дёЂй …гЂ‚",'[type="text"][required],textarea[required]':"ж­¤з‚єеї…еЎ«ж¬„пјЊи«‹е®Њж•ґеЎ«еЇ«гЂ‚",missingOptionSelection:"и«‹и‡іе°‘йЃёж“‡дёЂй …гЂ‚",forbiddenEmailDomain:"и«‹ијёе…Ґж‚Ёзљ„е·ҐдЅњй›»йѓµењ°еќЂгЂ‚ж­¤иЎЁж јдёЌжЋҐеЏ—дѕ†и‡Є$1зљ„ењ°еќЂгЂ‚",emailOptIn:"и«‹жџҐж”¶йѓµд»¶д»Ґй‡Ќж–°йЃёж“‡еЉ е…ҐгЂ‚",resubscribeMessage:"ж‚Ёдјјд№Ћи¦ЃйЃёж“‡дёЌжЋҐж”¶й›»йѓµйЂљиЁЉгЂ‚<a class='resubscribe-link' href='#resubscribe'>и«‹жЊ‰ж­¤и™•</a>зЌІеѕ—й‡Ќж–°иЁ‚й–±зљ„й›»йѓµгЂ‚",":date":"и«‹дЅїз”Ёж—ҐжњџйЃёж“‡е™ЁжЊ‰з…§е№ґ-жњ€-ж—Ґж јејЏијёе…ҐгЂ‚",phoneInvalidCharacters:"еѓ…иѓЅеЊ…еђ«ж•ёе­—гЂЃxпјЊд»ҐеЏЉжЁ™й»ћз¬¦и™џпјљ+()-.",phoneInvalidLengthOrFormat:"еї…й €жЇжњ‰ж•€зљ„й›»и©±и™џзўј",emailSuggestion:"дЅ зљ„ж„ЏжЂќжЇ"}}}.call(this),function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};a=window.hsJQuery,null==window.hbspt&&(window.hbspt={}),g=null!=hbspt.forms?hbspt.forms:hbspt.forms={},h=g.inputHelpers=g.inputHelpers||{},c=9,null==g.contexts&&(g.contexts={}),n={validationCache:{}},d=window.__hs_,f="prod",e="prod"===f?"":"qa"===f?"qa":("undefined"!=typeof window&&null!==window&&null!=(i=window.location)&&null!=(j=i.hostname)?j.indexOf("hubspotqa.com"):void 0)>-1||("undefined"!=typeof window&&null!==window&&null!=(k=window.location)&&null!=(l=k.href)?l.indexOf("env=qa"):void 0)>-1?"qa":"",g.create=function(b){var c,d,f,h,i;return null!=(h=window.hbspt)&&null!=(i=h.forms)&&"function"==typeof i.setup&&i.setup(b),d=g.getCookie("hubspotutk"),c=this.getUniqueFormId(b),b.timestamp=b.timestamp?b.timestamp:(new Date).getTime(),g.defaultContext.pageUrl=window.location.href,g.defaultContext.pageTitle=document.title,null!=b.formData&&(b.form=a.extend(!0,{},b.formData),delete b.formData),f=g.contexts[c]=a.extend(!0,{},g.defaultContext,b),f.urlRoot="https://forms.hubspot"+e+".com",f.internalApiBase="https://internal.hubapi"+e+".com",f.emailValidationUrl=f.internalApiBase+"/emailvalidation/v1/public/validate",f.urlBase=f.urlRoot+"/uploads/form/v2",f.ctxBase=f.urlRoot+"/embed/v3/form/"+f.portalId+"/"+f.formId+"?callback=?",f.containerId="hbspt-form-"+b.timestamp,f.containerSelector="#"+f.containerId,d&&(f.hutk=d),g.originalEmbedContext=JSON.stringify(b),f.async?f.target=f.containerSelector:g.injectEmbedContainer(f),g.registerAnalyticsCallback(f),g.getFormData(f)},g.registerAnalyticsCallback=function(a){var b;return null==window._hsq&&(window._hsq=[]),b=this.getUniqueFormId(a),window._hsq.push(["trackFormView",a.formId]),window._hsq.push(function(c){var d,e,f,h;return a.hutk||(a.hutk=(null!=(d=c.utk)?d.visitor:void 0)||void 0),g.assignFirstVisitData(a),null!=c.pageId&&null!=(e=g.contexts[b])&&(e.pageId=c.pageId),a.canonicalUrl||null!=(f=g.contexts[b])&&(f.canonicalUrl=c.canonicalUrl),a.contentType?void 0:null!=(h=g.contexts[b])?h.contentType=c.contentType:void 0})},g.assignFirstVisitData=function(b){var c,d,e,f,h,i,j,k;return c=g.getEscapedCookie("hsfirstvisit"),d=c.split("|"),k=g.getUniqueFormId(b),j=g.getFormCtxById(k),c&&3===d.length?(i=d[0],e=d[1],h=d[2],h.length&&(a.isNumeric(h)&&(h=+h),f=new Date(h).getTime()),j.firstVisitUrl=i,j.firstVisitReferer=e,j.firstVisitTimestamp=f||h):void 0},g.getUniqueFormId=function(a){var b;return a.formInstanceId?b=a.formId+"_"+a.formInstanceId:a.formId},g.injectEmbedContainer=function(b){var c,d,e,f;return"undefined"==typeof b.target?(f=document.getElementsByTagName("script"),e=f[f.length-1],d=b.cms?"hbspt-form Normal ContactFormWrapper":"hbspt-form",c=a('<div class="'+d+'" id="'+b.containerId+'"></div>'),a(e).after(c)):(b.containerSelector=b.target,b.cms?a(b.target).addClass("Normal ContactFormWrapper"):void 0)},g.getFormData=function(b){var c,d;return c={properties:g.getCachedCompletedFields()},d=g.createEmbedRestPayload(b),a.getJSON(b.ctxBase,d).done(function(d){var e,f,h,i;return f=g.getUniqueFormId(b),i=g.contexts[f].properties,h=a.extend(!0,{},d,g.contexts[f],c),g.contexts[f].previewMode&&(h.properties=i),e=g.contexts[f]=h,"undefined"!=typeof e.onBeforeFormInit&&null!=e.onBeforeFormInit&&e.onBeforeFormInit(e),g.initialize(g.contexts[f])}).error(function(a){throw"Failed to load form data from HubSpot"})},g.createEmbedRestPayload=function(a){var b,c;return b={hutk:a.hutk},c=h.getQueryStringParams(),null!=(null!=c?c.email:void 0)&&(b.email=c.email),b},g.getRecentFieldsCookie=function(){var a;return a=h.getQueryStringParams(),null!=(null!=a?a.submissionGuid:void 0)?g.getCookie("hsrecentfields"):!1},g.getCachedCompletedFields=function(){var b,c;return c=g.getRecentFieldsCookie(),c?b=a.parseJSON(decodeURIComponent(c))||{}:{}},g._submitHandler=function(b){var c;return g.waitingForValidation?(c=a('[type="submit"]',this),c.prop("disabled",!0),g.submitClicked=!0,b.preventDefault(),setTimeout(function(a){return function(){return g.waitingForValidation&&g.submitClicked?(g.waitingForValidation=!1,g.submitClicked=!1,c.prop("disabled",!1),c.click()):void 0}}(this),1e3),!1):void 0},g.initialize=function(b){var c,d,e,f,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w;if(b.form.action=g.buildSubmitUrl(b),i=a(b.containerSelector),e=i.find(".performable-legacy"),n=e.length,w=this.getUniqueFormId(b),k=n?null:g.buildForm(b.form,w),v=g.getUniqueFormId(b),l="hsForm_"+v,n||i.append(k),c=n?e:i.find("#"+l),g.injectCss(b),n)for(c.attr("novalidate",!0),c.attr("id",l),c.attr("action",b.form.action),f=c.find("input[type=submit]"),h.bindSubmissionActions(f,b),s=b.form.formFieldGroups,o=0,q=s.length;q>o;o++)for(m=s[o],t=m.fields,p=0,r=t.length;r>p;p++)j=t[p],j.required&&(d=c.find("[name="+j.name+"]"),d.attr("required",!0));else null!=(u=c.find(":date"))&&u.dateinput({format:"yyyy-mm-dd",selectors:!0,yearRange:[-100,5]});return"undefined"!=typeof b.onBeforeValidationInit&&null!=b.onBeforeValidationInit&&b.onBeforeValidationInit(c,b),g.setupValidation(c,b),c.on("submit",a.proxy(g._submitHandler,c)),"undefined"!=typeof b.onFormReady&&null!=b.onFormReady&&b.onFormReady(c,b),g.setupAutoResubscribeHandler(c,b)},g.escapeEntityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},g.unescapeEntityMap={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#x2F;":"/"},g.escapeHtml=function(a){return String(a).replace(/[&<>"'\/]/g,function(a){return entityMap[a]})},g.unescapeHtml=function(a){return String(a).replace(/&amp;/g,"&").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#x2F;/g,"/")},g.getFormLanguageFromMetaData=function(a){var b,c,d,e,f;for(f="en",e=a.form.metaData,b=0,c=e.length;c>b;b++)d=e[b],"lang"===d.name&&(f=d.value);return f},g.setupValidation=function(b,c){var d,e;return e={offset:[0,0],position:"top center",messageClass:"hsformerror",message:"<div><em/></div>",lang:g.getFormLanguageFromMetaData(c),onFail:function(b){return function(b,c){return a(".resubscribe-message").remove()}}(this),onSuccess:function(d){return function(d,e){var f;return a(e).find(":selected[value=__PLACEHOLDER__]").val(""),"submit"===(null!=d&&null!=(f=d.originalEvent)?f.type:void 0)?h.cacheCompletedFields(b,c):void 0}}(this)},a("body").on("click touchstart",".hsformerror p, .hsformerror .close-form-error",function(b){return a(this).parent(".hsformerror").fadeOut("fast"),b.preventDefault(),!1}),d=a.extend(!0,{},e,c.validationOptions||{}),g.addValidationMessages(d),g.initCustomValidators(d,c),b.validator(d)},g.addValidationMessages=function(b){var c;return c=b.lang,a.tools.validator.localize(c,g.langs[c]||g.langs.en),null!=(null!=b?b.localization:void 0)?g.addLocalizationMessages(b.localization):void 0},g.addLocalizationMessages=function(b){var c,d;if(b){d=[];for(c in b)d.push(b.hasOwnProperty(c)?a.tools.validator.localize(c,b[c]):void 0);return d}},g.showErrorMessage=function(a,b){return void 0},g.parameterizeJson=function(a){var b,c;b=[];for(c in a)b.push(a[c]instanceof Array?c+"="+encodeURI(a[c].join(",")):a[c]instanceof Object?g.parameterizeJson(a[c]):c+"="+encodeURI(a[c]));return b.join("&amp;")},g.buildSubmitUrl=function(a){return[a.urlBase,"/",a.portalId,"/",a.form.guid].join("")},g.injectCss=function(b){var c;return c=b.css+b.cssRequired||"",a('<style type="text/css">'+c+"</style>").appendTo("head")},g.getFormCtxById=function(a){return g.contexts[a]||g.defaultContext},m={},g.setupAutoResubscribeHandler=function(b,c){var f,h,i,j;return f=a('[type="email"][name="email"]',b),i=function(b,d){var f;return g.emailRe.test(b)?null!=m[b]?d(m[b]):(f="https://api.hubapi"+e+(".com/email/v1/form-resubscribe/"+b+"/jsonp?portalId="+c.portalId+"&callback=?"),null!=n._resubXhr&&n._resubXhr.abort(),n._resubXhr=a.getJSON(f,function(a){return function(a){return m[b]=a.emailShouldResubscribe,d(m[b])}}(this))):d(!1)},j=function(a,b){return setTimeout(b,a)},b.on("click",".resubscribe-link",function(d){var h,i,k,l,n,o,p,q,r,s,t,u,v;return d.preventDefault(),(n=f.val())?(o=encodeURIComponent(n),r=document.title,p=window.location.href,s=c.portalId,t={portalId:s,resub_form_name:encodeURIComponent(r),resub_form_address:encodeURIComponent(p)},u=function(){var a;a=[];for(q in t)v=t[q],a.push(q+"="+v);return a}().join("&"),l="https://api.hubapi"+e+(".com/email/v1/form-resubscribe/"+o+"/jsonp/initiate?"+u+"&callback=?"),k=a(".resubscribe-message",b),i=a("span",k),h=a("<span style='display:none'>"+g.langs[g.getFormLanguageFromMetaData(c)].emailOptIn+"</span>"),k.append(h),i.fadeOut(200,function(){return h.fadeIn(400,function(){return j(2e3,function(){return k.fadeOut()})})}),a.getJSON(l),m[n]=!1):void 0}),h=function(b){var d;return d=f.val(),i(d,function(b){return function(b){var d,e;return b?(e="<span>"+g.langs[g.getFormLanguageFromMetaData(c)].resubscribeMessage+"</span>",d=a("<div class='resubscribe-message email-validation message'/>").html(e),a(".resubscribe-message").remove(),f.after(d)):void a(".resubscribe-message").remove()}}(this))},f.on("blur",h),f.on("keyup",d.debounce(h,200)),""!==f.val()?h(null):void 0},g.buildForm=function(b,c){var d,e,f,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;for(f=a(document.createElement("form")),i=g.getFormCtxById(c),n=g.getGroupsToBuild(i),C={name:"submit",text:b.submitText,description:""},x={editMode:!1,ctx:i},f.attr({"accept-charset":"UTF-8",enctype:"multipart/form-data",id:"hsForm_"+c,"class":b.cssClass,action:b.action,method:null!=(y=b.method)?y:"POST"}),f.addClass("hs-form"),i.cms&&f.addClass("ContactFormItems"),o=!1,z=i.form.formFieldGroups,p=0,s=z.length;s>p;p++)if(l=z[p],l.fields.length>1){o=!0;break}for(q=0,t=n.length;t>q;q++){for(l=n[q],e=a(document.createElement("fieldset")),k=l.fields.length,e.addClass("form-columns-"+k),null!=l.richText&&(h=g.buildRichText(l.richText),o?e.append(h):f.append(h)),m=!1,A=l.fields,r=0,u=A.length;u>r;r++)if(j=A[r],j.description){m=!0;break}for(B=l.fields,w=0,v=B.length;v>w;w++)j=B[w],m&&o&&!j.description&&(j.description="&nbsp;"),d=g.buildField(j,x),e.append(d),g.postFieldRender(d,j,i);f.append(o?e:d)}return f.append(g.buildField(C,x)),f},g.postFieldRender=function(a,b,c){return"phone"===b.name&&g.setupPhone(a,b,c),"booleancheckbox"===b.fieldType&&g.setupBooleanCheckbox(b,c),"date"===b.fieldType&&g.setupDatePicker(b,c),"email"===b.name?g.setupEmail(a,b,c):void 0},g.setupPhone=function(a,b,c){return g.addPhoneValidator(b,c)},g.setupBooleanCheckbox=function(a,b){return g.addFieldNameToMappingList("boolCheckBoxFields",a,b)},g.setupDatePicker=function(a,b){return g.addFieldNameToMappingList("dateFields",a,b)},g.setupEmail=function(a,b,c){var d;return g.setupMailcheck(a,c),(null!=(d=b.validation)?d.data:void 0)?c.validationOptions.forbiddenDomains=g.getBlockedDomains(b,c):void 0},g.addFieldNameToMappingList=function(a,b,c){var d;return d=c[a].length?c[a].split(","):[],d.push(b.name),c[a]=d.toString()},g.getGroupsToBuild=function(a){var b,c,d,e,f,g,i,j,k,l,m,n,o,p,q,r,s,t,u;t=function(a,b){var c,d,e,g,h,i;if(!a.isSmartGroup)return!0;for(h=a.fields.length,i=a.fields,e=0,g=i.length;g>e;e++){if(c=i[e],d=c.name.toLowerCase(),!(d in b&&b[d]))return!0;f.push(d)}return!1},c=a.form.formFieldGroups,l=a.properties,e=[],f=[],u=0,b=[],s=[];for(i=0,n=c.length;n>i;i++)d=c[i],d["default"]?b.push(d):s.push(d);if(a.deactivateSmartForm&&!h.getQueryStringParams().email)return b;for(j=0,o=b.length;o>j;j++)d=b[j],t(d,l)?e.push(d):u+=1;for(m=0,p=s.length;p>m&&(d=s[m],u);m++)t(d,l)&&(e.push(d),u-=1);if(f.length>0){for(g={},r=0,q=f.length;q>r;r++)k=f[r],g[k]=l[k];a.form.metaData.push({name:"smartFields",value:JSON.stringify(g),includeInSubmission:!0})}return e},g.emailIsValid=!0,g.emailRe=/.@./,g.datepickerRe=/^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,g._handleDelayedSubmit=function(b,c){var d,e,f;return g.waitingForValidation&&(g.waitingForValidation=!1,f=g.getUniqueFormId(c),d=g.getFormById(f),e=a('[type="submit"]',d),e.prop("disabled",!1),g.submitClicked&&(g.submitClicked=!1,b))?e.click():void 0},g.isEmailValid=function(b,c,d,e){return b&&a.trim(b)?(b=a.trim(b),d||g.emailRe.test(b)?null!=n.validationCache[b]?(g._handleDelayedSubmit(n.validationCache[b],c),e(n.validationCache[b])):(null!=n._validationXhr&&n._validationXhr.abort(),n._validationXhr=a.ajax(c.emailValidationUrl+"/"+b,{type:"PUT",contentType:"application/json",dataType:"jsonp",success:function(a,d,f){var h;return h=!!a.success,g._handleDelayedSubmit(h,c),n.validationCache[b]=h,e(h)},error:function(){return g._handleDelayedSubmit(!0,c),e(!0)}})):(g._handleDelayedSubmit(!0,c),e(!0))):(g._handleDelayedSubmit(!0,c),e(!0))},g.validateEmail=function(b,c,d){return g.emailIsValid=!0,b.closest("form").data("validator").checkValidity(b),b.siblings(".new-email-validation").remove(),g.isEmailValid(b.val(),c,d,function(d){return g.emailIsValid=d,b.closest("form").data("validator").checkValidity(b),d||(g.emailFailedValidation=!0),g.emailFailedValidation&&b.closest("form").data("validator").checkValidity(b),b.siblings(":not(.resubscribe-message)").remove(),d?void 0:(a(".resubscribe-message").remove(),b.mailcheck({suggested:function(b){return function(b,d){var e,f;return f=a(b),e=a('<div class="email-correction new-email-validation message" />'),e.html(g.langs[g.getFormLanguageFromMetaData(c)].emailSuggestion+(' <a href="javascript:;">'+d.full+"</a>?")),a(".resubscribe-message").remove(),f.after(e).siblings(".email-correction").slideDown().click(function(){return f.val(d.full),e.remove(),f.siblings(".new-email-validation").remove(),g.validateEmail(f,c)})}}(this),empty:function(b){return function(b){var c;return c=a(b).siblings(".email-correction"),c.length>0?c.remove():void 0}}(this)}),b.siblings(".new-email-validation").slideDown())})},g.setupMailcheck=function(b,e){var f,h;return f=a('[type="email"][name="email"]',b),h=function(a){return function(b,d){var h;return h=f.val(),d.keyCode!==c&&a.previousEmail!==h?(a.previousEmail=h,g.validateEmail(f,e,b)):void 0}}(this),f.on("blur change",function(a){return h(!0,a)}),f.on("keydown",function(a){return g.waitingForValidation=!0,13===a.which?h(!0,a):void 0}),f.on("input keyup",d.debounce(function(a){return h(!1,a)},1e3))},g.getBlockedDomains=function(b,c){var d,e,f,g,h,i,j,k;for(j=b.validation.data.split("|||"),d=j.length>1?j[1].split(","):[],k=j[0],f=c.validationOptions.forbiddenDomains||[],i=k.split(","),g=0,h=i.length;h>g;g++)e=i[g],e=a.trim(e),e&&o.call(f,e)<0&&f.push(e);return c.validationOptions.forbiddenDomains=f.concat(d)},g.strcmp=function(a,b){var c,d;return null!=(c=a===b)?c:{0:null!=(d=a>b)?d:{1:-1}}},g.buildField=function(b,c){var d,e,f,i,j,k,l,m,n,o,p,q,r,s;return d=a("<div/>"),o=[],d.addClass("hs_"+b.name),q=c.ctx.urlParams[b.name],l=(null!=(p=c.ctx.form)?p.ignoreCurrentValues:void 0)||c.ctx.ignoreCurrentValues,h.isExistingProperty(c.ctx.properties,b.name)&&!l&&("date"===b.fieldType?(b.defaultValue="",r=c.ctx.properties[b.name],g.datepickerRe.test(r)?b.defaultValue=r:(e=new Date(-1!==r.indexOf("/")||-1!==r.indexOf("-")?r:parseInt(r)),i=e.getUTCDate().toString(),i=i.length<2?"0"+i:i.toString(),n=(e.getUTCMonth()+1).toString(),n=n.length<2?"0"+n:n,s=e.getUTCFullYear().toString(),f=s+"-"+n+"-"+i,g.datepickerRe.test(f)&&(b.defaultValue=f))):b.hidden&&b.defaultValue||(b.defaultValue=c.ctx.properties[b.name])),"undefined"!=typeof q&&(b.defaultValue=q),"email"===b.name&&c.ctx.urlParams._hse&&(b.defaultValue=c.ctx.urlParams._hse),"submit"===b.name?j=g.fieldTypes.submit(b,c):b.hidden&&!c.editMode?(j=g.fieldTypes.hidden(b,c),d.addClass("field hs-form-field").hide()):(b.options.length>0&&b.options.sort(function(a,b){return a.displayOrder===b.displayOrder?g.strcmp(a.value,b.value):a.displayOrder>b.displayOrder?1:-1}),j=g.fieldTypes[b.fieldType](b,c),d.addClass("field"),d.addClass("hs-form-field"),m=g.inputHelpers.buildLabel(b,c),d.append(m)),b.isSmartField&&d.addClass("smart-field"),c.ctx.cms&&(d.addClass("ContactFormItem"),j.find("input, select, textarea").addClass("AutoFormInput")),k=g.inputHelpers.createDesc(b,c.editMode),o.push(k,j),a.each(o,function(a,b){return d.append(b)}),d},g.include=function(a,b){return-1!==a.indexOf(b)},g.getCookie=function(a){var b,c;return b=document.cookie.match("(^|;) ?"+a+"=([^;]*)(;|$)"),c=null,b&&b[2]&&(c=b[2]),c},g.getEscapedCookie=function(a){var b;return b=g.getCookie(a),null===b||"undefined"==typeof b?"":unescape(b)},g.getFormById=function(b){return a("#hsForm_"+b)},g.initCustomValidators=function(a,b){return g.addEmptyTextInputValidator(),g.addInvalidEmailValidator(),g.addForbiddenEmailDomainsValidation(a,b),g.addRequiredCheckboxOrRadioGroupValidation(),g.addEmptySelectValidator(),g.addNumberValidator(),g.addNumberMessageOverride(a,b),g.addDatePickerValidation(a,b),g.addCustomValidatorFns(a)},g.addEmptyTextInputValidator=function(){return a.tools.validator.fn('[type="text"][required],textarea[required]',function(b,c){return""!==a.trim(c)})},g.addInvalidEmailValidator=function(){return a.tools.validator.fn(":email",function(a,b){return g.emailIsValid})},g.addForbiddenEmailDomainsValidation=function(b,c){var d,e,f;return f=b.forbiddenDomains||[],e="#hsForm_"+g.getUniqueFormId(c)+" :email",d=function(){return a(this).is(e)},a.tools.validator.fn(d,function(a,b){var c,e;return d.key="forbiddenEmailDomain",c=null!=(e=b.split("@")[1])?e.toLowerCase():void 0,f.indexOf(c)>=0?[c]:!0})},g.addRequiredCheckboxOrRadioGroupValidation=function(){var b;return b=function(){return a(this).parents(".inputs-list[required]").length>0},a.tools.validator.fn(b,function(c,d){var e,f;return b.key="missingOptionSelection",e=a(c).parents(".inputs-list").find("input"),f=e.map(function(){return this.id}),c.attr("id")===f[0]&&e.filter(":checked").length>0?!0:!1})},g.addEmptySelectValidator=function(){return a.tools.validator.fn("select[required]",function(b,c){return"__PLACEHOLDER__"===a(b).find(":selected").val()?!1:!0})},g.addDatePickerValidation=function(b,c){return a.tools.validator.fn(":date",function(b,c){return""!==c?g.datepickerRe.test(a(b).val()):!0})},g.addCustomValidatorFns=function(b){var c,d,e;if(null!=b.validation){c=b.validation,e=[];for(d in c)e.push(c.hasOwnProperty(d)?a.tools.validator.fn(c[d].matcher,c[d].errorMessages,c[d].validator):void 0);return e}},g.buildRichText=function(b){var c;return c=a(document.createElement("div")),c.addClass("hs-richtext"),c.html(b.content)},g.addNumberValidator=function(){return a.tools.validator.fn(":number",function(b,c){return null!=b.context.validity?b.context.validity.valid:""!==c?a.isNumeric(c):!0})},g.addNumberMessageOverride=function(b,c){var d;return d=g.getFormById(c.form.guid),d.find(":number").attr("data-message",a.tools.validator.messages[":number"][b.lang])},g.addPhoneValidator=function(b,c){return a.tools.validator.fn('[name="phone"]',function(a,d){var e,f,h,i,j,k,l,m,n;if(k=/^(\+?\d+)?(?:[-().]?\d+)+(?:[x]?\d+)$/i,m=d.replace(/\s/g,""),e=m.replace(/[-+().x]/g,""),j=7,i=20,b.validation.data&&(n=b.validation.data.split(":"),h=n[0],f=parseInt(n[1])))switch(h){case"gt":j=f+1;break;case"lt":i=f-1;break;case"gte":j=f;break;case"lte":i=f;break;case"eq":j=f,i=f;break;default:h&&(j=parseInt(h)),i=f}return b.validation.required||d?/^\d*$/.test(e)?k.test(m)&&j<=(l=e.length)&&i>=l?!0:g.langs[g.getFormLanguageFromMetaData(c)].phoneInvalidLengthOrFormat:g.langs[g.getFormLanguageFromMetaData(c)].phoneInvalidCharacters:!0})},g.getErrMsg=function(b,c,d){var e,f,g;return e=b.lang||a.tools.validator.conf.lang,(null!=(f=b.localization)&&null!=(g=f[e])?g[c]:void 0)||d},g.fieldTypes={text:function(b,c){var d,e;return d=a(document.createElement("input")),e=a(document.createElement("div")),d.addClass("hs-input"),e.addClass("input"),d.attr("type","text"),d=h.setTextInputAttrs(h.setValidationAttrs(d,b),b,c),e.append(d)},textarea:function(b,c){var d,e;return d=a(document.createElement("textarea")),e=a(document.createElement("div")),d.addClass("hs-input"),e.addClass("input"),d=h.setTextInputAttrs(h.setValidationAttrs(d,b),b,c),e.append(d)},checkbox:function(b,c){var d;return d=a(document.createElement("div")),d.addClass("input"),d.append(g.inputHelpers.buildMultiField(b,c))},booleancheckbox:function(b){return function(b,c){var d,e,f,i,j,k,l,m;return f=a(document.createElement("ul")),k=b.hasOwnProperty("selectedOptions"),j=c.ctx,l=(null!=(m=j.form)?m.ignoreCurrentValues:void 0)||j.ignoreCurrentValues,h.isExistingProperty(j.properties,b.name)&&!l&&(b.selectedOptions=j.properties[b.name].split(",")),e=g.inputHelpers.booleanInput(b),i=g.inputHelpers.buildSimpleLabel("hs-form-"+b.fieldType+"-display"),d=a(document.createElement("li")).addClass("hs-form-"+b.fieldType),f.addClass("inputs-list"),b.required&&f.attr("required",!0),k&&g.include(b.selectedOptions,"true")&&e.attr("checked","checked"),e.attr("name",b.name).attr("id",b.name).addClass("hs-input"),i.attr("for",b.name).html(b.label),i.prepend(e),b.required&&i.append('<span class="hs-form-required"> * </span>'),d.append(i),f.append(d),f}}(this),radio:function(b,c){var d;return d=a(document.createElement("div")),d.addClass("input"),d.append(g.inputHelpers.buildMultiField(b,c))},select:function(b,c){var d,e,f,i,j;return e=a(document.createElement("select")),f=a(document.createElement("div")),j=b.hasOwnProperty("selectedOptions"),i=c.ctx,e.addClass("hs-input"),e.attr("id",b.name+"-"+g.getUniqueFormId(c.ctx)),f.addClass("input"),b.selectedOptions=h.prefillFieldWithPropertyOrParam(i,b),""!==b.unselectedLabel&&(d=a(document.createElement("option")),d.attr("value","__PLACEHOLDER__"),d.text(b.unselectedLabel),e.append(d)),a.each(b.options,function(c,d){var f;return f=a(document.createElement("option")),f.attr("value",String(b.options[c].value)),f.text(b.options[c].label),j&&g.include(b.selectedOptions,b.options[c].value)&&f.attr("selected","selected"),e.append(f)}),e.attr("name",b.name),e=h.setValidationAttrs(e,b),f.append(e)},number:function(b,c){var d,e;return d=a(document.createElement("input")),e=a(document.createElement("div")),d.addClass("hs-input"),e.addClass("input"),d=h.setTextInputAttrs(h.setValidationAttrs(d,b),b,c),d.attr({type:"number",name:b.name,value:b.defaultValue,step:"any"}),e.append(d)},date:function(b,c){var d,e;return d=a(document.createElement("input")),e=a(document.createElement("div")),d.addClass("hs-input"),e.addClass("input"),d.attr({id:b.name+"-"+g.getUniqueFormId(c.ctx),type:"date",name:b.name,value:b.defaultValue}),h.setValidationAttrs(d,b),e.append(d)},file:function(b,c){var d,e;return d=a(document.createElement("input")),e=a(document.createElement("div")),d.addClass("hs-input"),e.addClass("input"),d.attr({id:b.name+"-"+g.getUniqueFormId(c.ctx),type:"file",size:"30",name:b.name}),h.setValidationAttrs(d,b),e.append(d)},submit:function(b,c){var d,e,f,g;return d=a(document.createElement("input")),e=a(document.createElement("div")),g=b.text||"Submit",f=c.ctx,d.addClass(f.submitButtonClass?f.submitButtonClass:"hs-button primary large"),e.addClass("actions"),c.ctx.cms&&d.addClass("FormSubmitButton"),h.bindSubmissionActions(d,f),d.attr("type","submit"),d.attr("value",g),e.append(d)},hidden:function(b,c){var d,e,f;return d=a(document.createElement("input")),e=a(document.createElement("div")),d.addClass("hs-input"),e.addClass("input"),f="enumeration"===b.type?b.selectedOptions.join(";"):b.defaultValue,d.attr({type:"hidden",name:b.name,value:f}),e.append(d)}},h.prefillFieldWithPropertyOrParam=function(a,b){var c,d;return c=(null!=(d=a.form)?d.ignoreCurrentValues:void 0)||a.ignoreCurrentValues,h.isExistingProperty(a.properties,b.name)&&!c?h.getSelectedOptions(a.properties[b.name]):b.defaultValue?b.defaultValue:b.hasOwnProperty("selectedOptions")?b.selectedOptions:[]},h.bindSubmissionActions=function(a,b){return a.click(function(a){var c,d,e,f;return f=g.getUniqueFormId(b),c=g.getFormById(f),e=c.find("[name=hs_context]").parent().remove(),d=h.buildContextField(b),d?(c.find("[name=hs_context]").parent().remove(),c.append(d)):e&&c.append(e),!0})},g.isHostedOnHubspot=function(){var b;return b=!1,a("body").contents().filter(function(){return 8===this.nodeType}).each(function(a,c){return/Generated by the HubSpot Template Builder/.test(c.nodeValue)||/page-load-success : cms/.test(c.nodeValue)?b=!0:void 0}),b},h.cacheCompletedFields=function(a,b){var c,d,e,f,i;for(f=a.serializeArray().filter(function(a){return"hs_context"!==a.name}),i=g.getCachedCompletedFields(),d=0,e=f.length;e>d;d++)c=f[d],""!==c.value&&(i[c.name]=c.value);return h.setCookie("hsrecentfields",JSON.stringify(i),5)},h.setCookie=function(a,b,c){var d,e,f;return f=60*c*1e3,d=new Date,d.setTime(d.getTime()+f),e=d.toGMTString(),document.cookie=a+"="+encodeURIComponent(b)+"; expires="+e+"; path=/"},h.buildContextField=function(b,c){var d,e,f,h,i,j,k,l;for(l=g.getUniqueFormId(b),d=g.getFormById(l),e=a.extend(!0,{},b),e.hutk=g.getCookie("hubspotutk"),e.recentFieldsCookie=g.getRecentFieldsCookie()||null,e.formHtml=null!=d?d.parent().html():void 0,e.userAgent="undefined"!=typeof navigator&&null!==navigator?navigator.userAgent:void 0,e.originalEmbedContext=g.originalEmbedContext,e.hostedOnHubspot=g.isHostedOnHubspot(),e.formName=b.form.name,k=e.form.metaData,h=0,i=k.length;i>h;h++)j=k[h],"disableCookieSubmission"===j.name?delete e.hutk:j.includeInSubmission&&null==e[j.name]&&(e[j.name]=j.value);return delete e.form,delete e.css,delete e.cssRequired,delete e.properties,delete e.urlParams,delete e.validationOptions,delete e.currentValues,f=JSON.stringify(e),g.fieldTypes.hidden({name:"hs_context",defaultValue:f},c)},h.buildMultiField=function(b,c){var d,e,f;return d=a(document.createElement("ul")),f=b.hasOwnProperty("selectedOptions"),e=c.ctx,d.addClass("inputs-list"),b.required&&d.attr("required",!0),b.selectedOptions=h.prefillFieldWithPropertyOrParam(e,b),a.each(b.options,function(e,h){var i,j,k;return j=g.inputHelpers.optionsInput(b,e,c),k=g.inputHelpers.buildSimpleLabel("hs-form-"+b.fieldType+"-display"),i=a(document.createElement("li")).addClass("hs-form-"+b.fieldType),f&&g.include(b.selectedOptions,b.options[e].value)&&j.attr("checked","checked"),k.attr("for",""+b.name+e+"-"+g.getUniqueFormId(c.ctx)).html(b.options[e].label),k.prepend(j),i.append(k),d.append(i)}),d.addClass("multi-container"),d},h.getSelectedOptions=function(b){var c,d,e,f,g,h;for(f=b.split(";"),g=[],c=0,d=f.length;d>c;c++)e=f[c],g.push(h=a.trim(e));return g},h.setTextInputAttrs=function(a,b,c){var d;return d=c.ctx,a.attr({id:b.name+"-"+g.getUniqueFormId(c.ctx),name:b.name,value:b.defaultValue,placeholder:b.placeholder}),a},h.setValidationAttrs=function(a,b){var c;return"validation"in b&&(null!=(c=b.validation)?c.name:void 0)&&a.attr("type",b.validation.name),"email"===b.name&&a.attr("type","email"),b.required&&a.attr("required",!0),a},h.optionsInput=function(b,c,d){var e,f;try{e=a(document.createElement("<input name='"+b.name+"'/>"))}catch(h){f=h,e=a(document.createElement("input"))}return e.attr({name:b.name,type:b.fieldType,value:b.options[c].value,id:""+b.name+c+"-"+g.getUniqueFormId(d.ctx)}).addClass("hs-input"),e},h.booleanInput=function(b){var c;return c=a(document.createElement("input")),c.attr("type","checkbox"),c.attr("value","true"),"true"===b.defaultValue&&c.attr("checked",!0),c},h.buildSimpleLabel=function(b){
var c;return c=a(document.createElement("label")),c.addClass(b),c},h.buildLabel=function(b,c){var d,e,f,h,i,j;return d=a(document.createElement("label")),f="booleancheckbox"===b.fieldType,i="Enter your "+b.label,h=f?"":b.label,j=b.required!==!0||f?"":'<span class="hs-form-required"> * </span>',e=""+h+j,c.ctx.cms&&d.addClass("AutoFormLabel"),d.attr("placeholder",i),d.attr("for",b.name+"-"+g.getUniqueFormId(c.ctx)),d.html(e),d},h.createDesc=function(b,c){var d;return d=a(['<div class="hs-field-desc">',b.description,"</div>"].join("")),b.description&&!b.hidden||b.description&&c?d.css("display","block"):d.css("display","none"),d.html(),d},h.isExistingProperty=function(a,b){return"undefined"!=typeof a&&a.hasOwnProperty(b)&&a[b].length?!0:!1},h.getQueryStringParams=function(){var a,b,c,d,e;for(e=/([^&=]+)=?([^&]*)/g,a=function(a){return decodeURIComponent(a)},d=window.location.search.substring(1),c={};b=e.exec(d);)c[a(b[1])]=a(b[2]);return c},g.defaultContext={portalId:null,formId:null,hutk:null,deactivateSmartForm:!1,form:{},properties:{},cms:!1,css:'.hs-button-reset,.hs-form .hs-button{border:0;font-family:Helvetica,Arial,sans-serif;line-height:1;margin:0;outline:0;padding:0}.base-hs-button-styles,.hs-form .hs-button{text-decoration:none;cursor:pointer;display:inline-block;font-size:12px;font-weight:700;line-height:12px;padding:7px 18px;position:relative;text-align:center}.base-hs-button-styles:hover,.hs-form .hs-button:hover{text-decoration:none}input.hs-input[type=checkbox],input.hs-input[type=radio]{cursor:pointer}input.hs-input,textarea.hs-input,select.hs-input{display:inline-block;width:210px;height:18px;padding:4px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px;font-weight:400;line-height:18px;color:#666;border:1px solid #ccc;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px}textarea.hs-input{padding-top:5px}html.webkit textarea.hs-input{padding-top:6px;padding-left:5px}input.hs-input[type=checkbox],input.hs-input[type=radio]{width:auto;height:auto;padding:0;margin:3px 0;line-height:normal;border:0}input.hs-input[type=file]{background-color:#fff;padding:initial;border:initial;line-height:initial;-moz-box-shadow:none;-webkit-box-shadow:none;box-shadow:none}input.hs-input[type=button],input.hs-input[type=reset],input.hs-input[type=submit]{width:auto;height:auto}input.hs-input[type=search]{-moz-border-radius:16px;-webkit-border-radius:16px;border-radius:16px;background-image:url(/common_assets/static/img/form/search.png);background-repeat:no-repeat;padding-left:26px;padding-right:6px;padding-top:5px;padding-bottom:3px;background-position:8px 8px}html.firefox input.hs-input[type=search]{position:relative;top:1px}input.hs-input[type=search].transparent-image{background-image:url(/common_assets/static/img/form/search-transparent.png)}input.hs-input[type=search]::-webkit-search-decoration,input.hs-input[type=search]::-webkit-search-cancel-button,input.hs-input[type=search]::-webkit-search-results-button,input.hs-input[type=search]::-webkit-search-results-decoration{display:none}select.hs-input,input.hs-input[type=file]{height:27px}select[multiple].hs-input{height:inherit}textarea.hs-input{height:auto}.hs-input:-moz-placeholder{color:#bfbfbf}.hs-input::-webkit-input-placeholder{color:#bfbfbf}input.hs-input,textarea.hs-input{-moz-transition:border .2s linear,box-shadow .2s linear;-o-transition:border .2s linear,box-shadow .2s linear;-webkit-transition:border .2s linear,box-shadow .2s linear;transition:border .2s linear,box-shadow .2s linear;-moz-box-shadow:inset 0 1px 3px rgba(0,0,0,.1);-webkit-box-shadow:inset 0 1px 3px rgba(0,0,0,.1);box-shadow:inset 0 1px 3px rgba(0,0,0,.1)}input.hs-input:focus,textarea.hs-input:focus{outline:0;border-color:rgba(82,168,236,.8);-moz-box-shadow:inset 0 1px 3px rgba(0,0,0,.1),0 0 8px rgba(82,168,236,.6);-webkit-box-shadow:inset 0 1px 3px rgba(0,0,0,.1),0 0 8px rgba(82,168,236,.6);box-shadow:inset 0 1px 3px rgba(0,0,0,.1),0 0 8px rgba(82,168,236,.6)}input.hs-input.error,.hs-form div.field.error input,.hs-form div.field.error textarea,.hs-form div.field.error .chzn-choices,textarea.hs-input.error{border-color:#c87872;-moz-box-shadow:0 0 3px rgba(171,41,32,.25);-webkit-box-shadow:0 0 3px rgba(171,41,32,.25);box-shadow:0 0 3px rgba(171,41,32,.25)}input.hs-input.error:focus,.hs-form div.field.error input:focus,.hs-form div.field.error textarea:focus,.hs-form div.field.error .chzn-choices:focus,textarea.hs-input.error:focus{border-color:#b9554d;-moz-box-shadow:0 0 6px rgba(171,41,32,.5);-webkit-box-shadow:0 0 6px rgba(171,41,32,.5);box-shadow:0 0 6px rgba(171,41,32,.5)}.input-mini.hs-input,input.mini.hs-input,textarea.mini.hs-input,select.mini.hs-input{width:60px}.input-small.hs-input,input.small.hs-input,textarea.small.hs-input,select.small.hs-input{width:90px}.input-medium.hs-input,input.medium.hs-input,textarea.medium.hs-input,select.medium.hs-input{width:150px}.input-large.hs-input,input.large.hs-input,textarea.large.hs-input,select.large.hs-input{width:210px}.input-xlarge.hs-input,input.xlarge.hs-input,textarea.xlarge.hs-input,select.xlarge.hs-input{width:270px}.input-xxlarge.hs-input,input.xxlarge.hs-input,textarea.xxlarge.hs-input,select.xxlarge.hs-input{width:530px}textarea.hs-input.xxlarge{overflow-y:auto}input.hs-input.span1,textarea.hs-input.span1,select.hs-input.span1{display:inline-block;float:none;width:30px;margin-left:0}input.hs-input.span2,textarea.hs-input.span2,select.hs-input.span2{display:inline-block;float:none;width:90px;margin-left:0}input.hs-input.span3,textarea.hs-input.span3,select.hs-input.span3{display:inline-block;float:none;width:150px;margin-left:0}input.hs-input.span4,textarea.hs-input.span4,select.hs-input.span4{display:inline-block;float:none;width:210px;margin-left:0}input.hs-input.span5,textarea.hs-input.span5,select.hs-input.span5{display:inline-block;float:none;width:270px;margin-left:0}input.hs-input.span6,textarea.hs-input.span6,select.hs-input.span6{display:inline-block;float:none;width:330px;margin-left:0}input.hs-input.span7,textarea.hs-input.span7,select.hs-input.span7{display:inline-block;float:none;width:390px;margin-left:0}input.hs-input.span8,textarea.hs-input.span8,select.hs-input.span8{display:inline-block;float:none;width:450px;margin-left:0}input.hs-input.span9,textarea.hs-input.span9,select.hs-input.span9{display:inline-block;float:none;width:510px;margin-left:0}input.hs-input.span10,textarea.hs-input.span10,select.hs-input.span10{display:inline-block;float:none;width:570px;margin-left:0}input.hs-input.span11,textarea.hs-input.span11,select.hs-input.span11{display:inline-block;float:none;width:630px;margin-left:0}input.hs-input.span12,textarea.hs-input.span12,select.hs-input.span12{display:inline-block;float:none;width:690px;margin-left:0}input.hs-input.span13,textarea.hs-input.span13,select.hs-input.span13{display:inline-block;float:none;width:750px;margin-left:0}input.hs-input.span14,textarea.hs-input.span14,select.hs-input.span14{display:inline-block;float:none;width:810px;margin-left:0}input.hs-input.span15,textarea.hs-input.span15,select.hs-input.span15{display:inline-block;float:none;width:870px;margin-left:0}input.hs-input.span16,textarea.hs-input.span16,select.hs-input.span16{display:inline-block;float:none;width:930px;margin-left:0}input.hs-input[disabled],select.hs-input[disabled],textarea.hs-input[disabled]{background-color:#f5f5f5;border-color:#ddd;cursor:not-allowed}.help-inline,.help-block{font-size:11px;line-height:18px;color:#818181}.help-inline{padding-left:5px}.help-block{display:block;max-width:600px}.inline-inputs{color:#818181}.inline-inputs span,.inline-inputs input{display:inline-block}.inline-inputs input.mini{width:60px}.inline-inputs input.small{width:90px}.inline-inputs span{padding:0 2px 0 1px}.input-prepend input,.input-append input{-moz-border-radius:0 3px 3px 0;-webkit-border-radius:0;border-radius:0 3px 3px 0}.input-prepend .add-on,.input-append .add-on{position:relative;background:#f5f5f5;border:1px solid #ccc;z-index:2;float:left;display:block;width:auto;min-width:16px;height:18px;padding:4px 4px 4px 5px;margin-right:-1px;font-weight:400;line-height:18px;color:#bfbfbf;text-align:center;text-shadow:0 1px 0 #fff;-moz-border-radius:3px 0 0 3px;-webkit-border-radius:3px;border-radius:3px 0 0 3px}.input-prepend .active,.input-append .active{background:#bfe0bf;border-color:#59AD59}.input-append input{float:left;-moz-border-radius:3px 0 0 3px;-webkit-border-radius:3px;border-radius:3px 0 0 3px}.input-append .add-on{-moz-border-radius:0 3px 3px 0;-webkit-border-radius:0;border-radius:0 3px 3px 0;margin-right:0;margin-left:-1px}.hs-form{margin-bottom:18px}.hs-form fieldset{margin-bottom:18px;padding-top:18px}.hs-form fieldset legend{display:block;margin-left:150px;font-size:19.5px;line-height:1;color:#414141}.hs-form .clearfix,.hs-form .field,.hs-form .hs-form-field{*zoom:1;margin-bottom:18px}.hs-form .clearfix:after,.hs-form .field:after,.hs-form .hs-form-field:after{content:"";display:table;clear:both}.hs-form label{padding-top:5px;font-size:13px;line-height:18px;font-weight:700;float:left;width:130px;text-align:right;color:#414141}.hs-form .input{margin-left:150px}.hs-form div.field.error{background:#fae5e3;padding:6px 0;margin-bottom:18px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px}.hs-form div.field.error>label,.hs-form div.field.error span.help-inline,.hs-form div.field.error span.help-block{color:#9d261d}.hs-form div.field.error .input-prepend span.add-on,.hs-form div.field.error .input-append span.add-on{background:#f4c8c5;border-color:#c87872;color:#b9554d}.hs-form .hsErrMsgContainer ul{margin-top:6px;margin-bottom:0;margin-left:7px;list-style:none}.hs-form .hsErrMsgContainer ul li{font-size:12px;color:#a44e47}.hs-form .hsErrMsgContainer .hs-block-message{min-width:200px;width:200px}.hs-form .hsErrMsgContainer .hs-block-message ul{margin-top:0}.hs-form .actions{background:#f5f5f5;margin-top:18px;margin-bottom:18px;padding:17px 20px 18px 150px;border-top:1px solid #ddd;-moz-border-radius:0 0 3px 3px;-webkit-border-radius:0;border-radius:0 0 3px 3px}.hs-form .actions .secondary-action{float:right}.hs-form .actions .secondary-action a{line-height:30px}.hs-form .actions .secondary-action a:hover{text-decoration:underline}.hs-form .inputs-list{margin:0 0 5px;width:100%}.hs-form .inputs-list>li{display:block;padding:0;width:100%}.hs-form .inputs-list label{display:block;float:none;width:auto;padding:0;line-height:18px;text-align:left;white-space:normal;font-weight:400}.hs-form .inputs-list label strong{color:#818181}.hs-form .inputs-list label small{font-size:11px;font-weight:400}.hs-form .inputs-list .inputs-list{margin-left:25px;margin-bottom:10px;padding-top:0}.hs-form .inputs-list:first-child{padding-top:6px}.hs-form .inputs-list>li+li{padding-top:2px}.hs-form .inputs-list input[type=radio],.hs-form .inputs-list input[type=checkbox]{margin-bottom:0}.hs-form.stacked{padding-left:20px}.hs-form.stacked fieldset{padding-top:9px}.hs-form.stacked legend{margin-left:0}.hs-form.stacked label{display:block;float:none;width:auto;font-weight:700;text-align:left;line-height:20px;padding-top:0;margin-bottom:4px}.hs-form.stacked .field{margin-bottom:18px}.hs-form.stacked .field div.input{margin-left:0}.hs-form.stacked .field div.input>input+a,.hs-form.stacked .field div.input select+a,.hs-form.stacked .field div.input textarea+a{margin-top:4px;display:block}.hs-form.stacked .inputs-list{margin-bottom:0}.hs-form.stacked .inputs-list>li{padding-top:0}.hs-form.stacked .inputs-list>li label{font-weight:400;padding-top:0}.hs-form.stacked div.error{padding:3px 10px 6px;margin-top:0;margin-left:-10px;margin-bottom:9px}.hs-form.stacked .actions{margin-left:-26px;padding-left:20px}.hs-form{padding-left:0}.hs-form.stacked{padding-left:0}.hs-form.stacked fieldset{padding:0}.hs-form .hs-button{color:#fff;text-shadow:0 -1px 0 #3574E3;background-color:#3574E3;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzdlYzhmNCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzM1NzRlMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==);background-size:100%;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#7ec8f4),color-stop(100%,#3574e3));background-image:-moz-linear-gradient(top,#7ec8f4,#3574e3);background-image:-webkit-linear-gradient(top,#7ec8f4,#3574e3);background-image:linear-gradient(to bottom,#7ec8f4,#3574e3);box-shadow:inset 0 1px 0 rgba(255,255,255,.5);border-top:1px solid #64BAF0;border-bottom:1px solid #1C4ED5;border-right:1px solid #468EE6;border-left:1px solid #468EE6;border-radius:4px;-moz-transition:opacity .15s linear;-o-transition:opacity .15s linear;-webkit-transition:opacity .15s linear;transition:opacity .15s linear;-moz-user-select:none;-webkit-user-select:none;user-select:none}.hs-form .hs-button:visited,.hs-form .hs-button:hover{color:#fff}.hs-form .hs-button:hover:not(.inactive),.hs-form .hs-button:focus:not(.inactive),.hs-form .hs-button.hovered:not(.inactive){box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 0 5px #3574E3;border-top:1px solid #4db0ee;border-bottom:1px solid #1946be;border-right:1px solid #3080e3;border-left:1px solid #3080e3}.hs-form .hs-button:active:not(.inactive):not(.link),.hs-form .hs-button.depressed:not(.inactive):not(.link),.dropdown-open>.hs-form .hs-button:not(.inactive):not(.link){background-color:#599eeb;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzM1NzRlMyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzU5OWVlYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==);background-size:100%;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#3574e3),color-stop(100%,#599eeb));background-image:-moz-linear-gradient(top,#3574e3,#599eeb);background-image:-webkit-linear-gradient(top,#3574e3,#599eeb);background-image:linear-gradient(to bottom,#3574e3,#599eeb);box-shadow:inset 0 1px 2px rgba(0,0,0,.3),inset 0 -1px 0 rgba(255,255,255,.3);border-top:1px solid #1C4ED5;border-bottom:1px solid #4084e2;border-right:1px solid #468EE6;border-left:1px solid #468EE6}.dropdown-open>.hs-form .hs-button:not(.inactive):not(.link){box-shadow:inset 0 1px 2px rgba(0,0,0,.3)}.hs-form .hs-button.disabled.disabled.disabled.disabled,.hs-form .hs-button[disabled][disabled][disabled]{background-color:#6387c5;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzg4YjFjZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzYzODdjNSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==);background-size:100%;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#88b1ce),color-stop(100%,#6387c5));background-image:-moz-linear-gradient(top,#88b1ce,#6387c5);background-image:-webkit-linear-gradient(top,#88b1ce,#6387c5);background-image:linear-gradient(to bottom,#88b1ce,#6387c5);box-shadow:inset 0 1px 0 rgba(255,255,255,0);border-top:1px solid #7baacc;border-bottom:1px solid #5774be;border-right:1px solid #6c94c7;border-left:1px solid #6c94c7;cursor:default;color:#ededed;text-shadow:none;opacity:.6}.hs-form .hs-button.disabled.disabled.disabled.disabled.next:before,.hs-form .hs-button[disabled][disabled][disabled].next:before{opacity:.5}.hs-form .hs-button.disabled.disabled.disabled.disabled.previous:before,.hs-form .hs-button[disabled][disabled][disabled].previous:before{opacity:.5}.hs-form .hs-button.next:before,.hs-form .hs-button.previous:before{background:url(/style_guide/static/img/hs-button-arrows.png) center 0 no-repeat;display:block;width:16px;height:16px;position:absolute;top:5px;content:" ";z-index:99}.hs-form .hs-button.next{padding-right:32px}.hs-form .hs-button.next:before{right:9px}.hs-form .hs-button.previous{padding-left:32px}.hs-form .hs-button.previous:before{background-position:center -16px;left:9px}.hs-form .hs-button.inactive{cursor:default}.hs-form ul{list-style:none}.hs-form label{display:block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.hs-form .hs-field-desc{color:#aaa;margin:0 0 5px 150px;font-size:11px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.hs-form .hs-form-required{color:red}.hs-form .field{margin-bottom:9px}.hs-form .hs-richtext{margin-bottom:3px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;line-height:18px;font-size:14px;color:#414141}.hs-form .hs-richtext hr{text-align:left;margin-left:0;width:91%}.hs-form .email-correction,.hs-form .email-validation{padding-top:3px;font-size:12px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.hs-form .email-correction a,.hs-form .email-validation a{cursor:pointer}.hs-form .inputs-list{padding-left:5px;list-style:none}.hs-form .inputs-list li input{margin:3px 5px 3px 0}.hs-form input[type=checkbox],.hs-form input[type=radio]{margin-right:5px}.hs-form input:not([type=image]),.hs-form textarea{box-sizing:content-box}.hs-form.stacked .hs-field-desc{margin:0 0 2px}.hs-form .hs-input,.hs-form textarea.hs-input{box-sizing:border-box;max-width:500px;width:90%}.hs-form .hs-input:not[type=checkbox],.hs-form .hs-input:not[type=radio],.hs-form textarea.hs-input:not[type=checkbox],.hs-form textarea.hs-input:not[type=radio]{min-height:18px;min-width:100px}.hs-form .actions{background:transparent;margin-top:18px;margin-bottom:18px;padding:17px 20px 18px 0;border-top:0;-moz-border-radius:0 0 3px 3px;-webkit-border-radius:0;border-radius:0 0 3px 3px}.hs-form .actions .secondary-action{float:right}.hs-form .actions .secondary-action a{line-height:30px}.hs-form .actions .secondary-action a:hover{text-decoration:underline}',cssRequired:".hs-form fieldset{border:0;padding:0;margin:0;max-width:500px}.hs-form fieldset.form-columns-1 .hs-input{width:95%}.hs-form fieldset.form-columns-1 .input{margin-right:8px}.hs-form fieldset.form-columns-1 input[type=checkbox],.hs-form fieldset.form-columns-1 input[type=radio]{width:auto}.hs-form fieldset.form-columns-2 .hs-form-field{width:50%;float:left}.hs-form fieldset.form-columns-2 .input{margin-right:8px}.hs-form fieldset.form-columns-3 .hs-form-field{width:32.7%;float:left}.hs-form fieldset.form-columns-3 .input{margin-right:8px}.hsformerror{margin:0 0 2px;padding:2px 6px;height:auto;background-color:#fdd2d0;font-size:11px;border:1px solid #fcb3af;padding:4px 16px 4px 10px;color:#000;display:none;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZlZmVmZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZkZDJkMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==);background-size:100%;background-image:-webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#fefefe),color-stop(100%,#fdd2d0));background-image:-moz-linear-gradient(#fefefe,#fdd2d0);background-image:-webkit-linear-gradient(#fefefe,#fdd2d0);background-image:linear-gradient(#fefefe,#fdd2d0);-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;-moz-box-shadow:0 0 6px #ddd;-webkit-box-shadow:0 0 6px #ddd;box-shadow:0 0 6px #ddd;z-index:99999}.hsformerror em{border:10px solid;border-color:#fdd2d0 transparent transparent;bottom:-17px;display:block;height:0;left:60px;position:absolute;width:0}.hsformerror p{font-family:Lucida Grande,Lucida Sans Unicode,bitstream vera sans,trebuchet ms,verdana,sans-serif;margin:0;float:left;margin-right:8px}.hsformerror:hover{cursor:default}.hsformerror .close-form-error{float:right;display:inline;top:3px;position:absolute;font-family:Verdana!important;color:#b17c79!important;cursor:pointer!important;font-size:11px!important;font-weight:400!important}.hsformerror .close-form-error:hover{color:#cc8884}#calroot{z-index:10000;margin-top:-1px;width:198px;padding:2px;background-color:#fff;font-size:11px;border:1px solid #ccc;-moz-border-radius:5px;-webkit-border-radius:5px;-moz-box-shadow:0 0 15px #666;-webkit-box-shadow:0 0 15px #666}#calroot p,#calroot div,#calroot a{font-family:Lucida Grande,Lucida Sans Unicode,bitstream vera sans,trebuchet ms,verdana,sans-serif}#calroot #calhead{padding:2px 0;height:22px}#calroot #caltitle{font-size:14px;color:#0150D1;float:left;text-align:center;width:155px;line-height:20px;text-shadow:0 1px 0 #ddd}#calroot #calnext,#calroot #calprev{display:block;margin:5px 7px;width:0;height:0;float:left;cursor:pointer}#calroot #calnext{float:right;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #666}#calroot #calprev{border-top:5px solid transparent;border-bottom:5px solid transparent;border-right:5px solid #666}#calroot #calprev.caldisabled,#calroot #calnext.caldisabled{visibility:hidden}#calroot #caltitle select{font-size:10px}#calroot #caldays{height:14px;border-bottom:1px solid #ddd}#calroot #caldays span{display:block;float:left;width:28px;text-align:center}#calroot #calweeks{background-color:#fff;margin-top:4px}#calroot .calweek{clear:left;height:22px}#calroot .calweek a{display:block;float:left;width:27px;height:20px;text-decoration:none;font-size:11px;margin-left:1px;text-align:center;line-height:20px;color:#666;-moz-border-radius:3px;-webkit-border-radius:3px}#calroot .calweek a:hover{background-color:#ddd}#calroot .calfocus{background-color:#ddd}#calroot a.calsun{color:red}#calroot a.caloff{color:#ccc}#calroot a.caloff:hover{background-color:#f5f5fa}#calroot a.caldisabled{background-color:#efefef!important;color:#ccc!important;cursor:default}#calroot #calcurrent{background-color:#498CE2;color:#fff}#calroot #caltoday{background-color:#333;color:#fff}@media (max-width:400px),(min-device-width:320px) and (max-device-width:480px){form.hs-form .form-columns-2 .hs-form-field,form.hs-form .form-columns-3 .hs-form-field{float:none;width:100%}form.hs-form .form-columns-2 .hs-form-field .hs-input,form.hs-form .form-columns-3 .hs-form-field .hs-input{width:95%}}",validationOptions:{},urlParams:h.getQueryStringParams(),boolCheckBoxFields:"",dateFields:"",previewMode:!1},b=a(".hbspt-form-container"),b.length&&b.each(function(b,c){var d,e;return d={},d.portalId=a(c).data("portalid"),d.formId=a(c).data("formid"),d.async=!0,d.timestamp=(new Date).getTime(),e=a.extend(!0,{},g.defaultContext,d),a(c).attr("id","hbspt-form-"+d.timestamp),g.create(e)})}.call(this);
//# sourceMappingURL=current.js.map

/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);

/*
* jquery-match-height 0.7.0 by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=-1,o=-1,i=function(t){return parseFloat(t)||0},a=function(e){var o=1,a=t(e),n=null,r=[];return a.each(function(){var e=t(this),a=e.offset().top-i(e.css("margin-top")),s=r.length>0?r[r.length-1]:null;null===s?r.push(e):Math.floor(Math.abs(n-a))<=o?r[r.length-1]=s.add(e):r.push(e),n=a}),r},n=function(e){var o={
byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof e?t.extend(o,e):("boolean"==typeof e?o.byRow=e:"remove"===e&&(o.remove=!0),o)},r=t.fn.matchHeight=function(e){var o=n(e);if(o.remove){var i=this;return this.css(o.property,""),t.each(r._groups,function(t,e){e.elements=e.elements.not(i)}),this}return this.length<=1&&!o.target?this:(r._groups.push({elements:this,options:o}),r._apply(this,o),this)};r.version="0.7.0",r._groups=[],r._throttle=80,r._maintainScroll=!1,r._beforeUpdate=null,
r._afterUpdate=null,r._rows=a,r._parse=i,r._parseOptions=n,r._apply=function(e,o){var s=n(o),h=t(e),l=[h],c=t(window).scrollTop(),p=t("html").outerHeight(!0),d=h.parents().filter(":hidden");return d.each(function(){var e=t(this);e.data("style-cache",e.attr("style"))}),d.css("display","block"),s.byRow&&!s.target&&(h.each(function(){var e=t(this),o=e.css("display");"inline-block"!==o&&"flex"!==o&&"inline-flex"!==o&&(o="block"),e.data("style-cache",e.attr("style")),e.css({display:o,"padding-top":"0",
"padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),l=a(h),h.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||"")})),t.each(l,function(e,o){var a=t(o),n=0;if(s.target)n=s.target.outerHeight(!1);else{if(s.byRow&&a.length<=1)return void a.css(s.property,"");a.each(function(){var e=t(this),o=e.attr("style"),i=e.css("display");"inline-block"!==i&&"flex"!==i&&"inline-flex"!==i&&(i="block");var a={
display:i};a[s.property]="",e.css(a),e.outerHeight(!1)>n&&(n=e.outerHeight(!1)),o?e.attr("style",o):e.css("display","")})}a.each(function(){var e=t(this),o=0;s.target&&e.is(s.target)||("border-box"!==e.css("box-sizing")&&(o+=i(e.css("border-top-width"))+i(e.css("border-bottom-width")),o+=i(e.css("padding-top"))+i(e.css("padding-bottom"))),e.css(s.property,n-o+"px"))})}),d.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||null)}),r._maintainScroll&&t(window).scrollTop(c/p*t("html").outerHeight(!0)),
this},r._applyDataApi=function(){var e={};t("[data-match-height], [data-mh]").each(function(){var o=t(this),i=o.attr("data-mh")||o.attr("data-match-height");i in e?e[i]=e[i].add(o):e[i]=o}),t.each(e,function(){this.matchHeight(!0)})};var s=function(e){r._beforeUpdate&&r._beforeUpdate(e,r._groups),t.each(r._groups,function(){r._apply(this.elements,this.options)}),r._afterUpdate&&r._afterUpdate(e,r._groups)};r._update=function(i,a){if(a&&"resize"===a.type){var n=t(window).width();if(n===e)return;e=n;
}i?-1===o&&(o=setTimeout(function(){s(a),o=-1},r._throttle)):s(a)},t(r._applyDataApi),t(window).bind("load",function(t){r._update(!1,t)}),t(window).bind("resize orientationchange",function(t){r._update(!0,t)})});



/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
if(Object.create){!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");}
