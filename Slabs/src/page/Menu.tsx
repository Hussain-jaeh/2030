import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resumeGame, resetGameState } from '../Features/gameSlice';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { InterstitialAd, AdEventType, TestIds } from "react-native-google-mobile-ads";


const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['game', 'puzzle', 'casual'],
});

const Menu = () => {
  const navigation = useNavigation();
  const isPaused = useSelector((state: RootState) => state.game.isPaused);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      interstitial.load();
    });

    
    interstitial.load();

 
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showAd = async () => {
    if (loaded) {
      await interstitial.show();
    }
  };

  const handleNewGame = async () => {
    await showAd();
    dispatch(resetGameState());
    navigation.navigate("Game");
  };
	 
  return (
     	<View style={styles.container}>
		<View style={styles.menuContainer}>
			
   <TouchableOpacity 
  style={styles.menuContainer_btnG} 
  onPress={() => {
    dispatch(resumeGame());
    navigation.navigate("Game");
  }}
>
  <Text style={styles.menuContainer_btn_text}>KEEP GOING</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={styles.menuContainer_btn} 
  onPress={() => {
    dispatch(resetGameState());
    navigation.navigate("Game");
  }}
>
  <Text style={styles.menuContainer_btn_text}>NEW GAME</Text>
       </TouchableOpacity>
         <TouchableOpacity 
              style={[styles.menuContainer_btn, styles.menuContainer_btn_sub]}// @ts-ignore
                 onPress={() => navigation.navigate("Challenges")}
                  >
                                        
        <Text style={styles.menuContainer_btn_text}>Levels</Text>
       </TouchableOpacity>
				
				<TouchableOpacity style={styles.menuContainer_btn}// @ts-ignore
				  onPress={() => navigation.navigate("HowToPlay")}>
					<Text style={styles.menuContainer_btn_text}>HOW TO PLAY</Text>
				</TouchableOpacity>
		
			</View>
		</View>
	)
}

export default Menu

const styles = StyleSheet.create({
	menuContainer_btn_sub3: {
		backgroundColor: "#6683AB",
	
	},
	menuContainer_btn_sub2: {
		backgroundColor: "#60A2F6"
	},
	menuContainer_btn_sub: {
		backgroundColor: "#A55EF8"
	},
	menuContainer_btn_text: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "800"
	},


	headerText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	menuContainer_btn: {
		width: '70%',
		paddingVertical: 15,
		margin: '3.5%', 
		borderRadius: 5,
		backgroundColor: "#BBADA2",
		justifyContent: "center",
		alignItems: "center",
	},
	menuContainer_btnG: {
		width: '70%',
		paddingVertical: 15,
		margin: '3.5%', 
		borderRadius: 5,
		backgroundColor: "#1cae54",
		justifyContent: "center",
		alignItems: "center",
	},
	menuContainer: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: 'center',
	},
	container: {
		flex: 1,
    	display:"flex",
		alignItems:'center',
		justifyContent:"center",
		flexDirection:"column",
        width: "100%",
		padding: 10,
	},
	btnText: {
		color: '#FFF',
		fontWeight: 'bold',
	},
});