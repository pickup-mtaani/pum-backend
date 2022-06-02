// // import React, { Component } from "react";
// // import Geolocation from '@react-native-community/geolocation';
// // import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// // import messaging from '@react-native-firebase/messaging';
// // import Icon from "react-native-vector-icons/FontAwesome";
// // import DeviceInfo from 'react-native-device-info';
// // import { Fab } from 'native-base';
// // import { Button, Input, CheckBox } from "react-native-elements";
// // import AsyncStorage from "@react-native-community/async-storage";
// // import PropTypes from "prop-types";
// // import { connect } from "react-redux";
// // import ImagePicker1 from 'react-native-image-crop-picker';
// // import { validateEmail } from './../../common/validateEmail';
// // import ImagePicker from 'react-native-image-picker';
// // import Spinner from "react-native-loading-spinner-overlay";
// // import axios from './../../../providers/axiosProvider';
// // import { createSalon, getSalons } from './../../../axios/actions/salonAction';
// // import { setCurrentUser } from './../../../axios/actions/authentication';
// // import { getAllstyles } from './../../../axios/actions/styleAction';
// // import { getamenities } from './../../../axios/actions/amenityAction';
// // import { RevokeTopic, addTopic, senttoTopic } from './../../../axios/actions/notificationAction';
// // import { withNavigation } from 'react-navigation';
// import {
//     //alert,
//     DatePickerAndroid,
//     Dimensions,
//     Keyboard,
//     KeyboardAvoidingView,
//     NetInfo,
//     ScrollView,
//     Image,
//     StatusBar,
//     StyleSheet,
//     Text,
//     ToastAndroid,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View
// } from "react-native";

// import { Item, Picker, ListItem, Body, Left, Right, Thumbnail, List, Label } from "native-base";

// import Geocoder from "react-native-geocoding";
// Geocoder.init("AIzaSyCjx6d_WJSAWfVgHFA6f3zBEVpDmK3okcw");



// class Create extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             photopth: false,
//             creenWidth: '',
//             screenHeight: '',
//             hairstyles: [],
//             stylesAvailable: [],
//             phone_number: '',
//             checked: false,
//             price: '',
//             styles: [],
//             amenities: [],
//             amenitiesOffered: [],
//             Email: '',
//             checked: false,
//             latitude: undefined,
//             longitude: undefined,
//             salon_name: '',
//             logo: '',
//             errors: {},
//             created_by: '',
//             hidden: true,
//             user_id: '',
//             loading: false,
//             region: {
//                 latitude: -1.2921,
//                 longitude: 36.8219,
//                 latitudeDelta: 0.1,
//                 longitudeDelta: 0.1
//             },
//             amenityList: [],

//             fcmToken: '',


//             step1: true,
//             step2: false,
//             step3: false,
//             step4: false,
//             last: false,
//             first: true,

//             town: '',




//         }

//         this.map = React.createRef();
//     }

//     step1 = () => {
//         return this.setState({
//             step1: true,
//             step2: false,
//             step3: false,
//             step4: false,
//             last: false,
//             first: true,
//         })
//     }

//     step2 = () => {
//         return this.setState({
//             step1: false,
//             step2: true,
//             step3: false,
//             last: false,
//             first: false,
//             step4: false,
//         })
//     }
//     step3 = () => {
//         return this.setState({
//             step1: false,
//             step2: false,
//             step3: true,
//             last: false,
//             first: false,
//             step4: false,
//         })
//     }
//     step4 = () => {
//         return this.setState({
//             step1: false,
//             step2: false,
//             step3: false,
//             last: true,
//             first: false,
//             step4: true,
//         })
//     }
//     prev1 = () => {
//         return this.setState({
//             step1: true,
//             step2: false,
//             step3: false,
//             last: false,
//             first: true,
//             step4: false,
//         })
//     }
//     prev2 = () => {
//         return this.setState({
//             step1: false,
//             step2: true,
//             step3: false,
//             last: false,
//             first: false,
//             step4: false,
//         })
//     }
//     getRevGeo = async () => {

//         this.setState({ loading: true })

//         const getL = await Geocoder.from(`${this.state.town}`)

//         var location = getL.results[0].geometry.location;

//         console.log(location);

//         let region = {
//             latitude: parseFloat(location.lat),
//             longitude: parseFloat(location.lng),
//             latitudeDelta: 0.11,
//             longitudeDelta: 0.11
//         };

//         this.setState({
//             latitude: parseFloat(location.lat),
//             longitude: parseFloat(location.lng),
//             region,
//             error: null,
//             loading: false
//         });

//         this.map.animateToRegion(region, 3000);

//     }

//     getLocation = async () => {
//         Geolocation.getCurrentPosition(
//             (position) => {

//                 this.setState({

//                     region: {
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude,
//                         latitudeDelta: 0.11,
//                         longitudeDelta: 0.11
//                     },
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude,

//                     error: null,
//                 });
//             },
//             (error) => this.setState({ error: error.message }),
//             { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
//         );
//     }
//     LaunchlogoPicker = () => {

//         const options = {
//             title: 'Select Image',
//             storageOptions: {
//                 skipBackup: true,
//                 path: 'images',
//             },
//         };

//         ImagePicker.showImagePicker(options, (response) => {
//             //console.log('Response = ', response);

//             if (response.didCancel) {
//                 //console.log('User cancelled image picker');
//             } else if (response.error) {
//                 //console.log('ImagePicker Error: ', response.error);
//             } else if (response.customButton) {
//                 //console.log('User tapped custom button: ', response.customButton);
//             } else {
//                 const source = { uri: response.uri };

//                 this.setState({
//                     logo: source
//                 })


//             }
//         });
//     }

//     validateEmail = (email) => {
//         var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         return re.test(email);
//     };



//     onRegister = async () => {
//         const { stylesAvailable, amenitiesOffered, latitude, longitude, logo } = this.state

//         const fcmToken = await AsyncStorage.getItem("fcm-token");

//         try {

//             this.setState({
//                 loading: true
//             })
//             if (logo === '') {
//                 this.setState({
//                     loading: false
//                 })
//                 return ToastAndroid.showWithGravityAndOffset(
//                     'Salon Logo is required',
//                     ToastAndroid.LONG,
//                     ToastAndroid.BOTTOM,
//                     25,
//                     50,
//                 );
//             }

//             if (latitude === undefined) {
//                 this.setState({
//                     loading: false
//                 })
//                 return ToastAndroid.showWithGravityAndOffset(
//                     'Kindly select location ',
//                     ToastAndroid.LONG,
//                     ToastAndroid.BOTTOM,
//                     25,
//                     50,
//                 );
//             }

//             if (!validateEmail(this.state.Email)) {
//                 this.setState({
//                     loading: false
//                 })
//                 return ToastAndroid.showWithGravityAndOffset(
//                     'Please enter valid salon email address',
//                     ToastAndroid.LONG,
//                     ToastAndroid.BOTTOM,
//                     25,
//                     50,
//                 );

//             }


//             let salon = {
//                 salon_name: this.state.salon_name,
//                 salon_description: this.state.salon_description,
//                 phone_number: this.state.phone_number,
//                 // styles: this.state.stylesAvailable,
//                 // amenities: this.state.amenitiesOffered,
//                 user_id: this.state.user_id,
//                 latitude: this.state.latitude,
//                 longitude: this.state.longitude,
//                 Email: this.state.Email,
//                 logo: this.state.logo,

//             }


//             if (stylesAvailable.length > 0) {

//                 salon.styles = stylesAvailable;

//             }

//             if (amenitiesOffered.length > 0) {

//                 salon.amenities = amenitiesOffered;

//             }


//             const result = await this.props.createSalon(salon);


//             const rol = await axios.post(`/user/${this.state.user_id}/role/Admin`);

//             await this.props.getSalons();

//             const Rdata = {
//                 fcm_token: this.props.user.user.fcm_token,
//                 topic: 'client'
//             }

//             const Adata = {
//                 fcm_token: this.props.user.user.fcm_token,
//                 topic: 'admin'
//             }

//             const notification = {
//                 // fcm_token: fcmToken,
//                 title: 'Hey !!! Your Best Hair Affair',
//                 topic: 'client',
//                 sound: 'default',
//                 body: `You are never fully dressed without great hair! ${this.state.salon_name} is the your new destination Visit us for `
//             }


//             const revokeTopic = await axios.post(`/fcm/revoke-topic`, Rdata)

//             const assignTopic = await axios.post(`/fcm/assign-topic`, Adata)

//             // const setSalonTopic  =  await messaging().subscribeToTopic('admin').then(() => console.log('Subscribed to topic!'));

//             // const dispatchNotification = await this.props.senttoTopic(notification)





//             await this.props.setCurrentUser(`${this.state.user_id}`);
//             this.props.navigation.navigate('Dashboard');
//             this.setState({
//                 loading: false
//             })


//         } catch (error) {
//             const errObj = error.response.data;
//             // alert(JSON.stringify(error))


//             this.setState({
//                 loading: false
//             })
//             ToastAndroid.showWithGravityAndOffset(
//                 Object.values(errObj)[0],
//                 ToastAndroid.LONG,
//                 ToastAndroid.BOTTOM,
//                 25,
//                 50,
//             );
//         }

//     }


//     getScreenSize = () => {
//         const screenWidth = Math.round(Dimensions.get('window').width);
//         const screenHeight = Math.round(Dimensions.get('window').height);
//         this.setState({ screenWidth: screenWidth, screenHeight: screenHeight })
//     }

//     handleTodoItemToggled = style => {

//         this.setState(prevState => {

//             return {
//                 styles: prevState.styles.map(item => (
//                     item.id === style.id

//                         ? { ...item, selected: !item.selected }
//                         : item
//                 ))
//             }
//         })

//     }

//     handleAmenityToggled = amenity => {

//         this.setState(prevState => {

//             return {
//                 amenityList: prevState.amenityList.map(item => (
//                     item.id === amenity.id

//                         ? { ...item, selected: !item.selected }
//                         : item
//                 ))
//             }
//         })

//     }
//     addstyles = async (style) => {

//         const { stylesAvailable } = this.state;

//         const styleExist = stylesAvailable.find((stl) => stl.id === style.id);

//         if (styleExist) {

//             this.handleTodoItemToggled(style)
//             const data = stylesAvailable.filter((stl) => stl.id !== style.id);

//             return this.setState({

//                 stylesAvailable: data


//             });

//         }
//         this.handleTodoItemToggled(style)
//         const obj = { id: style.id, name: style.name, selected: true };


//         return this.setState({
//             stylesAvailable: [...stylesAvailable, obj]
//         });




//     }

//     addamenities = async (amenity) => {

//         const { amenitiesOffered } = this.state;


//         const amenityExist = amenitiesOffered.find((stl) => stl.id === amenity.id);

//         if (amenityExist) {

//             const data = amenitiesOffered.filter((stl) => stl.id !== amenity.id);
//             this.handleAmenityToggled(amenity)
//             return this.setState({

//                 amenitiesOffered: data


//             });

//         }
//         this.handleAmenityToggled(amenity)
//         const obj = { id: amenity.id };


//         return this.setState({
//             amenitiesOffered: [...amenitiesOffered, obj]
//         });




//     }

//     onpageEnd = async () => {

//         try {

//             var arr = this.state.hairstyles
//             //   //alert(JSON.stringify(arr[arr.length - 1]));
//             const lastid = arr[arr.length - 1]._id

//             console.log(lastid)
//             const response = await axios.get(`/hairstyle/page/5e96b66adf2eac658652e0b4/all`)
//             const data = response.data.styles;
//             // //alert(JSON.stringify(data))
//             var newlist = this.state.styles.concat(data);
//             return this.setState({
//                 hairstyles: newlist,
//                 // loading: false

//             });
//         } catch (error) {
//             //alert(JSON.stringify(error.response.data))
//             return error;
//         }



//     }


//     bottomTabNav = () => {
//         const { step1, step2, step3, step4, first, last } = this.state
//         return (

//             <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
//                 {step1 && first ? <Button style={[Newstyles.stepButton, { marginRight: 0 }]} onPress={() => this.step2()}
//                     type="clear"
//                     title='' /> : <></>}
//                 {step1 && first ?
//                     <Button title="Next" type="clear" containerStyle={Newstyles.buttonContainerStyle} buttonStyle={Newstyles.buttonStyle} titleStyle={Newstyles.buttonTitleStyle} onPress={() => this.step2()} />
//                     : <></>}



//                 {step2 ?
//                     <Button title="Prev" type="clear" containerStyle={Newstyles.buttonContainerStyle} buttonStyle={Newstyles.buttonStyle} titleStyle={Newstyles.buttonTitleStyle} onPress={() => this.step1()} />
//                     : <></>}
//                 {step2 ?
//                     <Button title="Next" type="clear" containerStyle={Newstyles.buttonContainerStyle} buttonStyle={Newstyles.buttonStyle} titleStyle={Newstyles.buttonTitleStyle} onPress={() => this.step3()} />

//                     : <></>}

//                 {step3 ?
//                     <Button title="Prev" type="clear" containerStyle={Newstyles.buttonContainerStyle} buttonStyle={Newstyles.buttonStyle} titleStyle={Newstyles.buttonTitleStyle} onPress={() => this.step2()} />

//                     : <></>}
//                 {step3 ?
//                     <Button title="Next" type="clear" containerStyle={Newstyles.buttonContainerStyle} buttonStyle={Newstyles.buttonStyle} titleStyle={Newstyles.buttonTitleStyle} onPress={() => this.step4()} />

//                     : <></>}

//                 {step4 ?
//                     <Button title="Prev" type="clear" containerStyle={Newstyles.buttonContainerStyle} buttonStyle={Newstyles.buttonStyle} titleStyle={Newstyles.buttonTitleStyle} onPress={() => this.step3()} />

//                     : <></>}
//                 {step4 ?
//                     <Button title="Finish" type="clear" containerStyle={Newstyles.buttonContainerStyle} buttonStyle={Newstyles.buttonStyle} titleStyle={Newstyles.buttonTitleStyle} onPress={() => this.onRegister()} />

//                     : <></>}

//             </View>

//         )

//     }

//     fetchmoreStyles = async () => {
//         try {
//             var arr = this.state.styles

//             const lastid = arr[arr.length - 1]._id


//             const response = await axios.get(`/hairstyle/page/${lastid}`)
//             const data = response.data.styles;

//             return this.setState({
//                 styles: data

//             });
//         } catch (error) {
//             //alert(error)
//             return error;
//         }



//     }

//     log = (eventName, e) => {
//         // console.log(eventName, e.nativeEvent);
//     }


//     crop = (uri) => {
//         ImagePicker1.openCropper({
//             path: `${this.state.logo.uri}`,
//             width: 400,
//             height: 400
//         }).then(image => {
//             this.setState({
//                 logo: { uri: image.path }
//             });
//             // alert(JSON.stringify(image));
//             return;
//         });
//     }

//     onDragEnd = (eventName, e) => {

//         this.setState({
//             latitude: e.nativeEvent.coordinate.latitude,
//             longitude: e.nativeEvent.coordinate.longitude
//         })

//     };


//     componentDidMount = async () => {

//         await this.getScreenSize()
//         await this.props.getAllstyles();
//         await this.props.getamenities();
//         await this.getLocation();

//         this.setState({

//             amenities: this.props.allamenities.amenities.amenities,

//             hairstyles: this.props.allStyles.allStyles,

//             fcmToken: this.props.user.user.fcm_token

//         })
//         await this.styling();
//         await this.Ameniytstyling()
//         const userid = await AsyncStorage.getItem("id");
//         const dev = await DeviceInfo.isHeadphonesConnected()
//         if (dev) {
//             alert('kindly switch on your ')
//         }
//         this.setState({
//             user_id: this.props.user.user._id
//         })


//     }

//     styling = async () => {
//         const { styles, hairstyles } = this.state
//         // const hairstyles
//         const tl = hairstyles.map((style, i) => {


//             styles.push(
//                 {
//                     uri: `${style.images[0]}`,

//                     name: style.style_name,
//                     id: style._id,
//                     slug: style.slug,
//                     desc: style.style_description,
//                     selected: false
//                 })


//             return style.images[0];

//         })
//     }

//     Ameniytstyling = async () => {
//         const { amenityList, amenities } = this.state
//         // const hairstyles
//         const tl = await amenities.map((amenity, i) => {


//             amenityList.push(
//                 {

//                     name: amenity.amenity_name,
//                     id: amenity._id,
//                     desc: amenity.amenity_description,
//                     selected: false
//                 })


//             return;

//         })
//     }



//     render() {

//         const { navigation } = this.props;

//         const { screenWidth, fcmToken, amenityList, salon_description, styles, amenitiesOffered, individual, stylesAvailable, screenHeight, name, salon_name, price, errors, phone_number, Email, latitude, longitude,
//         } = this.state;

//         return (
//             <>
//                 <Spinner
//                     visible={this.state.loading}
//                     textContent={'Registering...'}
//                 // textStyle={styles.spinnerTextStyle}
//                 />



//                 {this.state.step4 ? <View style={Newstyles.containerMain}>
//                     <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
//                         <Text style={Newstyles.subTitle}>Location Details </Text>
//                     </View>
//                     <View style={{ flexDirection: 'row', marginHorizontal: 20, paddingHorizontal: 20, borderRadius: 30, backgroundColor: '#bdbdbd', height: 40 }}>

//                         <Item style={{ flex: 4 }}>

//                             <Input placeholder="Search" onChangeText={(text) => this.setState({ town: text })} />


//                         </Item>
//                         <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
//                             <TouchableOpacity activeOpacity={1} onPress={() => this.getRevGeo()}>
//                                 <Text style={{}}>Search</Text>
//                             </TouchableOpacity>
//                         </View>



//                     </View>
//                     <MapView
//                         ref={(ref) => { this.map = ref; }}
//                         style={[styles.map, { flex: 1, height: 300 }]}
//                         initialRegion={this.state.region}
//                         showsUserLocation={true}
//                         onMapReady={this.onMapReady}
//                         onRegionChangeComplete={this.onRegionChange}>


//                         <MapView.Marker
//                             coordinate={{
//                                 "latitude": this.state.region.latitude,
//                                 "longitude": this.state.region.longitude
//                             }}
//                             onSelect={e => this.log('onSelect', e)}
//                             onDrag={e => this.log('onDrag', e)}
//                             onDragStart={e => this.log('onDragStart', e)}
//                             onDragEnd={e => this.onDragEnd('onDragEnd', e)}
//                             onPress={e => this.log('onPress', e)}

//                             title={"Your Location"}
//                             draggable={true} />


//                     </MapView>


//                     <View style={Newstyles.bottomView}>
//                         <this.bottomTabNav />
//                     </View>
//                 </View>
//                     : <></>}
//                 {this.state.step3 ? <View style={Newstyles.containerMain}>
//                     <ScrollView style={{ marginBottom: 50 }}>
//                         <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
//                             <Text style={Newstyles.subTitle}>Extra Services </Text>
//                         </View>

//                         {amenityList.map((amenity, i) => (

//                             <ListItem avatar key={i}>
//                                 <Left>
//                                     {/* <Thumbnail source={{ uri: `${style.uri}` }} /> */}
//                                 </Left>
//                                 <Body>
//                                     <Text>{amenity.name}</Text>
//                                     {/* <Text note>{amenity.amenity_description}</Text> */}
//                                 </Body>
//                                 <Right>
//                                     <CheckBox
//                                         center

//                                         checkedIcon='dot-circle-o'
//                                         // size={4}
//                                         // containerStyle={{ padding: -30 }}
//                                         uncheckedIcon='circle-o'
//                                         checked={amenity.selected}
//                                         onPress={() => this.addamenities(amenity)}
//                                     />
//                                 </Right>
//                             </ListItem>

//                         ))}
//                     </ScrollView>
//                     <View style={Newstyles.bottomView}>
//                         <this.bottomTabNav />
//                     </View>
//                 </View>
//                     : <></>}
//                 {this.state.step2 ?
//                     <View style={Newstyles.containerMain}>
//                         <ScrollView >
//                             <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
//                                 <Text style={Newstyles.subTitle}> Services offered </Text>
//                             </View>

//                             {styles.map((style, i) => (


//                                 <ListItem avatar key={i} style={{ paddingVertical: 10 }}>
//                                     <Left>
//                                         <Thumbnail source={{ uri: `${style.uri}` }} />
//                                     </Left>
//                                     <Body>
//                                         <Text>{style.name}</Text>
//                                         {/* <Text note>{style.desc}</Text> */}
//                                     </Body>
//                                     <Right>
//                                         <CheckBox
//                                             center
//                                             containerStyle={{ padding: 0 }}
//                                             checkedIcon='dot-circle-o'
//                                             uncheckedIcon='circle-o'
//                                             checked={style.selected}
//                                             onPress={() => this.addstyles(style)}
//                                         />
//                                         {/* {style.selected ? <CheckBox selected onPress={() => this.addstyles(style)} /> : <Text onPress={() => this.addstyles(style)} >Undo</Text>} */}
//                                     </Right>
//                                 </ListItem>




//                             ))}

//                             {/* <Text onPress={()=>this.onpageEnd()}>more</Text> */}

//                         </ScrollView>
//                         <View style={Newstyles.bottomView}>
//                             <this.bottomTabNav />
//                         </View>
//                     </View> : <></>}
//                 {this.state.step1 ?

//                     <View style={Newstyles.containerMain}>
//                         <ScrollView >


//                             <KeyboardAvoidingView behavior="padding" enabled>
//                                 <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}><Text style={Newstyles.subTitle}>Salon Details </Text></View>
//                                 <View>



//                                     <Input

//                                         label='Salon Name'
//                                         labelStyle={Newstyles.labelStyle}
//                                         inputStyle={Newstyles.inputStyle}
//                                         containerStyle={Newstyles.containerStyle}


//                                         onChangeText={(text) => this.setState({ salon_name: text, errors: {} })}
//                                         value={salon_name}

//                                     />
//                                     {/* <Input

//                                     label='Description'
//                                     labelStyle={Newstyles.labelStyle}
//                                     inputStyle={Newstyles.inputStyle}
//                                     containerStyle={Newstyles.containerStyle}
//                                     inputContainerStyle={Newstyles.inputContainerStyle}
//                                     onChangeText={(text) => this.setState({ salon_description: text, errors: {} })}
//                                     value={salon_description}
//                                 // inputStyle={keyboardType=numeric}
//                                 // keyboardType='numeric'
//                                 /> */}

//                                     <Input

//                                         label=' Salon Email'
//                                         labelStyle={Newstyles.labelStyle}
//                                         inputStyle={Newstyles.inputStyle}
//                                         containerStyle={Newstyles.containerStyle}
//                                         inputContainerStyle={Newstyles.inputContainerStyle}
//                                         onChangeText={(text) => this.setState({ Email: text, errors: {} })}
//                                         value={Email}
//                                     // inputStyle={keyboardType=numeric}
//                                     // keyboardType='numeric'
//                                     />



//                                     <Input

//                                         label='Salon Cell Number'
//                                         labelStyle={Newstyles.labelStyle}
//                                         inputStyle={Newstyles.inputStyle}
//                                         containerStyle={Newstyles.containerStyle}
//                                         inputContainerStyle={Newstyles.inputContainerStyle}
//                                         onChangeText={(text) => this.setState({ phone_number: text, errors: {} })}
//                                         value={phone_number}
//                                         keyboardType='numeric'
//                                     />
//                                     <View>
//                                         <TouchableOpacity activeOpacity={1} onPress={() => this.LaunchlogoPicker()}  >
//                                             <Input

//                                                 label='Logo'
//                                                 labelStyle={Newstyles.labelStyle}
//                                                 inputStyle={Newstyles.inputStyle}
//                                                 containerStyle={Newstyles.containerStyle}
//                                                 inputContainerStyle={Newstyles.inputContainerStyle}
//                                                 value={'upload Image'}


//                                                 disabled={true}

//                                                 leftIcon={

//                                                     <Icon

//                                                         name='camera'

//                                                         size={20}

//                                                         color='#9e9e9e'

//                                                     />

//                                                 }


//                                             />
//                                             {this.state.logo ? <TouchableOpacity activeOpacity={1} onPress={() => this.crop(`${this.state.logo.uri}`)}>

//                                                 <Image source={{ uri: `${this.state.logo.uri}` }} style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 90 }} />
//                                                 <Text>Crop Image</Text>
//                                             </TouchableOpacity> : <View></View>}
//                                         </TouchableOpacity>
//                                     </View>

//                                 </View>
//                             </KeyboardAvoidingView>
//                         </ScrollView>
//                         <View style={Newstyles.bottomView}>
//                             <this.bottomTabNav />
//                         </View>
//                     </View>
//                     : <></>


//                 }

//             </>

//         )
//     }
// }


// Create.propTypes = {
//     createSalon: PropTypes.func.isRequired
// };

// const mapStateToProps = (state) => ({

//     user: state.auth,

//     allStyles: state.styles,

//     allamenities: state.amenities

// });

// export default connect(mapStateToProps, { createSalon, getAllstyles, getamenities, getSalons, setCurrentUser, RevokeTopic, addTopic, senttoTopic })(Create);

// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//         height: 400,
//         width: 400,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//     },
//     map: {
//         ...StyleSheet.absoluteFillObject,
//     },


//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 30
//     },
//     btn: {
//         color: '#fff'
//     },
//     text: {
//         color: '#000',
//         paddingLeft: 10,
//         fontSize: 15
//     },
//     wizardScreen: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         paddingVertical: 10
//         // fontSize:20,
//         // fontWeight:300
//     },
//     scrollView: {
//         // backgroundColor: 'pink',
//         marginHorizontal: 20,
//     },
//     inputItem: {

//         fontSize: 10,
//         paddingVertical: 0,

//     },
//     inputLabel: {
//         fontSize: 10,
//         paddingVertical: 0,


//     },

//     InputContainer: {
//         // paddingVertical: 2,
//         marginTop: 15
//     },

//     btnstyle: {
//         // backgroundColor:
//     },

//     showPass: {
//         flex: 1,
//         flexDirection: 'row',
//         alignContent: 'space-between',
//         // marginHorizontal:20

//     },
//     spinnerTextStyle: {
//         color: '#FFF'
//     },

// })



// const Newstyles = StyleSheet.create({
//     containerStyle: {

//         marginVertical: 15,

//     },
//     subTitle: {
//         color: '#757575',

//         letterSpacing: 1,

//         fontSize: 16,

//         fontWeight: '200',

//         fontFamily: 'Segoe UI',

//         marginTop: 10
//     },

//     labelStyle: {

//         paddingHorizontal: 10,

//         letterSpacing: 1,

//         textTransform: 'uppercase',

//         fontWeight: '200',

//         fontSize: 11

//     },

//     inputStyle: {

//         color: '#757575',

//         letterSpacing: 1,

//         fontSize: 16,

//         fontWeight: '200',

//     },

//     inputContainerStyle: {

//         borderBottomColor: '#bdbdbd',

//     },

//     buttonContainerStyle: {

//         paddingVertical: 7,

//     },

//     buttonStyle: {

//         backgroundColor: "transparent",


//     },

//     buttonTitleStyle: {

//         letterSpacing: 2,

//         textTransform: 'uppercase',

//         color: '#000',

//         fontSize: 13

//     },

//     disabledInputStyle: {

//         color: '#bdbdbd',

//     },
//     containerMain: {
//         // flex: 1,
//         flex: 1,
//         flexDirection: "column"
//         // alignItems: 'center',
//         // justifyContent: 'center',
//         // marginTop: 50
//         // height:screenHeight-290
//     },
//     bottomView: {
//         width: '100%',
//         height: 50,
//         backgroundColor: 'transparent',
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'absolute', //Here is the trick
//         bottom: '0%', //Here is the trick
//     },
//     textStyle: {
//         color: '#fff',
//         fontSize: 18,
//     },
//     stepButton: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         marginBottom: 36,

//     },
//     buttonContainerStyle: {

//         paddingVertical: 7,

//     },

//     buttonStyle: {

//         backgroundColor: "transparent",


//     },

//     buttonTitleStyle: {

//         letterSpacing: 2,

//         textTransform: 'uppercase',

//         color: '#000',

//         fontSize: 13

//     },

// })


// // var formData = new FormData();

// // formData.append('salon_name', salon.salon_name);

// // formData.append('phone_number', salon.phone_number);

// // formData.append('latitude', salon.latitude);

// // formData.append('longitude', salon.longitude);

// // formData.append('user_id', salon.user_id);

// // formData.append('Email', salon.Email);

// // formData.append('logo', {
// //     uri: salon.logo.uri,
// //     name: 'logo.jpg',
// //     type: 'image/jpeg', // This is important for Android!!
// // });

// // salon.styles.forEach((style, i) => {

// //     formData.append("styles", style.id);

// // });

// // salon.amenities.forEach((amenity, i) => {

// //     formData.append("amenities", amenity.id);

// // });


// // formData.append('salon_description', salon.salon_description);

// // console.log(JSON.stringify(formData))

// // const Responcs = await axios.post('/salon', formData)