import React from 'react';
import {
  View,
  StatusBar,
  ViewProps,
  StatusBarStyle,
  Platform,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten';
import { ThemeKey } from '../../../../src/core/themes';
import Constants from 'expo-constants';
import { theme } from '../../../app.component'

interface ComponentProps {
  currentTheme: ThemeKey;
}

export type DynamicStatusBarProps = ThemedComponentProps & ViewProps & ComponentProps;

class DynamicStatusBarComponent extends React.Component<DynamicStatusBarProps> {
  private getStatusBarContent = (): StatusBarStyle => {
    if (this.props.currentTheme === 'Storm Trooper' || theme.backgroundColor == "white") {
      return 'dark-content';
    } else {
      return 'light-content';
    }
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;
    const androidStatusBarBgColor: string = themedStyle.container.backgroundColor;
    const barStyle: StatusBarStyle = this.getStatusBarContent();

    return (
      <View style={themedStyle.container}>
        <StatusBar
          backgroundColor={theme.backgroundColor}
          barStyle={barStyle}
        />
      </View>
    );
  }
}

export const DynamicStatusBar = withStyles(DynamicStatusBarComponent, () => ({
  container: {
    backgroundColor: "#262626",//theme.background---after apple fix status bar dark mode overiding content
    height: Platform.select({
      ios: Constants.statusBarHeight,
      android: 0,
    }),
  },
}));
