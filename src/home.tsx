import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { HomeScreenNavigationProp, Movie } from './types';
import { getAllMovies } from './utils/webflow';
import type { ImageURISource } from 'react-native';
import {
  MyComponent,
  usePrompt,
  displayPrompt,
  displayInlines,
} from '@redfast/react-native-redfast';
import type { PathItem } from '@redfast/redfast-core';

interface Row {
  id: string;
  type: string;
  orientation: string;
  list: Movie[] | PathItem[];
}

const Separator = () => <View style={styles.separator} />;

const VideoRoll = ({
  movies,
  orientation,
}: {
  movies: Movie[];
  orientation: string;
}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id}
      horizontal
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('MovieDetail', { movie: item })}
        >
          <Image
            source={{ uri: item.hdPosterLandscape }}
            style={
              orientation === 'landscape'
                ? styles.movieImageLandscape
                : styles.movieImagePortrait
            }
          />
        </TouchableOpacity>
      )}
    />
  );
};

const ImageRow = ({
  image,
  height,
  callback = undefined,
}: {
  image: ImageURISource;
  height: number;
  callback?: () => {};
}) => {
  return (
    <TouchableOpacity onPress={() => callback?.()}>
      <Image source={image} style={{ ...styles.imageRow, height: height }} />
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [rowList, setRowList] = React.useState<Row[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [pathItem, setPathItem] = React.useState<PathItem>();

  const {
    state: { promptMgr },
  } = usePrompt();

  React.useEffect(() => {
    if (promptMgr) {
      (async () => {
        const movies = await getAllMovies();
        const mid = Math.floor(movies.length / 2);
        const movieRow1 = movies.slice(0, mid);
        const movieRow2 = movies.slice(mid);
        const inlines = (await promptMgr?.getInlines('android-banner')) ?? [];
        const rows: Row[] = [];
        if (inlines.length > 0) {
          rows.push({
            id: String(rows.length),
            type: 'banner',
            orientation: 'landscape',
            list: inlines,
          });
        }
        rows.push({
          id: String(rows.length),
          type: 'highlight',
          orientation: 'landscape',
          list: [require('../assets/highlightd.png')],
        });
        rows.push({
          id: String(rows.length),
          type: 'movie',
          orientation: 'portrait',
          list: movieRow1,
        });
        rows.push({
          id: String(rows.length),
          type: 'splash',
          orientation: 'landscape',
          list: [require('../assets/splash.png')],
        });
        rows.push({
          id: String(rows.length),
          type: 'new',
          orientation: 'landscape',
          list: [require('../assets/new-release.png')],
        });
        rows.push({
          id: String(rows.length),
          type: 'movie',
          orientation: 'landscape',
          list: movieRow2,
        });
        setRowList(rows);

        const { path, delaySeconds } = await promptMgr.onScreenChanged('home');
        if (path) {
          setTimeout(() => {
            setPathItem(path);
            setShowModal(true);
          }, delaySeconds);
        }
      })();
    }
  }, [promptMgr]);

  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <FlatList
        data={rowList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'movie':
              return (
                <VideoRoll
                  movies={item.list as Movie[]}
                  orientation={item.orientation}
                />
              );
            case 'banner':
              return displayInlines(
                item.list as PathItem[],
                (windowWidth * 300) / 1026,
                (result) =>
                  console.log(
                    JSON.stringify({ ...result, source: 'banner' }, null, 2)
                  )
              );
            case 'highlight':
              return (
                <ImageRow
                  image={item.list[0] as ImageURISource}
                  height={(windowWidth * 203) / 1373}
                />
              );
            case 'splash':
              return (
                <ImageRow
                  image={item.list[0] as ImageURISource}
                  height={(windowWidth * 456) / 1564}
                />
              );
            case 'new':
              return (
                <ImageRow
                  image={item.list[0] as ImageURISource}
                  height={(windowWidth * 206) / 1623}
                />
              );
            default:
              return null;
          }
        }}
        ItemSeparatorComponent={Separator}
      />
      <TouchableOpacity
        onPress={async () => {
          if (promptMgr) {
            const { path, delaySeconds } =
              await promptMgr.onButtonClicked('clickId');
            if (path) {
              setTimeout(() => {
                setPathItem(path);
                setShowModal(true);
              }, delaySeconds);
            }
            await promptMgr.customTrack('genres');
            await promptMgr.resetGoal();
          }
        }}
      >
        <MyComponent message="Reset Prompts" />
      </TouchableOpacity>
      {displayPrompt(showModal, pathItem, (result) => {
        console.log(JSON.stringify({ ...result, source: 'modal' }, null, 2));
        setShowModal(false);
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageRow: {
    width: '100%',
    borderRadius: 10,
  },
  movieImagePortrait: {
    width: 240,
    height: 320,
    borderRadius: 10,
    marginRight: 10,
  },
  movieImageLandscape: {
    width: 320,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
  separator: {
    // Style your separator
    height: 10, // Adjust height for spacing
    width: '100%',
    backgroundColor: 'transparent', // Or a color if you want a visible line
  },
});
