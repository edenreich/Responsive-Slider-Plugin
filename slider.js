
/*
|--------------------------------------------------------------------------
| Polyfill section
|--------------------------------------------------------------------------
| just in case some objects are not supported by the browser.
| 
|
*/
if(typeof Object.create !== 'function') {

	Object.create = function(obj) {
		
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

/*
|--------------------------------------------------------------------------
| jQuery Slider Plugin
|--------------------------------------------------------------------------
| This plugin allow you to create a slider on the webpage, you may pass it
| the array of paths to your images and they will be displayed on that slider.
| 
| This Slider plugin is allowed for personal use and is restricted for commercial use.
| 
| Copyrights Eden Reich©. 
|
*/
;(function($, window, document, undefined)
{
	"use strict";
	

	var Slider = {

		sliderWidth: null,
		sliderHeight: null,
		ref_int: 0,
		$slider: null,
		$slides: null,
		images: [],
		currentSlide: null,
		settings: {},
		$leftButton: {},
		$rightButton: {},
		$stepsWrapper: {},

		/**
		 * We initiating all the Slider Object Properties
		 * and overriding the default settings with given 
		 * settings from the user.
		 */
		init: function(options, element) {
			// We cache the slider object for a later use.
			var _currentInstance = this;
			
			// We extend the overriding our setting with the users settings.
			_currentInstance.settings = $.extend({}, $.fn.Slider.settings, options);

			// We create and cache the elements for the slider.
			_currentInstance.$sliderWrapper = $(element);
			_currentInstance.$slider = _currentInstance.createSlider();
			_currentInstance.$slides = _currentInstance.createSlides(_currentInstance.settings.images);
			
			// We get the height and the width of the slider according to the window size.
			_currentInstance.sliderWidth = _currentInstance.$sliderWrapper.width();
			_currentInstance.sliderHeight = (_currentInstance.$sliderWrapper.height() === 0) ? 400 : _currentInstance.$sliderWrapper.height();
			
			// We make sure our slider will have a reasonable height on smaller screens.
			_currentInstance.sliderHeight = ($(window).width() < 667) ? 200 : _currentInstance.sliderHeight;
			
			// We add the slider to the DOM
			_currentInstance.$slider.html(_currentInstance.$slides);
			_currentInstance.$sliderWrapper.html(_currentInstance.$slider);
			
			// We set the current slide position to 1
			_currentInstance.currentSlide = 1;

			// We cache the images from the settings in our current object property
			_currentInstance.images = _currentInstance.settings.images;
		
			// We check if auto sliding if requested
			if(_currentInstance.settings.autoSlide) {

				_currentInstance.startSlider();
				
				_currentInstance.$sliderWrapper
					.on('mouseenter', _currentInstance.stopSlider.bind(_currentInstance))
					.on('mouseleave', _currentInstance.startSlider.bind(_currentInstance));
			}

			// We add a buttons for the slider if requested
			if(_currentInstance.settings.withButtons) {
				
				_currentInstance.addButtons();

				_currentInstance.$leftButton.on('click', _currentInstance.slideLeft.bind(_currentInstance));
				_currentInstance.$rightButton.on('click', _currentInstance.slideRight.bind(_currentInstance));

			}

			if(_currentInstance.settings.withSteps) {

				_currentInstance.addSteps();
			}

			// We style the slider
			_currentInstance.styleSlider();
		},

		/**
		 * This method starts the Slider.
		 */
		startSlider: function() {
			
			var _currentInstance = this;
			
			_currentInstance.ref_int = setInterval(_currentInstance.slideRight.bind(_currentInstance), _currentInstance.settings.slideTime || 2000);		
		},

		/**
		 * This method stops the Slider.	
		 */
		stopSlider: function() {
			
			var _currentInstance = this;
			
			clearInterval(_currentInstance.ref_int);
		},

		/**
		 * This method creates the Slider Element.	
		 */
		createSlider: function() {

			return $("<ul />", {
				'class': 'slides',
			});
		},

		/**
		 * This method creates the Slides.
		 */
		createSlides: function(images) {
			
			var	_currentInstance = this,
				slides = [],
				img = {};

			$(images).each(function(index, value) {

				img = $('<img />', {'src': value});

				slides[index] = $("<li />", {
					'class': 'slide',
				}).append(img);

				_currentInstance.images[index] = img;
			});

			return slides;	
		},

		/**
		 * This method Styles the slider.	
		 */
		styleSlider: function() {

			var _currentInstance = this;

			var sliderWarpperSelectorName = '.' + $(_currentInstance.$sliderWrapper).attr('class'),
				sliderSelectorName = '.' + $(_currentInstance.$slider).attr('class'),
				slidesSelectorName = '.' + $(_currentInstance.$slider).find('li').attr('class'),
				imageSelectorName = '.' + $(_currentInstance.$slider).find('li').attr('class') +' > img';
				
			if(_currentInstance.settings.withButtons) {

				var buttonLeft = '.' + $(_currentInstance.$leftButton).attr('class').split(' ')[1],
					buttonRight = '.' + $(_currentInstance.$rightButton).attr('class').split(' ')[1],
					leftButtonIcon = '.' + $(_currentInstance.$leftButton).find('span').attr('class').replace(/\s+/g, '.'),
					rightButtonIcon = '.' + $(_currentInstance.$rightButton).find('span').attr('class').replace(/\s+/g, '.');
			}

			if(_currentInstance.settings.withSteps) {
				
				var stepsWrapper = '.' + _currentInstance.$stepsWrapper.attr('class'),
					step = '.' + _currentInstance.$stepsWrapper.children('div').attr('class');
			}	
			
			var styleTags = $('<style />');
			
			var styleRules =  sliderWarpperSelectorName + '{text-align:center;display:block;overflow:hidden;position:relative;width:'+_currentInstance.sliderWidth+'px;height:'+ _currentInstance.sliderHeight +'px;border:1px solid #000000;box-shadow:0 0 15px 1px #ffffff;}';
				styleRules += sliderWarpperSelectorName + ' ' + sliderSelectorName + '{width:'+ _currentInstance.sliderWidth*_currentInstance.images.length +'px;height:'+ _currentInstance.sliderHeight +'px;position:absolute;left:0;top:0;margin:0;padding:0;}';
				styleRules += sliderWarpperSelectorName + ' ' + slidesSelectorName + '{float:left;height:100%;width:'+ _currentInstance.sliderWidth +'px;}';
				styleRules += sliderWarpperSelectorName + ' ' + imageSelectorName + '{height:100%;width:100%;}';
			
			if(_currentInstance.settings.withButtons) {

				styleRules += sliderWarpperSelectorName + ' ' + buttonLeft + '{background-color:RGBA(0, 0, 0, 0.3);color:#e4e4e4;position:absolute;width:45px;height:45px;border-radius:50% 50%;float:left;top:50%;left:10px;margin-top:-20px;border:0;outline:0;}';
				styleRules += sliderWarpperSelectorName + ' ' + buttonRight + '{background-color:RGBA(0, 0, 0, 0.3);color:#e4e4e4;position:absolute;width:45px;height:45px;border-radius:50% 50%;float:right;top:50%;right:10px;margin-top:-20px;border:0;outline:0;}';
				styleRules += sliderWarpperSelectorName + ' ' + leftButtonIcon + '{font-size:1.5em;line-height:45px;text-align:center;display:block}';
				styleRules += sliderWarpperSelectorName + ' ' + rightButtonIcon + '{font-size:1.5em;line-height:45px;text-align:center;display:block}';
				styleRules += sliderWarpperSelectorName + ' ' + buttonLeft + ':hover{background-color:RGBA(0,0,0,0.5)}';
				styleRules += sliderWarpperSelectorName + ' ' + buttonRight + ':hover{background-color:RGBA(0,0,0,0.5)}';
			}

			if(_currentInstance.settings.withSteps) {

				styleRules += sliderWarpperSelectorName + ' ' + stepsWrapper + '{position:absolute;bottom:5px;height:40px;display:inline-block;border:1px solid #000000;padding:0 25px;margin-left: -' + ((_currentInstance.images.length*20)+60)/2 + 'px;border-radius:50% 50%;background-color:RGBA(0, 0, 0, 0.3);}';
				styleRules += sliderWarpperSelectorName + ' ' + step + '{border:3px solid #000000;border-radius:50% 50%;width:20px;height:20px;position:relative;display:inline-block;margin:0 auto;top:10px;background-color:RGBA(0, 0, 0, 0.4);margin-left:5px;}';
				styleRules += sliderWarpperSelectorName + ' ' + step + '.active{background-color:#ffffff;}';
			}

			$('head').append(styleTags.html(styleRules));
		},

		/**
		 * This method adds the buttons if requested.
		 */
		addButtons: function() {

			var _currentInstance = this;

			_currentInstance.$leftButton = $('<button />', {
				'class': 'button btn-left',
				'href': '#',
			}).append($('<span />', {
				'class': 'glyphicon glyphicon-chevron-left',	
			}));

			_currentInstance.$rightButton = $('<button />', {
				'class': 'button btn-right',
				'href': '#',
			}).append($('<span />', {
				'class': 'glyphicon glyphicon-chevron-right',	
			}));

			_currentInstance.$sliderWrapper.append(_currentInstance.$leftButton);
			_currentInstance.$sliderWrapper.append(_currentInstance.$rightButton);
		},

		/**
		 * This method adds the indexes("indication points" on which slider we are currently at) 
		 * if requested.
		 */
		addSteps: function() {

			var _currentInstance = this;

			_currentInstance.$stepsWrapper = $('<div />', {
				'class': 'steps-wrapper',
			}).appendTo(_currentInstance.$sliderWrapper);
		
			var steps = [],
				$step;

			$(_currentInstance.images).each(function(index, value) {
		
				$step = $('<div />', {
					'class': 'step',
				});
				
				steps.push($step);
			});
			
			_currentInstance.$stepsWrapper.append(steps);	
		},

		/**
		 * This method will slide the slider to the left.
		 */
		slideLeft: function() {
			
			var _currentInstance = this;

			if(event) {

				event.preventDefault();
				_currentInstance.$leftButton.prop('disabled', true);
			}
			
			if(_currentInstance.currentSlide == 1) {
				
				_currentInstance.currentSlide = _currentInstance.images.length;
				_currentInstance.$leftButton.prop('disabled', false);

				if(_currentInstance.settings.withSteps) {

					_currentInstance.makeStep(_currentInstance.currentSlide);
				}

				return _currentInstance.$slider.animate({'margin-left':'-'+ _currentInstance.sliderWidth*(_currentInstance.images.length-1)}, _currentInstance.settings.slideSpeed);
				
			}
			
			return	$(_currentInstance.$slider).animate({'margin-left': '+='+_currentInstance.sliderWidth}, _currentInstance.settings.slideSpeed, function() {
					
				_currentInstance.currentSlide--;
				_currentInstance.$leftButton.prop('disabled', false);

				if(_currentInstance.settings.withSteps) {

					_currentInstance.makeStep(_currentInstance.currentSlide);
				}
			});
		},

		/**
		 * Thid method slides the slider to the right.
		 */
		slideRight: function() {
			
			var _currentInstance = this;
			
			if(event) {

				event.preventDefault();
				_currentInstance.$rightButton.prop('disabled', true);
			}	
				
			if(_currentInstance.currentSlide == _currentInstance.images.length) {
				
				_currentInstance.currentSlide = 1;
				_currentInstance.$rightButton.prop('disabled', false);

				if(_currentInstance.settings.withSteps) {

					_currentInstance.makeStep(_currentInstance.currentSlide);
				}

				return _currentInstance.$slider.animate({'margin-left': 0}, _currentInstance.settings.slideSpeed);
			}

			return $(_currentInstance.$slider).animate({'margin-left': '-='+_currentInstance.sliderWidth}, _currentInstance.settings.slideSpeed, function() {
					
				_currentInstance.currentSlide++;
				_currentInstance.$rightButton.prop('disabled', false);

				if(_currentInstance.settings.withSteps) {

					_currentInstance.makeStep(_currentInstance.currentSlide);
				}
			});
		},

		/**
		 * This method changes the steps if requested according to the current slide.	
		 */
		makeStep: function(currentSlide) {
			
			var _currentInstance = this;
			
			_currentInstance.$stepsWrapper.children('div').removeClass('active');
			_currentInstance.$stepsWrapper.children('div:nth-child(' + currentSlide + ')').addClass('active');
		},
	};


	/**
	 * We take advantage of the jQuery loop and returning an instance of as many
	 * sliders as we need on a certain HTML page.
	 * It lets you give your own settings to this specific slider you just created.	
	 */
	$.fn.Slider = function(options) {
		
		return this.each(function() {
			var slider = Object.create(Slider);
				slider.init(options, this);
		});
	};

	/**
	 * The creation of a settings object allow us to choose a global settings
	 * to all of the sliders at once
	 */
	$.fn.Slider.settings = {
		'slideTime': 2000,
		'slideSpeed': 1000,
		'images': [],
		'autoSlide': true,
		'widthButtons': false,
		'withSteps': false,
	};

})(jQuery, window, document);