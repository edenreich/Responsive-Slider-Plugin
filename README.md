# Responsive Slider Plugin
This plugin allow you to create a responsive plugin on your website, you may pass it array of Images Paths and it will display them on that slider. You can also create multiple sliders on the same page. Enjoy :)


##How To Use
first you need to choose an element on the DOM. For instance if you have an element with class called 'slider',
you will call it like so:
```javascript
$('.slider').Slider({

});
```


##Available Options
you can pass an options as json object to the $('.slider').Slider(); plugin.
example:
```javascript
$('.slider').Slider({
  'available_settings': 'my_settings'
});
```


if you choose to set the settings globally to all sliders that are on the DOM just use the child object called Settings like so:
```javascript
$('.slider').Slider.settings = {
		'slideTime': 2000,
		'slideSpeed': 1000,
		'images': [],
		'autoSlide': true,
		'widthButtons': false,
		'withSteps': false,
	};
```
