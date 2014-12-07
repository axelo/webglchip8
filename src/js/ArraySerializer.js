var ArraySerializer = {

	decode8: function(str, what) {
		return new Uint8Array(ArraySerializer._decode(str));
	},

	decode16: function(str) {
		return ArraySerializer._decode(str);
	},

	_decode: function(str) {
		var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
		var bufView = new Uint16Array(buf);
		for (var i=0, strLen=str.length; i<strLen; i++) {
		  bufView[i] = str.charCodeAt(i);
		}
		return bufView;
	},

	encode: function(uint8array, what) {
		return String.fromCharCode.apply(null, new Uint16Array(uint8array));
	}
}
