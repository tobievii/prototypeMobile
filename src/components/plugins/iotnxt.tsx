import React, { Component } from 'react';
import {AsyncStorage, View, Text, TextInput, Button, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import { url, version, theme } from '../../app.component';
import { NavigationScreenProps, FlatList, ScrollView } from 'react-navigation';
// import { List, ListItem } from 'react-native-ui-kitten';

export const name = 'Iotnxt';

interface GatewayProps {
    update: Function;
    action: (action: object) => void;
}

// tslint:disable-next-line: no-empty-interface
interface GatewayState {

}

class Iotnxt extends React.Component<GatewayProps, GatewayState, NavigationScreenProps> {

    state = {
        TextInputDisableStatus: false,
        data : '',
        addGatewayForm: {
            GatewayId: 'gateway',
            Secret: this.generateDifficult(16),
            HostAddress: 'greenqueue.prod.iotnxt.io',
            PublicKey: '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>',
        },
        loading: true,
        gatewayList: [],

    };

    presets = {
        dev: {
            HostAddress: 'greenqueue.dev.iotnxt.io',
            PublicKey: '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>qblcqOI90QOdJk9pegGE+LDfXgMveZGpDBPpyIsSl8+Zkcp5zWxYj3k6BoWoL3U2z7l3wan6U9IhtAqaeTFatdwBOx0vOK8DWr4RIp1n6nAO7jEaHgsA1+FmFZTc8hQw6OEXVi+b31b7EFwLau0UA4TCj5862akf21ZqxaXmQUyyQA9Nl4JggY+TZDFL+hj+JdIm0V/yzq6o90E57s/70WYoDT6fZ5nDfdAgom/ZwjeUGTUh8V5HYJWuTZ33rRbKa8zYQ/HzAf5FZAVhndGI+CJFvorG8p53wXn2LP7NPhX6chCa++DVbFdru3OCLYMzdBqpohoVwHZnGGX1SGVi0Q==</Modulus></RSAKeyValue>',
        },
        qa: {
            HostAddress: 'greenq.qa2.iotnxt.io',
            PublicKey: '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>w6GwwIJImw87wUxg7JUtOiolWVyDTzPsT6ANvvFW00JkKTOHVTI2gMguogO/aH9SAjHVm35N1M9RO5W9CAnqbCVoL0i3gM3K7Z5DZeI0jFx/8ho1iMtcrCfEdCBv32eN+/Yuao15NtTbQubqmMa4D4URXbuzeZvDPG4DwsVur263kk3uoSASyoqIKbVFbIulmViZFtXOTWrjgSAvCjULOPYXllZUDZTCq3Q9BuoHFCQXA+5ZAsm0PHKBKEZ/G852Fcy602PUcUpdvEJdiiQ80M3f+BhgZiJG2mDg0fySnVznQIb1tJ8ISOTqcPuzep4TYrm04p2wH8uR82bhVzNFFQ==</Modulus></RSAKeyValue>',
        },
        prod: {
            HostAddress: 'greenqueue.prod.iotnxt.io',
            PublicKey: '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>',
        },
    };

    async componentDidMount() {
        this.getGateways();
    }

    getGateways = async () => {
        try {
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const gateways = await fetch(url + '/api/v3/iotnxt/gateways', {
              method: 'GET',
              headers: {
                'Authorization': user.auth,
                'Content-Type': 'application/json',
              },
            });
            const data = await gateways.json();
            this.setState({ gatewayList: data, loading: false });
            console.log(this.state.gatewayList);

          } catch (err) {
            console.log('Error fetching data-----------', err);
          }
    }

    renderItem(data: React.ReactNode) {
        return <TouchableOpacity style={{backgroundColor: 'transparent'}}>
                    <View>
                        <Text>{data}</Text>
                    </View>
                </TouchableOpacity>;
    }





    generateDifficult(count: number) {
        const _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let str = '';
        for (let i = 0; i < count; i++) {
            const tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
            str += '' + tmp;
        }
        return str;
    }

    // tslint:disable-next-line: no-shadowed-variable
    changeInput = (name: string) => {
        return (evt: { target: { value: any; }; }) => {
            const addGatewayForm = { ...this.state.addGatewayForm };
            addGatewayForm[name] = evt.target.value;
            this.setState({ addGatewayForm });
        };
    }

    // tslint:disable-next-line: no-shadowed-variable
    choosePreset = (name: string | number) => {
        return (evt: any) => {
            const addGatewayForm = { ...this.state.addGatewayForm };
            addGatewayForm.HostAddress = this.presets[name].HostAddress;
            addGatewayForm.PublicKey = this.presets[name].PublicKey;
            this.setState({ addGatewayForm });
        };
    }

    render() {
        const { gatewayList, loading } = this.state;

            if (!loading) {
                return (
        <ScrollView style={{ backgroundColor: theme.backgroundColor2 }}>

                    {
                gatewayList.map ((item, key) =>
                <TouchableHighlight style={{ height: 50, borderColor: '#6c757d', borderBottomWidth: 1 }} key={key}>
                    <View style={{ width: '100%', marginLeft: 10, flexDirection: 'row', marginTop: -2 }} >
                      <Text
                      style={{ width: '70%', color: theme.color, marginLeft: 10, marginTop: 15 }} >{item.GatewayId}
                      </Text>
                    </View>
                </TouchableHighlight >,
                    )
                    }
        </ScrollView>

                    );
            } else { return null; }
        // return (
        //     <List  containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        //     <FlatList
        //         data={this.state.gatewayList}
        //         renderItem={({ item }) => (
        //         <ListItem
        //             // roundAvatar
        //             title={`${item.gatewayList.GatewayId}`}
        //             subtitle={item.gatewayList.HostAddress}
        //             // avatar={{ uri: item.picture.thumbnail }}
        //         containerStyle={{ borderBottomWidth: 0 }}
        //         />
        //         )}
        //         keyExtractor={item => item.email}
        //     />
        //     </List>;
        // )

        // return (
        // <View>
        //         <Text>ADD GATEWAY</Text> */}
        //          <Text>{this.state.data}</Text>
        //         <View>
        //             <TextInput
        //                 style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
        //                 placeholder='Gateway ID'
        //                 onChangeText={() => this.changeInput('GatewayId')}
        //                 value={this.state.addGatewayForm.GatewayId}
        //             />

        //             <TextInput
        //                 style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
        //                 placeholder='Secret'
        //                 onChangeText={() => this.changeInput('Secret')}
        //                 value={this.state.addGatewayForm.Secret}
        //                 editable={this.state.TextInputDisableStatus}
        //             />

        //             <TextInput
        //                 style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
        //                 placeholder='Public key'
        //             // onChangeText={(text) => this.setState({text})}
        //                 value={this.state.addGatewayForm.PublicKey}
        //                 editable={this.state.TextInputDisableStatus}
        //             />

        //             <Button title='Prod'
        //                 onPress={() => this.choosePreset('prod')}
        //             />
        //             <Button title='Dev'
        //                 onPress={() => this.choosePreset('dev')}
        //             />
        //             <Button title='QA'
        //                 onPress={() => this.choosePreset('qa')}
        //             />

        //             {/* <Button title='Add'
        //                 onPress={() => this.loadServerGateways()}
        //             /> */} */}

        //         </View>
        //     </View>
        // );
    }
}

export default Iotnxt;
