import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';

// Collection reference
const EVENTS_COLLECTION = 'events';

// Helper function to upload image
export const uploadEventImage = async (file, eventId) => {
  try {
    const imageRef = ref(storage, `events/${eventId}/${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper function to delete image
export const deleteEventImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error as the image might already be deleted
  }
};

// Create a new event
export const createEvent = async (eventData, imageFile) => {
  try {
    // First create the event document to get an ID
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      imageUrl: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    let imageUrl = '';
    
    // Upload image if provided
    if (imageFile) {
      imageUrl = await uploadEventImage(imageFile, docRef.id);
      
      // Update the document with the image URL
      await updateDoc(docRef, {
        imageUrl: imageUrl,
        updatedAt: serverTimestamp()
      });
    }

    return {
      id: docRef.id,
      ...eventData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
};

// Get all events
export const getAllEvents = async () => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION), 
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to JavaScript dates
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        date: data.date // Keep date as string for consistency
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

// Get upcoming events
export const getUpcomingEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('date', '>=', today),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }
};

// Get past events
export const getPastEvents = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('date', '<', today),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching past events:', error);
    throw new Error('Failed to fetch past events');
  }
};

// Get a single event by ID
export const getEventById = async (eventId) => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    } else {
      throw new Error('Event not found');
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
};

// Update an event
export const updateEvent = async (eventId, eventData, newImageFile = null) => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    
    // Get current event data to check for existing image
    const currentDoc = await getDoc(docRef);
    const currentData = currentDoc.data();
    
    let imageUrl = currentData?.imageUrl || '';
    
    // Handle image update
    if (newImageFile) {
      // Delete old image if it exists
      if (currentData?.imageUrl) {
        await deleteEventImage(currentData.imageUrl);
      }
      
      // Upload new image
      imageUrl = await uploadEventImage(newImageFile, eventId);
    }
    
    const updateData = {
      ...eventData,
      imageUrl,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    return {
      id: eventId,
      ...updateData,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    // Get event data to delete associated image
    const eventData = await getEventById(eventId);
    
    // Delete image from storage if it exists
    if (eventData.imageUrl) {
      await deleteEventImage(eventData.imageUrl);
    }
    
    // Delete document from Firestore
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

// Get events by category
export const getEventsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('category', '==', category),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw new Error('Failed to fetch events by category');
  }
};
