import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, ScrollView, AsyncStorage, Text, KeyboardAvoidingView } from 'react-native';
import { TopNavigation } from '@kitten/ui';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { textStyle } from '@src/components/common';
import { Widget } from './dashboard/widget';
import { DataView } from './dashboard/dataView';
import { url, theme } from '../../../app.component';
let data: { [x: string]: { layout: any; }; };
export class DeviceViewContainer extends React.Component<NavigationScreenProps> {
    state: {
        device: [];
        widgetLayout: { [x: string]: any; map: (arg0: (widget: any, i: any) => JSX.Element) => void; };
    };
    static navigationOptions = {
        header: null,
    };

    private navigationKey: string = 'DeviceViewContainer';

    componentWillMount() {
        const { navigation } = this.props;
        this.setState({ device: navigation.getParam('user') });
        this.widgetLayoutInfo(navigation.getParam('user'));
    }

    widgetLayoutInfo = async (device: { id: any; }) => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        try {
            const response = await fetch(url + '/api/v3/states/full', {
                method: 'GET',
                headers: {
                    'Authorization': user.auth,
                    'Content-Type': 'application/json',
                },
            });
            data = await response.json();
            for (const i in data) {
                if (data[i].devid === device.id) {
                    this.setState({ widgetLayout: data[i].layout });
                }
            }
        } catch (err) {
            return console.error(err.toString());
        }
    }

    widgetDisplay = () => {
        if (this.state.widgetLayout) {
            return (
                this.state.widgetLayout.map((widget, i) => {
                    const deviceprops = {
                        device: this.state.device,
                        widget: this.state.widgetLayout[i],
                        key: i,
                    };
                    return (<View key={i} style={{
                        paddingTop: 10,
                        shadowColor: 'black', shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.32, shadowRadius: 5.46, elevation: 9,
                    }} >
                        <Widget {...deviceprops} />
                    </ View>
                    );
                },
                )
            );
        } else {
            return (
                <View ><Text style={{ color: 'white' }}>No widgets to display.....</Text></View>
            );
        }
    }

    Controls = (control: string) => {
        if (control === 'left') {
            return (<View>
                <TouchableOpacity style={{ opacity: 0.7 }} onPress={() => this.props.navigation.goBack(null)}>
                    <Feather name='chevron-left' size={32} color='white' />
                </TouchableOpacity>
            </View>);
        } else if (control === 'right') {
            return (<View>
                <TouchableOpacity style={{ opacity: 0.7 }} >
                    <MaterialIcons name='save' size={32} color='white' />
                </TouchableOpacity>
            </View>);
        }
    }

    render() {
        const deviceprops = {
            data: this.state.device,
        };
        return (<View style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 60 }}>
            <TopNavigation
                alignment='center'
                title={this.state.device.id.toString()}
                leftControl={this.Controls('left')}
                titleStyle={{ color: theme.color }}
                rightControls={this.Controls('right')}
                style={{ position: 'relative', backgroundColor: theme.backgroundColor }}
            ></TopNavigation>
            <ScrollView style={{ backgroundColor: theme.backgroundColor, padding: 8 }}>
                <ScrollView>
                    <ScrollView style={{ backgroundColor: '#202020', paddingBottom: 5 }}>
                        <DataView {...deviceprops} />
                    </ScrollView >
                    <KeyboardAvoidingView
                        behavior='padding'>
                        {this.widgetDisplay()}
                    </KeyboardAvoidingView>
                </ScrollView >
            </ScrollView>
        </View >
        );
    }
}
