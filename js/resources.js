let Resources = function(settings) {

	if (!settings)
		settings = {};

	function loadResources(list, cb) {
		if (list.length) {
			let
				entry = list.pop();

			if (Resources._RESOURCES[entry.id])
				loadResources(list, cb);
			else {

				switch (entry.type) {
					case "image":{
						let
							image = document.createElement("img");

						image.style.display = "none";
						image.src = (settings.prefix || "")+ entry.url;
						image.onload = ()=>{
							Resources._RESOURCES[entry.id] = {
								width: image.width,
								height: image.height,
								image: image
							};
							document.body.removeChild(image);
							loadResources(list, cb);
						}
						document.body.appendChild(image);
						break;
					}
				}

			}
		} else {
			Resources.loadState = 2;
			cb();
		}
	}

	return {
		get:(id)=>{
			return Resources.loadState == 2 ? Resources._RESOURCES[id] : 0;
		},
		load:(cb)=>{
			if (Resources.loadState == 2)
				cb();
			else if (!Resources.loadState) {
				let
					toLoad = [];
				Resources.loadState = 1;
				Resources._RESOURCES = [];
				PASSAGES.forEach(passage=>{
					if (passage.resources)
						passage.resources.forEach(resource=>{
							toLoad.push(resource);
						})
				})
				loadResources(toLoad,cb);
			}
		}
	}
}
