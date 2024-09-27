import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";

type bookdata = {
  title: string;
  subtitle: string;
  isbn13: number;
  price: number;
  image: string;
  url: string;
};
type GetType = {
  books: bookdata[];
  error: number;
  total: number;
  page: number;
};

export default function Home() {
  const [bookname, setBookname] = useState<string>("");
  const [apiData, setapiData] = useState<GetType | null>(null);
  const [error, seterror] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [displaydata, setdisplaydata] = useState<boolean> (false)
  const [finalBooks, setFinalBooks] = useState<bookdata[]>([]);

  //fetching api data by using fetch method and error checking
  const getdata = async () => {
    try {
      const response = await fetch(
        "https://api.itbook.store/1.0/search/angular"
      );
      const newdata: GetType = await response.json();
      setapiData(newdata);
      setLoading(false);
    } catch (error: any) {
      seterror(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    getdata();
  }, []);



  const handleSearch = () => {
    if (!bookname) {
      Alert.alert('Enter a book name to search');
      return;
    }

    if (apiData && apiData.books) {
      const filteredBooks = apiData.books.filter((book) =>
        book.title.toLowerCase().includes(bookname.toLowerCase())
      );
      
      setFinalBooks(filteredBooks || []);

     
      if (filteredBooks.length === 0) {
        Alert.alert("No books found for the search term");
      }
    }
  };
  
  const removeItem = (id: number) => {
    Alert.alert("Book deleted");
    const updatedBooks = finalBooks.filter((book) => book.isbn13 !== id);
    setFinalBooks(updatedBooks);
  };



  if (loading) {
    return <ActivityIndicator color="green" size={30} />;
  }

  
  if (error) {
    return <Text>{error}</Text>;
  }
 
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter a word to search.."
        style={styles.namebox}
        value={bookname}
        onChangeText={(text) => setBookname(text)}
      />
      <Pressable
        style={styles.searchbox}
        onPress={handleSearch}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Search
        </Text>
      </Pressable>

     
      { finalBooks.length > 0 && (
          <FlatList
          style={{ marginVertical: 30 }}
          data={finalBooks}
          keyExtractor={(item) => `${item.isbn13}`}
          renderItem={({ item }) => (
            <View style={styles.maincontainer}>
              <View style={styles.imgcontainer}>
                <Text style={styles.heading}>{item.title}</Text>
                <Image source={{ uri: item.image }} style={styles.image} />
              </View>
              <View style={{}}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontStyle: "italic",
                    color: "grey",
                  }}
                >
                  Price: {item.price}
                </Text>
                <Pressable onPress={() => removeItem(item.isbn13)}
                  style={{
                    backgroundColor: "red",
                    padding: 10,
                    margin: 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
        
      )
    
      }
    
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  namebox: {
    borderWidth: 1,
    padding: 15,
    margin: 20,
    width: 300,
  },
  searchbox: {
    margin: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lavender",
    width: 300,
    borderRadius: 20,
  },
  maincontainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 10,
    // borderWidth: 1,
  },
  imgcontainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 200,
    width: 200,
    margin: 5,
  },
  heading: {
    fontStyle: "italic",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    fontSize: 25,
  },
});
