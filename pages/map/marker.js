const IconSize = {
	default: "35px",
	focus: "55px"
}
class PoiMarker {
	constructor(id, latitude, longitude, title, icon) {
		this.id = id
		this.latitude = latitude
		this.longitude = longitude
		this.title = title
		this.iconPath = icon
		this.width = IconSize.default
		this.height = IconSize.default
		this.anchor = {
			x: 0.5,
			y: 1
		}
		this.callout = {
			content: title,
			// display: "ALWAYS",
			padding: 10,
			borderRadius: 5
		}
	}
}

module.exports = {
	IconSize,
	PoiMarker
}
