import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample friends data - replace with your actual data source
const SAMPLE_FRIENDS = [
  { id: '1', name: 'Alex Johnson' },
  { id: '2', name: 'Taylor Smith' },
  { id: '3', name: 'Jordan Lee' },
  { id: '4', name: 'Casey Brown' },
  { id: '5', name: 'Morgan Wilson' },
  { id: '6', name: 'Riley Davis' },
  { id: '7', name: 'Quinn Martinez' },
  { id: '8', name: 'Jamie Taylor' },
  { id: '9', name: 'Avery Lopez' },
  { id: '10', name: 'Drew Garcia' },
];

const FriendsDropdown = ({ selectedFriends, setSelectedFriends }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState(SAMPLE_FRIENDS);

  // Filter friends based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = SAMPLE_FRIENDS.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(SAMPLE_FRIENDS);
    }
  }, [searchQuery]);

  // Check if a friend is selected
  const isFriendSelected = (friendId) => {
    return selectedFriends.some(friend => friend.id === friendId);
  };

  // Toggle friend selection
  const toggleFriendSelection = (friend) => {
    if (isFriendSelected(friend.id)) {
      setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  // Render each friend item
  const renderFriendItem = ({ item }) => {
    const isSelected = isFriendSelected(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.friendItem,
          isSelected && styles.selectedFriendItem
        ]}
        onPress={() => toggleFriendSelection(item)}
      >
        <Text style={[
          styles.friendName,
          isSelected && styles.selectedFriendName
        ]}>
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#00cc99" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={selectedFriends.length ? styles.dropdownText : styles.placeholderText}>
          {selectedFriends.length
            ? `${selectedFriends.length} friend${selectedFriends.length !== 1 ? 's' : ''} selected`
            : "Select friends"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#aaa" />
      </TouchableOpacity>

      {selectedFriends.length > 0 && (
        <View style={styles.selectedContainer}>
          <FlatList
            data={selectedFriends}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.selectedFriendChip}>
                <Text style={styles.selectedFriendChipText}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => toggleFriendSelection(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Friends</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={20} color="#aaa" />
                </TouchableOpacity>
              ) : null}
            </View>

            <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              renderItem={renderFriendItem}
              style={styles.friendsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No matching friends found</Text>
              }
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedContainer: {
    marginTop: 8,
  },
  selectedFriendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFriendChipText: {
    marginRight: 6,
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  friendsList: {
    marginBottom: 15,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedFriendItem: {
    backgroundColor: '#f0f9f6',
  },
  friendName: {
    fontSize: 16,
    color: '#333',
  },
  selectedFriendName: {
    fontWeight: '500',
    color: '#00cc99',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#00cc99',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendsDropdown;