import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import Title from "../components/ui/Title";
import { useEffect, useState } from "react";
import NumberContainer from "../components/game/NumberContainer";
import PrimaryButton from "../components/ui/PrimaryButton";
import Card from "../components/ui/Card";
import InstructionText from "../components/ui/InstructionText";
import { Ionicons } from "@expo/vector-icons";
import GuessLogItem from "../components/game/GuessLogItem";

const generateRandomNumber = (min, max, exclude) => {
  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum === exclude) {
    return generateRandomNumber(min, max, exclude);
  } else {
    return rndNum;
  }
};

let min = 1;
let max = 100;

const GameScreen = ({ chosenNumber, gameOver }) => {
  const initialGuess = generateRandomNumber(1, 100, chosenNumber);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [guessRound, setGuessRounds] = useState([initialGuess]);
  const { width, height } = useWindowDimensions();

  const nextGuessHandler = (direction) => {
    if (
      (direction === "lower" && currentGuess < chosenNumber) ||
      (direction === "greater" && currentGuess > chosenNumber)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [
        {
          text: "Sorry!",
          style: "cancel",
        },
      ]);
      return;
    }

    if (direction === "lower") {
      max = currentGuess;
    } else {
      min = currentGuess + 1;
    }

    const newRndNumber = generateRandomNumber(min, max, currentGuess);
    setCurrentGuess(newRndNumber);
    setGuessRounds((prevGuess) => [newRndNumber, ...prevGuess]);
  };

  const guessRoundListLength = guessRound.length;

  useEffect(() => {
    if (currentGuess === chosenNumber) {
      gameOver(guessRound.length);
    }
  }, [currentGuess, chosenNumber, gameOver]);

  useEffect(() => {
    min = 1;
    max = 100;
  }, []);

  let content = (
    <>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card>
        <InstructionText style={styles.instruction}>
          Higher or Lower
        </InstructionText>
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            <PrimaryButton handlePress={() => nextGuessHandler("lower")}>
              <Ionicons name="md-remove" size={24} color={"#fff"} />
            </PrimaryButton>
          </View>
          <View style={styles.button}>
            <PrimaryButton handlePress={() => nextGuessHandler("greater")}>
              <Ionicons name="md-add" size={24} color={"#fff"} />
            </PrimaryButton>
          </View>
        </View>
      </Card>
    </>
  );

  return (
    <View style={styles.screen}>
      <Title>Opponent's Guess</Title>
      {width > 500 ? (
        <>
          <View style={styles.buttonsContainerWide}>
            <View style={styles.button}>
              <PrimaryButton handlePress={() => nextGuessHandler("lower")}>
                <Ionicons name="md-remove" size={24} color={"#fff"} />
              </PrimaryButton>
            </View>
            <NumberContainer>{currentGuess}</NumberContainer>
            <View style={styles.button}>
              <PrimaryButton handlePress={() => nextGuessHandler("greater")}>
                <Ionicons name="md-add" size={24} color={"#fff"} />
              </PrimaryButton>
            </View>
          </View>
        </>
      ) : (
        content
      )}
      <View style={styles.flatListContainer}>
        {/* {guessRound.map((g) => (
          <Text key={g}>{g}</Text>
        ))} */}
        <FlatList
          data={guessRound}
          renderItem={(itemData) => (
            <GuessLogItem
              roundNumber={guessRoundListLength - itemData.index}
              guess={itemData.item}
              key={itemData.item}
            />
          )}
        />
      </View>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    paddingVertical: 35,
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
  instruction: {
    marginBottom: 12,
  },
  flatListContainer: {
    flex: 1,
  },
  buttonsContainerWide: {
    flexDirection: "row",
    alignItems: "center",
  },
});
