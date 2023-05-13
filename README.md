# OutSystems Urbi Maps Plugin

![Urbi.ae Logo](https://media.licdn.com/dms/image/C4E0BAQG9Wfkj1p6SwQ/company-logo_200_200/0/1645530884086?e=2147483647&v=beta&t=0I0bjh82tlenlQ48mBrO47qpdXLyBcSxyFdl7kPg1Eg) ![OutSystems Logo](https://t4spartners.com/wp-content/uploads/2021/11/Outsystems.png)

This Cordova plugin provides seamless integration with Urbi maps for iOS and Android platforms. It enables OutSystems developers to incorporate maps, navigation, search, and other advanced features typically offered by maps solutions into their Cordova applications.

## Features

- Display maps and geospatial data from Urbi maps.
- Utilize navigation functionalities for enhanced user experience.
- Enable searching for places, addresses, and points of interest.
- Access advanced mapping features such as geocoding and reverse geocoding.

## Installation

To add the Cordova Urbi Maps Plugin to your project, run the following command:

```bash
cordova plugin add https://github.com/os-adv-dev/outsystems-plugin-urbimaps.git
```

## Usage

The Cordova Urbi Maps Plugin provides a simple interface to interact with Urbi maps. The primary method `openMap` allows you to open the map view. Below is an example of how to use the plugin:

```javascript
cordova.plugins.UrbiMaps.openMap(
  function(success) {
    console.log(success);
  },
  function(error) {
    console.log(error);
  }
);
```

## API

The plugin exposes the following methods:

- `openMap(successCallback, errorCallback)`: Opens the Urbi maps view.

## Platform Support

This plugin is compatible with the following platforms:

- iOS
- Android

## Additional Resources

- [Urbi maps documentation](https://urbi.ae/docs)
- [OutSystems website](https://www.outsystems.com/)

## License

This plugin is released under the [MIT License](https://opensource.org/licenses/MIT).

---

Feel free to contribute to this project by submitting issues or pull requests. For any questions or support, please contact the project maintainers.

Happy mapping with Urbi and OutSystems!
