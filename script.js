'use strict';

var DisplayControlComponent = function( options ) {
	var displayValue;
  
  this._options = options;
  this.container = options.container;
  this.element = this.container.querySelector( options.triggerSelector );
  this.toggleBlockElement = this.container.querySelector( options.blockSelector );
	this.originalDisplayValue = getComputedStyle( this.toggleBlockElement ).display;
  
  displayValue = this.toggleBlockElement.style.display || this.originalDisplayValue;
  this.displayValue = displayValue === 'none' ? 'block' : displayValue;
  this.hidden = displayValue === 'none';
  
  this._toggle = this.toggle.bind( this );
  this.element.addEventListener( 'click', this._toggle );
}

DisplayControlComponent.prototype = {
  constructor: DisplayControlComponent,
  show: function() {
  	this.hidden = false;
    this.toggleBlockElement.style.display = this.originalDisplayValue !== 'none' ? '' : this.displayValue;
  },
  hide: function() {
	  this.hidden = true;
    this.toggleBlockElement.style.display = 'none';
  },
  toggle: function() {
    if ( !this.hidden ) {
    	return this.hide();
    }
    this.show();
  },
  remove: function() {
    this.element.removeEventListener( 'click', this._toggle );
  }
}

var AnimatedDisplayControlComponent = function( options ) {
	DisplayControlComponent.call( this, options );
}

AnimatedDisplayControlComponent.prototype = Object.create( DisplayControlComponent.prototype );

AnimatedDisplayControlComponent.prototype.show = function() {
	var iterationsCount = Math.ceil( this._options.speed / this._options.iterationSpeed ),
  	opacityInterval = +( 1 / iterationsCount ).toFixed( 4 ),
    opacity = 0,
  	interval;
    
	if ( this.working ) {
  	return;
  }
	this.working = true;
  this.toggleBlockElement.style.opacity = 0;
	
 	interval = setInterval(function() {
  	if ( iterationsCount-- === 0 ) {
    	this.working = false;
      this.hidden = false;
    	return clearInterval( interval );
    }
    opacity += opacityInterval;
    console.log( opacity );
    this.toggleBlockElement.style.opacity = opacity.toFixed( 4 );
  }.bind( this ), this._options.iterationSpeed ); 
}

AnimatedDisplayControlComponent.prototype.hide = function() {
	var iterationsCount = Math.ceil( this._options.speed / this._options.iterationSpeed ),
  	opacityInterval = +( 1 / iterationsCount ).toFixed( 4 ),
    opacity = 1,
  	interval;
	if ( this.working ) {
  	return;
  }
	this.working = true;
  this.toggleBlockElement.style.opacity = 1;
	
 	interval = setInterval(function() {
  	if ( iterationsCount-- === 0 ) {
    	this.working = false;
      this.hidden = true;
    	return clearInterval( interval );
    }
    opacity -= opacityInterval;
    this.toggleBlockElement.style.opacity = opacity.toFixed( 4 );
  }.bind( this ), this._options.iterationSpeed ); 
}
AnimatedDisplayControlComponent.prototype.constructor = AnimatedDisplayControlComponent;

var testDisplay = new AnimatedDisplayControlComponent({
	container: test,
  triggerSelector: '.summary__title',
  blockSelector: '.summary__details',
  speed: 1000,
  iterationSpeed: 100
});


