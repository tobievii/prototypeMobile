import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native'
import { Themes } from './favorites.component';
import {
  ThemeContextType,
  ThemeContext,
  ThemeKey,
  themes,
} from '@src/core/themes';
import { Theme } from './type';
import SwitchToggle from 'react-native-switch-toggle';
export var Themestate = {
  backgroundColor: "#262626",
  backgroundColor2: "#202020",
  color: "white",
  value: false
}
export class FavoritesContainer extends React.Component {
  state = {
    switchOn3: false,
    backgrounColor: ""
  };
  componentWillMount() {
    this.getTheme()
  }

  getTheme = async () => {
    var theme = await AsyncStorage.getItem('Theme')
    theme = JSON.parse(theme)
    if (theme == null) {
      this.setState({ switchOn3: false })
      this.setState({ backgrounColor: "#262626" })
    }
    else {
      this.setState({ switchOn3: theme['value'] })
      this.setState({ backgrounColor: theme['backgroundColor'] })
    }
    Themestate = theme
  }

  removeTheme = async () => {
    await AsyncStorage.removeItem('Theme')
  }

  private EXCLUDE_THEMES: ThemeKey[] = [
    'App Theme',
  ];

  private data: Theme[] = [];

  constructor(props) {
    super(props);
    this.data = Object.keys(themes)
      .filter(this.shouldIncludeTheme)
      .map(this.toThemeObject);
  }

  private shouldIncludeTheme = (themeKey: ThemeKey): boolean => {
    return !this.EXCLUDE_THEMES.includes(themeKey);
  };

  private toThemeObject = (theme: ThemeKey): Theme => {
    return { name: theme, theme: themes[theme] };
  };

  private renderContent = (context: ThemeContextType): React.ReactElement<any> => {
    return (
      <Themes
        data={this.data}
        currentTheme={context.currentTheme}
        onToggleTheme={context.toggleTheme}
      />
    );
  };

  onPress3 = () => {
    this.removeTheme()
    this.setState({ switchOn3: !this.state.switchOn3 })
    if (this.state.switchOn3 == true) {
      var dark = {
        backgroundColor: "#262626",
        backgroundColor2: "#202020",
        color: "white",
        value: false
      }
      Themestate = dark
      this.setState({ backgrounColor: dark.backgroundColor })
      AsyncStorage.setItem('Theme', JSON.stringify(dark))
    }
    else {
      var light = {
        backgroundColor: "white",
        backgroundColor2: "white",
        color: "black",
        value: true
      }
      Themestate = light
      this.setState({ backgrounColor: light.backgroundColor })
      AsyncStorage.setItem('Theme', JSON.stringify(light))
    }
  }

  public render(): React.ReactNode {
    return (
      <View style={{
        flexDirection: "row",
        backgroundColor: this.state.backgrounColor, width: "100%", height: "100%"
      }}>
        <Text style={{ color: "black" }}>Dark Mode</Text>
        <SwitchToggle
          containerStyle={{
            marginTop: 16,
            width: 140,
            height: 65,
            borderRadius: 30,
            padding: 5,
          }}
          backgroundColorOn='grey'
          backgroundColorOff='grey'
          circleStyle={{
            width: 55,
            height: 55,
            borderRadius: 27.5,
            backgroundColor: "rgb(102,134,205)",
          }}
          switchOn={this.state.switchOn3}
          onPress={() => { this.onPress3() }}
          circleColorOff='#262626'
          circleColorOn='white'
          duration={500}
        />
        <Text style={{ color: "white" }}>Light Mode</Text>
      </View>
    );
  }
}
