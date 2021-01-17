
// Motobug engine configuration flags
var configuration = {
    classicAngles: false,   // snap sonic to 45deg, just like the classics
    mBlurDefault: true      // set to false to disable motion blur
};

// a list used for asynchronous background loading
var loadingList = [];

// ensure the value is between min and max via wrapping
function wrap(value,min,max){
	if(value < min)
		value = max-(min-value);
	if(value > max)
		value = min-(max-value);
	return value;
}

// clamp a value between min and max
function clamp(value,min,max){
	if(value < min)
		value = min;
	if(value > max)
		value = max;
	return value;
}

// Linear interpolation.
function lerp(v0, v1, t) {
	return (1 - t) * v0 + t * v1;
}