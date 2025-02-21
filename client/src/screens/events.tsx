import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GOOGLE_IOS_ID, GOOGLE_WEB_ID } from "@env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import moment from "moment";

export default function InfiniteScrollCalendar() {
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_ID,
    iosClientId: GOOGLE_IOS_ID,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly", "email", "profile"],
    offlineAccess: true,
  });

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      setAccessToken(tokens.accessToken);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  // Fetch events for the given date range
  const fetchEvents = async (start, end) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const formattedEvents = { ...events };

      // Organize events by date
      response.data.items.forEach((event) => {
        const startTime = moment(event.start?.dateTime || event.start?.date);
        const day = startTime.format("YYYY-MM-DD");

        if (!formattedEvents[day]) {
          formattedEvents[day] = [];
        }

        formattedEvents[day].push({
          title: event.summary || "No Title",
          start: startTime.format("HH:mm"),
          end: moment(event.end?.dateTime || event.end?.date).format("HH:mm"),
        });
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial events
  useEffect(() => {
    if (accessToken) {
      const startOfWeek = moment().startOf("week").toISOString();
      const endOfWeek = moment().endOf("week").toISOString();
      fetchEvents(startOfWeek, endOfWeek);
    }
  }, [accessToken]);

  // Generate days around the current week
  const generateDays = () => {
    const days = [];
    for (let i = -30; i <= 30; i++) {
      days.push(moment().add(i, "days").format("YYYY-MM-DD"));
    }
    return days;
  };

  // Render day button
  const renderDay = ({ item }) => {
    const isSelected = item === selectedDay;
    const hasEvents = events[item]?.length > 0;

    return (
      <TouchableOpacity
        style={[styles.dayButton, isSelected && styles.selectedDayButton]}
        onPress={() => setSelectedDay(item)}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {moment(item).format("ddd")}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.selectedDayText]}>
          {moment(item).format("D")}
        </Text>
        {hasEvents && <View style={styles.eventDot} />}
      </TouchableOpacity>
    );
  };

  // Render events for the selected day
  const renderEventsForSelectedDay = () => {
    const dayEvents = events[selectedDay] || [];

    return (
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsHeader}>Events for {moment(selectedDay).format("dddd, MMM D")}</Text>

        {dayEvents.length > 0 ? (
          dayEvents.map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>
                {event.start} - {event.end}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEventText}>No events for this day.</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!accessToken ? (
        <View>
          <Text style={styles.signInText}>Sign in to view your calendar:</Text>
          <Text onPress={signInWithGoogle} style={styles.signInButton}>
            Sign in with Google
          </Text>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <>
          {/* Infinite Scrollable Days */}
          <FlatList
            horizontal
            data={generateDays()}
            keyExtractor={(item) => item}
            renderItem={renderDay}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekDaysContainer}
          />

          {/* Event List for Selected Day */}
          {renderEventsForSelectedDay()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#f9f9f9",
  },
  weekDaysContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dayButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#e0f7fa",
    width: 70,
  },
  selectedDayButton: {
    backgroundColor: "#007AFF",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#555",
  },
  selectedDayText: {
    color: "#fff",
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF5733",
    marginTop: 3,
  },
  eventsContainer: {
    marginTop: 20,
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  eventsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
  },
  eventCard: {
    backgroundColor: "#e0f7fa",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  eventTime: {
    fontSize: 12,
    color: "#555",
  },
  noEventText: {
    textAlign: "center",
    fontSize: 14,
    color: "#999",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#4285F4",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 200,
  },
});
