import { AppRegistry , YellowBox } from 'react-native'
import Navigator from './src/Navigator'
import { name as appName } from './app.json'

YellowBox.ignoreWarnings([
    'componentWillMount is deprecated', // Swipeable
    'componentWillUpdate is deprecated', // DrawerLayout
    'componentWillReceiveProps is deprecated ', // ActionButton
    'Async Storage has been extracted', // Async Storage
])

AppRegistry.registerComponent(appName, () => Navigator)
