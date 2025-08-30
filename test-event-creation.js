import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Test function to create an event with curl
async function testEventCreation() {
  try {
    console.log('🧪 Testing Event Creation...\n');

    // Test event creation with curl
    console.log('1. Testing event creation...');
    
    const eventData = {
      title: 'Final Test Event',
      description: 'This is a final test event to verify placeholder functionality',
      shortDescription: 'Final test event',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      time: '14:00',
      location: {
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345'
      },
      organizer: {
        name: 'Test Organizer',
        email: 'test@example.com',
        phone: '123-456-7890'
      },
      category: 'Cultural',
      images: [] // Let the server add placeholder
    };

    console.log('Event data to be sent:', JSON.stringify(eventData, null, 2));

    // Use curl to test the API
    const curlCommand = `curl -X POST http://localhost:5000/api/events -H "Content-Type: application/json" -d "${JSON.stringify(eventData).replace(/"/g, '\\"')}"`;
    
    console.log('\nExecuting curl command...');
    const { stdout, stderr } = await execAsync(curlCommand);
    
    if (stderr) {
      console.log('Curl stderr:', stderr);
    }
    
    const result = JSON.parse(stdout);
    console.log('\nEvent creation response:', result);

    if (result.success) {
      console.log('✅ Event created successfully!');
      console.log('Event ID:', result.data._id);
      console.log('Event images:', result.data.images);
      
      // Test fetching all events
      console.log('\n2. Testing all events retrieval...');
      const { stdout: eventsStdout } = await execAsync('curl -X GET http://localhost:5000/api/events');
      const eventsResult = JSON.parse(eventsStdout);
      
      if (eventsResult.success) {
        console.log('✅ All events retrieved successfully!');
        console.log(`Found ${eventsResult.data.events?.length || 0} events`);
        
        // Check if our test event is in the list
        const testEvent = eventsResult.data.events?.find(e => e.title === 'Test Event with Placeholder Image');
        if (testEvent) {
          console.log('✅ Test event found in events list');
          console.log('Test event images in list:', testEvent.images);
        }
      } else {
        console.log('❌ Failed to retrieve all events:', eventsResult.message);
      }
    } else {
      console.log('❌ Event creation failed:', result.message);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testEventCreation();
