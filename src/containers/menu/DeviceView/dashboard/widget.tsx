import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Platform, Text, View, TouchableHighlight, TouchableOpacity, ScrollView, TextInput, AsyncStorage, Alert } from 'react-native';
import { FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Calendar } from './calendar';
import { WidgetButton } from './widgetButton'
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import { url, version } from '../../../../app.component'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

export class Widget extends Component {
    state: {
        showmenu;
        widgetTitle;
        widgetState;
        command;
        buttonText;
        color;
        colorPickerState;
        buttonState;
        background;
        colorPicker;
        OStextarea;
    }
    _menu = null;

    UNSAFE_componentWillMount() {
        if (Platform.OS == "android") {
            this.setState({ OStextarea: 1 })
        }
        else {
            this.setState({ OStextarea: 4 })
        }
        this.setState({ showmenu: "none", widgetTitle: this.props['widget'].type, widgetState: "white", colorPickerState: "none", buttonState: "flex" })
        if (this.props['widget'].type == "widgetButton" || this.props['widget'].type == "button") {
            if (!this.props['widget'].options) {
                this.props['widget'].options = {}
            }
            if (this.props['widget'].options) {
                if (this.props['widget'].options.command) {
                    this.setState({ command: this.props['widget'].options.command })
                }
                else if (!this.props['widget'].options.command) {
                    this.setState({ command: JSON.stringify({ "foo": true }) })
                }

                if (this.props['widget'].options.buttonText) {
                    this.setState({ buttonText: this.props['widget'].options.buttonText })
                }
                else if (!this.props['widget'].options.buttonText) {
                    this.setState({ buttonText: "SEND" })
                }

                if (this.props['widget'].options.color) {
                    this.setState({ color: this.props['widget'].options.color })
                }
                else if (!this.props['widget'].options.color) {
                    this.setState({ color: "#111111" })
                }

                if (this.props['widget'].options.background) {
                    this.setState({ background: this.props['widget'].options.background })
                }
                else if (!this.props['widget'].options.background) {
                    this.setState({ background: "#11cc88" })
                }
            }
        }
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    onClick = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        try {
            fetch(url + "/api/" + version + "/data/post", {
                method: "POST", headers: { 'Authorization': user.auth, "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ id: this.props['device'].id, data: JSON.parse(this.state.command) })
            }).then(response => response.json()).then(resp => {
                Alert.alert(
                    'Command Sent',
                    this.state.command,
                    [{ text: 'Cancel', onPress: () => console.log(''), style: 'cancel', },
                    { text: 'OK', onPress: () => console.log('') },
                    ],
                    { cancelable: false },
                );
            })
        }
        catch (err) {
            return console.error(err.toString());
        }
    }

    menuState = () => {
        if (this.state.showmenu == null || !this.state.showmenu || this.state.showmenu == "flex" || this.state.showmenu == undefined) {
            this.setState({ showmenu: "none", widgetState: "white", buttonState: "flex" })
        }
        else {
            this.setState({ showmenu: "flex", widgetState: "red", buttonState: "none" })
        }
    }

    widget = () => {
        var options = this.state
        var deviceprops =
        {
            data: this.props['device'],
            widget: options,
            onClick: this.onClick,
        }
        if (this.state.widgetTitle == "Calendar" || this.state.widgetTitle == "calendar") {
            return (<ScrollView horizontal={true} style={{ display: this.state.buttonState, height: "130%" }} >
                <Calendar {...deviceprops} />
            </ScrollView>)
        }
        else if (this.state.widgetTitle == "widgetButton" || this.state.widgetTitle == "button") {
            return (<View key={this.props['widget'].i} style={{ display: this.state.buttonState, height: "90%" }}>
                <WidgetButton {...deviceprops} />
            </View>)
        }
        else {
            return (
                <View>
                    <Text style={{ color: "white" }}>Widget has not been created yet...</Text>
                </View>
            )
        }
    }

    showCommandText = async (button) => {
        for (var widget in this.props['device'].layout) {
            if (this.props['device'].layout[widget].i == this.props['widget'].i) {
                if (button == "save") {
                    this.props['device'].layout[widget].options.command = this.state.command
                    this.props['device'].layout[widget].options.buttonText = this.state.buttonText
                    this.props['device'].layout[widget].options.color = this.state.color
                    this.props['device'].layout[widget].options.background = this.state.background
                }
                else {
                    this.props['device'].layout.splice(widget, 1)
                }
            }
        }
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        if (button == "save") {
            try {
                fetch(url + "/api/" + version + "/data/post", {
                    method: "POST", headers: { 'Authorization': user.auth, "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ key: this.props['device'].key, layout: this.props['device'].layout })
                }).then(response => response.json()).then(resp => {
                })
            }
            catch (err) {
                return console.error(err.toString());
            }
        }
        else {
            try {
                fetch(url + "/api/" + version + "/stateupdate", {
                    method: "POST", headers: { 'Authorization': user.auth, "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ query: { key: this.props['device'].key }, update: { $set: { layout: this.props['device'].layout } } })
                }).then(response => response.json()).then(resp => {
                })
            }
            catch (err) {
                return console.error(err.toString());
            }
        }
    }

    backgroundColor = () => {
        return (
            <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ alignContent: "flex-start" }}>
                    <Text style={{ color: "white", fontSize: 17 }}>BackGround:</Text></View>
                <TextInput
                    placeholder={this.state.background}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={(background) => this.setState({ background })}
                    value={this.state.background}
                    style={{ width: 219, height: "95%", backgroundColor: "black", borderColor: "#262626", borderWidth: 1, color: "white", marginTop: 0 }} >
                </TextInput>
                <TouchableHighlight style={{ backgroundColor: this.state.background, width: "10%", height: "95%", alignContent: "flex-end" }} onPress={() => { this.setState({ colorPickerState: 'flex', colorPicker: "background" }); console.log("see") }}>
                    <View style={{}} />
                </TouchableHighlight>
            </View>)
    }

    buttonTextColor = () => {
        return (
            <View style={{ flexDirection: "row", width: "auto" }}>
                <View style={{ alignContent: "flex-start" }}>
                    <Text style={{ color: "white", fontSize: 17 }}>Color:</Text></View>
                <TextInput
                    placeholder={this.state.buttonText}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={(color) => this.setState({ color })}
                    value={this.state.color}
                    style={{ width: 275, height: "95%", backgroundColor: "black", borderColor: "#262626", borderWidth: 1, color: "white" }} >
                </TextInput>
                <TouchableHighlight style={{ backgroundColor: this.state.color, width: "10%", height: "95%", alignContent: "flex-end" }} onPress={() => { this.setState({ colorPickerState: 'flex', colorPicker: "color" }) }}>
                    <View style={{}} />
                </TouchableHighlight>
            </View>)
    }

    buttonText = () => {
        return (
            <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ alignContent: "flex-start" }}>
                    <Text style={{ color: "white", fontSize: 17 }}>ButtonText:</Text>
                </View>
                <TextInput
                    placeholder={this.state.buttonText}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={(buttonText) => this.setState({ buttonText })}
                    value={this.state.buttonText}
                    style={{ width: 231, height: "95%", backgroundColor: "black", borderColor: "#262626", borderWidth: 1, color: "white" }} />
            </View>)
    }

    buttons() {
        return (
            <View style={{ flexDirection: "row", width: "100%", marginTop: 5 }}>
                <View >
                    <TouchableOpacity onPress={() => this.showCommandText("save")} >
                        <Text style={{ backgroundColor: "black", borderColor: "#262626", borderWidth: 1, color: "white", fontSize: 15, }} >
                            <MaterialIcons name="save" size={14} color="white" />
                            SAVE
                            </Text>
                    </TouchableOpacity>
                </View>
                <View >
                    <TouchableOpacity onPress={() => this.showCommandText("remove")} >
                        <Text style={{ backgroundColor: "black", color: "white", fontSize: 15, marginLeft: 10, borderColor: "#262626", borderWidth: 1 }} >
                            <MaterialIcons name="delete" size={14} color="white" />
                            REMOVE
                            </Text>
                    </TouchableOpacity>
                </View>
            </View>)
    }

    textinput = () => {
        if (this.state.widgetTitle == "widgetButton" || this.state.widgetTitle == "button") {
            return (
                <View style={{ backgroundColor: "rgba(0,0,0,0.)" }}>
                    {this.buttons()}
                    {this.backgroundColor()}
                    {this.buttonTextColor()}
                    {this.buttonText()}
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={{ alignContent: "flex-start" }}><Text style={{ color: "white", fontSize: 15 }}>Command:</Text></View>
                    </View>
                    <TextInput
                        placeholder={this.state.command}
                        multiline={true}
                        numberOfLines={1}
                        onChangeText={(command) => this.setState({ command })}
                        value={this.state.command}
                        style={{ width: 325, height: "50%", backgroundColor: "black", borderColor: "#262626", borderWidth: 1, color: "white" }} />
                </View>
            )
        }
        else return null
    }

    openMenu = () => {
        if (this.state.showmenu !== "none" && this.state.colorPickerState == "none") {
            return (
                <View style={{ backgroundColor: "#262626", width: 280, height: "58%" }}>
                    {/* <Picker style={{ backgroundColor: "black", height: "40%", borderWidth: 5, borderColor: "#262626" }} mode="dialog"
                    onValueChange={(itemValue) =>
                        this.setState({ widgetTitle: itemValue })}>
                    <Picker.Item color="grey" label="Calendar" value="Calendar" />
                    <Picker.Item color="grey" label="NivoLine" value="NivoLine" />
                    <Picker.Item color="grey" label="ChartLine" value="ChartLine" />
                    <Picker.Item color="grey" label="Zoomable" value="Zoomable" />
                    <Picker.Item color="grey" label="Blank" value="Blank" />
                    <Picker.Item color="grey" label="ThreeDWidget" value="ThreeDWidget" />
                    <Picker.Item color="grey" label="Gauge" value="Gauge" />
                    <Picker.Item color="grey" label="mesh" value="mesh" />
                    <Picker.Item color="grey" label="map" value="map" />
                    <Picker.Item color="grey" label="form" value="form" />
                    <Picker.Item color="grey" label="schedular" value="schedular" />
                    <Picker.Item color="grey" label="widgetButton" value="widgetButton" />
                    <Picker.Item color="grey" label="chart" value="chart" />
                </Picker> */}
                    <Menu
                        ref={this.setMenuRef}
                        button={
                            <Text onPress={this.showMenu} style={{ backgroundColor: "black", color: "white", width: "40%", height: "auto", fontSize: 17, marginTop: 5 }}>
                                {this.state.widgetTitle}<AntDesign name="caretdown" size={15} color="white" /> </Text>}>
                        <MenuItem onPress={() => { this.hideMenu(), this.setState({ widgetTitle: "Calendar" }), this.menuState() }}>Calendar</MenuItem>
                        <MenuItem onPress={() => { this.hideMenu(), this.setState({ widgetTitle: "widgetButton" }), this.menuState() }}>WidgetButton</MenuItem>
                        <MenuItem onPress={this.hideMenu} disabled>Blank</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={this.hideMenu}>Coming soon...</MenuItem>
                    </Menu>
                    {this.textinput()}
                </View>
            )
        }
        else {
            return (
                null
            )
        }
    }

    setColor = (color) => {
        if (this.state.colorPicker == "color") {
            this.setState({ color: color })
        }
        else if (this.state.colorPicker == "background") {
            this.setState({ background: color })
        }
    }

    colorPicker = () => {
        if (this.state.widgetTitle == "widgetButton" || this.state.widgetTitle == "button") {
            return (<View style={{ display: this.state.colorPickerState, height: "80%" }}>
                <TouchableHighlight onPress={() => { this.setState({ colorPickerState: "none" }) }}>
                    <FontAwesome name="close" size={25} color={this.state.widgetState} />
                </TouchableHighlight>
                <ColorPicker
                    onColorChange={color => { this.setColor(fromHsv(color)) }}
                    style={{ flex: 1, display: this.state.colorPickerState, width: "95%" }} />
            </View>)
        }
        else null
    }

    render() {
        return (
            <View style={{ backgroundColor: "#262626", width: "100%", height: 280 }}>
                <View style={{ backgroundColor: "black", width: "100%", height: 30, flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                        <Text style={{ color: "white", fontSize: 25, marginLeft: 10 }}>{this.state.widgetTitle}</Text></View>
                    <View style={{ width: "50%", alignItems: "flex-end" }}>
                        <TouchableHighlight onPress={() => this.menuState()}>
                            <Text style={{ backgroundColor: "black", marginRight: 20, height: "100%" }}>
                                <FontAwesome name="wrench" size={25} color={this.state.widgetState} />
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                {this.openMenu()}
                {this.widget()}
                {this.colorPicker()}
            </View >
        )
    }
}