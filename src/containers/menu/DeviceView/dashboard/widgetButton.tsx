import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, TouchableHighlight, Alert, AsyncStorage, } from 'react-native';

export class WidgetButton extends Component {


    render() {
        return (
            <TouchableHighlight onPress={this.props['onClick']}>
                <View style={{ width: "100%", height: "100%", backgroundColor: this.props['widget'].background, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: this.props['widget'].color }}>
                        {this.props['widget'].buttonText}
                    </Text>
                </View>
            </TouchableHighlight >
        )
    }
}