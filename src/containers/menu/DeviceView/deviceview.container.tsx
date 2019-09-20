import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, ScrollView, AsyncStorage, Text, KeyboardAvoidingView } from 'react-native';
import { TopNavigation } from '@kitten/ui';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { textStyle } from '@src/components/common'
import { Widget } from './dashboard/widget';
import { DataView } from './dashboard/dataView'
import { url, version, theme } from '../../../app.component'
var data;
export class DeviceViewContainer extends React.Component<NavigationScreenProps> {
    state: {
        device: [];
        widgetLayout;
    }
    static navigationOptions = {
        header: null,
    };

    private navigationKey: string = 'DeviceViewContainer';

    componentWillMount() {
        var { navigation } = this.props;
        this.setState({ device: navigation.getParam('user') })
        this.widgetLayoutInfo(navigation.getParam('user'))
    }

    widgetLayoutInfo = async (device) => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        if (url !== "https://8bo.org") {
            try {
                const response = await fetch(url + '/api/' + version + '/states/full', {
                    method: 'GET',
                    headers: {
                        'Authorization': user.auth,
                        'Content-Type': 'application/json',
                    },
                })
                data = await response.json()
                for (var i in data) {
                    if (data[i].devid == device['id']) {
                        this.setState({ widgetLayout: data[i].layout })
                    }
                }
            }
            catch (err) {
                return console.error(err.toString());
            }
        }
        else {
            this.setState({ widgetLayout: this.state.device['layout'] })
        }
    }

    widgetDisplay = () => {
        if (this.state.widgetLayout) {
            return (
                this.state.widgetLayout.map((widget, i) => {
                    var deviceprops = {
                        device: this.state.device,
                        widget: this.state.widgetLayout[i],
                        key: i
                    }
                    return (<View key={i} style={{ width: "100%" }} >
                        <Widget {...deviceprops} />
                    </ View>
                    )
                }
                )
            )
        }
        else
            return (
                <View ><Text style={{ color: theme.color }}>No widgets to display.....</Text></View>
            )
    }

    Controls = (control) => {
        if (control == "left") {
            return (<View>
                <TouchableOpacity style={{ opacity: 0.7 }} onPress={() => this.props.navigation.goBack(null)}>
                    <Feather name="chevron-left" size={32} color={theme.color} />
                </TouchableOpacity>
            </View>)
        }
        else if (control == "right") {
            return (<View>
                <TouchableOpacity style={{ opacity: 0.7 }} >
                    <MaterialIcons name="save" size={32} color={theme.color} />
                </TouchableOpacity>
            </View>)
        }
    }

    render() {
        var deviceprops = {
            data: this.state.device
        }
        return (<View style={{ height: "100%", backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <TopNavigation
                alignment='center'
                title={this.state.device['id'].toString()}
                leftControl={this.Controls("left")}
                titleStyle={textStyle.subtitle}
                rightControls={this.Controls("right")}
                style={{ position: "relative", backgroundColor: theme.backgroundColor }}
            ></TopNavigation>
            <ScrollView style={{ backgroundColor: theme.backgroundColor, padding: 8 }}>
                <ScrollView>
                    <ScrollView style={{ backgroundColor: "#202020", paddingBottom: 5 }}>
                        <DataView {...deviceprops} />
                    </ScrollView >
                    <KeyboardAvoidingView
                        behavior="padding">
                        {this.widgetDisplay()}
                    </KeyboardAvoidingView>
                </ScrollView >
            </ScrollView>
        </View >
        );
    }
}


