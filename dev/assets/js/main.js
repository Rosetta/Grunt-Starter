function Validator()
{
	'use strict';
}

Validator.prototype.checkName = function(name)
{
	'use strict';
	return (/[^a-z]/i.test(name) === false);
};

window.addEventListener('load', function(){
	'use strict';

	// Complicated script goes here ete
});


$("#owl-demo").owlCarousel({
 
  autoPlay: 3000,
  items : 4,
  itemsDesktop : [1199,3],
  itemsDesktopSmall : [979,3]

});
