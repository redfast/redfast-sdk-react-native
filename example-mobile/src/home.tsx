/* eslint-disable react-native/no-inline-styles */

import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Text,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { HomeScreenNavigationProp, Movie } from './types';
import { getAllMovies } from './utils/webflow';
import type { ImageURISource } from 'react-native';
import {
  usePrompt,
  displayPrompt,
  RedfastInline,
} from '@redfast/react-native-redfast';
import type { PathItem } from '@redfast/redfast-core';
import { PromptResultCode } from '@redfast/redfast-core';

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

const FootNote = ({
  message,
  color = 'blue',
}: {
  message: string;
  color: string;
}) => {
  return (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
      <Text style={[{ fontSize: 16, fontWeight: 'bold' }, { color }]}>
        Dev: {message}
      </Text>
    </View>
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
        const rows: Row[] = [];

        rows.push({
          id: String(rows.length),
          type: 'banner',
          orientation: 'landscape',
          list: [],
        });
        rows.push({
          id: String(rows.length),
          type: 'highligt',
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
              return (
                <RedfastInline
                  zoneId="android-banner"
                  closeButtonColor="#000000"
                  closeButtonBgColor="#FFFFFF"
                  closeButtonSize="20"
                  timerFontSize="14"
                  timerFontColor="#FFFFFF"
                  onEvent={(result) => {
                    const getEventName = (code: PromptResultCode) => {
                      switch (code) {
                        case PromptResultCode.IMPRESSION:
                          return 'Redfast Impression';
                        case PromptResultCode.BUTTON1:
                          return 'Redfast Click';
                        case PromptResultCode.BUTTON2:
                          return 'Redfast Click2';
                        case PromptResultCode.BUTTON3:
                          return 'Redfast Decline';
                        case PromptResultCode.DISMISS:
                          return 'Redfast Dismiss';
                        case PromptResultCode.TIMEOUT:
                          return 'Redfast Timeout';
                        case PromptResultCode.HOLDOUT:
                          return 'Redfast Holdout';
                        default:
                          return 'Redfast Event';
                      }
                    };

                    const analyticsData = {
                      name: getEventName(result.code),
                      data: {
                        ...result.promptMeta,
                        timestamp: new Date().toISOString()
                      }
                    };
                    console.log('ANALYTICS:', JSON.stringify(analyticsData, null, 2));
                  }}
                />
              );
            case 'highligt':
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
        <FootNote message="Reset Prompts" color="blue" />
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
