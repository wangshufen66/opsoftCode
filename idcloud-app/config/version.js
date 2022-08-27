import {
	getCurrentAppStage
} from '@/config/stage.js'
import manifest from 'manifest.json'

let version = {
	prod: {
		version: "2.2.3_210123",
		version_number: 223002
	},
	dev: {
		version: "2.2.3_210122.alpha",
		version_number: 223001
	}
}

export const getCurrentVersion = () => {
	try {
		const versionName = JSON.parse(manifest).versionName
		const versionCode = JSON.parse(manifest).versionCode
		version.prod = {
			version: versionName,
			version_number: versionCode
		}
		version.dev = {
			version: `${versionName}-alpha`,
			version_number: versionCode + 1
		}
	} catch (e) {}


	return {
		prod: {
			version: getCurrentAppStage() === 'dev' ? version.dev.version : version.prod.version,
			version_number: getCurrentAppStage() === 'dev' ? version.dev.version_number : version.prod.version_number,
		},
		dev: {
			version: version.dev.version,
			version_number: version.dev.version_number
		}
	}
}
