import { View, FlatList, Text, Image, StyleSheet, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { MovieDetailScreenRouteProp } from './types';
import type { ImageURISource } from 'react-native';
import React from 'react';
import { usePrompt, displayPrompt } from '@redfast/react-native-redfast';
import type { PathItem } from '@redfast/redfast-core';
import { PathType } from '@redfast/redfast-core';

const Separator = () => <View style={styles.separator} />;

interface Row {
  id: string;
  height: number;
  image: ImageURISource;
}

export default function MovieDetailScreen() {
  const { movie } = useRoute<MovieDetailScreenRouteProp>().params;
  const [detailRow] = React.useState<Row[]>([
    {
      id: '0',
      height: 200,
      image: require('../assets/description1.png'),
    },
    {
      id: '1',
      height: 200,
      image: require('../assets/description2.png'),
    },
    {
      id: '2',
      height: 200,
      image: require('../assets/description3.png'),
    },
    {
      id: '3',
      height: 200,
      image: require('../assets/description4.png'),
    },
    {
      id: '4',
      height: 200,
      image: require('../assets/description5.png'),
    },
  ]);
  const {
    state: { promptMgr },
  } = usePrompt();
  const [showModal, setShowModal] = React.useState(false);
  const [pathItem, setPathItem] = React.useState<PathItem>();

  React.useEffect(() => {
    if (promptMgr) {
      (async () => {
        let prompts = promptMgr.getPrompts(PathType.BOTTOM_BANNER);
        console.log(JSON.stringify(prompts, null, 2));
        prompts = await promptMgr.getTriggerablePrompts(
          'genres',
          '*',
          PathType.ALL
        );
        console.log(JSON.stringify(prompts, null, 2));
        if (prompts.length > 0) {
          prompts[0]?.impression();
        }
      })();
    }
  }, [promptMgr]);

  const onButtonClicked = async () => {
    if (promptMgr) {
      const { path, delaySeconds } = await promptMgr.onButtonClicked('clickId');
      if (path) {
        setTimeout(() => {
          setPathItem(path);
          setShowModal(true);
        }, delaySeconds);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: movie.sdPoster }} style={styles.movieImage} />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.description}>{movie.description}</Text>
      <Text />
      <Text style={styles.description}>Duration: 1 hr 49 mins</Text>
      <Text style={styles.description}>Director: {movie.directors}</Text>
      <Separator />
      <Button title="Purchase" onPress={onButtonClicked} />
      <Separator />
      <FlatList
        data={detailRow}
        keyExtractor={(item) => item.id}
        renderItem={({ item: { image } }) => <Image source={image} />}
        ItemSeparatorComponent={Separator}
      />
      {displayPrompt(showModal, pathItem, (result) => {
        console.log(result);
        setShowModal(false);
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  movieImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'left',
  },
  separator: {
    // Style your separator
    height: 10, // Adjust height for spacing
    width: '100%',
    backgroundColor: 'transparent', // Or a color if you want a visible line
  },
});
